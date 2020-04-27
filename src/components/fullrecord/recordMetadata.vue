<template>
  <div id="pdfInformationTab">
    <div class="pdfMetadata">
      <div class="information">information</div>
      <div class="pdfSpecs">
        <div>
          <span>ID:</span>
          <span>{{ this.getId() }}</span>
        </div>
        <div>
          <span>Title:</span>
          <span>{{ this.getTitle() }}</span>
        </div>
        <div>
          <span>Chapter:</span>
          <span>{{ this.getChapter() }}</span>
        </div>
        <div>
          <span>Page:</span>
          <span>{{ this.getPage() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "RecordMetadata",

    props: {
      record: {
        type: Object
      }
    },
    methods: {
      getId: function() {
        return this.record ? this.record.id : "";
      },

      getTitle: function() {
        return this.record ? this.record.title : "";
      },

      getChapter: function() {
        return this.record ? this.record.chapter : "";
      },
      getPage: function() {
        return this.record ? (this.record.page == 0 ? this.record.page : this.record.page - 1) : "";
      }
    },
  };
</script>
