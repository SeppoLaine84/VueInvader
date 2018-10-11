<template>
    <div id="main">
        <div class="home container">
            <h1>{{ msg }}</h1>
            <p>Welcome to your new single-page application, built with <a href="https://vuejs.org" target="_blank">Vue.js</a>.</p>
            <div id="invader-canvas">

            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'Home',
        props: {
            msg: String
        }
    };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
</style>
