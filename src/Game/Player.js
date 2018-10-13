import { GameSprite } from "./BaseObjects";
import  Bullet  from "./Bullet";
import { container } from './GameEngine';

/**
 *  PLAYER CLASS
 */
class Player extends GameSprite {
    constructor(mgr, name, x, y) {
        super(mgr, "player_ship.png");
        this.mgr = mgr;
        this.Name = name;
        this.MovementSpeed = this.mgr.GameInfo.player.movementSpeed;
        this.Bullets = [];
        this.LastShootTime = this.mgr.GameData.t;
        

        this.firstPositionSet = false;
        this.SetPosition(x, y);

        console.log("Player added");
    }

    get IsAlive() {
        return !this.mgr.GameData.GameOver;
    }

    Update() {
        if (this.mgr.GameData.t && this.mgr.GameData.mouseData && this.IsAlive) {
            this.DoMovement();
            this.Shoot();
            this.CheckBounds();
        }
    }

    DoMovement() {
        var mouseDir = 0;
        var mouseData = this.mgr.GameData.mouseData;
       
        
        if (mouseData.x >this.position.x) mouseDir = 1;
        else if (mouseData.x < this.position.x) mouseDir = -1;

        var x = this.position.x;

        var vel = (mouseDir * this.MovementSpeed);
        if (vel > this.MovementSpeed) {
            vel = this.MovementSpeed;
        }
        else if (vel < -this.MovementSpeed) {
            vel = -this.MovementSpeed;
        }
        this.SetVelocity(vel);

        x += this.velocity.x * this.mgr.GameData.dt;

        this.SetPosition(parseInt(x), this.originalPosition.y);
      
    }

    SetPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.Sprite.position = this.position;
        if (this.firstPositionSet === false) {
            this.originalPosition = this.position;
            this.firstPositionSet = true;
        }
    }

    Shoot() {

        var t = this.mgr.GameData.t;
       
        var diff = t - this.LastShootTime;

        if (diff >= this.mgr.GameInfo.player.shootInterval) {
           
            if (this.mgr.GameData.mouse) {

                if (this.mgr.GameData.mouse.buttons === 1) {
                    
                    var bulletleft = new Bullet(this.mgr);
                    this.mgr.GameData.GameObjects.push(bulletleft);
                    bulletleft.SetPosition(this.position.x, this.position.y);
                    bulletleft.SetVelocity(0, this.mgr.GameInfo.bullet.speed);

                    var bulletright = new Bullet(this.mgr);
                    this.mgr.GameData.GameObjects.push(bulletright);
                    bulletright.SetPosition(this.position.x + 16, this.position.y);
                    bulletright.SetVelocity(0, this.mgr.GameInfo.bullet.speed);

                    this.LastShootTime = t;

                }
            }
        }
    }

    CheckBounds() {
        if (this.position.x > this.mgr.GameInfo.resolution.width - this.Sprite.width - 3)
            this.SetPosition(this.mgr.GameInfo.resolution.width - this.Sprite.width - 3, this.position.y);
        else if (this.position.x < 3)
            this.SetPosition(3, this.position.y);
    }
}

export default Player;
