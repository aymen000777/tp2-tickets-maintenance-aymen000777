<script setup lang="ts">
import axios from 'axios'
import { computed, onMounted, ref } from 'vue'
import { RouterLink } from 'vue-router'
import DeleteTicketDialog from './DeleteTicketDialog.vue'
import { deleteTicket, getTickets, updateTicket } from '../services/ticketService.js'
import type { Ticket } from '../types/ticket'
import { ticketPriorities, ticketStatuses } from '../types/ticket'

const tickets = ref<Ticket[]>([])
const searchQuery = ref('')
const selectedStatus = ref('')
const selectedPriority = ref('')
const isLoading = ref(true)
const busyTicketId = ref<string | null>(null)
const ticketPendingDelete = ref<Ticket | null>(null)
const errorMessage = ref('')
const successMessage = ref('')

const filteredTickets = computed(() => {
  const query = searchQuery.value.trim().toLocaleLowerCase('fr')
  return tickets.value.filter((ticket) => {
    const matchesTitle = ticket.titre.toLocaleLowerCase('fr').includes(query)
    const matchesStatus = !selectedStatus.value || ticket.statut === selectedStatus.value
    const matchesPriority = !selectedPriority.value || ticket.priorite === selectedPriority.value
    return matchesTitle && matchesStatus && matchesPriority
  })
})

async function loadTickets() {
  isLoading.value = true
  errorMessage.value = ''
  try {
    tickets.value = await getTickets()
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Impossible de charger les tickets. Vérifiez que JSON Server fonctionne sur le port 3000.'
      : 'Une erreur inattendue est survenue pendant le chargement des tickets.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant le chargement des tickets :', error)
  } finally {
    isLoading.value = false
  }
}

async function advanceStatus(ticket: Ticket) {
  if (busyTicketId.value) return
  const currentIndex = ticketStatuses.indexOf(ticket.statut)
  const nextStatus = ticketStatuses[currentIndex + 1]
  if (!nextStatus) return

  busyTicketId.value = ticket.id
  errorMessage.value = ''
  successMessage.value = ''
  try {
    const updatedTicket = await updateTicket(ticket.id, { statut: nextStatus })
    tickets.value = tickets.value.map((item) => (item.id === ticket.id ? updatedTicket : item))
    successMessage.value = `Le ticket « ${ticket.titre} » est maintenant « ${nextStatus} ».`
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Le statut n’a pas pu être modifié. Vérifiez la connexion au serveur API.'
      : 'Une erreur inattendue a empêché la modification du statut.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant le changement de statut :', error)
  } finally {
    busyTicketId.value = null
  }
}

async function removeTicket(ticket: Ticket) {
  ticketPendingDelete.value = ticket
}

async function confirmDelete() {
  if (busyTicketId.value) return
  const ticket = ticketPendingDelete.value
  if (!ticket) return
  busyTicketId.value = ticket.id
  errorMessage.value = ''
  successMessage.value = ''
  try {
    await deleteTicket(ticket.id)
    tickets.value = tickets.value.filter((item) => item.id !== ticket.id)
    successMessage.value = `Le ticket « ${ticket.titre} » a été supprimé.`
    ticketPendingDelete.value = null
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Le ticket n’a pas pu être supprimé. Vérifiez la connexion au serveur API.'
      : 'Une erreur inattendue a empêché la suppression du ticket.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant la suppression du ticket :', error)
  } finally {
    busyTicketId.value = null
  }
}

onMounted(loadTickets)
</script>

<template>
  <section class="tickets-page" aria-labelledby="tickets-title" :aria-busy="isLoading">
    <header class="page-heading">
      <div>
        <p class="eyebrow">SUPPORT INFORMATIQUE</p>
        <h1 id="tickets-title">Suivi des tickets<span class="heading-period">.</span></h1>
        <p class="page-intro">Consultez et gérez les incidents déclarés par les utilisateurs.</p>
      </div>
      <RouterLink class="button button-primary" to="/tickets/nouveau">+ Nouveau ticket</RouterLink>
    </header>

    <div class="filters" aria-label="Recherche et filtres des tickets">
      <div class="filter-field search-field">
        <label for="ticket-search">Rechercher par titre</label>
        <input id="ticket-search" v-model="searchQuery" type="search" placeholder="Ex. imprimante" />
      </div>
      <div class="filter-field">
        <label for="status-filter">Statut</label>
        <select id="status-filter" v-model="selectedStatus">
          <option value="">Tous les statuts</option>
          <option v-for="status in ticketStatuses" :key="status" :value="status">{{ status }}</option>
        </select>
      </div>
      <div class="filter-field">
        <label for="priority-filter">Priorité</label>
        <select id="priority-filter" v-model="selectedPriority">
          <option value="">Toutes les priorités</option>
          <option v-for="priority in ticketPriorities" :key="priority" :value="priority">{{ priority }}</option>
        </select>
      </div>
    </div>

    <p v-if="errorMessage" class="notice error-notice" role="alert">{{ errorMessage }}</p>
    <p v-if="successMessage" class="notice success-notice" role="status">{{ successMessage }}</p>
    <p v-if="isLoading" class="notice" role="status">Chargement des tickets…</p>
    <template v-else-if="!errorMessage">
      <div class="tickets-summary" aria-live="polite">
        <h2>Liste des incidents</h2>
        <span>{{ filteredTickets.length }} ticket{{ filteredTickets.length > 1 ? 's' : '' }} visible{{ filteredTickets.length > 1 ? 's' : '' }}</span>
      </div>

      <ul v-if="filteredTickets.length" class="ticket-list">
        <li v-for="ticket in filteredTickets" :key="ticket.id" class="ticket-card">
          <div class="ticket-main">
            <div class="ticket-title-row">
              <h3>{{ ticket.titre }}</h3>
              <span class="badge" :class="`priority-${ticket.priorite.toLowerCase()}`">Priorité {{ ticket.priorite }}</span>
            </div>
            <p class="ticket-description">{{ ticket.description }}</p>
            <dl class="ticket-details">
              <div><dt>Demandeur</dt><dd>{{ ticket.demandeur }}</dd></div>
              <div><dt>Date de création</dt><dd><time :datetime="ticket.dateCreation">{{ ticket.dateCreation }}</time></dd></div>
            </dl>
          </div>
          <div class="ticket-actions">
            <span class="badge status-badge" :class="`status-${ticket.statut.toLowerCase().replace(' ', '-')}`">
              {{ ticket.statut }}
            </span>
            <div class="action-links">
              <RouterLink class="text-link" :to="`/tickets/${ticket.id}`">Détail / modifier</RouterLink>
              <button
                v-if="ticket.statut !== 'Fermé'"
                class="text-button"
                type="button"
                :disabled="busyTicketId !== null"
                @click="advanceStatus(ticket)"
              >
                {{ busyTicketId === ticket.id ? 'Mise à jour…' : `Passer à ${ticketStatuses[ticketStatuses.indexOf(ticket.statut) + 1]}` }}
              </button>
              <button
                class="text-button danger-link"
                type="button"
                :disabled="busyTicketId !== null"
                @click="removeTicket(ticket)"
              >
                Supprimer
              </button>
            </div>
          </div>
        </li>
      </ul>
      <p v-else class="notice empty-notice" role="status">Aucun ticket ne correspond à votre recherche et à vos filtres.</p>
    </template>
    <button v-if="errorMessage && !isLoading" class="button button-secondary retry-button" type="button" @click="loadTickets">
      Réessayer
    </button>
    <DeleteTicketDialog
      v-if="ticketPendingDelete"
      :ticket-title="ticketPendingDelete.titre"
      :busy="busyTicketId === ticketPendingDelete.id"
      @confirm="confirmDelete"
      @cancel="ticketPendingDelete = null"
    />
  </section>
</template>

<style scoped>
.tickets-page { max-width: 1040px; margin: 0 auto; }
.page-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin: 36px 0 28px; }
.eyebrow { margin-bottom: 10px; color: var(--green); font-size: 11px; font-weight: 800; letter-spacing: .14em; }
h1 { color: var(--ink); font-size: clamp(30px, 5vw, 43px); font-weight: 650; letter-spacing: -.045em; line-height: 1.15; }
.heading-period { color: var(--coral); }
.page-intro { margin-top: 12px; color: var(--muted); font-size: 15px; }
.filters { display: grid; grid-template-columns: minmax(220px, 1.6fr) repeat(2, minmax(160px, 1fr)); gap: 14px; margin-bottom: 24px; padding: 18px; border: 1px solid var(--line); border-radius: 13px; background: var(--white); }
.filter-field { display: grid; gap: 7px; }
.filter-field label { color: var(--ink); font-size: 12px; font-weight: 700; }
.filter-field input, .filter-field select { width: 100%; min-height: 42px; padding: 0 12px; border: 1px solid var(--line); border-radius: 8px; background: var(--white); color: var(--ink); font: inherit; }
.tickets-summary { display: flex; align-items: baseline; justify-content: space-between; gap: 16px; margin-bottom: 12px; }
.tickets-summary h2 { color: var(--ink); font-size: 15px; font-weight: 750; }
.tickets-summary span { color: var(--muted); font-size: 12px; }
.ticket-list { display: grid; gap: 12px; padding: 0; list-style: none; }
.ticket-card { display: flex; align-items: flex-start; justify-content: space-between; gap: 20px; padding: 20px; border: 1px solid var(--line); border-radius: 13px; background: var(--white); box-shadow: 0 3px 12px rgb(23 53 46 / 3%); }
.ticket-main { min-width: 0; flex: 1; }
.ticket-title-row { display: flex; flex-wrap: wrap; align-items: center; gap: 10px; }
.ticket-title-row h3 { color: var(--ink); font-size: 16px; font-weight: 750; }
.ticket-description { margin: 10px 0 16px; color: #53645c; font-size: 13px; line-height: 1.65; }
.ticket-details { display: flex; flex-wrap: wrap; gap: 24px; margin: 0; }
.ticket-details div { display: grid; gap: 3px; }
.ticket-details dt { color: var(--muted); font-size: 10px; font-weight: 700; text-transform: uppercase; }
.ticket-details dd { color: var(--ink); font-size: 12px; font-weight: 650; }
.ticket-actions { display: grid; justify-items: end; gap: 14px; }
.badge { display: inline-flex; min-height: 26px; align-items: center; padding: 0 9px; border-radius: 20px; font-size: 10px; font-weight: 800; white-space: nowrap; }
.priority-haute { background: #fae4dd; color: #9c4635; }
.priority-moyenne { background: #fff0cf; color: #856321; }
.priority-basse { background: #e6eee5; color: #496c51; }
.status-ouvert { background: #e5efff; color: #315a91; }
.status-en-cours { background: #fff0cf; color: #856321; }
.status-résolu { background: #e2f1e4; color: #3c7047; }
.status-fermé { background: #e8e8e8; color: #555; }
.action-links { display: grid; justify-items: end; gap: 8px; }
.text-link, .text-button { padding: 0; border: 0; background: none; color: var(--green); font: inherit; font-size: 12px; font-weight: 750; text-decoration: none; cursor: pointer; }
.text-link:hover, .text-button:hover { text-decoration: underline; }
.text-button:disabled { cursor: wait; opacity: .6; }
.danger-link { color: #a5312b; }
.button { display: inline-flex; min-height: 42px; align-items: center; justify-content: center; padding: 0 16px; border: 0; border-radius: 8px; font: inherit; font-size: 13px; font-weight: 750; text-decoration: none; cursor: pointer; }
.button-primary { background: var(--green); color: #fff; }
.button-secondary { border: 1px solid var(--line); background: #fff; color: var(--ink); }
.retry-button { margin-top: 12px; }
.notice { padding: 18px; border: 1px solid var(--line); border-radius: 10px; background: #fff; color: var(--muted); font-size: 13px; }
.error-notice { border-color: #efc3bc; background: #fff5f2; color: #a5312b; }
.success-notice { border-color: #cde2cf; background: #f2faf2; color: #356a3e; }
.empty-notice { text-align: center; }
@media (max-width: 700px) {
  .page-heading { align-items: flex-start; flex-direction: column; }
  .filters { grid-template-columns: 1fr; }
  .ticket-card { flex-direction: column; }
  .ticket-actions { width: 100%; justify-items: start; }
  .action-links { justify-items: start; }
}
</style>
