<template>
    <div id="highscores" style="float:left">
        <h3>ALLTIME TOP-10</h3>
        <ul>
            <li v-for="item, index in highscoreTable" v-if="item.score > 0 && index < 10" >
                <span class="position">#{{ index+1 }}</span>
                <span class="score">{{ item.score }}</span>
                <span class="player-name">{{ item.name.substring(0, 12) }}</span>
            </li>
        </ul>
    </div>
</template>

<script>

    import axios from 'axios';

    class Highscore {
        constructor(name, score, cb = function () { }) {
           
            this.doc = { name: name, score: score };

            axios({ method: 'post', url: 'http://localhost:3000/scores/add', data: this.doc, }).then(function (response) {
            }).catch(function (error) {
                console.log(error);
            });
        
        }
    }

    export default {
        name: "Highscores",
        data() {
            return {
                highscoreTable: [],
            }
        },
        methods: {
            addHighscore: function (name, score) {
                var hs = new Highscore(name, score, function (err, newdoc) {
                    if (err) console.err(err);
                    this.getHighscores();
                });
            },
            getHighscores: function () {
                var _self = this;
                axios.get('http://localhost:3000/scores').then(function (scores) {
                    _self.highscoreTable = scores.data;
                }).catch(function (error) {
                    console.log(error);
                })
            },
        },
        created: function () {
            this.getHighscores();
        }
    };
</script>

<style scoped>
</style>