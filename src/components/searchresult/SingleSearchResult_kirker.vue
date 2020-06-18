<template>
    <div class="searchResult" :id="this.$_fixIdForSearchResultContainer(result.groupValue)">
    <search-result-rank-number :indexNumber="indexNumber"/>
        <div class="generalInfo">
        <div class="overallInfo">
             <single-search-result-info-base :result="result"  />
          <div class="resultInfo">Time</div>
          <div class="timeTitle" />
          <div class="resultDate">
            Rapport from approx <span>{{ this.$_transformDate(result.doclist.docs[0].ctime) }} </span>
            years ago, {{ this.$_deliverTimeBetween(result.doclist.docs[0].ctime) }}
            <div v-if="result.doclist.docs[0].ff_primaryobject_year_from_i && result.doclist.docs[0].ff_primaryobject_year_to_i">
              <hr class="report-divider" align="left" />
              Rapport content from time period between
              <span :title="this.$_returnACorDC(result.doclist.docs[0].ff_primaryobject_year_from_i)">&nbsp; 
              {{ this.$_deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_from_i) }}</span> and 
              <span :title="this.$_returnACorDC(result.doclist.docs[0].ff_primaryobject_year_to_i)">&nbsp;
              {{ this.$_deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_to_i) }}</span>
            </div>
          </div>
          <div class="placeTitle">Place</div>
          <div class="resultPlace">{{ this.$_returnAddresses(result.doclist.docs[0].place_name) }}</div>
          
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
  
  import SingleSearchResultInfoBase from "./common/SingleSearchResultInfoBase"
  import PDFSearchResult from "./common/PDFSearchResult"
  import ResultMap from "./addons/ResultMap.vue";
  import SearchResultUtils from "../../mixins/SearchResultUtils"
  import SearchResultRankNumber from "./common/SearchResultRankNumber"
  
  export default {
    name: "SingleSearchResult_kirk",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
      ResultMap,
      SingleSearchResultInfoBase,
      PDFSearchResult,
      SearchResultRankNumber
  
    },
     mixins: [SearchResultUtils],
    props: {
      result: {
        type: Object,
        required: true
      },
      queryString: {
        type: String,
        requred: true
      },
      indexNumber: {
        type: Number,
        required:true
      }
    }
  };
</script>
