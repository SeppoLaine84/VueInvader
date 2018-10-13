/***********
 * 
 * EXPLOSION CLASS
 * 
 */


import { AnimatedSprite } from "./BaseObjects";

class Explosion extends AnimatedSprite {
    constructor(mgr) {
        super(mgr, "explosion", 6, 64, 64, 4000, true);
        //this.SetPosition(200, 200);
    }
}

export default Explosion;