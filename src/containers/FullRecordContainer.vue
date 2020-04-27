<template>
  <div>
      <div>
        <record-metadata :record="recordData" />
      </div>
   <pdf-document class="pdf-document" :record="recordData" :singlePage="singlePage" :query="queryDisplay" />
  </div>
</template>

<script>
import RecordMetadata from "../components/fullrecord/recordMetadata.vue";
import PdfDocument from "../components/fullrecord/pdfDocument.vue";
import { mapState } from 'vuex';

export default {
  name: "FullRecordContainer",

  components: {
    RecordMetadata,
    PdfDocument
  },

  data: () => ({ recordData: null, pdfUrl: "", startPage: 0, id: "", singlePage: false }),

  computed: {
    ...mapState({
      queryDisplay: state => state.searchStore.queryDisplay,
      results: state => state.searchStore.results
    })
  },

  created() {
    //console.log(this.$attrs.id)
    //console.log(decodeURIComponent(this.$attrs.id), "created")
    //console.log(this.results)
  },

  methods: {
    setRecordData(rd) {
      this.recordData = rd;
    },
    setPdfUrl(pdfUrl) {
      this.pdfUrl = pdfUrl;
    },
    setStartPage() {
      this.startPage = 0;
    },

    setId(id) {
      this.id = id;
    },

    setPageRenderMode(page) {
      if (page) {
        this.singlePage = true;
      }
    },
    setQuery(query) {
      console.log(query)
    },

    scrollToTop() {
      window.scrollTo(0, 0);
    }
  },
  /*beforeRouteEnter(to,from, next) {
    console.log(to, from, next, "we entered")
    next(vm => {
      if(vm.results.length > 0) {
        console.log(vm.results[to.query.id])
        vm.setRecordData(vm.results[to.query.id]);
      if (to.query.query && to.query.page) {
        vm.setPageRenderMode(true);
      }
      vm.setId(to.query.id);
      vm.scrollToTop();
      }
      else {
        console.log("we need the data plx!")
      }
    })
  }*/

beforeRouteEnter(to, from, next) {
  //console.log("------ before we enter ------")
    next(vm => {
    if (to.query.id && vm.results.length > 0) {
      let result
      vm.results.filter(item => {
        if(item.groupValue === to.query.loarId) {
          //console.log("we found item", item)
          item.doclist.docs.filter(doc => {
            if(doc.id === decodeURIComponent(to.query.id)) {
              //console.log("its a match", doc)
              result = doc
            }
          })
        }})
      //console.log(result, "result")
      vm.setRecordData(result)
      if (to.query.query && to.query.page) {
        vm.setPageRenderMode(true);
      }
      vm.setId(to.query.id);
      vm.scrollToTop();
    }
    else {
    console.log("NO ID MATCH")
   /*searchService
      .doSearch("id:" + to.query.id)
      .then(searchResult => {
        next(vm => {
          vm.setQuery(to.query.query);
          vm.setRecordData({ doc: results[0].doclist.docs[0] });
          if (to.query && to.query.page) {
            vm.setPageRenderMode(true);
          }
          vm.setId(to.query.id);
          vm.scrollToTop();
        });
      })
      .catch(reason => {
        console.log("Search error", reason);
      });*/
  }});
}
};

</script>
