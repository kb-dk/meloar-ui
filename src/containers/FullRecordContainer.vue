<template>
  <div>
      <div>
        <record-metadata :record="recordData" />
      </div>
   <pdf-document class="pdf-document" :record="recordData" :singlePage="singlePage" :query="query" />
  </div>
</template>

<script>
import RecordMetadata from "../components/fullrecord/recordMetadata.vue";
import PdfDocument from "../components/fullrecord/pdfDocument.vue";
import { mapState, mapActions } from 'vuex';

export default {
  name: "FullRecordContainer",

  components: {
    RecordMetadata,
    PdfDocument
  },

  data: () => ({ recordData: null, pdfUrl: "", startPage: 0, id: "", singlePage: false }),

  computed: {
    ...mapState({
      query: state => state.searchStore.query,
      results: state => state.searchStore.results,
      instance: state => state.searchStore.instance,
    })
  },
  watch: {
    results: function(newValue) {
      if(typeof newValue === 'object' && newValue !== null ) {
        if(Object.keys(this.results).length >= 1) {
          this.setRecordData(this.results[0].doclist.docs[0]);
          this.scrollToTop();
          this.setLoadingStatus(false)
        }
      }
    }
  },

  created() {
    //console.log(this.$attrs.id)
    //console.log(decodeURIComponent(this.$attrs.id), "created")
    //console.log(this.results)
  },


  methods: {
    ...mapActions('searchStore', {
      doSearch: 'doSearch',
      setLoadingStatus: 'setLoadingStatus',
      updateQuery:'updateQuery',
      updateInstance:'updateInstance'
    }),
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
    //console.log("NO ID MATCH")
    vm.doSearch({query:to.query.loarId, instance:to.params.location})
    .then(() => {
      vm.updateInstance(to.params.location)
      vm.updateQuery(to.query.query)
      vm.setId(to.query.id)
      vm.setQuery(to.query.query)
      if (to.query.query && to.query.page) {
        vm.setPageRenderMode(true);
      }
    })
      .catch(reason => {
        console.log("Search error", reason);
      });
  }});
}
};

</script>
