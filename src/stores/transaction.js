/* 
거래 관련 Pinia
- axios 로 데이터 불러오기 등등 수행
*/

import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useEaxample = defineStore('counter', () => {
  const count = ref(0);
  const doubleCount = computed(() => count.value * 2);
  function increment() {
    count.value++;
  }

  return { count, doubleCount, increment };
});
