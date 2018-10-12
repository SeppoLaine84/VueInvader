import { Container } from 'pixi.js';
import { WebGLRenderer } from 'pixi.js';
import { Sprite } from 'pixi.js';
import { Graphics } from 'pixi.js';
import { Filter } from 'pixi.js';
import { Matrix } from 'pixi.js';
import { setTimeout } from 'timers';
import { GameObject, GameSprite, AnimatedSprite, Player, Enemy, Bullet, Explosion } from './GameObjects';


var GameInfo = {
    resolution: {
        width: 640,
        height: 480,
    },
    gameoverViewTime: 100,
    player: {
        movementSpeed: 200,
        shootInterval: 30,
    },
    bullet: {
        speed: -600
    },
    enemies: {
        rows: 4,
        rowSpacing: 40,
        rowStartOffset: 40,
        columns: 10,
        columnSpacing: 90,
        columnStartOffset: 67,
        moveSpeed: 2.5,
        downwardSpeed: 50,
        spawnInterval: 5000,
    }
};

var renderer, container;
    
class GameEngine {
    constructor(elementID = "cvs") {
        this.element = elementID;
               
        this.GameData = {
            GameOver: false, GameOverTime: 0,
            score: 0, scoreText: undefined,
            lastTime: 0, t: 0, dt: 0, player: {}, sprites: [], GameObjects: [],
            mouseData: undefined, mouse: undefined,
            removeList: [],
        };
       
        this.GameInfo = GameInfo;
        

        Math.radians = function (degrees) {
            return degrees * Math.PI / 180;
        };

        this.initGraphics();

        console.log("EngineCreated");
    }

    initGraphics() {
        var cvs = document.getElementById(this.element);
        cvs.width = this.GameInfo.resolution.width;
        cvs.height = this.GameInfo.resolution.height;

        renderer = new PIXI.WebGLRenderer(this.GameInfo.resolution.width, this.GameInfo.resolution.height, { backgroundColor: 0x113, view: cvs, antialias: true });
        container = new PIXI.Container();

        function update(time) {
            renderer.render(container);
            requestAnimationFrame(update);
        }

        update();
    }

   

    addPlayer() {
        this.GameData.player = new Player(this, "New Player");
        this.player.SetPosition(this.GameInfo.resolution.width / 2, this.GameInfo.resolution.height - 40);
        this.GameData.GameObjects.push(this.player);
        return this.player;
    }

    addEnemy(x, y) {
        var enemy = new Enemy(this, x, y);
        enemy.SetPosition(x, y);
        this.GameData.GameObjects.push(enemy);
        return enemy;
    }

    addExplosion(x, y) {
        var explosion = new Explosion(this);
        explosion.SetPosition(x, y);
        this.GameData.GameObjects.push(explosion);
        return explosion;
    }

    addScore(text, x, y) {
        this.scoreText = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: 14, fill: 0x33ee33, align: 'center' });
        this.scoreText.position.x = x;
        this.scoreText.position.y = y;

        container.addChild(this.scoreText);
    }

    addText(text, x, y, size = 14, fill = 0x33ee33) {
        var _text = new PIXI.Text(text, { fontFamily: 'Arial', fontSize: size, fill: fill, align: 'center' });
        _text.position.x = x;
        _text.position.y = y;
        container.addChild(_text);
        return _text;
    }

    removeObjects() {
        var _self = this;
        this.GameData.removeList.forEach(function (object) {

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
        });
        this.removeList = [];
    }

    addToRemove(object) {
        if (object.deleting === false) {
            object.deleting = true;
            this.GameData.removeList.push(object);
        }
    }

}

export { GameEngine, container};