// Global search state.

import { searchService } from '../services/SearchService'

const state = {
  query: "",
  queryDisplay: "",
  results: {},
  facets: {},
  error: "",
  instance:"",
  loading:false,
  solrOptions: {
    shownResultsNumber:50,
    currentOffset:0,
    searchSort:""
  }
}

const actions = {
  updateQueryDisplay ( {commit}, param ) {
    commit('updateQueryDisplaySuccess', param)
  },
  updateInstance ( {commit}, param ) {
    commit('updateInstance', param)
  },
  setLoadingStatus( {commit}, param) {
    commit('setLoadingStatus', param)
  },
  updateQuery ( {commit}, param ) {
    commit('updateQuerySuccess', param)
  },
  updateShownResultsNumber( {commit}, param ) {
    commit('updateShownResultsNumberSuccess', param)
  },
  updateSearchSort( {commit}, param ) {
    commit('updateSearchSortSuccess', param)
  },
  updateCurrentOffset ( {commit}, param ) {
    commit('updateCurrentOffsetSuccess', param)
  },
  doSearch ({ commit }, params) {
    commit('setLoadingStatus',true)
    searchService
      .fireSearch(params.query, params.instance, params.options, params.sort)
      .then(result => commit('doSearchSuccess', result), error =>
        commit('doSearchError', error))
  },

  resetSearch ({ commit }) {
    commit('resetSearch')
  }
}

const mutations = {
  updateQueryDisplaySuccess(state, param) {
    state.queryDisplay = param
  },
  updateQuerySuccess(state, param) {
    state.query = param
  },
  updateShownResultsNumberSuccess(state, param) {
    state.solrOptions.shownResultsNumber = param
  },
  updateCurrentOffsetSuccess(state, param) {
    state.solrOptions.currentOffset = param
  },
  updateSearchSortSuccess(state, param) {
    state.solrOptions.searchSort = param
  },
  updateInstance(state, param) {
    state.instance = param
  },
  doSearchSuccess(state, result) {
    //console.log("we got results",result)
    state.results = result.results
    state.facets = result.facets
  },
  removeFacets(state) {
    state.facets = null
  },
  doSearchError(state, message) {
    state.error = message;
  },
  setLoadingStatus(state, status) {
    state.loading = status
  }

}

export const searchStore = {
  namespaced: true,
  state,
  actions,
  mutations
}
