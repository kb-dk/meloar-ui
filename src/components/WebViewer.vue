<template>
  <div ref='viewer'></div>
</template>

<script>
/* eslint-disable */
export default {
  name: 'WebViewer',
  props: {
    path: String,
    url: String,
    query: String
  },
  mounted: function () {
        WebViewer({
            path: this.path,
            initialDoc: this.url, // replace with your own PDF file
          }, this.$refs.viewer).then((instance) => {
      const docViewer = instance.docViewer;
      const pdfQuery = this.query;

    // you must have a document loaded when calling this api
    docViewer.on('documentLoaded', function() {
      instance.searchTextFull(pdfQuery, {
        wholeWord: true
      });
    });
      


           
          });
    }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div {
  width: 100%; 
  height: 100vh;
}
</style>