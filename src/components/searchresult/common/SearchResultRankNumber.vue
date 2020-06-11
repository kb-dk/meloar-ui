
<template>
  <div class="rankNumberContainer">
      <div class="rankNumber">{{ indexNumber + 1 }}</div>
      </div>
</template>
<script>
  
  export default {
    name: "SearchResultRankNumber",
    props: {
       indexNumber: {
        type: Number,
        required:true
      }
    }
    
  };
</script>





