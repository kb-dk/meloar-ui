<template>
    <div class="searchContainer">
      <transition name="loading-overlay">
        <div v-if="loading === true" class="loading-overlay">
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
          <div class="bubble"></div>
        </div>
      </transition>
        <!--<div class="searchError">Something went terribly wrong with your search. Please try again.</div>-->
        <search-box :time="time"/>
        <div class="labsContainer">
          <a href="http://labs.kb.dk/">Back to labs.kb.dk</a>
        </div>
        <search-results :mapAllowed="this.map" />
        <transition name="loading-overlay">
        <div v-if="scrolledFromTop" class="topTopArrow" v-on:click="backToTop">↑</div>
        </transition>
      </div>
</template>
<script>
import SearchResults from "../components/SearchResults.vue";
import MeloarInstances from '../instances/instances';
import SearchBox from "../components/SearchBox.vue";
import SearchResultUtils from "../mixins/SearchResultUtils"
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
    map:false,
    scrolledFromTop:false
  }),
  mixins: [SearchResultUtils],
  computed: {
    ...mapState({
      query: state => state.searchStore.query,
      results: state => state.searchStore.results,
      loading: state => state.searchStore.loading,
      instance: state => state.searchStore.instance,
      solrOptions: state => state.searchStore.solrOptions,
    })
  },
  created() {
    this.MeloarInstances.instances.filter(item => {
        item.key === this.instance || item.key === this.$route.params.instance ? (this.time = item.searchOptions.time, this.map = item.searchOptions.map) : null
      })
  },
  mounted() {
    window.addEventListener("scroll", this.onScroll)
  },
  methods: {
    ...mapActions('searchStore', {
      doSearch: 'doSearch',
      structureSearchResult: 'structureSearchResult',
      updateSearchSort:'updateSearchSort'
    }),
    onScroll(e) {
      e.target.documentElement.scrollTop > 0 ? this.scrolledFromTop = true : this.scrolledFromTop = false
    },
    backToTop() {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
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
    //Apparently full encoding breaks solr, so we just want to escape the brackets [], since that's what needed for the tomcat to accept the query.
    const query = to.params.query.replace(/\[/g,'%5B').replace(/]/g,'%5D');
    //const query = encodeURIComponent(to.params.query);
        next(vm => {
          if(query.includes("ff_primaryobject_year_from_i") || query.includes("ff_primaryobject_year_from_i")) {
            let timeFrom;
            let timeTo;
            query.split("&fq=").filter(item => {
             item.includes("ff_primaryobject_year_from_i") ? timeTo = parseInt(vm.$_returnTimeFromQueryString(decodeURIComponent(item))) : null
             item.includes("ff_primaryobject_year_to_i") ? timeFrom = parseInt(vm.$_returnTimeFromQueryString(decodeURIComponent(item))) : null
            })
            vm.updateSearchSort('&sort=dist(2,ff_primaryobject_year_from_i,ff_primaryobject_year_to_i,' + timeFrom +',' + timeTo + ')+asc,score+desc')
          }
          vm.doSearch({query:query, instance:vm.instance, options:'&rows=' + vm.solrOptions.shownResultsNumber + '&start=' + vm.solrOptions.currentOffset, sort: vm.solrOptions.searchSort});
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