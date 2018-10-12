/**
*
* RECTANGLE CLASS FOR COLLISION CHECKING
*
*/
class Rect {
    constructor(x, y, w, h) {
        this.x = x;
        this.y = y;
        this.width = w;
        this.height = h;
    }

    IsIntersecting(other) {
        return !(other.x > this.x + this.width ||
            other.x + other.width < this.x ||
            other.y > this.y + this.height ||
            other.y + other.height < this.y);
    }
}

export { Rect };