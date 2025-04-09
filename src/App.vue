<template>
  <div class="d-flex">
    <!-- 우측 콘텐츠 영역은 항상 flex-grow -->
    <div class="flex-grow-1 d-flex flex-column">
      <Header v-if="!isExcludedView" />
      <main class="flex-grow-1 bg-light">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onBeforeUnmount, ref, computed } from "vue";
import Header from "./components/Header.vue";
import Footer from "./components/Footer.vue";
import { useRoute } from "vue-router";

const route = useRoute();

// Nav 랑 Header 배제할 컴포넌트
const isExcludedView = computed(() => {
  const excludedPaths = ["/"];
  return excludedPaths.includes(route.path);
});
</script>
