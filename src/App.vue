<template>
    <div id="app" class="home container">
        <Home msg="VueINVADER!" />
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
