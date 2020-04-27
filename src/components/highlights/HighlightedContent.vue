<template>
    <div v-if="isArrayEmpty(this.contentArray)" class="renderedSnippet">
          <ul>
            <li class="string" v-html="this.highlightStrings(this.contentArray, this.query)" />
          </ul>
          <div class="empty" />
      </div>
</template>

<script>
export default {
  name: "highlightedContent",

  props: {
    contentArray: {
      type: Array,
      required: true
    },
    query: {
      type: String,
      required: true
    }
  },

  data: () => ({ givenString: "" }),

  methods: {
    highlightStrings(arg, query) {
      if (query === "*.*") {
        return arg;
      } else {
        for (let i = 0; i < arg.length; i++) {
          return arg[i].replace(new RegExp(query, "ig"), match => {
            return '<span class="highlightText">' + match + "</span>";
          });
        }
      }
    },
    isArrayEmpty(arg) {
      if (arg.length > 0) {
        return true;
      } else {
        return false;
      }
    }
  },
};
</script>
