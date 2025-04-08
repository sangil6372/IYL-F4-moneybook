<template>
  <div>
    <header
      class="header-bar d-flex justify-content-center align-items-center position-relative"
    >
      <!-- 로고 -->
      <img src="@/assets/logo.png" alt="Logo" class="logo-img" />

      <!-- 로그아웃 버튼 (우측 끝) -->
      <button
        class="btn btn-danger btn-outline-dark position-absolute end-0 me-3 fw-bold bg-gradient text-white"
        @click="handleLogout"
      >
        로그아웃
      </button>
    </header>

    <!-- 모바일용 Offcanvas 메뉴 -->
    <div
      class="offcanvas offcanvas-start text-white custom-offcanvas"
      tabindex="-1"
      id="mobileSidebar"
      aria-labelledby="offcanvasSidebarLabel"
    >
      <div class="offcanvas-header">
        <h5 class="offcanvas-title" id="offcanvasSidebarLabel">메뉴</h5>
        <button
          type="button"
          class="btn-close btn-close-white"
          data-bs-dismiss="offcanvas"
          aria-label="Close"
        ></button>
      </div>
      <div class="offcanvas-body">
        <RouterLink to="/" class="nav-link text-white mb-2">홈</RouterLink>
        <RouterLink to="/calendar" class="nav-link text-white mb-2"
          >캘린더</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import { RouterLink, useRouter } from "vue-router";

const authStore = useAuthStore();
const router = useRouter();

function handleLogout() {
  authStore.logout();
  router.push("/"); // 또는 { name: 'home' }
}
</script>

<style scoped>
.header-bar {
  background-color: rgb(255, 255, 255);
  height: 120px;
}

/* Offcanvas 설정 */
.custom-offcanvas {
  --bs-offcanvas-width: auto;
  max-width: 80vw;
  background-color: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(4px);
}

img {
  width: 400px;
  height: auto;
}
</style>
