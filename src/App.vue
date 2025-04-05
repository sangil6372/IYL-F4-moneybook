<template>
  <div class="d-flex">
    <!-- 데스크탑일 때만 NavBar를 렌더링 -->
    <NavBar v-if="!isMobile" />

    <!-- 우측 콘텐츠 영역은 항상 flex-grow -->
    <div class="flex-grow-1 d-flex flex-column min-vh-100">
      <Header />
      <main class="flex-grow-1 p-4 bg-light">
        <RouterView />
      </main>
      <!-- <Footer />  필요 없을 것 같기도도-->
    </div>
  </div>

  <!-- 모바일 전용 햄버거 버튼은 NavBar 내부에서 offcanvas로 표시됨 -->
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue'
import NavBar from './components/NavBar.vue'
import Header from './components/Header.vue'
import Footer from './components/Footer.vue'






//  임시로 모바일 사이즈 확인
const isMobile = ref(false)

function checkWindowSize() {
  isMobile.value = window.innerWidth < 992
}

onMounted(() => {
  checkWindowSize()
  window.addEventListener('resize', checkWindowSize)
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', checkWindowSize)
})
</script>
