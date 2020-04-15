// Global search state.

import { searchService } from '../services/SearchService'

const state = {
  query: "",
  queryDisplay: "",
  results: {},
  error: "",
}

const actions = {
  updateQueryDisplay ( {commit}, param ) {
    console.log("here!");
    commit('updateQueryDisplaySuccess', param)
  },

  doSearch ({ commit }, params) {
    console.log("WE DO SEARCH PLXPLX!")
    commit('doSearchSuccess')
    searchService
      .fireSearch(params)
      .then(users => commit('doSearchSuccess', users), error =>
        commit('doSearchError', error))
  },

  resetSearch ({ commit }) {
    commit('resetSearch')
  }
}

const mutations = {
  updateQueryDisplaySuccess(state, param) {
    console.log("here? :S")
    state.queryDisplay = param
  },
  doSearchSuccess(state, users) {
    state.results = users;
  },
  doSearchError(state, message) {
    state.error = message;
  }

}

export const searchStore = {
  namespaced: true,
  state,
  actions,
  mutations
}
