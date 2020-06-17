//import { storeSearchResult } from "../store/cacheStoreHelper.js";
import axios from "axios";

// Calls to search service
export const searchService = {
  fireSearch,
  structureSearchResult,
}

function fireSearch(query, instance, options, sort) {
    query === undefined ? query = '' : query = "&q=" + query;
    const searchUrl = "/api/discovery/meloar/collection?collection=" + instance + "&group.facet=true&group.ngroups=true&facet=true&hl=true&group.field=loar_id&group.limit=50&group=true" + query + options + sort;
    return axios
      .get(searchUrl)
      .then(response => {
        //storeSearchResult(response.data);
        return structureSearchResult(response.data);
      })
      .catch(error => {
        return Promise.reject(error);
      });
  }

  function structureSearchResult(searchResults) {
    let result = {};
    let highLights = [];
    let results = [];
    for (let i = 0; i < searchResults.grouped.loar_id.groups.length; i++) {
      searchResults.grouped.loar_id.groups[i].query = searchResults.responseHeader.params.q;
      searchResults.grouped.loar_id.groups[i].allHits =
        searchResults.grouped.loar_id.ngroups;
      for (let o = 0; o < searchResults.grouped.loar_id.groups[i].doclist.docs.length; o++) {
        const highLightsBlock =
          searchResults.highlighting[searchResults.grouped.loar_id.groups[i].doclist.docs[o].id]
            .content;
        highLights = highLightsBlock ? highLightsBlock : [];
        searchResults.grouped.loar_id.groups[i].doclist.docs[o].highLightSnippets = highLights;
      }
      results.push(searchResults.grouped.loar_id.groups[i]);
    }
    result.results = results
    result.facets = searchResults.facet_counts
    return result; 
  }
