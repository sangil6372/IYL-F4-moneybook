/* 캘린더에서 사용할 pinia */

import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";

export const useCalender = defineStore("transaction", () => {
  //state
  const BASEURI = "api/transaction";
  const state = reactive({ transaction: [] });
});
