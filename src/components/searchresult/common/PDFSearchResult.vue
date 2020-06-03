<template>
<div>
    <!--PDF Search result handling-->
        <div :v-if="!queryString.includes('&pt=')" class="matches">
          <span class="numbersFound">{{ result.doclist.numFound }}</span>
          <span v-if="result.doclist.numFound > 1"> matches </span>
          <span v-if="result.doclist.numFound === 1"> match </span>
          <span>found in pdf. Displaying </span>
          <span v-if="result.doclist.docs.length <= defaultVisibleSnippets" class="numbersFound">{{ this.result.doclist.docs.length }}</span>
          <span v-if="result.doclist.docs.length > defaultVisibleSnippets" class="numbersFound">{{ defaultVisibleSnippets }}</span>.
          <span v-if="result.doclist.docs.length > defaultVisibleSnippets" class="seeAllSnippets" v-on:click="toggleMoreSnippetsVisibility()">
          <span v-if="showingAllSnippets === true">See less hits</span>
          <span v-if="showingAllSnippets === false">See more hits</span>
          </span>
        </div>
        <div v-if="this.queryString.includes('&pt=') !== true">
          <div v-for="(snippets, index) in result.doclist.docs"
            class="snippet"
            v-bind:key="index"
            :style="index > defaultVisibleSnippets - 1 && !showingAllSnippets ? 'display:none' : 'display:block'">
            <div class="chapterTitle">chapter </div>
            <highlighted-chapter :chapterString="snippets.chapter" :query="queryString" />
            <div class="pageTitle">page </div>
            <div class="pageNumber">{{snippets.page == 0 ? 1 : snippets.page}}</div>
            <ul>
            <highlighted-content :contentArray="snippets.highLightSnippets" :query="queryString" />
            </ul>
            <router-link :to="$_getRecordLink(snippets.id, true, snippets.loar_id)">
              <span>⮊</span> Go to hit
            </router-link>
          </div>
        </div>
      <router-link class="entirePdfLink" :to="$_getRecordLink(this.result.doclist.docs[0].id, false, this.result.doclist.docs[0].loar_id)">
        See entire pdf
      </router-link>
      </div>
</template>

<script>
  import HighlightedChapter from "../../highlights/HighlightedChapter"
  import HighlightedContent from "../../highlights/HighlightedContent"
  import SearchResultUtils from "../../../mixins/SearchResultUtils"
  

  export default {
    name: "PDFSearchResult",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
    //  ResultMap,
     HighlightedChapter,
      HighlightedContent
    },
     mixins: [SearchResultUtils],
    props: {
      result: {
        type: Object,
        required: true
      },
      queryString: {
        type: String,
        requred: true
      }
    }
    };
</script>
