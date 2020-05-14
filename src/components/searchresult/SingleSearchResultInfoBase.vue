
<template>
<div>
  <div class="resultTitle">
            <div class="pdfTitle">pdf title</div>
            <div class="pdfName">{{ result.doclist.docs[0].title }}</div>
       </div>
          <div class="authorContainer">
            <div class="authorTitle">Authors:&nbsp;</div>
            <div class="authorName">{{ this.returnAuthors(result.doclist.docs[0].author) }}</div>
          </div>
    </div>
</template>

<script>
  import {mapState} from "vuex"

  export default {
    name: "SingeSearchResultInfoBase",
    data: () => ({  }),
    components: {
    //  ResultMap,
    },
    props: {
      result: {
        type: Object,
        required: true
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
     returnAuthors(authors) {
        return authors ? authors.join(', ') : "Ingen forfatter(e) opgivet.";
      },
    }
  };
</script>





