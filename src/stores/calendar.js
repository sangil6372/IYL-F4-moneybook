/* 캘린더에서 사용할 pinia */

import { reactive, computed } from "vue";
import { defineStore } from "pinia";
import axios from "axios";

export const useCalendar = defineStore("transaction", () => {
  //state
  const BASEURI = "/api/transaction";
  const state = reactive({ transaction: [] });

  //getter
  const transaction = computed(() => state.transaction);

  // actions
  const fetchTransaction = async () => {
    try {
      const reponse = await axios.get(BASEURI);
      state.transaction = reponse.data;
      console.log("거래 목록 가져오기");
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
    transaction,
    fetchTransaction,
    calendarEvents,
    addTransaction,
    deleteTransaction,
    updateTransaction,
  };
});
