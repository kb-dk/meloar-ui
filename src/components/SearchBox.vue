<template>
  <div class="column-width">
  <div class="searchbox">
    <div v-if="this.$route.name !== 'Instance'" class="instanceHeadline">{{ instanceName }}</div>
      <!--<transition name="loading-overlay">
         <div v-if="loading === true"></div>
      </transition>-->
    <form @submit.prevent="search">
      <input v-model="searchQuery" size="16" type="text" placeholder="Type to search." />
      <button class="submitButton" title="Search" type="submit"></button>
      <button class="resetButton" v-on:click="returnToStart()" title="Reset" type="reset"></button>
    </form>
    <time-slider v-if="time === true"
                 :min="searchOptions.timeOptions.min"
                 :max="searchOptions.timeOptions.max" 
                 :start="timeFrom"
                 :end="timeTo"
                 :interval="searchOptions.timeOptions.interval" 
                 @search-box-update="searchBoxUpdate"
                 @do-new-search="search" />
  </div>
  <applied-filters
             :queryString="this.query || ''"
             :route="this.$router.history.current.path"
             v-if="this.$route.name === 'Search'"
             @timeSliderUpdate="timeSliderValuesUpdated"
             />
</div>
</template>

<script>
  //import "../assets/styles/search.scss";
  import { mapState, mapActions } from "vuex";
  import TimeSlider from "../components/TimeSlider";
  import MeloarInstances from '../instances/instances';
  import AppliedFilters from "./AppliedFilters.vue";
  import SearchResultUtils from "../mixins/SearchResultUtils"


  export default {
    name: "SearchBox",
    components: {
      AppliedFilters,
      TimeSlider,
    },
    mixins: [SearchResultUtils],
    props: {
      time: {
        type: Boolean,
        required: true
      }
    },
    data: () => ({
        MeloarInstances:MeloarInstances,
        searchQuery: "",
        timeTo:'',
        instanceName: "",
        timeFrom:'',
        searchOptions:{}
    }),
    computed: {
      ...mapState({
        queryDisplay: state => state.searchStore.queryDisplay,
        query: state => state.searchStore.query,
        loading: state => state.searchStore.loading,
        instance: state => state.searchStore.instance
      })
    },
    created() {
      //A fast check on weather we do have a query set - and if we dont, we check if the params hae a query, and we get that.
      //If all fails, fallback is "No query."
      if(this.searchQuery == "") {
        this.queryDisplay !== "" ? this.searchQuery = this.queryDisplay :
        this.$router.history.current.params.query ? 
        this.searchQuery = this.$router.history.current.params.query.substr(0, this.$router.history.current.params.query.indexOf('&')) ||
        this.$router.history.current.params.query 
        : "No query."
      }
      //We need the search options, so we check if the key is present and identifiable in either the instance or the route
      //Then we get the search options from the meloarInstances opbject.
        this.MeloarInstances.instances.filter(item => {
        item.key === this.instance || item.key === this.$route.params.instance ? (this.instanceName = item.name,
                                                                                  this.searchOptions = item.searchOptions) : null
      });
      //When creating, check if we already have the time for the slider in the params, and if so, put them into the slider
      if(this.time === true) {
        if(this.$router.history.current.params.query) {
        this.$router.history.current.params.query.split("&fq=").filter(item => {
          item.includes("ff_primaryobject_year_from_i") ? this.timeFrom = parseInt(this.$_returnTimeFromQueryString(item)) : null
          item.includes("ff_primaryobject_year_to_i") ? this.timeTo = parseInt(this.$_returnTimeFromQueryString(item)) : null
          })
        }
        //Double check - if we didn't get anything from the params, we set them ourselves from the options.
        this.timeFrom === '' ? this.timeFrom = this.searchOptions.timeOptions.min : null;
        this.timeTo === '' ? this.timeTo = this.searchOptions.timeOptions.max : null;
      }
    },
    watch: {
      queryDisplay: function(newValue) {
      this.searchQuery = newValue
    },
    $route(to) {
      //Make sure, when the route is updated in any way - that we update the displayQuery and query.
      //This makes sure, that pressing the backbutton in the browser rightly updates the used query in the searchbox.
      console.log(to.params)
      this.updateQuery(to.params.query);
      to.params.query.indexOf("&d=") !== -1 && to.params.query.indexOf("&d=") < to.params.query.indexOf("&fq=") ? this.updateQueryDisplay(to.params.query.split("&d=")[0]) :
      this.updateQueryDisplay((to.params.query.split("&fq=")[0]));
    }
  },
    methods: {
      ...mapActions("searchStore", {
        updateQueryDisplay: "updateQueryDisplay",
        updateQuery: "updateQuery",
      }),
      // Update the slider variables from he given params (that is given from the slider - so we can keep track of them inhere.)
      searchBoxUpdate(variable) {
        this.timeTo = variable[1];
        this.timeFrom = variable[0];
      },
      //check the item that is removed from te fliters
      //if it's a time filter, set the time on the appropriate variable to the max or min limit, depending on which filter.
      timeSliderValuesUpdated(item) {
        item.includes("ff_primaryobject_year_from_i") ? this.timeFrom = this.searchOptions.timeOptions.min : null
        item.includes("ff_primaryobject_year_to_i") ? this.timeTo = this.searchOptions.timeOptions.max : null
      },
      //Search function h as been substancially bigger - because we have to take care of some time-issues.
      search(e) {
        // We check if anything has changed. Either the query or any time related business.
        if (this.searchQuery !== this.queryDisplay || this.queryTimeChanged()) {
          // If we're satisfied, we check if the searchQuery is set. If it isn't, we set it to all
          // This is if you're only searching based on time.
          this.searchQuery === '' ? this.searchQuery = "*.*" : null;
          this.updateQueryDisplay(this.searchQuery || "*.*");
          //Rip out the filters from he params and set up variables for creating new filter.
          let filters = this.$router.history.current.params.query || '';
          let newCombinedFilter = "";
          let filterArray = [];
          // Make sure there actually are some filters to run manipulate.
          if (filters !== undefined) {
            // Check if the first filter is a normal filter or a location filter.
            let isLocationSet = filters.indexOf("&d=") > -1;
            // split the filter up accordingly - if location, we split on &d= first, then on &fq=.
            isLocationSet ? filterArray = filters.split("&d=")[1].split("&fq=") : filterArray = filters.split("&fq=");
            // If location is not set, we hae to remove the first entry, as it's the query.
            // If location is true, then we've alread done it with the [1] in the filter.split above.
            isLocationSet ? null : filterArray.shift();
            //Run through the array, and inset the new updated filters - but make sure we actually have an array to run through.
            if(filterArray.length > 0 && Array.isArray(filterArray)) {
                filterArray.forEach((item, index) => {
                //If it's the first - we check if location is set, and add that prefix - otherwise the fq prefix.
                //We check if the items are timeSlider items - if not, we just return them and place them. Otherwise we alter the timeSlider filters.
                if(index === 0) {
                  item = this.filterTimeSliderCreator(item)
                  item !== "" ? newCombinedFilter += isLocationSet ? "&d=" + item : "&fq=" + item : null;
                }
                else {
                  item = this.filterTimeSliderCreator(item)
                  item !== "" ? newCombinedFilter += "&fq=" + item : null;
                }
                })
            }
          }
          //Check if timefilters are applied.
          //If not, check if they should be.
          //If they should be, apply them at the end.
          if(this.time === true && newCombinedFilter.includes("ff_primaryobject_year_from_i") === false && this.timeFrom !== this.searchOptions.timeOptions.min) {
            newCombinedFilter += "&fq=ff_primaryobject_year_from_i:[" + this.timeFrom + " TO *]";
          }
          if(this.time === true && newCombinedFilter.includes("ff_primaryobject_year_to_i") === false && this.timeTo !== this.searchOptions.timeOptions.max) {
            newCombinedFilter += "&fq=ff_primaryobject_year_to_i:[" + this.timeTo + " TO *]";
          }
          //Update the query variable in the store, and fire the search.
          this.updateQuery(this.searchQuery + newCombinedFilter)
          this.$router.push({ name: "Search", params: { query: this.searchQuery + newCombinedFilter, instance: this.instance } });
          e ? e.preventDefault() : null;
        }
      },
      queryTimeChanged() {
        let proceed = false;
        // We make sure we're on a Search instance. 
        //if we're not we don't have to go though all this, because we'll always fire a search on the instance route no matter what.
        if(this.time === true && this.$router.history.current.name === "Search") {
          let filters = this.$route.params.query ? this.$route.params.query.split("fq=") : ""
          //If we have more han one filter (that means, more than the query, we check them out)
          filters.length > 1 ? filters.forEach(item => {
              if(item.includes("ff_primaryobject_year_from_i")) {
                //console.log("1",parseInt(this.$_returnTimeFromQueryString(item)), this.timeFrom)
                //We check if the value matches the current set value in the slider. If so, we don't grant a search. Other wise, we do.
                parseInt(this.$_returnTimeFromQueryString(item)) === this.timeFrom ? null : proceed = true;
              }
              if(item.includes("ff_primaryobject_year_to_i")) {
                //console.log("3", parseInt(this.$_returnTimeFromQueryString(item)), this.timeTo)
                //We check if the value matches the current set value in the slider. If so, we don't grant a search. Other wise, we do.
                parseInt(this.$_returnTimeFromQueryString(item)) === this.timeTo ? null : proceed = true;
              }
          }) : null;
        }
        //If no filters with time were present, we do a quick check if the values of the sliders have been moved from their initial positions.
        if(!this.$route.params.query.includes("ff_primaryobject_year_from_i") && this.timeFrom !== this.searchOptions.timeOptions.min) {
          proceed = true
        }
        if(!this.$route.params.query.includes("ff_primaryobject_year_to_i") && this.timeTo !== this.searchOptions.timeOptions.max) {
          proceed = true
        }
        //Yea, insance pages gets a free pass at searching.
        else if(this.$router.history.current.name === "Instance") {
          proceed = true;
        }
        //console.log(proceed, "road taken")
        return proceed
      },
      //Function to take a timeSlider filter, and update it accordingly.
      //Based on if it's year from/to, and whether it is needed (if filters are set at all)
      filterTimeSliderCreator(filterString) {
        if(filterString.includes("ff_primaryobject_year_from_i")) {
          this.timeFrom !== this.searchOptions.timeOptions.min ? filterString = "ff_primaryobject_year_from_i:[" + this.timeFrom + " TO *]" : filterString = ""; 
        }
        if(filterString.includes("ff_primaryobject_year_to_i")) {
          this.timeTo !== this.searchOptions.timeOptions.max ? filterString = "ff_primaryobject_year_to_i:[" + this.timeTo + " TO *]" : filterString = ""; 
        }
        // Returns the altered filterString - which can be "" if no filter is needed.
        // This is taken care of in search where the filters are put back together.
        return filterString
      },
      // Return to the start search-page.
      returnToStart() {
        this.updateQueryDisplay("")
        this.updateQuery("")
        this.$router.history.current.name === "Instance"
          ? null
          : this.$router.push({ name: "Instance", params: {instance: this.instance} });
      }
    }
  };
</script>
