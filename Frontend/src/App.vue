<script setup>
import Router from "./routers/index";
import Nav from "./components/nav.vue";
</script>

<template>
  <div>
    <Nav />
    <RouterView />
  </div>
</template>

<style scoped></style>
