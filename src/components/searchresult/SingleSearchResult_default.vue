<template>
    <div class="searchResult" :id="fixIdForSearchResultContainer(result.groupValue)">
      <div class="generalInfo">
        <div class="overallInfo">
          <single-search-result-info-base :result="result"  />
        </div>
        
    </div>
    <PDF-search-result :result="result" :queryString="queryString" />
    </div>

</template>

<script>
   import PDFSearchResult from "./PDFSearchResult";
   import SingleSearchResultInfoBase from "./SingleSearchResultInfoBase"
  //import ResultMap from "./ResultMap.vue";
  import { mapState } from "vuex";


  export default {
    name: "SearchResult",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
     PDFSearchResult,
     SingleSearchResultInfoBase
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
      fixIdForSearchResultContainer(id) {
        return id.replace(/:|\s|\//g, '-')
      },
    }
  };
</script>
