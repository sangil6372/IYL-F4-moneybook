<template>
  <div>
    <header
      class="header-bar d-flex justify-content-center align-items-center position-relative"
    >
      <!-- ✅ 모바일 전용 햄버거 버튼 (왼쪽 위 고정) -->
      <button
        class="btn btn-outline-light d-lg-none position-absolute start-0 ms-3"
        type="button"
        data-bs-toggle="offcanvas"
        data-bs-target="#mobileSidebar"
        aria-controls="mobileSidebar"
      >
        ☰
      </button>

      <!-- ✅ 로고 이미지 -->
      <img src="@/assets/logo.png" alt="Sadari Logo" class="logo-img " />
    </header>

    <!-- ✅ 모바일용 Offcanvas 메뉴 -->
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
        <RouterLink to="/transaction" class="nav-link text-white mb-2"
          >캘린더</RouterLink
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
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
height : auto;
}

</style>
