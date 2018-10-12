import { Rect } from './Helpers.js';
import { container } from './GameEngine.js';
/**
*
* BASE GAME OBJECT CLASS
*
*/
class GameObject {
    constructor() {
        this.id = this.GenID();
        this.position = { x: 0, y: 0 };
        this.lastPosition = this.position;
        this.velocity = { x: 0, y: 0 };
        this.deleting = false;
    }

    SetPosition(x, y) {
        this.lastPosition = this.position;
        this.position.x = x;
        this.position.y = y;
    }

    SetVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    GenID() {
        return '_' + Math.random().toString(36).substr(2, 9);
    }
}

/**
    *
    * SPRITE CLASS
    *
    */
class GameSprite extends GameObject {

    constructor(mgr, filename, width = 24, height = 32) {
        super();
        this.mgr = mgr;
        this.Area = new Rect(0, 0, width, height);
        this.Sprite = new PIXI.Sprite.fromImage("/img/" + filename);
        this.Sprite.width = width;
        this.Sprite.height = height;

        container.addChild(this.Sprite);
    }

    SetPosition(x, y) {
        this.Sprite.x = x;
        this.Sprite.y = y;
        this.Area.x = this.Sprite.x;
        this.Area.y = this.Sprite.y;
        super.SetPosition(this.Sprite.x, this.Sprite.y);
    }

    SetRotation(deg) {
        this.Sprite.rotation = Math.radians(deg);
    }

    IsCollided(other) {
        return this.Area.IsIntersecting(other);
    }

}

class AnimatedSprite extends GameObject {
    constructor(mgr, folder_name, frames, width, height, framespeed = 10, looping = true) {
        super();
        this.mgr = mgr;
        this.Area = new Rect(0, 0, width, height);
        this.frames = frames;
        this.width = width;
        this.height = height;
        this.Sprites = [];
        this.folder = folder_name;
        this.currentFrame = 0;
        this.frameSpeed = 1000.0 / framespeed;
        this.lastTime = 0;
        this.looping = looping;
        this.currentSprite = undefined;

        this.addSprites();
    }

    addSprites() {
        for (var i = 0; i < this.frames; i++) {
            var sprite = new PIXI.Sprite.fromImage("/img/" + this.folder + "/" + this.folder + "_" + i + ".png");

            sprite.width = this.width;
            sprite.height = this.height;
            sprite.visible = false;

            this.Sprites.push(sprite);

            if (i === 0) this.currentSprite = sprite;

            mgr.container.addChild(sprite);

        }
    }

    Update() {
        if (this.currentSprite) {
            this.currentSprite.visible = false;
            this.currentSprite = this.Sprites[this.currentFrame];
            if (this.currentSprite) {
                this.currentSprite.visible = true;
            }
            if (this.looping) {
                this.currentFrame++;
                if (this.currentFrame > this.frames) this.currentFrame = 0;
            } else {
                if (this.currentFrame < this.frames) this.currentFrame++;
            }
        }
    }

    SetPosition(x, y) {
        super.SetPosition(x + 32, y - 32);
        this.Area.x = x;
        this.Area.y = y;
        for (var i = 0; i < this.frames; i++) {
            this.Sprites[i].x = x;
            this.Sprites[i].y = y;
        }
    }

}

/**
 *
 * PLAYER CLASS
 *
 */
class Player extends GameSprite {
    constructor(mgr, name) {
        super(mgr, "player_ship.png");
        this.mgr = mgr;
        this.Name = name;
        this.MovementSpeed = GameInfo.player.movementSpeed;
        this.Bullets = [];
        this.LastShootTime = t;
    }

    Update() {
        if (t && mouseData) {
            this.DoMovement();
            this.Shoot();
            this.CheckBounds();
        }
    }

    DoMovement() {
        var mouseDir = 0;

        if (mouseData.x > this.position.x) mouseDir = 1;
        else if (mouseData.x < this.position.x) mouseDir = -1

        var x = this.position.x;

        var vel = Math.floor((mouseDir * this.MovementSpeed));
        if (vel > this.MovementSpeed) {
            vel = this.MovementSpeed
        }
        else if (vel < -this.MovementSpeed) {
            vel = -this.MovementSpeed
        }
        this.SetVelocity(vel)

        x += this.velocity.x * dt;
        this.SetPosition(x, this.position.y);
    }

    Shoot() {

        var diff = t - this.LastShootTime;
        if (diff >= GameInfo.player.shootInterval) {

            if (mouse) {

                if (mouse.buttons == 1) {

                    var bulletleft = new Bullet(this.mgr);
                    GameObjects.push(bulletleft);
                    bulletleft.SetPosition(this.position.x, this.position.y);
                    bulletleft.SetVelocity(0, GameInfo.bullet.speed);

                    var bulletright = new Bullet(this.mgr);
                    GameObjects.push(bulletright);
                    bulletright.SetPosition(this.position.x + 16, this.position.y);
                    bulletright.SetVelocity(0, GameInfo.bullet.speed);
                    this.LastShootTime = t;

                }
            }
        }
    }

    CheckBounds() {
        if (this.position.x > GameInfo.resolution.width - this.Sprite.width - 3)
            this.SetPosition(GameInfo.resolution.width - this.Sprite.width - 3, this.position.y)
        else if (this.position.x < 3)
            this.SetPosition(3, this.position.y)
    }
}

/**
 *
 * BULLET CLASS
 *
 */
class Bullet extends GameSprite {

    constructor(mgr) {
        super(mgr, "bullet.png", 3, 6);
        this.mgr = mgr;
    }

    Update() {
        if (t && mouseData) {
            this.DoMovement();
            this.CheckBounds();
        }
    }

    DoMovement() {
        var y = this.position.y;
        y += this.velocity.y * dt;
        this.SetPosition(this.position.x, y);
    }

    CheckBounds() {
        if (this.position.y < 0) {
            addToRemove(this);
        }
    }

}

class Explosion extends AnimatedSprite {
    constructor(mgr) {
        super(mgr, "explosion", 6, 64, 64, 4000, true);
        this.SetPosition(200, 200);
    }
}

/**
*
* ENEMY CLASS
*
*/
class Enemy extends GameSprite {
    constructor(mgr, xinit, yinit) {
        super("player_ship.png");
        this.mgr = mgr
        this.Bullets = [];
        this.SetRotation(180);
        this.lastVelocity = 0;
        this.time = yinit;
        this.originalX = xinit;
        this.originalY = yinit;
    }

    Update() {

        if (t) {

            this.time += dt;
            var pos = this.position;
            pos.x = 90 + (this.originalX / 2 + Math.cos(this.time * 2) * 128 / 2);
            pos.y += (GameInfo.enemies.downwardSpeed) * dt;
            this.SetPosition(pos.x, pos.y);

        }
    }
}

export { GameObject, GameSprite, AnimatedSprite, Player, Enemy, Bullet, Explosion };
