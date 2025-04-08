<template>
    <!-- 컨테이너 -->
    <div class="container mt-4">

    <!-- 상단 지표 카드 3개 -->
    <div class="d-flex justify-content-between mb-4">
      <div class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm">
        <h5>💸 지출 <strong>{{ expense.toLocaleString() }}원</strong></h5>
      </div>
      <div class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm">
        <h5>💵 수입 <strong>{{ income.toLocaleString() }}원</strong></h5>
      </div>
      <div class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm">
        <h5>🏦 이익 <strong>{{ net.toLocaleString() }}원</strong></h5>
      </div>
    </div>

    <div class="row">
      <!-- 라인 차트 -->
      <div class="col-md-8 mb-4">
        <div class="bg-white rounded shadow-sm p-3">
          <Line :data="lineChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- 도넛 차트 -->
      <div class="col-md-4">
        <div class="bg-white rounded shadow-sm p-3 h-100 d-flex flex-column justify-content-center align-items-center">
          <!-- 클릭 가능한 지출과 수입 -->
          <h6 class="mb-3">
            <span @click="selectedTab = 'expense'" :class="{ 'fw-bold': selectedTab === 'expense' }" style="cursor: pointer;">지출</span>
            <span> | </span>
            <span @click="selectedTab = 'income'" :class="{ 'fw-bold': selectedTab === 'income' }" style="cursor: pointer;">수입</span>
          </h6>
          
          <!-- 차트 -->
          <div class="position-relative" style="width: 150px; height: 150px;">
            <Doughnut :data="donutData" :options="donutOptions" />
            <span
              class="position-absolute text-center fw-bold"
              style="
              top: 50%;
              left: 50%;
              transform: translate(-50%, -25px);
              font-size: 0.8rem;"
            >
              {{ donutTotal }}
            </span>
          </div>

          <!-- 카테고리 -->
          <div class="d-flex flex-wrap justify-content-around w-100 mt-3">
            <div
              class="text-center px-2 py-1"
              v-for="(item, i) in donutLegend"
              :key="i"
              style="min-width: 80px;">
              <div :style="{ color: donutColors[i] }">
                ●
                <small>{{ item.label }}</small>
              </div>
              <small class="fw-bold">{{ item.value }}</small>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed} from 'vue'
import { useTransaction } from '@/stores/transaction'
import { Line, Doughnut } from 'vue-chartjs'
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'

// Chart.js 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement, LineElement, PointElement, CategoryScale, LinearScale);

// pinia 등록
const useStore = useTransaction();
// db.json 으로 부터 axios.get
const { fetchTransaction } = useStore;

// 지출 수입 이익
const expense = ref(0);
const income = ref(0);
const net = computed(() => income.value - expense.value);

// 카테고리별 지출 반응형 설정
const pieDataMap = ref({
  expense: {},
  income: {}
});
const lineDataMap = ref({});
 
// 지출 탭을 디폴트로 설정!
const selectedTab = ref('expense');

// 이번 달의 지출 수입 이익을 계산
const analyzeThisMonth = async () => {
  // store 갱신
  await fetchTransaction();
  // 갱신된 거래목록 가져옴
  const transaction = useStore.transaction;

  // 현재 년도와 달 계산
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  // 거래 목록 중 이번 년도 이번달인 거래만 필터링
  const filtered = transaction.filter(item => {
    const date = new Date(item.date);
    return date.getFullYear() === year && (date.getMonth() + 1) === month;
  });

  // 임시 지출, 수입 총합
  let exp = 0;
  let inc = 0;
  // 임시 차트 자료
  const categoryMap = { expense: {}, income: {} };
  const dailyMap = {};

  // 필터링된 거래들을 조건에 따라 정리
  filtered.forEach(item => {
    // 오늘의 날짜
    const day = new Date(item.date).getDate();
    // 날짜에 따른 지출 수입 초기화
    if (!dailyMap[day]) dailyMap[day] = { income: 0, expense: 0 };
    const type = item.type;

    // 카테고리 누적
    if (!categoryMap[type][item.category]) categoryMap[type][item.category] = 0;
    categoryMap[type][item.category] += item.amount;
    // 일별 누적
    dailyMap[day][type] += item.amount;
    
    if (type === 'expense') exp += item.amount;
    else if (type === 'income') inc += item.amount;
    
    // // 수입이라면 총수입과 날짜에 따른 수입 기록
    // // 지출이라면 카테고리별 지출도 추가
    // if (item.type === 'expense') {
    //   if (!categoryMap[item.category]) categoryMap[item.category] = 0
    //   exp += item.amount
    //   dailyMap[day].expense += item.amount
    //   categoryMap[item.category] += item.amount
    // }
    // else if (item.type === 'income') {
    //   inc += item.amount
    //   dailyMap[day].income += item.amount
    // }
  });
  // 반응형에 대입
  income.value = inc;
  expense.value = exp;
  // 차트 반응형 데이터에 대입
  pieDataMap.value = categoryMap;
  lineDataMap.value = dailyMap;
  console.log(pieDataMap);
}

// 이번 달 계산 수행
analyzeThisMonth();

// 도넛 색상 정의
const donutColors = ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF', '#FF9F40']

const donutLegend = computed(() => {
  const current = pieDataMap.value[selectedTab.value] || {};
  return Object.entries(current).map(([label, value], i) => ({
    label,
    value: value.toLocaleString() + '원',
    color: donutColors[i % donutColors.length]
  }))
})

const donutData = computed(() => ({
  labels: donutLegend.value.map(i => i.label),
  datasets: [
    {
      data: donutLegend.value.map(i => parseInt(i.value.replace(/[^0-9]/g, ''))),
      backgroundColor: donutLegend.value.map(i => i.color),
      hoverOffset: 10
    }
  ]
}))

// 도넛 옵션
const donutOptions = {
  responsive: true,
  layout: { padding: { bottom: 30 } },
  plugins: {
    legend: { display: false }, // 커스텀 범례로 대체
    tooltip: {
      callbacks: {
        label: context => `${context.label}: ${context.parsed.toLocaleString()}원`
      }
    }
  }
}

// 도넛 차트 금액 총합
const donutTotal = computed(() => {
  const current = pieDataMap.value[selectedTab.value] || {};
  const total = Object.values(current).reduce((a, b) => a + b, 0)
  return total.toLocaleString();
})

// 그래프 차트 데이터 세팅
const lineChartData = computed(() => {
  const labels = Object.keys(lineDataMap.value).map(day => `${day}일`)
  const incomeData = Object.values(lineDataMap.value).map(item => item.income)
  const expenseData = Object.values(lineDataMap.value).map(item => item.expense)

  return {
    labels,
    datasets: [
      {
        label: '수입',
        data: incomeData,
        borderColor: '#36a2eb',
        backgroundColor: '#36a2eb',
        tension: 0.5
      },
      {
        label: '지출',
        data: expenseData,
        borderColor: '#ff6384',
        backgroundColor: '#ff6384',
        tension: 0.4
      }
    ]
  }
})

// 그래프 옵션 세팅
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: 'top'
    },
    title: {
      display: false
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: value => `${value.toLocaleString()}원`
      }
    }
  }
}
</script>


<style scoped>
</style>