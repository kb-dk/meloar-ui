import Vue from 'vue'
import Vuex from 'vuex'
import App from './App.vue'
import router from './router'

Vue.use(Vuex)

import { searchStore } from './store/SearchStore'

import './assets/styles/main.scss'

Vue.config.productionTip = false

export const store = new Vuex.Store({
  modules: {
    searchStore,
  },
  strict: true
})

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
