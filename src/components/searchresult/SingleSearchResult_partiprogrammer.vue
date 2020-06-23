<template>
  <div class="searchResult" :id="$_fixIdForSearchResultContainer(result.groupValue)">
  <search-result-rank-number :indexNumber="indexNumber"/>
      <div class="generalInfo">
      <div class="overallInfo">
        <single-search-result-info-base :result="result"  />
        <div class="releaseDate">Release year</div>
        <div class="releaseDateInfo">{{ this.result.doclist.docs[0].ctime.substring(0,4) }}</div>
      </div>
      <result-image :imgsrc="this.result.doclist.docs[0].image_full[0] || 'No image'" />      
  </div>
  <PDF-search-result :result="result" :queryString="queryString" />
  </div>

</template>

<script>
import SingleSearchResultInfoBase from "./common/SingleSearchResultInfoBase"
import PDFSearchResult from "./common/PDFSearchResult"
import SearchResultUtils from "../../mixins/SearchResultUtils"
import SearchResultRankNumber from "./common/SearchResultRankNumber"
import ResultImage from "./addons/ResultImage"


export default {
  name: "SingleSearchResult_partiprogrammer",
  components: {
   PDFSearchResult,
   SingleSearchResultInfoBase,
   SearchResultRankNumber,
   ResultImage
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
  },
 };
</script>
