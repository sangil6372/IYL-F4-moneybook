<template>
    <div class="container mt-4">
      <h2 class="mb-4 text-primary">거래 내역</h2>
  
      <table class="table table-hover text-center align-middle">
        <thead class="table-dark">
          <tr>
            <th scope="col">날짜</th>
            <th scope="col">분류</th>
            <th scope="col">내용</th>
            <th scope="col">금액</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(tx, index) in transactions" :key="index">
            <td>{{ tx.date }}</td>
            <td>{{ tx.category }}</td>
            <td>{{ tx.title }}</td>
            <td :class="tx.type === '지출' ? 'text-danger' : 'text-success'">
              {{ tx.type === '지출' ? '-' : '+' }}₩{{ formatAmount(tx.amount) }}
            </td>
          </tr>
        </tbody>
      </table>
  
      <div v-if="transactions.length === 0" class="text-center text-muted mt-5">
        거래 내역이 없습니다.
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue'
  
  const transactions = ref([
    { title: '커피', date: '2025-04-05', category: '카페', amount: 4500, type: '지출' },
    { title: '급여', date: '2025-04-01', category: '수입', amount: 2300000, type: '수입' },
    { title: '편의점', date: '2025-04-02', category: '식비', amount: 2200, type: '지출' },
    { title: '배당금', date: '2025-03-30', category: '투자', amount: 52000, type: '수입' },
  ])
  
  function formatAmount(val) {
    return val.toLocaleString()
  }
  </script>
  