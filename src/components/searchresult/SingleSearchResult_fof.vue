<template>
    <div class="searchResult" :id="fixIdForSearchResultContainer(result.groupValue)">
      <div class="generalInfo">
        <div class="overallInfo">
         
         
             <single-search-result-info-base :result="result"  />
         
          <div class="resultInfo">Time</div>
          <div class="timeTitle" />
          <div class="resultDate">
            Rapport from approx <span>{{ this.transformDate(result.doclist.docs[0].ctime) }} </span>
            years ago, {{ this.deliverTimeBetween(result.doclist.docs[0].ctime) }}
            <hr class="report-divider" align="left" />
            <div v-if="result.doclist.docs[0].ff_primaryobject_year_from_i && result.doclist.docs[0].ff_primaryobject_year_from_i">
              Rapport content from time period between
              <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_from_i)">&nbsp; 
              {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_from_i) }}</span> and 
              <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_to_i)">&nbsp;
              {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_to_i) }}</span>
            </div>
          </div>
          <div class="placeTitle">Place</div>
          <div class="resultPlace">{{ this.returnAddresses(result.doclist.docs[0].place_name) }}</div>
          
        </div>
        <div class="mapContainer">
          <result-map
            :id="result.doclist.docs[0].id"
            :coordinateSet="result.doclist.docs[0].place_coordinates || 'Unknown'"
          />
        </div> 
     </div>
     <PDF-search-result :result="result" :queryString="queryString" />
    
  </div>
</template>

<script>
  import ResultMap from "./ResultMap.vue";
  import { mapState } from "vuex";


  export default {
    name: "SearchResult",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
      ResultMap,
    
    },
    props: {
      result: {
        type: Object,
        required: true
      },
      queryString: {
        type: String,
        requred: true
      }
    },
    computed: {
    ...mapState({
      instance: state => state.searchStore.instance
    })
  },
    created() {
    },
    methods: {
      getRecordLink(id, page, loarId) {
        return page
          ? {
              name: "Record",
              query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId, page: true },
              params: {instance: this.instance }
            }
          : { name: "Record", 
              query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId },
              params: {instance: this.instance } 
            };
      },
      transformDate(date) {
        const convertedDate = new Date(date);
        const currentDate = new Date();
        const diffYears = currentDate.getFullYear() - convertedDate.getFullYear();
        return diffYears;
      },
      fixIdForSearchResultContainer(id) {
        return id.replace(/:|\s|\//g, '-')
      },
      deliverTimeBetween(date) {
        const convertedDate = new Date(date);
        return convertedDate.getFullYear();
      },
      deliverTimePeriodStamp(time) {
        let returnphase;
        time.toString().charAt(0) === "-"
          ? (returnphase = time.toString().slice(1) + " BC")
          : (returnphase = time + " AC");
        return returnphase;
      },
      returnACorDC(time) {
        return time.toString().charAt(0) === "-"
          ? time.toString().slice(1) + " before Christ"
          : time.toString() + " bfter Christ";
      },
      returnAddresses(addresses) {
        return addresses ? addresses.join(', ') : "Ingen lokation(er) opgivet.";
      },
      returnAuthors(authors) {
        return authors ? authors.join(', ') : "Ingen forfatter(e) opgivet.";
      },
      toggleMoreSnippetsVisibility() {
        this.showingAllSnippets = !this.showingAllSnippets;
      }
    }
  };
</script>
