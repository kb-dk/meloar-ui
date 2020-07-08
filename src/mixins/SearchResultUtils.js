import { mapState, mapActions } from 'vuex'

export default {
  computed: {
    ...mapState({
      instance: state => state.searchStore.instance,
      query: state => state.searchStore.query,
      solrOptions: state => state.searchStore.solrOptions

    })

  },
  methods: {
      ...mapActions("searchStore", {
          updateCurrentOffset: "updateCurrentOffset",
          doSearch:"doSearch"
    }),
    $_nextResults() {
      this.updateCurrentOffset(this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber);
      this.doSearch(
        {
        query:this.query,
        instance:this.instance,
        options:'&rows=' + this.solrOptions.shownResultsNumber + '&start=' + this.solrOptions.currentOffset,
        sort:this.solrOptions.searchSort
        }
      );
    },
    $_previousResults() {
      this.updateCurrentOffset(this.solrOptions.currentOffset - this.solrOptions.shownResultsNumber);
      this.doSearch(
        {
        query:this.query,
        instance:this.instance,
        options:'&rows=' + this.solrOptions.shownResultsNumber + '&start=' + this.solrOptions.currentOffset,
        sort:this.solrOptions.searchSort
        }
      );
    },
    $_getRecordLink(id, page, loarId) {
      return page
        ? {
            name: "Record",
            query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId, page: true },
            params: {instance: this.instance }
          }
        : { name: "Record", 
            query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId },
            params: {instance: this.instance } 
          };
    },
    $_transformDate(date) {
      const convertedDate = new Date(date);
      const currentDate = new Date();
      const diffYears = currentDate.getFullYear() - convertedDate.getFullYear();
      return diffYears;
    },
    $_fixIdForSearchResultContainer(id) {
      return id.replace(/:|\s|\//g, '-')
    },
    $_deliverTimeBetween(date) {
      const convertedDate = new Date(date);
      return convertedDate.getFullYear();
    },
    $_deliverTimePeriodStamp(time) {
      let returnphase;
      time.toString().trim().charAt(0) === "-"
        ? (returnphase = time.toString().trim().slice(1) + " BC")
        : (returnphase = time + " AC");
      return returnphase;
    },
    $_returnTimeFromQueryString(time) {
      time = time.split('[').pop().split(']')[0].replace(/TO|FROM|\*/g, '').trim()
      return time
    },
    $_returnACorDC(time) {
      return time.toString().charAt(0) === "-"
        ? time.toString().slice(1) + " before Christ"
        : time.toString() + " bfter Christ";
    },
    $_returnAddresses(addresses) {
      return addresses ? addresses.join(', ') : "Ingen lokation(er) opgivet.";
    },
    $_returnAuthors(authors) {
      return authors ? authors.join(', ') : "Ingen forfatter(e) opgivet.";
    },
    
    
   
  }

}
