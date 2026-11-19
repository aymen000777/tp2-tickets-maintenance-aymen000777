import { createRouter, createWebHistory } from 'vue-router'
import TicketList from './components/TicketList.vue'
import NewTicketView from './views/NewTicketView.vue'
import TicketDetailView from './views/TicketDetailView.vue'
import NotFoundView from './views/NotFoundView.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tickets' },
    { path: '/tickets', component: TicketList },
    { path: '/tickets/nouveau', component: NewTicketView },
    { path: '/tickets/:id', component: TicketDetailView },
    { path: '/:pathMatch(.*)*', component: NotFoundView },
  ],
})
