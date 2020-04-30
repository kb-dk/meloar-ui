<template>
  <div class="homeContainer">
    <div class="titleContainer">
      <h2>Meloar</h2>
      <hr style="width:300px" />
      <span>Fund & fortidsminder v2</span>
    </div>
    <search-box />
    <search-map />
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
import SearchBox from "../components/SearchBox.vue";
import SearchMap from "../components/SearchMap.vue";
//import TimeSlider from "../components/TimeSlider";

export default {
  name:'HomeContainer',
  components: {
    SearchBox,
    SearchMap
  }
}
</script>
