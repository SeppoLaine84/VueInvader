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

function GenID() {
    return '_' + Math.random().toString(36).substr(2, 9);
}

class Timer {
    constructor(opts, fn = function () { console.log("triggered"); }) {
        this.id = GenID();
        this.startTime = this.time;
        this.currentTime = this.startTime;

        this.opts = {
            timeout: 1,
            loop: false,
            autostart: true
        };

        this.fn = fn;
        this.options = opts;
        this.running = false;
        this.finished = false;

        if (this.options.autostart)
            this.Start();
    }

    Start() {
        this.running = true;
    }

    Stop() {
        this.running = false;
    }

    Remove() {
        this.finished = true;
    }

    Update() {
        if (this.running && !this.finished) {
            this.currentTime = this.time;
            var diff = this.currentTime - this.startTime;
            if (diff >= this.options.timeout) {
                if (!this.options.loop) 
                    this.finished = true;
                this.startTime = this.currentTime;
                if (this.fn)
                    this.fn();
            }
        }
    }

    get time() {
        return new Date().getTime() / 1000;
    }
}

export { Rect, Timer, GenID};