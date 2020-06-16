<template>
    <div class="searchResultContainer">
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
             <span class="numbersFound">{{ resultHits || "0" }}</span> matches was found. Showing hit 
              <span class="numbersFound"> {{ this.solrOptions.currentOffset + 1 }} - {{ this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber > resultHits ? resultHits : this.solrOptions.shownResultsNumber + this.solrOptions.currentOffset }}</span>.
              <div>
                <button :disabled="this.solrOptions.currentOffset <= 0" v-on:click="previousResults">last 10</button>
                <button :disabled="this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber >= this.resultHits" v-on:click="nextResults">next 10</button>
              </div>
           </div>
           <component :is="searchResultComponentName"  v-for="(item, index) in this.results" :result="item" :indexNumber="index" :queryString="queryDisplay" :key="index"  ></component>
        </div>
     </div>
</template>

<script>
import AppliedFilters from "./AppliedFilters.vue";
import { mapState, mapActions } from 'vuex'

export default {
  name: "SearchResults",
  components: {
    SingleSearchResult_default: () => import("./searchresult/SingleSearchResult_default"),
    SingleSearchResult_fof: () => import("./searchresult/SingleSearchResult_fof"),
    SingleSearchResult_kirker: () => import("./searchresult/SingleSearchResult_kirker"),
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
      instance: state => state.searchStore.instance,
      solrOptions: state => state.searchStore.solrOptions,
    }),
     searchResultComponentName() {
          //Remember to handle default instance
         return this.instance ? 'SingleSearchResult_' + this.instance : 'SingleSearchResult_default'
        }
  },
  created() {
    this.instance === '' ? this.updateInstance(this.$route.params.instance) : null
  },
  methods: {
    ...mapActions("searchStore", {
        updateQueryDisplay: "updateQueryDisplay",
        updateQuery: "updateQuery",
        setLoadingStatus:"setLoadingStatus",
        updateInstance: "updateInstance",
        updateShownResultsNumber: "updateShownResultsNumber",
        updateCurrentOffset: "updateCurrentOffset",
        doSearch:"doSearch"
      }),
    checkForResults(results) {
      if (results === undefined) {
        return false
      }
      else {
        return Object.keys(results).length > 0 && results.constructor === Array
      }
    },
    nextResults() {
      this.updateCurrentOffset(this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber);
      this.doSearch(
        {
        query:this.query,
        instance:this.instance,
        options:'&row=' + this.solrOptions.shownResultsNumber + '&start=' + this.solrOptions.currentOffset,
        sort:this.solrOptions.searchSort
        }
      );
      console.log("next 10")
    },
    previousResults() {
      this.updateCurrentOffset(this.solrOptions.currentOffset - this.solrOptions.shownResultsNumber);
      this.doSearch(
        {
        query:this.query,
        instance:this.instance,
        options:'&row=' + this.solrOptions.shownResultsNumber + '&start=' + this.solrOptions.currentOffset,
        sort:this.solrOptions.searchSort
        }
      );
      console.log("last 10")
    },
    filterFromFacets(filter, value) {
      var getQuery = this.query;
      if (getQuery === "") {
        getQuery = this.$router.history.current.params.query;
      }
      this.updateQuery(getQuery + '&fq=' + filter + ':"' + encodeURIComponent(value) + '"')
      this.$router.push({
        name: "Search",
        params: { query: getQuery + '&fq=' + filter + ':"' + encodeURIComponent(value) + '"', options:'&row=' + this.solrOptions.shownResultsNumber + '&start=' + this.solrOptions.currentOffset, sort: this.solrOptions.searchSort }
      })
    }
  },
}
</script>