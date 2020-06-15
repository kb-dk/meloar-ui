<template>
    <div class="searchContainer">
        <!--<div class="searchError">Something went terribly wrong with your search. Please try again.</div>-->
        <search-box :time="time"/>
        <div class="labsContainer">
          <a href="http://labs.kb.dk/">Back to labs.kb.dk</a>
        </div>
        <search-results />
      </div>
</template>
<script>
import SearchResults from "../components/SearchResults.vue";
import MeloarInstances from '../instances/instances';
import SearchBox from "../components/SearchBox.vue";
import { mapState, mapActions } from 'vuex'

export default {
  name: "SearchContainer",
  components: {
    SearchBox,
    SearchResults
  },
  data: () => ({
    MeloarInstances:MeloarInstances,
    facets: {},
    hits: "",
    searchError: false,
    time: false,
  }),
  computed: {
    ...mapState({
      query: state => state.searchStore.query,
      results: state => state.searchStore.results,
      instance: state => state.searchStore.instance,
      searchSort: state => state.searchStore.searchSort,
      shownResultsNumber: state => state.searchStore.shownResultsNumber,
      currentOffset: state => state.searchStore.currentOffset,
    })
  },
  created() {
    this.MeloarInstances.instances.filter(item => {
        item.key === this.instance || item.key === this.$route.params.instance ? this.time = item.searchOptions.time : null
      })
  },
  methods: {
    ...mapActions('searchStore', {
      doSearch: 'doSearch',
      structureSearchResult: 'structureSearchResult'
    }),
    setFacets(facets) {
      this.facets = facets;
    },
    setHits(hits) {
      this.hits = hits;
    },
    getFacets(searchResults) {
      let facets = JSON.parse(JSON.stringify(searchResults.facet_counts.facet_fields));
      return facets;
    },
    getHits(searchResults) {
      let hits = searchResults.grouped.loar_id.matches.toString();
      return hits;
    },
    setErrorStatus() {
      this.searchError = true;
    },
    /*getQuery(to) {
      let query = to.query.query;
    },*/
    checkForSearchChange(to, from) {
      return to.params.query !== from.params.query;
    }
  },

  beforeRouteEnter(to, from, next) {
    const query = to.params.query;
        next(vm => {
          vm.doSearch({query:query, instance:vm.instance, options:'&row=' + vm.shownResultsNumber + '&start=' + vm.currentOffset, sort: vm.searchSort});
          //console.log(vm, query);
        })
  },

 beforeRouteUpdate(to, from, next) {
   //console.log("we at the beforeRouteUpdate")
    const query = to.params.query;
    if(this.checkForSearchChange(to, from)) {
      this.doSearch({query:query, instance:to.params.instance, options:to.params.options, sort: to.params.sort})
      next();
    }
  },
}
</script>