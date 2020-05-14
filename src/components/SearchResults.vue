<template>
    <div class="searchResultContainer">
      <applied-filters
             :queryString="query || ''"
             :route="this.$router.history.current.path"
           />
      <div v-if="results && resultHits === 0" class="noResults">We weren't able to find any results for you.<br>
         <span class="emojiComponent">😥</span></div>
         <div v-if="loading === false && results" class="searchResults">
           <div class="headline">Filter by:</div>
           <div v-if="this.facets" class="facets">
                  <div v-bind:key="index" v-for="(item, index) in this.facets.facet_fields" class="facet">                    
                    <div class="facetName">{{ index.split("_")[0] }}</div>
                    <div v-on:click="number % 2 === 0 ? filterFromFacets(index, facet) : null" v-bind:key="number" v-for="(facet, number) in item" :class="number % 2 === 0 ? 'facetItem' : 'facetHitNumber'">
                      {{ number % 2 === 0 ? facet || "Unknown" : "(" + facet + ")" }}
                    </div>
                </div>
              </div>
           <div class="headline">
             <span class="numbersFound">{{ resultHits || "0" }}</span> matches was found in
               <span class="numbersFound"> {{ resultMatches || "0" }}</span>
               <span v-if="resultHits > 1 || resultHits === null || resultHits === 0"> pdfs</span>
               <span v-if="resultHits === 1"> pdf</span>
           </div>
             <single-search-result v-for="(item, index) in this.results" :result="item" :queryString="queryDisplay" :key="index" />
        </div>
     </div>
</template>

<script>
// import SingleSearchResult from "./SingleSearchResult.vue";
import SingleSearchResult from "./searchresult/SingleSearchResult_default";
import AppliedFilters from "./AppliedFilters.vue";
import { mapState, mapActions } from 'vuex'

export default {
  name: "SearchResults",
  components: {
    SingleSearchResult,
    AppliedFilters
  },
  data: () => ({
    resultHits: null,
    resultMatches: null,
  }),

  watch: {
    results: function(newValue) {
      if(typeof newValue === 'object' && newValue !== null ) {
        //console.log(Object.keys(this.results).length, "LEEEENGTH")
        if(Object.keys(this.results).length >= 1) {
          this.queryDisplay === "" ? this.updateQueryDisplay(this.results[0].query) : null
          this.resultHits = this.results[0].allHits
          this.resultMatches = this.results.length
        }
        else {
          this.resultHits = 0
          this.resultMatches = 0
        }
        this.setLoadingStatus(false)
      }
    }
  },
  computed: {
    ...mapState({
      query: state => state.searchStore.query,
      queryDisplay: state => state.searchStore.queryDisplay,
      results: state => state.searchStore.results,
      facets: state => state.searchStore.facets,
      loading: state => state.searchStore.loading,
      instance: state => state.searchStore.instance

    })
  },
  created() {
    this.instance === '' ? this.updateInstance(this.$route.params.instance) : null
  },
  methods: {
    ...mapActions("searchStore", {
        updateQueryDisplay: "updateQueryDisplay",
        updateQuery: "updateQuery",
        setLoadingStatus:"setLoadingStatus",
        updateInstance: "updateInstance"
      }),
    checkForResults(results) {
      if (results === undefined) {
        return false
      }
      else {
        return Object.keys(results).length > 0 && results.constructor === Array
      }
    },
    filterFromFacets(filter, value) {
      console.log("filter search", filter, value)
      var getQuery = this.query;
      if (getQuery === "") {
        getQuery = this.$router.history.current.params.query;
      }
      this.updateQuery(getQuery + '&fq=' + filter + ':"' + encodeURIComponent(value) + '"')
      this.$router.push({
        name: "Search",
        params: { query: getQuery + '&fq=' + filter + ':"' + encodeURIComponent(value) + '"' }
      })
    }
  },
}
</script>