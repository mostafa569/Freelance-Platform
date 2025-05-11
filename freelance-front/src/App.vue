<template>
  <div id="app">
  
    <Navbar v-if="showNavbar" />
    <div class="container mt-4">
      <router-view />
    </div>
  </div>
</template>

<script>
import Navbar from './components/layout/Navbar.vue';

export default {
  name: "App",
  components: {
    Navbar,
  },
  computed: {
    showNavbar() {
       
      const hiddenRoutes = ["/login", "/register"];
      return !hiddenRoutes.includes(this.$route.path);
    }
  },
  watch: {
  
    $route() {
      
    }
  }
};
</script>
