<template>
  <div id="AllResultsOnMap">
      <div v-on:click="toggleMap" class="locationShown">
        <button >See results on map</button>
      </div>
      <!-- <div id="searchMapContainer" :class="mapShown ? 'searchMapContainer shown' : 'searchMapContainer hidden'"> -->
      <div v-show="mapShown" id="searchMapContainer" class="searchMapContainer">
        <div id="mapInfo">Showing hit {{ this.solrOptions.currentOffset + 1 }} - {{ this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber }} of {{ this.results[0] ? this.results[0].allHits : 'unknown' }} hits.</div>
        <div v-if="!loading && this.results.length > 0" class="mapPagingButtonContainer">
          <button class="pagingButton back" :disabled="this.solrOptions.currentOffset <= 0" v-on:click="$_previousResults">previous {{ this.solrOptions.shownResultsNumber }}</button>
          <button class="pagingButton forward" :disabled="this.solrOptions.currentOffset + this.solrOptions.shownResultsNumber >= this.results[0].allHits" v-on:click="$_nextResults">next {{ this.solrOptions.shownResultsNumber }}</button>
        </div>
        <div v-on:click="toggleMap" class="mapClose" />
        <div class="searchMap" id="allResultsMap" />
      </div>

    </div>
</template>
<script>
import "../../node_modules/leaflet/dist/leaflet.css";
import icon from "../../node_modules/leaflet/dist/images/marker-icon.png";
import iconShadow from "../../node_modules/leaflet/dist/images/marker-shadow.png";
import { mapState } from "vuex";
import SearchResultUtils from "../mixins/SearchResultUtils"

export default {
name: "AllResultsMap",

data: () => ({ mapShown:false, created: false, map:null }),
computed: {
    ...mapState({
      results: state => state.searchStore.results,
      instance: state => state.searchStore.instance,
      query: state => state.searchStore.query,
      loading: state => state.searchStore.loading,
      solrOptions: state => state.searchStore.solrOptions
  })
},
props: {
    openOnReset: {
      type: Boolean,
      required: true
    },
  },
mixins: [SearchResultUtils],
methods: {
  createMap(results) {
      let mapNode = require("leaflet");
      let coordinates = [56.1572, 10.2107];
      let DefaultIcon = mapNode.icon({
        iconSize: [25, 41],
        iconAnchor: [12.5, 25],
        //popupAnchor: [0, -30],
        iconUrl: icon,
        shadowUrl: iconShadow
      });
      mapNode.Marker.prototype.options.icon = DefaultIcon;
      let resultmap = mapNode.map("allResultsMap");
      resultmap.setView(coordinates, 7);
      //If https problems occur, try https://a.tile.openstreetmap.org/{z}/{x}/{y}.png instead.
      //Old access point: https://{s}.tile.osm.org/{z}/{x}/{y}.png
      mapNode
        .tileLayer("https://a.tile.openstreetmap.org/{z}/{x}/{y}.png", {
          attribution: '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a>'
        })
        .addTo(resultmap);
        for(let y = 0 ; y < Object.keys(results).length ; y++) {
          if(results[y].doclist.docs[0].place_coordinates) {
          mapNode.marker(results[y].doclist.docs[0].place_coordinates.split(',').reverse())
          .addTo(resultmap)
          .bindPopup("<a href=" + this.createLink(results[y]) + ">" + Number(this.solrOptions.currentOffset + y + 1) + ": " + results[y].doclist.docs[0].title + "</a>");
          }
        }
        this.map = resultmap;
        this.created = true;
    },
    toggleMap() {
      this.mapShown = !this.mapShown;
      let callbackmap = this.map;
      //Horrible, horrible hack to have the map revalidate the size 
      //Just to make sure that it's aligned to the size of the users screen, and the right tiles are loaded.
      // https://stackoverflow.com/questions/24412325/resizing-a-leaflet-map-on-container-resize
      setTimeout(function() { callbackmap.invalidateSize() }, 50);
      this.$emit('toggleMapUpdated', this.mapShown);
    },
    createLink(item) {
      return "/" + this.instance + "/record?id=" + encodeURIComponent(item.doclist.docs[0].id) + "&query=" + this.query + "&loarId=" + item.doclist.docs[0].loar_id;
    }
  },
mounted() {
  this.createMap(this.results)
  this.mapShown = this.openOnReset;
  if(this.mapShown) {
    let callbackmap = this.map;
    setTimeout(function() { callbackmap.invalidateSize() }, 50);
  }
},

};
</script>
