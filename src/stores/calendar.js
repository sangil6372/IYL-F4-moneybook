/* 캘린더에서 사용할 pinia */

import { ref, reactive, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

// 🐷 userID 쓰기 위해 피니아 임포트
import { useAuthStore } from "@/stores/auth";

export const useCalendar = defineStore("transaction", () => {
  //state
  const BASEURI = "/api/transaction";
  const state = reactive({ transaction: [] });
  const authStore = useAuthStore();

  //getter
  const transaction = computed(() => state.transaction);
  const totalTransaction = computed(() => state.transaction.length);

  const fixedCostTransaction = computed(() =>
    transaction.value.filter(
      (item) => item.fixedCost === "true" && item.type === "expense"
    )
  );

  // actions
  // 거래 목록 db.json에서 다시 받아오기
  const fetchTransaction = async () => {
    try {
      // 🐷 reponse -> response
      const response = await axios.get(BASEURI);

      // 🐷 userId 가져오기
      const userId = authStore.user.id;

      // 🐷 성공적으로 가져오면 state 에 넣기
      if (response.status === 200) {
        // 🐷 userId 에 따라서 거래목록을 필터링
        const userTransaction = response.data.filter((item) => {
          return item.userId === userId;
        });
        // 🐷 필터링된 거래 목록 state에 넣기
        state.transaction = userTransaction;
        // totalTransaction.value = state.transaction.length;
        console.log("거래 목록 가져오기");
      } else {
        alert("거래 목록 조회 실패");
      }
    } catch (error) {
      alert("에러발생:" + error);
    }
  };

  // 캘린더 events 넣기
  const calendarEvents = computed(() => {
    const total = {};
    transaction.value.forEach((item) => {
      const date = item.date;
      if (!total[date]) {
        total[date] = { income: 0, expense: 0 };
      }
      if (item.type == "income") {
        total[date].income += item.amount;
      } else {
        total[date].expense += item.amount;
      }
    });

    return Object.entries(total).map(([date, { income, expense }]) => ({
      date,
      income,
      expense,
    }));
  });

  const addTransaction = async (item) => {
    try {
      await axios.post(BASEURI, { ...item });
      await fetchTransaction();
    } catch (error) {
      alert("에러발생:" + error);
    }
  };

  const deleteTransaction = async (id) => {
    try {
      await axios.delete(`${BASEURI}/${id}`);
      await fetchTransaction();
    } catch (error) {
      alert("에러발생:" + error);
    }
  };

  const updateTransaction = async (id, updateData) => {
    try {
      await axios.put(`${BASEURI}/${id}`, updateData);
      await fetchTransaction();
    } catch (error) {
      alert("에러발생:" + error);
    }
  };

  return {
    totalTransaction,
    transaction,
    calendarEvents,
    fetchTransaction,
    addTransaction,
    deleteTransaction,
    updateTransaction,
    fixedCostTransaction,
  };
});
