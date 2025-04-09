// stores/dashBoard.js
import { defineStore } from 'pinia';
import axios from 'axios';

export const useDashBoardStore = defineStore('dashBoard', {
  state: () => ({
    transactions: [],
  }),

  actions: {
    async fetchTransactions() {
      try {
        const response = await axios.get('http://localhost:3000/transaction');
        this.transactions = response.data;
      } catch (error) {
        console.error('데이터 불러오기 실패:', error);
      }
    },
  },
});
