<template>
  <div class="container-fluid">
    <header class="navbar navbar-expand-lg px-5 py-3">
      <!-- 로고 -->
      <RouterLink to="/">
        <img src="@/assets/logo2.png" alt="Logo" class="logo-img" />
      </RouterLink>

      <!-- 햄버거 버튼 -->
      <button
        class="navbar-toggler"
        type="button"
        @click="isNavOpen = !isNavOpen"
      >
        <span class="navbar-toggler-icon"></span>
      </button>

      <!-- 메뉴 (collapse 안에 넣어야 반응형 적용됨) -->
      <div class="collapse navbar-collapse" :class="{ show: isNavOpen }">
        <ul
          class="navbar-nav ms-auto gap-lg-4 gap-2 align-items-lg-center flex-column flex-lg-row mt-3 mt-lg-0"
        >
          <li class="nav-item">
            <RouterLink to="/dashboard" class="nav-link" active-class="active">
              <i class="fas fa-table me-1"></i>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/analytics" class="nav-link" active-class="active">
              <i class="fa-solid fa-chart-simple me-1"></i>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/calendar" class="nav-link" active-class="active">
              <i class="fa-solid fa-money-bill-transfer me-1"></i>
            </RouterLink>
          </li>
          <li class="nav-item">
            <RouterLink to="/profile" class="nav-link" active-class="active">
              <i class="fas fa-user me-1"></i>
            </RouterLink>
          </li>
          <li class="nav-item">
            <a
              href="#"
              class="nav-link fw-bold"
              @click.prevent="handleLogout"
              style="color: #FF6384;"
            >
              <i class="fas fa-sign-out-alt me-1"></i>
            </a>
          </li>
        </ul>
      </div>
    
  </header>

  </div>
  
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";

const router = useRouter();
const authStore = useAuthStore();

const isNavOpen = ref(false);

const handleLogout = () => {
  const confirmed = confirm("로그아웃 하시겠습니까?");
  if (confirmed) {
    authStore.logout();
    router.push("/");
  }
};
</script>

<style scoped>
.nav-link {
  font-weight: 500;
  color: #333;
  transition: 0.2s;
}

.nav-link.active,
.nav-link:hover {
  color: #1790a0;
}

.navbar-toggler {
  border: none;
}

.navbar-toggler-icon {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 30 30'%3e%3cpath stroke='rgba%280, 0, 0, 0.5%29' stroke-width='2' d='M4 7h22M4 15h22M4 23h22'/%3e%3c/svg%3e");
}

.logo-img {
  width: 200px;
}
</style>
