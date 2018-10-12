

<template>

    <div id="main">
        <Highscores ref="highscore_el" />
        <div id="invader-canvas">
            <canvas id="cvs"></canvas>
        </div>
        <modal v-if="showModal" @close="closeModal()">
            <!--
      you can use custom content here to overwrite
      default content
    -->
            <h3 slot="header">
                GAME OVER
                <br />
                <small>Better luck next time!</small>
            </h3>
            <div slot="body">
                <p>Please, enter your name:</p>
                <input type="text" id="player_name" v-model="player.Name" />
            </div>
            <button slot="footer" class="modal-default-button" @click="closeModal()">
                OK
            </button>
        </modal>
    </div>

</template>


<script>
    import { setTimeout } from 'timers';
    import Highscores from './Highscores.vue';
    import { GameEngine } from './../Game/GameEngine.js';

    var engine, renderer, container;
    var enemySpawnTimer;
       
    export default {
        name: 'Home',
        components: {
            Highscores
        },
        props: {
            msg: String,
        },

        data() {
            return {
                showModal: false,
                engine:engine
            }
        },

        mounted: function () {

            this.drawCanvas();
        },

        methods: {

            saveHighscore() {
                this.$refs.highscore_el.addHighscore(this.player.Name, this.score);
            },

          
            closeModal: function () {
                this.showModal = false;
                this.saveHighscore();
            },

            drawCanvas: function () {
                var _self = this;

                engine = new GameEngine("cvs");
                this.engine = engine;

                //this.initRenderer();
                this.addContent();

                engine.addScore("SCORE: 0", 5, 5);

                var postext = engine.addText("TIME", 200, 5);

                var frag =
                    `precision mediump float;
                    uniform vec4 filterArea;
                    uniform sampler2D uSampler;
                    uniform float val;
                    varying vec2 vTextureCoord;
                    void main (void) {
                      vec4 col = texture2D(uSampler, vTextureCoord);
                      if(vTextureCoord.x > val) gl_FragColor = texture2D(uSampler, vec2(val, vTextureCoord.y));
                      else                      gl_FragColor = col;
                    }`.split('\n').reduce((c, a) => c + a.trim() + '\n')

                var uniforms = {
                    val: { type: 'float', value: 0 }
                };
                var filter = new PIXI.Filter(null, frag, uniforms);

                var count = 1;

                var gameoverOnce = true;

                function update(time) {

                    _self.updateTime(time);
                    _self.removeObjects();

                    if (_self.GameOver == false) {

                        _self.mouseData = renderer.plugins.interaction.mouse.global;
                        _self.mouse = renderer.plugins.interaction.mouse;

                        _self.GameObjects.forEach(function (obj) {

                            if (obj.Update) {
                                obj.Update();
                            }

                            if (obj instanceof Bullet == true) {
                                _self.checkCollisions(obj);
                            }

                            _self.checkForGameOver(obj);
                        });

                        GameInfo.enemies.downwardSpeed *= 1.0015;

                    }
                    else {

                        if (gameoverOnce) {
                            clearTimeout(enemySpawnTimer);
                            _self.showModal = true;
                            gameoverOnce = false;
                        }

                        // Start cool fadeout effect
                        if (_self.t - _self.GameOverTime >= GameInfo.gameoverViewTime) {

                            count -= Math.pow(0.15 * Math.random(), 2);
                            uniforms = {
                                val: { type: 'float', value: count },
                                mappedMatrix: { type: 'mat3', value: new PIXI.Matrix() }
                            };
                            filter = new PIXI.Filter(null, frag, uniforms);
                            container.filters = [filter];
                        }
                    }

                    renderer.render(container);
                    requestAnimationFrame(update);

                }
                //update();

            },

            initRenderer() {
                var cvs = document.getElementById('cvs');

                cvs.width = GameInfo.resolution.width;
                cvs.height = GameInfo.resolution.height;

                renderer = new PIXI.WebGLRenderer(GameInfo.resolution.width, GameInfo.resolution.height, { backgroundColor: 0x113, view: cvs, antialias: true });

                container = new PIXI.Container();

            },

            checkCollisions(fromObj) {
                var _self = this;

                this.GameObjects.forEach(function (obj) {
                    if (obj instanceof Enemy) {
                        if (fromObj.IsCollided(obj.Area)) {

                            _self.addExplosion(obj.position.x, obj.position.y);
                            _self.addToRemove(obj);
                            _self.addToRemove(fromObj);
                            _self.updateScore(100);

                        }
                    }
                });
            },

            updateTime(time) {
                this.dt = 0;
                this.t = time / 10;
                if (this.lastTime) {
                    this.dt = (time - this.lastTime) / 1000;
                }
                this.lastTime = time;
            },

            addContent() {

                engine.addPlayer();
                //this.spawnMonsters(GameInfo.enemies.rows);

                //this.enemySpawner();
            },

            enemySpawner() {
                var _self = this;
                enemySpawnTimer = setTimeout(function () {
                    if (_self.GameOver == false) {

                        if (GameInfo.enemies.spawnInterval > 1000)
                            GameInfo.enemies.spawnInterval -= 250;

                        _self.spawnMonsters(1);
                        _self.enemySpawner();
                    }
                }, GameInfo.enemies.spawnInterval)
            },

            spawnMonsters(rows) {
                for (var y = 0; y < rows; y++) {
                    for (var x = 0; x < GameInfo.enemies.columns; x++) {
                        this.addEnemy(GameInfo.enemies.columnStartOffset + (x * GameInfo.enemies.columnSpacing), GameInfo.enemies.rowStartOffset + (y * GameInfo.enemies.rowSpacing));
                    }
                }
            },

            updateScore(amt) {
                this.score += amt;
                this.scoreText.setText("SCORE: " + this.score.toString());
            },

            checkForGameOver(gameObject) {

                if (gameObject instanceof Enemy == true) {
                    if (gameObject.position.y >= GameInfo.resolution.height - 5) {
                        this.GameOver = true;
                        this.GameOverTime = this.t;
                    }
                }
            }
        },
        created() {

        }
    };
</script>


<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
