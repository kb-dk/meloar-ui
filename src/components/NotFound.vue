<template>
  <div class="notfoundContainer">
    <div v-if="ready === true" class="notfound">
      <span class="unfortunate">Uh-oh,</span>
      <div class="error">404</div>
      <div class="message">
        <span>It looks like the page you looked for has been misplaced, and can't be reached. We're truly sorry!</span>
        <br>
        <router-link v-if="this.$route.name === 'Record'" :to="{name: 'Instance', params: { instance: this.$route.params.instance }}">← Go back to search</router-link>
        <router-link v-if="this.$route.name === 'Instance'" :to="{name: 'Home' }">← Go back to Meloar</router-link>
      </div>
      </div>
  </div>
</template>
  
  <script>  
    export default {
      name: "NotFound",
      data() {
        return {
          ready: false
        };
      },
      created() {
        console.log(this.$route)
        this.ready = true
      },
      methods: {
      }
    };
  </script>
  