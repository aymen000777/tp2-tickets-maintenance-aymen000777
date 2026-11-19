<script setup lang="ts">
import axios from 'axios'
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import TicketForm from '../components/TicketForm.vue'
import { createTicket } from '../services/ticketService.js'
import type { TicketDraft } from '../types/ticket'

const router = useRouter()
const saving = ref(false)
const errorMessage = ref('')

async function saveTicket(ticket: TicketDraft) {
  if (saving.value) return
  saving.value = true
  errorMessage.value = ''
  try {
    const now = new Date()
    const dateCreation = [
      now.getFullYear(),
      String(now.getMonth() + 1).padStart(2, '0'),
      String(now.getDate()).padStart(2, '0'),
    ].join('-')
    await createTicket({ ...ticket, statut: 'Ouvert', dateCreation })
    await router.push('/tickets')
  } catch (error) {
    errorMessage.value = axios.isAxiosError(error)
      ? 'Le ticket n’a pas pu être créé. Vérifiez que le serveur API est démarré, puis réessayez.'
      : 'Une erreur inattendue a empêché la création du ticket.'
    if (!axios.isAxiosError(error)) console.error('Erreur inattendue pendant la création du ticket :', error)
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <section class="form-page">
    <RouterLink class="back-link" to="/tickets">← Retour à la liste</RouterLink>
    <p class="eyebrow">NOUVEL INCIDENT</p>
    <h1>Nouveau ticket<span class="heading-period">.</span></h1>
    <p class="page-intro">Décrivez le problème pour créer un ticket de support.</p>
    <TicketForm :saving="saving" :error-message="errorMessage" @submit="saveTicket" @cancel="router.push('/tickets')" />
  </section>
</template>

<style scoped>
.form-page {
  max-width: 760px;
  margin: 32px auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 30px;
  color: var(--green);
  font-size: 13px;
  font-weight: 700;
  text-decoration: none;
}

.eyebrow {
  margin-bottom: 8px;
  color: var(--green);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 0.14em;
}

h1 {
  margin: 0;
  color: var(--ink);
  font-size: clamp(30px, 5vw, 42px);
  letter-spacing: -0.045em;
}

.heading-period {
  color: var(--coral);
}

.page-intro {
  margin: 10px 0 24px;
  color: var(--muted);
}
</style>
