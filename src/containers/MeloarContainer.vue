<template>
    <div class="homeContainer">
      <div class="titleContainer">
        <h2>Meloar</h2>
        <hr style="width:300px" />
        <span>Meloar baby!</span>
      </div>
      <div class="simpleNavigation">
        <router-link class="menuLink" :to="{name: 'Instance', params: { location: 'fof' }}">Fof</router-link>
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
  
  export default {
    name:'MeloarContainer',
    components: {
    }
  }
  </script>
  