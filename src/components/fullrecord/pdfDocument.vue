<template>
  <div v-if="iframeUrl !== ''">
    <router-link :to="this.createSearchLink()" class="backToSearch">
      back to searching.
    </router-link>
    <div class="iframe-container">
      <iframe :src="this.iframeUrl" />
    </div>
  </div>
</template>

<script>

import { mapState, mapActions } from "vuex";
import MeloarInstances from '../../instances/instances';

export default {
    name: "PdfDocument",

    data: () => ({
      iframeUrl:'',
      publicPath: process.env.BASE_URL,
      MeloarInstances:MeloarInstances,
    }),
    computed: {
      ...mapState({
        instance: state => state.searchStore.instance
      }),
    },
    props: {
      record: Object,
      singlePage: Boolean,
      query: String
    },
    watch: {
      record: function() {
      this.iframeUrl = this.getUrl()
      }
    },

    methods: {
      ...mapActions("searchStore", {
        updateInstance: "updateInstance"
      }),
      getUrl() {
        let highlightAllowed = false;
        this.MeloarInstances.instances.filter(item => {
        item.key === this.instance ? highlightAllowed = item.pdfHighlight : null
      })
        const proxyURL = encodeURIComponent(
          "/api/resource/meloar?collection=" + this.instance + "&url=" + this.record.external_resource[0]
        );
        //console.log(decodeURIComponent(proxyURL));
        const viewerURL = this.publicPath + "static/pdfviewer/web/viewer.html?file=";
        const pageParams = this.singlePage
          ? highlightAllowed
            ? "#search=" + this.query + "&page=" + this.getSinglePageNumber()
            : "#page=" + this.getSinglePageNumber()
          : "";
        return viewerURL + proxyURL + pageParams;
      },

      createSearchLink() {
        return { name: "Search", params: { query:this.query, instance: this.instance } }
      },

      getSinglePageNumber() {
        return this.record.page[0] === 0 ? 1 : this.record.page[0];
      }
    },
  };
</script>
