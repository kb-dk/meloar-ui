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
    commit('updateQueryDisplaySuccess', param)
  },

  updateQuery ( {commit}, param ) {
    commit('updateQuerySuccess', param)
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
    state.queryDisplay = param
  },
  updateQuerySuccess(state, param) {
    state.query = param
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
