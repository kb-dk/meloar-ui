import Vue from 'vue'
import VueRouter from 'vue-router'
import MeloarContainer from "../containers/MeloarContainer.vue";

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MeloarContainer
  },
  {
    path: '/:location',
    name: 'Instance',
    component: () => import(/* webpackChunkName: "instance" */ '../containers/InstanceContainer.vue')
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../containers/AboutContainer.vue')
  },
  {
    path: "/:location/search/:query",
    name: "Search",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "search" */ '../containers/SearchContainer.vue')
  },
  {
    path: "/:location/record/",
    name: "Record",
    component: () => import(/* webpackChunkName: "fullrecord" */ '../containers/FullRecordContainer.vue'),
    props: (route) => ({ id: route.query.id, page: route.query.page, query: route.query.query, loarId: route.query.loarId })
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router
