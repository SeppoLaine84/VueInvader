import { Container } from 'pixi.js';
import { WebGLRenderer } from 'pixi.js';
import { Sprite } from 'pixi.js';
import { Graphics } from 'pixi.js';
import { Filter } from 'pixi.js';
import { Matrix } from 'pixi.js';
import { setTimeout } from 'timers';


// Game objects
import Player from './Player';
import Enemy from './Enemy';
import Bullet from './Bullet';
import Explosion from './Explosion';
import { Rect, Timer } from './Helpers';
import ShaderFX  from './ShaderFX';

var GameInfo = {
    resolution: {
        width: 640,
        height: 480,
    },
    score: {
        constantScoreAmt: 200,
        constantScoreTimeout: 0.5
    },
    gameoverViewTime: 100,
    player: {
        movementSpeed: 300,
        shootInterval: 35,
    },
    bullet: {
        speed: -600
    },
    enemies: {
        score:1000,
        rows: 4,
        rowSpacing: 50,
        rowStartOffset: -200,
        columns: 10,
        columnSpacing: 120,
        columnStartOffset: 7,
        moveSpeed: 2.5,
        downwardSpeed: 20,
        spawnInterval: 5000,
    }
};

Math.radians = function (degrees) {
    return degrees * Math.PI / 180;
};

var renderer, container;
    
class GameEngine {

    constructor(elementID = "cvs") {

        this.element = elementID;
        this.running = true;      

        this.GameData = {
            GameOver: false, GameOverTime: 0,
            score: 0, scoreText: undefined,
            lastTime: 0, t: 0, dt: 0, player: {}, sprites: [], GameObjects: [],
            mouseData: undefined, mouse: undefined,
            removeList: [],
            filters: []
        };

        this.timers = { active: [], remove: [] };
        this.Update = undefined;
        this.GameInfo = GameInfo;

        this.initGraphics();
    }

    // Initializes webgl canvas
    initGraphics() {
        var cvs = document.getElementById(this.element);

        cvs.width = this.GameInfo.resolution.width;
        cvs.height = this.GameInfo.resolution.height;

        renderer = new PIXI.WebGLRenderer(this.GameInfo.resolution.width, this.GameInfo.resolution.height, { backgroundColor: 0x113, view: cvs, antialias: true });
        container = new PIXI.Container();
    }

    // Starts game
    Start() {

        var _self = this;
        var gameoverOnce = true;

        function update(time) {

            if (_self.running) {

                _self.updateTime(time);
                _self.updateTimers();
                _self.removeObjects();

                _self.GameData.mouseData = renderer.plugins.interaction.mouse.global;
                _self.GameData.mouse = renderer.plugins.interaction.mouse;

                _self.updateObjects();
            }

            if (_self.Update)
                _self.Update();

            renderer.render(container);
            requestAnimationFrame(update);

        }

        console.log("Engine started.");
        update();
    }

    updateObjects() {
        var _self = this;

        _self.GameData.GameObjects.forEach(function (obj) {
                      
            if (obj.Update) {
                obj.Update();
            }

            if (obj instanceof Bullet === true) {
                _self.checkCollisions(obj);
            }
            else if (obj instanceof Enemy === true)
                _self.checkForGameOver(obj);
        });
    }

    get GameObjects() {
        return this.GameData.GameObjects;
    }
       
    // Creates player
    addPlayer() {
        this.GameData.player = new Player(this, "New Player", this.GameInfo.resolution.width / 2, this.GameInfo.resolution.height - 40);
        this.GameData.GameObjects.push(this.GameData.player);
        return this.GameData.player;
    }

    // Add enemy
    addEnemy(x, y) {
        var random = {
            x: -1 + (Math.random()),
            y: -1 + (Math.random()),
        };
        var enemy = new Enemy(this, x+random.x, y+random.y);
        this.GameData.GameObjects.push(enemy);
        return enemy;
    }

    // Adds explosion
    addExplosion(x, y) {
        var explosion = new Explosion(this);
        explosion.SetPosition(x, y);
        this.GameData.GameObjects.push(explosion);
        return explosion;
    }

    // Add score text
    addScore(text, x, y) {
        this.GameData.scoreText = new PIXI.Text(text, { fontFamily: 'C64', fontSize: 14, fill: 0x33ee33, align: 'center' });
        this.GameData.scoreText.position.x = x;
        this.GameData.scoreText.position.y = y;
        container.addChild(this.GameData.scoreText);
        return this.GameData.scoreText;
    }

    // Adds text
    addText(text, x, y, size = 14, fill = 0x33ee33) {
        var _text = new PIXI.Text(text, { fontFamily: 'C64', fontSize: size, fill: fill, align: 'center' });
        _text.position.x = x;
        _text.position.y = y;
        container.addChild(_text);
        return _text;
    }

    // Add Custom timer 
    addTimer(opts, func) {
        var timer = new Timer(opts, func);
        this.timers.active.push(timer);
        return timer;
    }
          
    // Updates custom timers
    updateTimers() {
        var _self = this;

        _self.timers.active.forEach(function (timer) {
            timer.Update();
            if (timer.finished) {
                _self.timers.remove.push(timer);
            }
        });

        _self.timers.remove.forEach(function (timer) {
            var idx = _self.timers.active.findIndex(function (o) {
                return o.id === timer.id;
            });

            if (idx)
                _self.timers.active.splice(idx, 1);
        });
    } 


    // Add GameObject for removal
    addToRemove(object) {
        if (object.deleting === false) {
            object.deleting = true;
            this.GameData.removeList.push(object);
        }
    }

    // Removes all GameObjects from remove list
    removeObjects() {
        var _self = this;
        this.GameData.removeList.forEach(function (object) {
            _self.removeObject(object);
        });
        this.GameData.removeList = [];
    }

    removeObject(object) {
        var _self = this;
        var child = _self.GameData.GameObjects.find(function (o) {
            return o.id === object.id;
        });

        var idx = _self.GameData.GameObjects.findIndex(function (o) {
            return o.id === object.id;
        });

        if (child)
            container.removeChild(child.Sprite);
        if (idx)
            _self.GameData.GameObjects.splice(idx, 1);
    }

    // Adds shader to memory
    addShader(name, fragment, uniforms) {

        var checkShader = this.getShader(name);

        if (checkShader === undefined) {
            var shader = new ShaderFX(name, fragment, uniforms);
            this.GameData.filters.push(shader);
            return shader;
        }
        else
            return checkShader;
    }

    // Gets shader from memory
    getShader(name) {
        return this.GameData.filters.find(function (shader) {
            return shader.name === name;
        });
    }
    
    // Check object for collisions
    checkCollisions(fromObj, collision_cb) {
        var _self = this;
        this.GameData.GameObjects.forEach(function (obj) {
            if (obj instanceof Enemy) {
                if (fromObj.IsCollided(obj.Area)) {
                    _self.addExplosion(obj.position.x, obj.position.y);
                    _self.addToRemove(obj);
                    _self.addToRemove(fromObj);
                    _self.updateScore(_self.GameInfo.enemies.score);
                }
            }
        });
    }
    
    // Adds value to score
    updateScore(amount) {
        this.GameData.score += amount;
    }

    // Updates timers
    updateTime(time) {
        this.GameData.dt = 0;
        this.GameData.t = time / 10;
        if (this.GameData.lastTime) {
            this.GameData.dt = (time - this.GameData.lastTime) / 1000;
        }
        this.GameData.lastTime = time;
    }


    // Checks if enemies get bottom of screen
    checkForGameOver(gameObject) {
        if (gameObject instanceof Enemy) {
            if (gameObject.position.y >= this.GameInfo.resolution.height - gameObject.Area.height && !this.GameData.GameOver) {
                console.log("GAME OVER");
                this.GameData.GameOver = true;
                this.GameData.GameOverTime = this.GameData.t;
            }
        }
    }
}

export { GameEngine, container};