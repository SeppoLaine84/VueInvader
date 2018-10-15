<template>
    <div id="main">
        <Highscores v-bind:class="{ opacity0: !running }" ref="highscore_el"/>
        <div id="invader-canvas" class="w-50">
            <C64Console v-show="!running"></C64Console>
            <canvas id="cvs"  v-show="running"></canvas>
        </div>



        <modal v-if="showModal" @close="closeModal()">
            <h3 slot="header">
                GAME OVER
                <br />
                <small>Better luck next time!</small>
            </h3>
            <div slot="body">
                <p>Please, enter your name:</p>
                <input type="text" id="player_name" v-model="engine.GameData.player.Name" />
            </div>
            <button slot="footer" class="modal-default-button" @click="closeModal">
                OK
            </button>
        </modal>

        <footer>
            <div class="container">
                <section class="w-25">
                    <h3>
                        This site probably won't work with mobile devices and all browsers!
                        <br />
                        <small>
                            Works best with Chrome and atleast FullHD monitor.
                        </small>
                    </h3>
                </section>
                <section class="w-50 ">
                    <h3 class="text-center">
                        Small unfinished buggy weekend project<br />
                        created by <a href="mailto:seppo.laine@lan-addict.fi" _target="blank">Seppo Laine</a>
                    </h3>
                </section>
                <section class="w-25">
                    <h3 class="text-left">
                        Source code available at <a href="https://github.com/SeppoLaine84/VueInvader/tree/master/src" _target="blank">GitHub</a>
                    </h3>
                </section>
                <div class="clearfix"></div>
            </div>
        </footer>
    </div>

</template>

<script>

    import { setTimeout, setInterval, clearInterval } from 'timers';
    import Highscores from './Highscores.vue';
    import { GameEngine } from './../Game/GameEngine.js';
    import { Timer } from './../Game/Helpers';
    import C64Console from './C64Console.vue';
    import Config from './../config';

    var engine;
    var enemySpawnTimer;

    export default {
        name: 'Home',
        components: {
            Highscores,
            C64Console
        },
        data() {
            return {
                showModal: false,
                engine: engine,
                running: false,
                scoreTimer: undefined,
                gameoverOnce: true,
                lines: [],
                currentLine: ""
            }
        },
        mounted: function () {
            this.focusC64Input();
            engine = new GameEngine("cvs");
            this.engine = engine;
        },
        methods: {
            focusC64Input: function () {
                document.getElementById("c64input").focus();
            },
            C64Command: function () {
                var val = document.getElementById("c64input").value;
                this.lines.push(val);
                this.currentLine = "";
            },
            closeModal: function () {
                this.showModal = !this.showModal;
                this.saveHighscore();
                engine.GameData.player = {};
            },
            // Custom update function
            GameUpdate() {
                var _self = this;
                if (engine.GameData.GameOver) {
                    if (this.gameoverOnce === true) {
                        this.gameoverOnce = false;
                        this.scoreTimer.Stop();
                        this.running = false;
                        this.showModal = true;
                        engine.removeObject(engine.GameData.player);
                    }
                }
            },
            // Starts game
            startGame: function () {
                console.log("Starting game..");
                var _self = this;

                engine.Update = this.GameUpdate; // Sets custom update function, does stuff after basic gameobject updates
                this.addContent();

                engine.Start(); // Start rendering

                this.scoreTimer = engine.addTimer(
                    {
                        timeout: engine.GameInfo.score.constantScoreTimeout,
                        loop: true,
                        autostart: true
                    }, function () {
                        _self.updateScore(engine.GameInfo.score.constantScoreAmt);
                    });

                this.scoreTimer.Start();
                this.running = true;
            },

            // Add player and enemies to scene
            addContent() {
                console.log("Loading content...");

                engine.addPlayer();
                this.gameoverShader = engine.addShader("GameOverFX", 'http://' + Config.backendUrl+ '/shaders /gameover.frag', { val: { type: 'float', value: 0 } })
                this.gameoverShader.update = function () {
                    count -= Math.pow(0.15 * Math.random(), 2);
                    uniforms = {
                        val: { type: 'float', value: count },
                        mappedMatrix: { type: 'mat3', value: new PIXI.Matrix() }
                    };
                    filter = new PIXI.Filter(null, frag, uniforms);
                    container.filters = [filter];
                }
                this.spawnMonsters(engine.GameInfo.enemies.rows);
                this.enemySpawner();

                // UI
                engine.addScore("SCORE: 0", 5, 5);
            },
            // Start spawning more enemies
            enemySpawner() {
                var _self = this;
                enemySpawnTimer = setTimeout(function () {
                    if (engine.GameData.GameOver == false) {
                       
                        if (engine.GameInfo.enemies.spawnInterval > 1000)
                            engine.GameInfo.enemies.spawnInterval -= 250;

                        _self.spawnMonsters(1);
                        _self.enemySpawner();
                    }
                }, engine.GameInfo.enemies.spawnInterval)
            },
            spawnMonsters(rows) {
                for (var y = 0; y < rows; y++) {
                    for (var x = 0; x < engine.GameInfo.enemies.columns; x++) {
                        engine.addEnemy(engine.GameInfo.enemies.columnStartOffset + (x * engine.GameInfo.enemies.columnSpacing), engine.GameInfo.enemies.rowStartOffset + (y * engine.GameInfo.enemies.rowSpacing));
                    }
                }
            },
            // Updates score display
            updateScore(amt) {
                engine.GameData.score += amt;
                engine.GameData.scoreText.text = "SCORE: " + engine.GameData.score.toString();
               
            },
            // Saves scores to database
            saveHighscore() {
                this.$refs.highscore_el.addHighscore(engine.GameData.player.Name, engine.GameData.score);
            },
        },
        created() {
        }
    };
</script>
<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
