<template>
  <section class="not-found">
    <p class="eyebrow">ERREUR 404</p>
    <h1>Page introuvable<span class="heading-period">.</span></h1>
    <p class="page-intro">Cette page n’existe pas ou a été déplacée.</p>
    <RouterLink class="button button-primary" to="/tickets">Retour à la liste</RouterLink>
  </section>
</template>

<style scoped>
.not-found { max-width: 700px; margin: 72px auto; text-align: center; }
.eyebrow { color: var(--green); font-size: 11px; font-weight: 800; letter-spacing: .14em; }
h1 { margin: 10px 0; color: var(--ink); font-size: clamp(30px, 5vw, 42px); letter-spacing: -.045em; }
.heading-period { color: var(--coral); }
.page-intro { margin-bottom: 24px; color: var(--muted); }
.button { display: inline-flex; min-height: 42px; align-items: center; padding: 0 16px; border-radius: 8px; background: var(--green); color: #fff; font-size: 13px; font-weight: 750; text-decoration: none; }
</style>
