<template>
  <div class="searchbox">
    <form @submit.prevent="search">
      <input v-model="searchQuery" size="16" type="text" placeholder="Type to search." />
      <button class="submitButton" title="Search" type="submit"></button>
      <button class="resetButton" v-on:click="returnToStart()" title="Reset" type="reset"></button>
    </form>
  </div>
</template>

<script>
  //import "../assets/styles/search.scss";
  import { mapState, mapActions } from "vuex";

  export default {
    name: "SearchBox",
    data() {
      return {
        searchQuery: ""
      };
    },
    computed: {
      ...mapState({
        queryDisplay: state => state.searchStore.queryDisplay
      })
    },
    created() {
      this.searchQuery = this.queryDisplay;
      console.log("HELLLO!", this.queryDisplay);
    },
    watch: {
      queryDisplay: function(newValue) {
      this.searchQuery = newValue
    }
  },
    methods: {
      ...mapActions("searchStore", {
        updateQueryDisplay: "updateQueryDisplay"
      }),
      search(e) {
        if (this.searchQuery !== this.queryDisplay) {
          this.updateQueryDisplay(this.searchQuery);
          console.log("WE SEARCH", this.$router);
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
          console.log("pushing new route!", this.$router);
          this.$router.push({ name: "Search", params: { query: this.searchQuery + fixedFilters } });
          e.preventDefault();
        }
      },
      returnToStart() {
        //this.searchState.query = "";
        //this.searchState.queryDisplay = "";
        console.log(this.$router.history.current.name, "where are we?");
        this.$router.history.current.name === "Home"
          ? this.updateQueryDisplay("")
          : this.$router.push({ name: "Home" });
      }
    }
  };
</script>
