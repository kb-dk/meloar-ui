<template>
  <div class="searchbox">
    <form @submit.prevent="search">
      <input
      v-model="query"
      size="16"
      type="text" 
      placeholder="Type to search.">
      <button class="submitButton" title="Search" type="submit"></button>
      <button class="resetButton" title="Reset" type="reset"></button>
    </form>
  </div>
</template>

<script>
  //import "../assets/styles/search.scss";
  import { mapState, mapActions } from 'vuex'

  export default {
  name: "SearchBox",
  data () {
    return {
      query:"",
    }
  },
  computed: {
    ...mapState({
      queryDisplay: state => state.searchStore.queryDisplay
    })
  },
  created() {
    console.log("HELLLO!", this.queryDisplay)
  },
  methods: {
    ...mapActions('searchStore', {
      updateQueryDisplay: 'updateQueryDisplay'
    }),
    search(e) {
      this.updateQueryDisplay(this.query)
      console.log("WE SEARCH", this.$router)
      //console.log(this.$router.history.current.params.query);
      let filters = this.$router.history.current.params.query;
      let fixedFilters = "";
      if (filters != undefined) {
        if (filters.indexOf("&d=") > -1 || filters.indexOf("&fq=") > -1) {
          if (filters.indexOf("&d=") > filters.indexOf("&fq=")) {
            fixedFilters = "&d=" + filters.split("&d=").pop();
          } else {
            fixedFilters = "&fq=" + filters.split("&fq=").pop();
          }
        }
        console.log(fixedFilters);
      }
      //console.log(filters);
      console.log("pushing new route!")
      this.$router.push({ name: "Search", params: { query: this.query + fixedFilters } });
      e.preventDefault();
    },
    returnToStart() {
      //this.searchState.query = "";
      //this.searchState.queryDisplay = "";
      this.$router.push({ name: "home" });
    }
  }
}
</script>  