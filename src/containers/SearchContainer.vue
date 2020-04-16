<template>
    <div class="searchContainer">
        <!--<div class="searchError">Something went terribly wrong with your search. Please try again.</div>-->
        <search-box />
        <div class="labsContainer">
          <a href="http://labs.kb.dk/">Back to labs.kb.dk</a>
        </div>
        <search-results />
      </div>
</template>
<script>
import SearchResults from "../components/SearchResults.vue";
import SearchBox from "../components/SearchBox.vue";
import { mapState, mapActions } from 'vuex'

export default {
  name: "SearchContainer",
  components: {
    SearchBox,
    SearchResults,
  },
  data: () => ({
    facets: {},
    hits: "",
    searchError: false
  }),
  computed: {
    ...mapState({
      queryDisplay: state => state.searchStore.queryDisplay,
      results: state => state.searchStore.results
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
    getQuery(to) {
      let query = this.queryDisplay;
      if (query === "") {
        console.log(to);
      }
    },
    checkForSearchChange(to, from) {
      return to.params.query !== from.params.query;
    }
  },

  beforeRouteEnter(to, from, next) {
    const query = to.params.query;
        next(vm => {
          vm.doSearch(query);
          console.log(vm, query);
        })
  },

 beforeRouteUpdate(to, from, next) {
    const query = to.params.query;
    if(this.checkForSearchChange(to, from)) {
      this.doSearch(query)
      next();
    }
  },
}
</script>