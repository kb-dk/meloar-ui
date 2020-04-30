<template>
  <div>
    <router-link :to="this.createSearchLink()" class="backToSearch">
      back to searching.
    </router-link>
    <div class="iframe-container">
      <iframe :src="this.iframeUrl" />
    </div>
  </div>
</template>

<script>

export default {
    name: "PdfDocument",

    data: () => ({
      iframeUrl:'',
      publicPath: process.env.BASE_URL
    }),

    created() {
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
      getUrl() {
        const proxyURL = encodeURIComponent(
          "/api/meloar/pdf?url=" + this.record.external_resource[0]
        );
        const viewerURL = this.publicPath + "static/pdfviewer/web/viewer.html?file=";
        const pageParams = this.singlePage
          ? "#search=" + this.query + "&page=" + this.getSinglePageNumber()
          : "";
        return viewerURL + proxyURL + pageParams;
      },

      createSearchLink() {
        return "/search/" + this.query;
      },

      getSinglePageNumber() {
        return this.record.page[0] === 0 ? 1 : this.record.page[0];
      }
    },
  };
</script>
