
<template>
<div>
  <div class="resultTitle">
            <div class="pdfTitle">pdf title</div>
            <div class="pdfName">{{ result.doclist.docs[0].title }}</div>
       </div>
          <div class="authorContainer">
            <div class="authorTitle">Authors:&nbsp;</div>
            <div class="authorName">{{ this.$_returnAuthors(result.doclist.docs[0].author) }}</div>
          </div>
    </div>
</template>

<script>
  import SearchResultUtils from "../../../mixins/SearchResultUtils"

  export default {
    name: "SingleSearchResultInfoBase",
    mixins: [SearchResultUtils],
    props: {
      result: {
        type: Object,
        required: true
      }
    }
    
  };
</script>





