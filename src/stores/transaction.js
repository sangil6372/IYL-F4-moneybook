/* 
거래 관련 Pinia
- axios 로 데이터 불러오기 등등 수행
*/

import { ref, reactive, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useTransaction = defineStore('transaction', () => {
  // state
  const BASEURI = '/api/transaction';
  const states = reactive({ transaction: [] });

  // getter
  // computed로 관리되는 거래 목록
  const transaction = computed(() => states.transaction);

  // actions
  // 거래 목록 db.json에서 다시 받아오기
  const fetchTransaction = async () => {
    try {
      const response = await axios.get(BASEURI);
      if (response.status === 200) {
        states.transaction = response.data;
        console.log('거래 목록 갱신 완료');
      } else {
        alert('거래 목록 조회 실패');
      }
    } catch (error) {
      alert('에러발생 :' + error);
    }
  };

  // 거래 추가 메소드,,, 추후 추가
  const addTransaction = async () => {

  };
  
  return { transaction, fetchTransaction };
});
