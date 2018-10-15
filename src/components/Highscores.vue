<template>
    <div id="highscores" class="w-25">
        <table>
            <thead>
                <tr>
                    <th colspan="3">
                        ALLTIME BEST PLAYERS
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="item, index in highscoreTable" v-if="item.score > 0 && index < 10">
                    <td class="position">#{{ index+1 }}</td>
                    <td class="score">{{ item.score }}</td>
                    <td class="player-name">{{ item.name.substring(0, 12) }}</td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<script>

    import axios from 'axios';
    import Config from './../config';

    class Highscore {
        constructor(name, score, cb = function () { }) {
           
            this.doc = { name: name, score: score };

            axios({
                method: 'post', url: 'http://' + Config.backendUrl + '/scores/add', data: this.doc, }).then(function (response) {
                cb(response);
            }).catch(function () {
               
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
                var hs = new Highscore(name, score, function (newdoc) {
                    this.getHighscores();
                });
            },
            getHighscores: function () {
                console.log("Getting highscores.");
                var _self = this;
                axios.get('http://' + Config.backendUrl + '/scores').then(function (scores) {
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