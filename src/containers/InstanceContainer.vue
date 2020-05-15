<template>
  <div :class="'instanceContainer ' + instance">
    <div class="titleContainer">
      <router-link :to="{name: 'Home'}"><h2>Meloar</h2></router-link>
      <hr style="width:300px" />
      <span>{{ instanceName || 'Ukendt instans' }} v2</span>
    </div>
    <search-box />
    <search-map v-if="searchOptions.map === true"/>
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
import MeloarInstances from '../instances/instances';
import { mapState, mapActions } from 'vuex'
//import TimeSlider from "../components/TimeSlider";

export default {
  name:'InstanceContainer',
  components: {
    SearchBox,
    SearchMap,
  },
  data: () => ({
    MeloarInstances:MeloarInstances,
    instanceName:'',
  }),
  computed: {
    ...mapState({
      instance: state => state.searchStore.instance,
    })
  },
  created() {
    this.updateInstance(this.$route.params.location)
    //Run through the instances and match - when we match, set instance, instance name and the search options for the instance.
    this.MeloarInstances.instances.filter(item => {
      console.log(item.key, "and", item['name'])
      item.key === this.instance ? 
      (this.updateInstance(item.key), 
      this.instanceName = item.name, 
      this.searchOptions = item.searchOptions) 
      : null
    })
  },
  methods: {
    ...mapActions("searchStore", {
        updateInstance: "updateInstance",
      }),

  }
}
</script>
