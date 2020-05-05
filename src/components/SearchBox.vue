<template>
  <div class="searchbox">
      <transition name="loading-overlay">
         <div v-if="loading === true"></div>
      </transition>
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
        queryDisplay: state => state.searchStore.queryDisplay,
        query: state => state.searchStore.query,
        loading: state => state.searchStore.loading
      })
    },
    created() {
      this.searchQuery = this.queryDisplay;
    },
    watch: {
      queryDisplay: function(newValue) {
      this.searchQuery = newValue
    }
  },
    methods: {
      ...mapActions("searchStore", {
        updateQueryDisplay: "updateQueryDisplay",
        updateQuery: "updateQuery",
      }),
      search(e) {
        if (this.searchQuery !== this.queryDisplay) {
          this.updateQueryDisplay(this.searchQuery);
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
          }
          this.updateQuery(this.searchQuery + fixedFilters)
          //console.log(filters);
          this.$router.push({ name: "Search", params: { query: this.searchQuery + fixedFilters } });
          e.preventDefault();
        }
      },
      returnToStart() {
        this.updateQueryDisplay("")
        this.updateQuery("")
        this.$router.history.current.name === "Home"
          ? null
          : this.$router.push({ name: "Home" });
      }
    }
  };
</script>
