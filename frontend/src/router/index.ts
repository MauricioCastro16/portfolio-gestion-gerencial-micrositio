import { createRouter, createWebHistory } from 'vue-router'
import DesafioView from '../views/DesafioView.vue'
import HomeView from '../views/HomeView.vue'
import InvestigacionView from '../views/InvestigacionView.vue'
import MapaConceptualView from '../views/MapaConceptualView.vue'
import RpaMemberView from '../views/RpaMemberView.vue'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'home', component: HomeView },
    {
      path: '/rpa/:memberId',
      name: 'rpa-member',
      component: RpaMemberView,
      props: true,
    },
    {
      path: '/mapa/:nivelId',
      name: 'mapa-nivel',
      component: MapaConceptualView,
      props: true,
    },
    {
      path: '/desafio/:desafioId',
      name: 'desafio',
      component: DesafioView,
      props: true,
    },
    {
      path: '/investigacion/:investigacionId',
      name: 'investigacion',
      component: InvestigacionView,
      props: true,
    },
  ],
  scrollBehavior(to, _from, saved) {
    if (saved) return saved
    /* El scroll real va en <main.one-page> en HomeView; no forzar window al volver con hash */
    if (to.hash && to.name === 'home') {
      return false
    }
    return { top: 0 }
  },
})
