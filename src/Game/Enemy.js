import { GameObject, GameSprite } from "./BaseObjects";
import { Rect } from './Helpers';
/**
 * ENEMY CLASS
 */
class Enemy extends GameSprite {

    constructor(mgr, xinit, yinit, width = 42, height = 19) {
        super(mgr, "enemy_ship.png", width, height);
        this.mgr = mgr;
        this.SetRotation(0);
        this.lastVelocity = 0;
        this.time = yinit;
        this.originalX = xinit;
        this.originalY = yinit;
        this.width = width; this.height = height;
        this.SetPosition(xinit, yinit);
        this.Area = new Rect(0, 0, this.width, this.height);
    }

    Update() {

        var t = this.mgr.GameData.t;
        var dt = this.mgr.GameData.dt;
        var GameInfo = this.mgr.GameInfo;
       
        if (t) {
          
            this.time += dt;
            var pos = this.position;
            pos.x = 90 + (this.originalX / 2 + Math.cos(this.time * 2) * 128 / 2);
            pos.y += (GameInfo.enemies.downwardSpeed) * dt;
            
            this.SetPosition(pos.x, pos.y);

        }
    }

    SetPosition(x, y) {
        this.position.x = x;
        this.position.y = y;
        this.Area.x = x;
        this.Area.y = y;
        this.Sprite.position = this.position;
        if (this.firstPositionSet === false) {
            this.originalPosition = this.position;
            this.firstPositionSet = true;
        }
    }

}

export default Enemy;