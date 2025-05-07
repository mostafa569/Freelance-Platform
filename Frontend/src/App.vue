<template>
  <div class="app-container">
    <!-- Navbar will only show when authenticated -->
    <Navbar v-if="isAuthenticated" />
    
    <!-- Router view to display the current page -->
    <router-view />
  </div>
</template>

<script>
import { ref, computed, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import Navbar from './components/Navbar.vue'

export default {
  name: 'App',
  components: {
    Navbar
  },
  setup() {
    const isAuthenticated = ref(false)
    const router = useRouter()
    
    // Check authentication status
    const checkAuth = () => {
      isAuthenticated.value = !!localStorage.getItem('admin_token')
    }
    
    // Initial check
    onMounted(() => {
      checkAuth()
    })
    
    // Watch for route changes to update authentication status
    watch(() => router.currentRoute.value, () => {
      checkAuth()
    })
    
    return {
      isAuthenticated
    }
  }
}
</script>

<style>
/* Global styles */
@import url("https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css");
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");

.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>