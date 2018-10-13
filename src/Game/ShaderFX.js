/**
 * SHADER CLASS
 */

class ShaderFX {
    constructor(name, fragment, uniforms) {
        var _self = this;

        this.name = name;
        this.fragment = undefined;
        this.uniforms = uniforms;
        this.shader = undefined;
        this.ready = false;
        this.running = false;

        this.update = function () { };

        PIXI.loader.add('shader_' + name, fragment).load(onLoaded);

        function onLoaded(loader, res) {
            _self.filter = new PIXI.Filter(null, res.data, _self.uniforms);
            _self.ready = true;
        }
    }

    Update() {
        if (this.running === true)
            this.update();
    }

    Start() {
        this.running = true;
    }
    Stop() {
        this.running = false;
    }
}

export default ShaderFX;