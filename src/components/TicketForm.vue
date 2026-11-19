<script setup lang="ts">
import { reactive, ref, watch } from 'vue'
import type { Ticket, TicketDraft } from '../types/ticket'
import { ticketPriorities, ticketStatuses } from '../types/ticket'

const props = defineProps<{
  initialTicket?: Ticket | null
  saving: boolean
  errorMessage: string
}>()

const emit = defineEmits<{
  submit: [ticket: TicketDraft]
  cancel: []
}>()

const form = reactive<TicketDraft>({
  titre: '',
  description: '',
  demandeur: '',
  priorite: 'Moyenne',
  statut: 'Ouvert',
  dateCreation: '',
})
const validationMessage = ref('')

watch(
  () => props.initialTicket,
  (ticket) => {
    form.titre = ticket?.titre ?? ''
    form.description = ticket?.description ?? ''
    form.demandeur = ticket?.demandeur ?? ''
    form.priorite = ticket?.priorite ?? 'Moyenne'
    form.statut = ticket?.statut ?? 'Ouvert'
    form.dateCreation = ticket?.dateCreation ?? ''
  },
  { immediate: true },
)

function submitForm() {
  if (props.saving) return

  const titre = form.titre.trim()
  const description = form.description.trim()
  const demandeur = form.demandeur.trim()

  if (!titre || !description || !demandeur) {
    validationMessage.value = 'Veuillez remplir le titre, la description et le demandeur.'
    return
  }

  validationMessage.value = ''
  emit('submit', {
    titre,
    description,
    demandeur,
    priorite: form.priorite,
    statut: form.statut,
    dateCreation: form.dateCreation,
  })
}
</script>

<template>
  <form class="ticket-form" novalidate @submit.prevent="submitForm">
    <div class="form-field">
      <label for="ticket-title">Titre <span aria-hidden="true">*</span></label>
      <input id="ticket-title" v-model="form.titre" required maxlength="120" />
    </div>
    <div class="form-field">
      <label for="ticket-description">Description <span aria-hidden="true">*</span></label>
      <textarea id="ticket-description" v-model="form.description" required rows="5"></textarea>
    </div>
    <div class="form-field">
      <label for="ticket-requester">Demandeur <span aria-hidden="true">*</span></label>
      <input id="ticket-requester" v-model="form.demandeur" required maxlength="100" />
    </div>
    <div class="form-grid">
      <div class="form-field">
        <label for="ticket-priority">Priorité</label>
        <select id="ticket-priority" v-model="form.priorite">
          <option v-for="priority in ticketPriorities" :key="priority">{{ priority }}</option>
        </select>
      </div>
      <div v-if="initialTicket" class="form-field">
        <label for="ticket-status">Statut</label>
        <select id="ticket-status" v-model="form.statut">
          <option v-for="status in ticketStatuses" :key="status">{{ status }}</option>
        </select>
      </div>
    </div>

    <p v-if="validationMessage" class="form-error" role="alert">{{ validationMessage }}</p>
    <p v-if="errorMessage" class="form-error" role="alert">{{ errorMessage }}</p>
    <div class="form-actions">
      <button class="button button-secondary" type="button" @click="emit('cancel')">Annuler</button>
      <button class="button button-primary" type="submit" :disabled="saving">
        {{ saving ? 'Enregistrement…' : initialTicket ? 'Enregistrer les modifications' : 'Créer le ticket' }}
      </button>
    </div>
  </form>
</template>

<style scoped>
.ticket-form {
  display: grid;
  gap: 18px;
  padding: 24px;
  border: 1px solid var(--line);
  border-radius: 14px;
  background: var(--white);
}

.form-field {
  display: grid;
  gap: 7px;
}

.form-field label {
  color: var(--ink);
  font-size: 13px;
  font-weight: 700;
}

.form-field label span {
  color: #b83d35;
}

.form-field input,
.form-field textarea,
.form-field select {
  width: 100%;
  min-height: 44px;
  padding: 10px 12px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  color: var(--ink);
  font: inherit;
}

.form-field textarea {
  resize: vertical;
}

.form-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 16px;
}

.form-error {
  margin: 0;
  color: #a5312b;
  font-size: 14px;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.button {
  display: inline-flex;
  min-height: 42px;
  align-items: center;
  justify-content: center;
  padding: 0 16px;
  border: 0;
  border-radius: 8px;
  font: inherit;
  font-size: 13px;
  font-weight: 750;
  text-decoration: none;
  cursor: pointer;
}

.button:disabled {
  cursor: wait;
  opacity: 0.65;
}

.button-primary {
  background: var(--green);
  color: #fff;
}

.button-secondary {
  border: 1px solid var(--line);
  background: #fff;
  color: var(--ink);
}

@media (max-width: 520px) {
  .form-grid {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column-reverse;
  }
}
</style>
