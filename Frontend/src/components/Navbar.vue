<script setup>
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const isMenuOpen = ref(false);
const isDropdownOpen = ref(false);

const adminName = computed(() => {
  return localStorage.getItem('admin_name') || 'Admin';
});

const logout = async () => {
  try {
    await api.logout();
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_name');
    router.push('/');
  } catch (error) {
    console.error('Logout failed:', error);
  }
};

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close dropdown when clicking outside
const handleClickOutside = (event) => {
  const userMenu = document.querySelector('.user-menu');
  if (userMenu && !userMenu.contains(event.target) && isDropdownOpen.value) {
    isDropdownOpen.value = false;
  }
};

onMounted(() => {
  // Close mobile menu when route changes
  router.afterEach(() => {
    isMenuOpen.value = false;
  });
  
  // Add click outside listener for dropdown
  document.addEventListener('click', handleClickOutside);
});

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>

<template>
  <nav class="navbar" role="navigation" aria-label="Main navigation">
    <div class="container">
      <div class="navbar-container">
        <div class="navbar-brand-container">
          <div class="logo-container">
            <div class="logo" aria-hidden="true">
              <i class="bi bi-briefcase-fill"></i>
            </div>
            <span class="logo-text">JobHub</span>
          </div>
          <button 
            class="menu-toggle" 
            type="button" 
            @click="toggleMenu"
            :aria-expanded="isMenuOpen"
            aria-controls="navbarNav"
            aria-label="Toggle navigation menu"
          >
            <i class="bi bi-list"></i>
          </button>
        </div>
        
        <div 
          class="navbar-content" 
          id="navbarNav" 
          :class="{ 'show': isMenuOpen }"
        >
          <ul class="nav-links" role="menubar">
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                :class="{ active: $route.path === '/jobs' }" 
                to="/jobs"
                role="menuitem"
              >
                <i class="bi bi-briefcase nav-icon" aria-hidden="true"></i>
                <span>Jobs</span>
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                :class="{ active: $route.path === '/candidates' }" 
                to="/candidates"
                role="menuitem"
              >
                <i class="bi bi-people nav-icon" aria-hidden="true"></i>
                <span>Candidates</span>
              </router-link>
            </li>
            <li class="nav-item" role="none">
              <router-link 
                class="nav-link" 
                :class="{ active: $route.path === '/employers' }" 
                to="/employers"
                role="menuitem"
              >
                <i class="bi bi-building nav-icon" aria-hidden="true"></i>
                <span>Employers</span>
              </router-link>
            </li>
          </ul>
          
          <div class="user-menu" @click="toggleDropdown">
            <div class="user-avatar">
              <div class="avatar-circle" aria-hidden="true">
                <span>{{ adminName.charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <div class="user-info">
              <span class="user-name">{{ adminName }}</span>
              <span class="user-role">Administrator</span>
            </div>
            <button 
              class="dropdown-toggle" 
              type="button" 
              :aria-expanded="isDropdownOpen"
              aria-label="User menu"
            >
              <i class="bi bi-chevron-down"></i>
            </button>
            
            <!-- Vue-managed dropdown instead of Bootstrap -->
            <ul 
              v-if="isDropdownOpen"
              class="dropdown-menu dropdown-menu-end show" 
              role="menu"
            >
               
              <li role="none">
                <button 
                  class="dropdown-item logout-btn" 
                  @click.stop="logout"
                  role="menuitem"
                >
                  <i class="bi bi-box-arrow-right" aria-hidden="true"></i> Logout
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </nav>
</template>

<style scoped>
/* Base Styles */
.navbar {
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  padding: 0.5rem 0;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  position: sticky;
  top: 0;
  z-index: 1000;
  backdrop-filter: blur(10px);
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
}

.navbar-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
}

/* Logo & Brand Styles */
.navbar-brand-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.logo-container {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 5px 15px rgba(59, 130, 246, 0.3);
}

.logo i {
  color: white;
  font-size: 1.2rem;
}

.logo-text {
  font-size: 1.5rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: 0.5px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

/* Menu Toggle Button */
.menu-toggle {
  display: none;
  background: transparent;
  border: none;
  color: white;
  font-size: 1.5rem;
  cursor: pointer;
  transition: color 0.2s ease;
}

.menu-toggle:hover {
  color: #3b82f6;
}

.menu-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

/* Navbar Content */
.navbar-content {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex: 1;
  margin-left: 2rem;
}

/* Navigation Links */
.nav-links {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
  gap: 0.5rem;
}

.nav-item {
  position: relative;
}

.nav-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: rgba(255, 255, 255, 0.75);
  padding: 0.75rem 1.25rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
  border-radius: 8px;
}

.nav-link:hover {
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.08);
}

.nav-link:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.nav-link.active {
  color: #ffffff;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(139, 92, 246, 0.15) 100%);
  position: relative;
}

.nav-link.active::after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 10%;
  right: 10%;
  height: 3px;
  background: linear-gradient(to right, #3b82f6, #8b5cf6);
  border-radius: 3px;
  box-shadow: 0px 0px 8px rgba(139, 92, 246, 0.6);
}

.nav-icon {
  font-size: 1.1rem;
}

/* User Menu Styles */
.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.5rem;
  background-color: rgba(255, 255, 255, 0.05);
  border-radius: 10px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  position: relative;
}

.user-menu:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.user-avatar {
  display: flex;
  align-items: center;
  justify-content: center;
}

.avatar-circle {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(139, 92, 246, 0.4);
}

.user-info {
  display: flex;
  flex-direction: column;
}

.user-name {
  color: white;
  font-weight: 500;
  font-size: 0.9rem;
  line-height: 1.2;
}

.user-role {
  color: rgba(255, 255, 255, 0.6);
  font-size: 0.75rem;
  line-height: 1.2;
}

/* Dropdown Menu */
.dropdown-toggle {
  background: transparent;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  font-size: 1rem;
  cursor: pointer;
  transition: color 0.2s ease;
  padding: 0;
  display: flex;
  align-items: center;
  margin-left: 0.5rem;
}

.dropdown-toggle:hover {
  color: white;
}

.dropdown-toggle:focus {
  outline: 2px solid #3b82f6;
  outline-offset: 2px;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  right: 0;
  z-index: 1000;
  border: none;
  background-color: #1e293b;
  border-radius: 8px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.25);
  padding: 0.5rem;
  min-width: 200px;
  margin-top: 0.5rem;
}

.dropdown-item {
  color: rgba(255, 255, 255, 0.75);
  padding: 0.75rem 1rem;
  font-size: 0.85rem;
  font-weight: 500;
  border-radius: 6px;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  transition: all 0.2s ease;
}

.dropdown-item i {
  font-size: 1rem;
  transition: transform 0.2s ease;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.dropdown-item:focus {
  outline: 2px solid #3b82f6;
  outline-offset: -2px;
  background-color: rgba(255, 255, 255, 0.08);
  color: white;
}

.dropdown-item:hover i {
  transform: translateX(3px);
}

.dropdown-divider {
  border-color: rgba(255, 255, 255, 0.1);
  margin: 0.5rem 0;
}

.logout-btn {
  color: #ef4444;
}

.logout-btn:hover {
  background-color: rgba(239, 68, 68, 0.1);
}

/* Media Queries */
@media (max-width: 992px) {
  .menu-toggle {
    display: block;
  }

  .navbar-container {
    flex-direction: column;
    align-items: flex-start;
  }

  .navbar-brand-container {
    width: 100%;
    justify-content: space-between;
    padding: 0.5rem 0;
  }

  .navbar-content {
    flex-direction: column;
    align-items: flex-start;
    margin-left: 0;
    width: 100%;
    display: none;
    margin-top: 1rem;
  }

  .navbar-content.show {
    display: flex;
  }

  .nav-links {
    flex-direction: column;
    width: 100%;
    gap: 0.25rem;
    margin-bottom: 1rem;
  }

  .nav-link {
    width: 100%;
    padding: 0.75rem 1rem;
  }

  .user-menu {
    width: 100%;
    justify-content: space-between;
    padding: 0.75rem 1rem;
  }
  
  /* Ensure dropdown is properly positioned on mobile */
  .dropdown-menu {
    position: static;
    width: 100%;
    margin-top: 0.5rem;
  }
}

@media (prefers-reduced-motion) {
  .dropdown-item i,
  .nav-link,
  .dropdown-toggle,
  .menu-toggle {
    transition: none;
  }
}

/* Import Bootstrap Icons via CDN */
@import url("https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css");
</style>