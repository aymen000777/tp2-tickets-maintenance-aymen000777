<template>
  <div class="app-shell">
    <header class="site-header">
      <RouterLink class="brand" to="/tickets" aria-label="Suivi des tickets, accueil">
        <span class="brand-mark" aria-hidden="true">T</span>
        <span>Tickets<span class="brand-period">.</span></span>
      </RouterLink>
      <nav class="site-navigation" aria-label="Navigation principale">
        <RouterLink class="header-link" to="/tickets">Tickets</RouterLink>
      </nav>
    </header>

    <main class="page-content">
      <RouterView />
    </main>
  </div>
</template>
