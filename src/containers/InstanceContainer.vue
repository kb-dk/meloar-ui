<template>
  <div :class="'instanceContainer ' + instance">
    <div v-if="instanceName">
      <div class="titleContainer">
        <h2>{{ instanceName || 'Ukendt instans' }}</h2>
        <hr style="width:300px" />
        <router-link :to="{name: 'Home'}"><span>back to MELOAR v2</span></router-link>
      </div>
      <search-box :time="searchOptions.time"/>
      <search-map v-if="searchOptions.map" />
      <div class="simpleNavigation">
        <router-link class="menuLink" to="/About">
          About this
        </router-link>
        <br />
        <br />
        <div class="labsContainer"> <a href="http://labs.kb.dk/">Back to labs.kb.dk</a></div>
      </div>
    </div>
    <not-found v-if='!instanceName'></not-found>
  </div>
</template>
<script>
import SearchBox from "../components/SearchBox.vue";
import SearchMap from "../components/SearchMap.vue";
import NotFound from "../components/NotFound.vue";
import MeloarInstances from '../instances/instances';
import { mapState, mapActions } from 'vuex'
//import TimeSlider from "../components/TimeSlider";

export default {
  name:'InstanceContainer',
  components: {
    SearchBox,
    SearchMap,
    NotFound
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
      this.updateInstance(this.$route.params.instance)
      this.MeloarInstances.instances.filter(item => {
        //console.log(item.key, "and", item['name'])
        item.key === this.instance ? (this.instanceName = item.name, this.searchOptions = item.searchOptions) : null
      })
    },
  mounted() {
    this.updateQuery("")
    this.updateQueryDisplay("")

  },
  methods: {
    ...mapActions("searchStore", {
        updateInstance: "updateInstance",
        updateQuery: "updateQuery",
        updateQueryDisplay: "updateQueryDisplay",

      }),

  }
}
</script>