<template>
    <div v-if="checkForResults(this.results)" class="searchResultContainer">
        <div v-if="resultHits === 0" class="noResultContainer">No results found. Sorry :(</div>
         <div class="searchResults">
           <!--<AppliedFilters
             queryString={searchState.query || ""}
             route={router.history.current.path}
           />-->
           <div class="headline">Filter by:</div>
           <div class="facets">
                   <div class="facet">
                     <div class="facetName">Facet name</div>
                   </div>
           </div>
           <div class="headline">
             <span class="numbersFound">{{ resultHits }}</span> matches was found in
               <span class="numbersFound"> {{ resultMatches }}</span>
               <span v-if="resultHits > 1"> pdfs</span>
               <span v-if="resultHits === 1"> pdf</span>
           </div>
             <single-search-result  v-for="(item, index) in this.results.grouped.loar_id.groups" :result="item" :queryString="queryDisplay" :key="index" />
        </div>
     </div>
</template>

<script>
import SingleSearchResult from "./SingleSearchResult.vue";
//import router from "../router/index.js";
//import AppliedFilters from "./AppliedFilters.js";
import { mapState } from 'vuex'

export default {
  name: "SearchResults",
  components: {
    SingleSearchResult
  },
  data: () => ({
    resultHits: null,
    resultMatches: null,
  }),

  watch: {
    results: function(newValue) {
      if(typeof newValue === 'object' && newValue !== null ) {
      this.resultHits = this.results.grouped.loar_id.matches
      this.resultMatches = this.results.grouped.loar_id.groups.length 
      }
    }
  },
  computed: {
    ...mapState({
      queryDisplay: state => state.searchStore.queryDisplay,
      results: state => state.searchStore.results
    })
  },
  methods: {
    checkForResults(results) {
      console.log("doing check", results)
      if (results === undefined) {
        return false
      }
      else {
        return Object.keys(results).length > 0 && results.constructor === Object
      }
    },
    filterFromFacets(name, key, props) {
      console.log(props.props.searchResults["0"].query);
      var getQuery = this.queryDisplay;
      if (getQuery === "") {
        getQuery = this.$router.history.current.params.query;
      }
      this.$router.push({
        name: "search",
        params: { query: getQuery + "&fq=" + key.key + ':"' + encodeURIComponent(name.name) + '"' }
      });
    }
  },
}
</script>