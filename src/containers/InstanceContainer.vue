<template>
  <div :class="'instanceContainer ' + instance">
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
import { mapState, mapActions } from 'vuex'
//import TimeSlider from "../components/TimeSlider";

export default {
  name:'InstanceContainer',
  components: {
    SearchBox,
    SearchMap
  },
  computed: {
    ...mapState({
      instance: state => state.searchStore.instance,
    })
  },
  created() {
    console.log(this.$route)
    this.updateInstance(this.$route.params.location)
  },
  methods: {
    ...mapActions("searchStore", {
        updateInstance: "updateInstance",
      }),

  }
}
</script>
