<template>
    <div class="homeContainer">
      <div class="headContainer">
      <div class="frontpageTitleContainer">
        <h2>Meloar</h2>
        <div class="explanationContainer">
        <span class="imp">ME</span><span>diestream for </span><span class="imp">LOAR</span>
      </div>
      </div>
      <div class="headCube"></div>
    </div>
    <div class="informationContainer">
      <div class="frontpageSimpleNavigation">
        <div class="navHeadline"><span>Available instances</span></div>
        <div class="meloarInstancesContainer">
        <router-link v-bind:key="index" v-for="(item, index) in instances" class="menuLink instanceLink" :to="{name: 'Instance', params: { instance: item.key }}">{{ item.name }}</router-link>  
      </div>
      </div>
    </div>
    <div class="frontpageBottomContainer">
     <div class="headCubeReversed"></div>
      <router-link class="menuLink" to="/About">About Meloar</router-link>
      <br>
      <a href="http://labs.kb.dk/">To labs.kb.dk</a>
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
  