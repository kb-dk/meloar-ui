<template>
    <div class="searchResult" :id="$_fixIdForSearchResultContainer(result.groupValue)">
    <search-result-rank-number :indexNumber="indexNumber"/>
        <div class="generalInfo">
        <div class="overallInfo">
          <single-search-result-info-base :result="result"  />
        </div>
        
    </div>
    <PDF-search-result :result="result" :queryString="queryString" />
    </div>

</template>

<script>
  import SingleSearchResultInfoBase from "./common/SingleSearchResultInfoBase"
  import PDFSearchResult from "./common/PDFSearchResult"
  import SearchResultUtils from "../../mixins/SearchResultUtils"
  import SearchResultRankNumber from "./common/SearchResultRankNumber"

 
  export default {
    name: "SingleSearchResult_default",
    components: {
     PDFSearchResult,
     SingleSearchResultInfoBase,
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
    },
   };
</script>
