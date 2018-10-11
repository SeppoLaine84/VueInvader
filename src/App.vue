<template>
    <div id="app">
        <Home msg="Vue.js INVEDERS!" />
    </div>
</template>

<script>
    import Home from './components/Home.vue';

    export default {
        name: 'app',
        components: {
            Home
        }
    };
</script>

<style src="./assets/style.min.css">
</style>
