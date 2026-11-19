<script setup lang="ts">
defineProps<{
  ticketTitle: string
  busy?: boolean
}>()

const emit = defineEmits<{
  confirm: []
  cancel: []
}>()
</script>

<template>
  <div class="dialog-backdrop" @click.self="emit('cancel')">
    <section class="confirm-dialog" role="dialog" aria-modal="true" aria-labelledby="delete-title" aria-describedby="delete-description">
      <p class="eyebrow">SUPPRESSION</p>
      <h2 id="delete-title">Supprimer ce ticket ?</h2>
      <p id="delete-description">
        Le ticket « <strong>{{ ticketTitle }}</strong> » sera supprimé définitivement.
      </p>
      <div class="dialog-actions">
        <button class="button button-secondary" type="button" :disabled="busy" @click="emit('cancel')">Annuler</button>
        <button class="button button-danger" type="button" :disabled="busy" @click="emit('confirm')">
          {{ busy ? 'Suppression…' : 'Confirmer la suppression' }}
        </button>
      </div>
    </section>
  </div>
</template>

<style scoped>
.dialog-backdrop { position: fixed; z-index: 20; inset: 0; display: grid; place-items: center; padding: 20px; background: rgb(18 32 27 / 54%); }
.confirm-dialog { width: min(100%, 440px); padding: 26px; border: 1px solid var(--line); border-radius: 14px; background: #fff; box-shadow: 0 20px 70px rgb(0 0 0 / 20%); }
.eyebrow { margin-bottom: 8px; color: #a5312b; font-size: 10px; font-weight: 850; letter-spacing: .14em; }
h2 { color: var(--ink); font-size: 22px; letter-spacing: -.025em; }
.confirm-dialog > p:not(.eyebrow) { margin-top: 12px; color: var(--muted); font-size: 14px; line-height: 1.6; }
.confirm-dialog strong { color: var(--ink); }
.dialog-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 24px; }
.button { display: inline-flex; min-height: 40px; align-items: center; justify-content: center; padding: 0 14px; border: 0; border-radius: 8px; font: inherit; font-size: 12px; font-weight: 750; cursor: pointer; }
.button:disabled { cursor: wait; opacity: .6; }
.button-secondary { border: 1px solid var(--line); background: #fff; color: var(--ink); }
.button-danger { background: #a5312b; color: #fff; }
@media (max-width: 480px) { .dialog-actions { flex-direction: column-reverse; } }
</style>
