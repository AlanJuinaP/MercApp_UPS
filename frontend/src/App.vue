<template>
  <div>
    <nav
      style="
        background:#222;
        color:white;
        padding:12px;
        display:flex;
        gap:20px;
      "
    >
      <RouterLink to="/" style="color:white;">Inicio</RouterLink>
      <RouterLink to="/cart" style="color:white;">Carrito</RouterLink>
      <RouterLink to="/about" style="color:white;">Acerca de</RouterLink>
    </nav>

    <main style="padding:20px;">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
</script>
