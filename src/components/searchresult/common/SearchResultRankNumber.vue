
<template>
  <div class="rankNumberContainer">
      <div class="rankNumber">{{ getActualRankingNumber() }}</div>
      </div>
</template>
<script>
  
  import { mapState } from "vuex";
  export default {
    name: "SearchResultRankNumber",
    props: {
       indexNumber: {
        type: Number,
        required:true
      }
    },
    computed: {
      ...mapState({
        solrOptions: state => state.searchStore.solrOptions,
      })
    },
    methods: {
      getActualRankingNumber() {
        return Number(this.solrOptions.currentOffset) + Number(this.indexNumber) + Number(1);
      }
    }
  };
</script>





