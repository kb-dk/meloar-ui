
<template>
  <div class="appliedFilters">
    <div v-if="this.filters.length > 0" class="headline">Applied Filters:</div>
      <div v-if="this.filters.length > 0" class="appliedFilterSelection">
          <div v-bind:key="index" v-for="(filter, index) in this.filters" class="filterEntity" v-on:click="removeSingleFilter(filter)">
            <div class="filterCategory">{{ findCategory(filter) }}</div>
            <div class="filterColon">:</div>
            <div class="filterName">{{ findName(filter) }}</div>
            <div class="filterClose">X</div>
          </div>
      </div>
    </div>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import SearchResultUtils from "../mixins/SearchResultUtils"


export default {
  name: "AppliedFilters",
  mixins: [SearchResultUtils],
  props: {
    queryString: {
      type: String,
      required: true
    },
    route: {
      type: String,
      required: true
    }
  },

  data: () => ({ filters: [], orgQuery: "" }),

  computed: {
      ...mapState({
        instance: state => state.searchStore.instance,
        searchSort: state => state.searchStore.searchSort,
        shownResultsNumber: state => state.searchStore.shownResultsNumber,
        currentOffset: state => state.searchStore.currentOffset,
      })
    },
  methods: {
    ...mapActions("searchStore", {
        updateQuery: "updateQuery",
    }),  
    findFilters(query) {
      if (query === "") {
        query = this.$route.params.query;
      }
      query = decodeURIComponent(query);
      // Create array with all the filters;
      let fqFilters = query.split("&fq=");
      // Check if we got a location filter (since it's first it will always be in the first element of the array, if it exists)
      let locFilters = fqFilters[0].split("&d=");
      // If it exists
      if (locFilters.length > 1) {
        // Set the original query to the first element of the array (which will be the query, before the first filter)
        this.orgQuery = locFilters[0];
        // Remove the query from the location filters array
        locFilters.shift();
        // Remove the first element of the filter query array, since it's what we got in the locFilter array.
        fqFilters.shift();
        // Set the filter to the combined loc and fq filter arrays.
        this.filters = locFilters.concat(fqFilters);
        // If we dont have a loation.
      } else {
        // Set the query to the first elemenet of the array, which is the original query.
        this.orgQuery = fqFilters[0];
        // Remove the query, so only filters is left in the array.
        fqFilters.shift();
        //  Set the filters to the fqFilter array.
        this.filters = fqFilters;
      }
    },
    removeSingleFilter(filterString) {
      for (let i = 0; i < this.filters.length; i++) {
        if (this.filters[i] === filterString) {
          this.filters.splice(i, 1);
        }
      }

      let mergedQuery = this.orgQuery;
      if (this.filters.length > 0) {
        if (this.filters[0].includes("&pt=") === true) {
          mergedQuery = mergedQuery + "&d=";
        } else {
          mergedQuery = mergedQuery + "&fq=";
        }
      }
      mergedQuery = mergedQuery + this.filters.join("&fq=")
      this.updateQuery(mergedQuery)
      //mergedQuery = encodeURIComponent(mergedQuery);
      this.$router.push({
        name: "Search",
        params: { query: mergedQuery, instance: this.instance, options:'&row=' + this.shownResultsNumber + '&start=' + this.currentOffset, sort: this.searchSort }
      });
      this.$emit('timeSliderUpdate', filterString);
    },
    findCategory(filter) {
      let category;
      if (filter.includes("&pt=") === true) {
        category = "location";
      } else {
        let i = filter.indexOf(":");
        let stringSplit = [filter.slice(0, i), filter.slice(i + 1)];
          category = stringSplit[0].substring(0, stringSplit[0].indexOf("_"))
      }
      return category;
    },
    findName(filter) {
      let name;
      let time = false;
      if (filter.includes("&pt=") === true) {
        let location = filter.split("&pt=");
        name = "d=" + location[0] + "&pt=" + location[1];
      } else {
        let i = filter.indexOf(":");
        let stringSplit = [filter.slice(0, i), filter.slice(i + 1)];
        name = stringSplit[1];
        if(filter.includes("ff_primaryobject_year_from_i") || filter.includes("ff_primaryobject_year_to_i")) {
          time = true;
          name = name.replace(/[*[\]]/g,'').replace(/TO|FROM/g, '');
        }
        name.includes("&sort") ? name = name.substring(0, name.indexOf('&sort')) : null
      }
      return time === true ? this.$_deliverTimePeriodStamp(name) : name;
    }
  },

  created() {
    this.findFilters(this.queryString);
  },

  watch: {
    route: function() {
      this.findFilters(this.queryString);
    }
  },
}
</script>