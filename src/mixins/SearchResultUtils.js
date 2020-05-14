import { mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      instance: state => state.searchStore.instance
    })

  },
  methods: {
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
      time.toString().charAt(0) === "-"
        ? (returnphase = time.toString().slice(1) + " BC")
        : (returnphase = time + " AC");
      return returnphase;
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
