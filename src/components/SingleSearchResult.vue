<template>
    <div class="searchResult" id="{this.result.doclist.docs['0'].loar_id.replace(/:|\s|\//g, '-')}">
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
            Rapport content from time period between
            <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_from_i)">&nbsp; 
            {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_from_i) }}</span> and 
            <span :title="this.returnACorDC(result.doclist.docs[0].ff_primaryobject_year_to_i)">&nbsp;
            {{ this.deliverTimePeriodStamp(result.doclist.docs[0].ff_primaryobject_year_to_i) }}</span>
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
        <div :v-if="!this.queryString.includes('&pt=')" class="matches">
          <span class="numbersFound">{{ result.doclist.numFound }}</span>
          <span v-if="this.result.doclist.numFound > 1"> matches </span>
          <span v-if="this.result.doclist.numFound === 1"> match </span>
          <span>found in pdf. Displaying </span>
          <span v-if="result.doclist.docs.length <= this.defaultVisibleSnippets" class="numbersFound">{{ this.result.doclist.docs.length }}</span>
          <span v-if="result.doclist.docs.length > this.defaultVisibleSnippets" class="numbersFound">{{ defaultVisibleSnippets }}</span>.
          <span v-if="result.doclist.docs.length > this.defaultVisibleSnippets" class="seeAllSnippets" v-on:click="this.toggleMoreSnippetsVisibility()">
          <span v-if="this.showingAllSnippets === true">See less hits</span>
          <span v-if="this.showingAllSnippets === false">See more hits</span>
          </span>
        </div>
        <!--{this.queryString.includes("&pt=") != true &&
        this.result.doclist.docs.map((snippets, index) => (
          <div
            class="snippet"
            style={index > defaultVisibleSnippets - 1 && !this.showingAllSnippets ? "display:none" : "display:block"}
          >
            <div class="chapterTitle">chapter </div>
            <HighlightedChapter chapterString={snippets.chapter} query={this.result.query} />
            <div class="pageTitle">page </div>
            {snippets.page == 0 ? <div class="pageNumber">1</div> : <div class="pageNumber">{snippets.page - 1}</div>}
            <ul>
              <HighlightedContent contentArray={snippets.highLightSnippets} query={this.result.query} />
            </ul>
            <router-link to={this.getRecordLink(snippets.id, true)}>
              <span>⮊</span> Go to hit
            </router-link>
          </div>
        ))}
      <router-link class="entirePdfLink" to={this.getRecordLink(this.result.doclist.docs["0"].id, false)}>
        See entire pdf
      </router-link>
      {this.showingAllSnippets && (
        <div class="seeAllSnippetsBottomContainer">
          <span class="seeAllSnippets" onClick={e => this.toggleMoreSnippetsVisibility()}>
            {this.showingAllSnippets ? <span>See less hits</span> : <span>See more hits</span>}
          </span>
        </div> -->
    </div>
</template>

<script>
  //import HighlightedChapter from "../components/HighlightedChapter";
  //import HighlightedContent from "../components/HighlightedContent";
  import ResultMap from "./ResultMap.vue";

  export default {
    name: "SearchResult",
    data: () => ({ showingAllSnippets: false, defaultVisibleSnippets:4 }),
    components: {
      ResultMap
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
    created() {
      console.log("hello", this)
    },
    methods: {
      getRecordLink(id, page) {
        return page
          ? {
              path: "/record/",
              query: { page: true, id: encodeURIComponent(id), query: this.queryString }
            }
          : { path: "/record/", query: { id: encodeURIComponent(id), query: this.queryString } };
      },
      transformDate(date) {
        const convertedDate = new Date(date);
        const currentDate = new Date();
        const diffYears = currentDate.getFullYear() - convertedDate.getFullYear();
        return diffYears;
      },
      deliverTimeBetween(date) {
        const convertedDate = new Date(date);
        return convertedDate.getFullYear();
      },
      deliverTimePeriodStamp(time) {
        let returnphase;
        console.log(time.toString());
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
