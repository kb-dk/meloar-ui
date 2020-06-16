<template>
    <div class="homeContainer">
      <div class="titleContainer">
        <h2>Meloar</h2>
        <hr style="width:300px" />
        <span>Available MeLOAR instances:</span>
      </div>
      <div class="simpleNavigation">
        <router-link v-bind:key="index" v-for="(item, index) in instances" class="menuLink instanceLink" :to="{name: 'Instance', params: { instance: item.key }}">{{ item.name }}</router-link>
        <br>
        <br>
        <router-link class="menuLink" to="/About">
          About this
        </router-link>
        <br>
        <a href="http://labs.kb.dk/">Back to labs.kb.dk</a>
      </div>
    </div>
  
  </template>
  <script>
  //import TimeSlider from "../components/TimeSlider";
  
  import MeloarInstances from "../instances/instances";

  export default {
    name:'MeloarContainer',
    components: {
    },
    computed: {
      instances () {
        return MeloarInstances.instances
      }
    },
  }
  </script>
  