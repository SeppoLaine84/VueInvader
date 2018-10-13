/**
 * Base GameObject classes
 */

import { Rect, GenID} from './Helpers.js';
import { container } from './GameEngine.js';


/**
 *  BASE GAME OBJECT CLASS
 */
class GameObject {
    constructor() {
        this.id = GenID();
        this.position = { x: 0, y: 0 };
        this.lastPosition = this.position;
        this.velocity = { x: 0, y: 0 };
        this.deleting = false;
        this.visible = true;
        this.originalPosition = this.position;
        this.firstPositionSet = false;
    }

    SetPosition(x, y) {
        if (this.firstPositionSet === false) {
            this.originalPosition = { x: x, y: y };
            this.firstPositionSet = true;
        }
        this.lastPosition = this.position;
        this.position.x = x;
        this.position.y = y;
    }

    SetVelocity(x, y) {
        this.velocity.x = x;
        this.velocity.y = y;
    }

    SetVisible(value) {
        this.visible = value;
    }
        
}

/**
 *  SPRITE CLASS
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
        super.SetPosition(this.Sprite.x, this.Sprite.y);
        this.Sprite.x = x;
        this.Sprite.y = y;
        this.Area.x = this.Sprite.x;
        this.Area.y = this.Sprite.y;
    }

    SetRotation(deg) {
        this.Sprite.rotation = Math.radians(deg);
    }

    SetVisible(value) {
        this.visible = value;
        this.Sprite.visible = value;
    }

    IsCollided(other) {
        return this.Area.IsIntersecting(other);
    }

}

/**
 *  ANIMATED SPRITE CLASS
 */
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

            container.addChild(sprite);

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

    SetVisible(value) {
        for (var i = 0; i < this.frames; i++) {
            var sprite = this.Sprites[i];
            this.visible = value;
            sprite.visible = value;
        }
    }

}

export { GameObject, GameSprite, AnimatedSprite};
