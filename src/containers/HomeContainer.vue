<template>
  <div class="homeContainer">
    <div class="titleContainer">
      <h2>Meloar</h2>
      <hr style="width:300px" />
      <span>Fund & fortidsminder</span>
    </div>
    <!--<SearchBox />
    <TimeSlider min={-3000} max={2000} values={[-1000,0]} />
    <SearchMap />-->
    <div class="simpleNavigation">
      <router-link class="menuLink" to="/About">
        About this
      </router-link>
      <br />
      <br />
      <a href="http://labs.kb.dk/">Back to labs.kb.dk</a>
    </div>
  </div>

</template>
<script>
//import SearchBox from "../components/SearchBox";
//import SearchMap from "../components/SearchMap";
//import TimeSlider from "../components/TimeSlider";

export default {
  name:'HomeContainer',
}
</script>
