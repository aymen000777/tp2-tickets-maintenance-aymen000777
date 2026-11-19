<script setup lang="ts">
import axios from 'axios'
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import DeleteTicketDialog from '../components/DeleteTicketDialog.vue'
import TicketForm from '../components/TicketForm.vue'
import { deleteTicket, getTicket, updateTicket } from '../services/ticketService.js'
import type { Ticket, TicketDraft } from '../types/ticket'

const route = useRoute()
const router = useRouter()
const ticket = ref<Ticket | null>(null)
const isLoading = ref(true)
const isEditing = ref(false)
const isSaving = ref(false)
const isDeleteDialogOpen = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

async function loadTicket() {
  const id = String(route.params.id)
  isLoading.value = true
  ticket.value = null
  errorMessage.value = ''
  try {
    ticket.value = await getTicket(id)
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      errorMessage.value = `Aucun ticket ne correspond à l’identifiant « ${id} ».`
    } else if (axios.isAxiosError(error)) {
      errorMessage.value = 'Impossible de charger ce ticket. Vérifiez que le serveur API est démarré.'
    } else {
      errorMessage.value = 'Une erreur inattendue est survenue pendant le chargement du ticket.'
      console.error('Erreur inattendue pendant le chargement du ticket :', error)
    }
  } finally {
    isLoading.value = false
  }
}

async function saveChanges(changes: TicketDraft) {
  if (!ticket.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''
  successMessage.value = ''
  try {
    ticket.value = await updateTicket(ticket.value.id, changes)
    isEditing.value = false
    successMessage.value = 'Les modifications ont été enregistrées.'
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Les modifications n’ont pas pu être enregistrées. Vérifiez la connexion au serveur API.'
      : 'Une erreur inattendue a empêché la modification du ticket.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant la modification du ticket :', error)
  } finally {
    isSaving.value = false
  }
}

async function removeTicket() {
  if (!ticket.value || isSaving.value) return
  isSaving.value = true
  errorMessage.value = ''
  try {
    await deleteTicket(ticket.value.id)
    isDeleteDialogOpen.value = false
    await router.push('/tickets')
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Le ticket n’a pas pu être supprimé. Vérifiez la connexion au serveur API.'
      : 'Une erreur inattendue a empêché la suppression du ticket.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant la suppression du ticket :', error)
  } finally {
    isSaving.value = false
  }
}

watch(() => route.params.id, loadTicket, { immediate: true })
</script>

<template>
  <section class="detail-page">
    <RouterLink class="back-link" to="/tickets">← Retour à la liste</RouterLink>
    <p v-if="isLoading" class="notice" role="status">Chargement du ticket…</p>
    <template v-else-if="ticket">
      <header class="detail-heading">
        <div>
          <p class="eyebrow">TICKET #{{ ticket.id }}</p>
          <h1>{{ ticket.titre }}<span class="heading-period">.</span></h1>
          <p class="page-intro">Détails et gestion de l’incident.</p>
        </div>
        <div v-if="!isEditing" class="header-actions">
          <button class="button button-secondary" type="button" @click="isEditing = true">Modifier</button>
          <button class="button button-danger" type="button" :disabled="isSaving" @click="isDeleteDialogOpen = true">Supprimer</button>
        </div>
      </header>

      <p v-if="successMessage" class="notice success-notice" role="status">{{ successMessage }}</p>
      <p v-if="errorMessage" class="notice error-notice" role="alert">{{ errorMessage }}</p>

      <TicketForm
        v-if="isEditing"
        :initial-ticket="ticket"
        :saving="isSaving"
        :error-message="errorMessage"
        @submit="saveChanges"
        @cancel="isEditing = false"
      />
      <dl v-else class="ticket-properties">
        <div class="property property-description"><dt>Description</dt><dd>{{ ticket.description }}</dd></div>
        <div class="property"><dt>Demandeur</dt><dd>{{ ticket.demandeur }}</dd></div>
        <div class="property"><dt>Priorité</dt><dd>{{ ticket.priorite }}</dd></div>
        <div class="property"><dt>Statut</dt><dd>{{ ticket.statut }}</dd></div>
        <div class="property"><dt>Date de création</dt><dd><time :datetime="ticket.dateCreation">{{ ticket.dateCreation }}</time></dd></div>
        <div class="property"><dt>Identifiant</dt><dd>{{ ticket.id }}</dd></div>
      </dl>
    </template>
    <div v-else class="not-found-panel">
      <h1>Ticket introuvable<span class="heading-period">.</span></h1>
      <p class="notice error-notice" role="alert">{{ errorMessage }}</p>
    </div>
    <DeleteTicketDialog
      v-if="isDeleteDialogOpen && ticket"
      :ticket-title="ticket.titre"
      :busy="isSaving"
      @confirm="removeTicket"
      @cancel="isDeleteDialogOpen = false"
    />
  </section>
</template>

<style scoped>
.detail-page { max-width: 820px; margin: 32px auto; }
.back-link { display: inline-block; margin-bottom: 30px; color: var(--green); font-size: 13px; font-weight: 700; text-decoration: none; }
.detail-heading { display: flex; align-items: flex-end; justify-content: space-between; gap: 20px; margin-bottom: 24px; }
.eyebrow { margin-bottom: 8px; color: var(--green); font-size: 11px; font-weight: 800; letter-spacing: .14em; }
h1 { margin: 0; color: var(--ink); font-size: clamp(28px, 5vw, 40px); letter-spacing: -.045em; overflow-wrap: anywhere; }
.heading-period { color: var(--coral); }
.page-intro { margin-top: 10px; color: var(--muted); }
.header-actions { display: flex; gap: 9px; }
.button { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; padding: 0 14px; border-radius: 8px; font: inherit; font-size: 12px; font-weight: 750; cursor: pointer; }
.button-secondary { border: 1px solid var(--line); background: #fff; color: var(--ink); }
.button-danger { border: 0; background: #a5312b; color: #fff; }
.button:disabled { cursor: wait; opacity: .6; }
.ticket-properties { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 0; overflow: hidden; border: 1px solid var(--line); border-radius: 14px; background: #fff; }
.property { display: grid; align-content: start; gap: 7px; min-height: 94px; padding: 20px; border-bottom: 1px solid var(--line); }
.property:nth-child(odd) { border-right: 1px solid var(--line); }
.property dt { color: var(--muted); font-size: 11px; font-weight: 800; text-transform: uppercase; }
.property dd { margin: 0; color: var(--ink); font-size: 14px; font-weight: 650; white-space: pre-wrap; overflow-wrap: anywhere; }
.property-description { grid-column: 1 / -1; min-height: 130px; }
.property-description dd { line-height: 1.65; }
.notice { padding: 18px; border: 1px solid var(--line); border-radius: 10px; background: #fff; color: var(--muted); font-size: 13px; }
.error-notice { border-color: #efc3bc; background: #fff5f2; color: #a5312b; }
.success-notice { margin-bottom: 16px; border-color: #cde2cf; background: #f2faf2; color: #356a3e; }
.not-found-panel h1 { margin-bottom: 18px; }
@media (max-width: 620px) {
  .detail-heading { align-items: flex-start; flex-direction: column; }
  .ticket-properties { grid-template-columns: 1fr; }
  .property { border-right: 0 !important; }
  .property-description { grid-column: auto; }
}
</style>
