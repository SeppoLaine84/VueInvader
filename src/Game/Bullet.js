import { GameSprite } from "./BaseObjects";
import { Rect } from './Helpers';

/**
 *
 * BULLET CLASS
 *
 */
class Bullet extends GameSprite {

    constructor(mgr) {
        super(mgr, "bullet.png", 3, 6);
        this.Area = new Rect(0, 0, 3, 6);
    }

    Update() {
        if (this.mgr.GameData.t && this.mgr.GameData.mouseData) {
            this.DoMovement();
            this.CheckBounds();
        }
    }

    DoMovement() {
        var dt = this.mgr.GameData.dt;
        var y = this.position.y;
        y += this.velocity.y * dt;
        this.SetPosition(this.position.x, y);
    }

    CheckBounds() {
        if (this.position.y < 0) {
            this.mgr.addToRemove(this);
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

export default Bullet;