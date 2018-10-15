<template>
 
    <div id="C64Console" class="c64container" @click="focusC64Input">
        <center style="margin-bottom:5px;">**** VUE.JS INVASION SYSTEM V1 ****</center>
        <center>TYPE 'HELP' FOR COMMANDS </center>
        <div>READY.</div>
                      
        <div class="input_text old-line" v-for="line in lines">
            <div v-bind:class="{error:line.type}">{{ line.value }}</div>
        </div>

        <div class="input_text clearfix">
            <span class="cursor blink_me"></span>
            <span>{{ currentLine }}</span>
        </div>

        <input class="ui-hidden-accessible" v-on:keyup.enter="C64Command" v-model="currentLine" id="c64input" />

    </div>
</template>

<script>

    export default {
        name: 'C64Console',
        data() {
            return {
                availableCommands: {
                    "run": this.run,
                    "help": this.help,
                },
                lines: [],
                currentLine: ""
            }
        },
        mounted: function () {
            this.focusC64Input();
        },
        methods: {
            focusC64Input: function () {
                document.getElementById("c64input").focus();
            },
            C64Command: function () {
                var val = {value: document.getElementById("c64input").value};
                this.lines.push(val);
                this.currentLine = "";
                this.parseCommand(val);
            },
            addLine(val, type) {
                this.lines.push({ value: val, type: type });
            },
            parseCommand(cmd) { 

                var _self = this;
                var commandFound = false;

                Object.keys(_self.availableCommands).forEach(function (key) {
                    if (key === cmd.value) {
                        commandFound = true;
                        _self.availableCommands[key]();
                        _self.addLine("READY.");
                    }
                });

                if (!commandFound) {
                    _self.addLine("?SYNTAX  ERROR.", "error");
                    _self.addLine("READY.");
                }
            },

            run() {
                var _self = this;
                this.addLine("LOADING.");

                _self.$parent.startGame();
            },
            help() {
                this.addLine("AVAILABLE COMMANDS:", "error");
                this.addLine("RUN  - STARTS INVASION GAME");
                this.addLine("HELP - THIS HELP");
            }
        }
    }
</script>

<style scoped>
</style>