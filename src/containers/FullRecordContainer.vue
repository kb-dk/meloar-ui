<template>
  <div>
    <div v-if="foundData !== false">
      <record-metadata :record="recordData" />
      <pdf-document class="pdf-document" :record="recordData" :singlePage="singlePage" :query="query" />
    </div>
    <not-found v-if="foundData === false"></not-found>
  </div>
</template>

<script>
import RecordMetadata from "../components/fullrecord/recordMetadata.vue";
import PdfDocument from "../components/fullrecord/pdfDocument.vue";
import NotFound from "../components/NotFound.vue";
import { mapState, mapActions } from 'vuex';

export default {
  name: "FullRecordContainer",
  components: {
    RecordMetadata,
    PdfDocument,
    NotFound
  },

  data: () => ({ recordData: null, pdfUrl: "", startPage: 0, id: "", singlePage: false, foundData:null }),

  computed: {
    ...mapState({
      query: state => state.searchStore.query,
      results: state => state.searchStore.results,
      instance: state => state.searchStore.instance,
      solrOptions: state => state.searchStore.solrOptions
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
        else {
          this.foundData = false
          //console.log("oh snap, we got no result!")
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
    vm.doSearch({query:to.query.loarId, instance:to.params.instance, options:'&rows=' + vm.solrOptions.shownResultsNumber + '&start=' + vm.solrOptions.currentOffset})
    .then(() => {
      vm.updateInstance(to.params.instance)
      vm.updateQuery(to.query.query)
      vm.setId(to.query.id)
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
