<template>
    <div class="searchResult" :id="fixIdForSearchResultContainer(result.groupValue)">
      <div class="generalInfo">
        <div class="overallInfo">
          <div class="resultTitle">
            <div class="pdfTitle">pdf title</div>
            <div class="pdfName">{{ result.doclist.docs[0].title }}</div>
          </div>
          <div class="resultInfo">Time</div>
          <div class="timeTitle" />
          <div class="resultDate">
            Rapport from approx <span>{{ this.transformDate(result.doclist.docs[0].ctime) }} </span>
            years ago, {{ this.deliverTimeBetween(result.doclist.docs[0].ctime) }}
            <hr class="report-divider" align="left" />
            <div v-if="result.doclist.docs[0].ff_primaryobject_year_from_i && result.doclist.docs[0].ff_primaryobject_year_from_i">
              Rapport content from time period between
              <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_from_i)">&nbsp; 
              {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_from_i) }}</span> and 
              <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_to_i)">&nbsp;
              {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_to_i) }}</span>
            </div>
          </div>
          <div class="placeTitle">Place</div>
          <div class="resultPlace">{{ this.returnAddresses(result.doclist.docs[0].place_name) }}</div>
          <div class="authorContainer">
            <div class="authorTitle">Authors:&nbsp;</div>
            <div class="authorName">{{ this.returnAuthors(result.doclist.docs[0].author) }}</div>
          </div>
        </div>
        <div class="mapContainer">
          <result-map
            :id="result.doclist.docs[0].id"
            :coordinateSet="result.doclist.docs[0].place_coordinates || 'Unknown'"
          />
        </div> 
     </div>
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
            <div class="pageNumber">{{snippets.page == 0 ? 1 : snippets.page - 1}}</div>
            <ul>
            <highlighted-content :contentArray="snippets.highLightSnippets" :query="queryString" />
            </ul>
            <router-link :to="getRecordLink(snippets.id, true, snippets.loar_id)">
              <span>⮊</span> Go to hit
            </router-link>
        </div>
      <router-link class="entirePdfLink" :to="this.getRecordLink(this.result.doclist.docs[0].id, false, this.result.doclist.docs[0].loar_id)">
        See entire pdf
      </router-link>
        <div class="seeAllSnippetsBottomContainer">
            <span v-if="this.showingAllSnippets" class="seeAllSnippets" v-on:click="toggleMoreSnippetsVisibility()">
                <span>See less hits</span>
            </span>
        </div>
    </div>
  </div>
</template>

<script>
  import HighlightedChapter from "./highlights/HighlightedChapter";
  import HighlightedContent from "./highlights/HighlightedContent";
  import ResultMap from "./ResultMap.vue";
  import { mapState } from "vuex";


  export default {
    name: "SearchResult",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
      ResultMap,
      HighlightedChapter,
      HighlightedContent
    },
    props: {
      result: {
        type: Object,
        required: true
      },
      queryString: {
        type: String,
        requred: true
      }
    },
    computed: {
    ...mapState({
      instance: state => state.searchStore.instance
    })
  },
    created() {
    },
    methods: {
      getRecordLink(id, page, loarId) {
        return page
          ? {
              name: "Record",
              query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId, page: true },
              params: {instance: this.instance }
            }
          : { name: "Record", 
              query: { id: encodeURIComponent(id), query: this.queryString, loarId: loarId },
              params: {instance: this.instance } 
            };
      },
      transformDate(date) {
        const convertedDate = new Date(date);
        const currentDate = new Date();
        const diffYears = currentDate.getFullYear() - convertedDate.getFullYear();
        return diffYears;
      },
      fixIdForSearchResultContainer(id) {
        return id.replace(/:|\s|\//g, '-')
      },
      deliverTimeBetween(date) {
        const convertedDate = new Date(date);
        return convertedDate.getFullYear();
      },
      deliverTimePeriodStamp(time) {
        let returnphase;
        time.toString().charAt(0) === "-"
          ? (returnphase = time.toString().slice(1) + " BC")
          : (returnphase = time + " AC");
        return returnphase;
      },
      returnACorDC(time) {
        return time.toString().charAt(0) === "-"
          ? time.toString().slice(1) + " before Christ"
          : time.toString() + " bfter Christ";
      },
      returnAddresses(addresses) {
        return addresses ? addresses.join(', ') : "Ingen lokation(er) opgivet.";
      },
      returnAuthors(authors) {
        return authors ? authors.join(', ') : "Ingen forfatter(e) opgivet.";
      },
      toggleMoreSnippetsVisibility() {
        this.showingAllSnippets = !this.showingAllSnippets;
      }
    }
  };
</script>
