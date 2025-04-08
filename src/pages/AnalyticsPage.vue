<template>
    <!-- 컨테이너 -->
    <div class="container mt-4">

    <!-- 선택 탭 버튼 -->
    <!-- 지출 수입 이익을 골라서 종합과 차트 변경 -->
    <div class="btn-group mb-3">
      <button
        class="btn"
        :class="selectedTab === 'expense' ? 'btn-dark' : 'btn-outline-secondary'"
        @click="selectedTab = 'expense'"
      >
        지출
      </button>
      <button
        class="btn"
        :class="selectedTab === 'income' ? 'btn-dark' : 'btn-outline-secondary'"
        @click="selectedTab = 'income'"
      >
        수입
      </button>
      <button
        class="btn"
        :class="selectedTab === 'net' ? 'btn-dark' : 'btn-outline-secondary'"
        @click="selectedTab = 'net'"
      >
        이익
      </button>
    </div>

    <!-- 요약 -->
    <div class="bg-light p-3 mb-4 text-center fw-bold fs-5">
      이번 달 {{ tabLabel }}은 {{ tabAmount.toLocaleString() }}원 입니다.
    </div>

    <div class="row">
      <!-- 라인 차트 -->
      <div class="col-md-8 mb-4">
        <Line :data="lineChartData" :options="lineChartOptions" />
      </div>

      <!-- 파이 차트 -->
      <div class="col-md-4 mb-4">
        <h5 class="text-center">지출 비중</h5>
        <Doughnut :data="pieChartData" :options="pieChartOptions" />
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
const pieDataMap = ref({});
const lineDataMap = ref({});
 
// 지출 탭을 디폴트로 설정!
const selectedTab = ref('expense');

// 그래프 탭 제목
const tabLabel = computed(() =>
  selectedTab.value === 'income' ? '수입' : // income -> 수입 표시
  selectedTab.value === 'net' ? '이익' : '지출' // net -> 순이익 표시 | expense -> 지출 표시
);

// 그래프 양
const tabAmount = computed(() =>
  selectedTab.value === 'income' ? income.value : selectedTab.value === 'net' ? income.value + expense.value : expense.value
)

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
  const categoryMap = {};
  const dailyMap = {};

  // 필터링된 거래들을 조건에 따라 정리
  filtered.forEach(item => {
    // 오늘의 날짜
    const day = new Date(item.date).getDate();
    // 날짜에 따른 지출 수입 초기화
    if (!dailyMap[day]) dailyMap[day] = { income: 0, expense: 0 };
    // 지출 카테고리에 따른 지출양 초기화
    if (item.type === 'expense'){
      if (!categoryMap[item.category]) categoryMap[item.category] = 0;
    }

    // 수입이라면 총수입과 날짜에 따른 수입 기록
    if (item.type === 'income') {
      inc += item.amount;
      dailyMap[day].income += item.amount;
    }
    // 지출이라면 카테고리별 지출도 추가
    else if (item.type === 'expense') {
      exp += item.amount;
      dailyMap[day].expense += item.amount;
      // 카테고리별 지출
      categoryMap[item.category] += item.amount;
    }
  });
  // 반응형에 대입
  income.value = inc;
  expense.value = exp;
  // 차트 반응형 데이터에 대입
  pieDataMap.value = categoryMap;
  lineDataMap.value = dailyMap;
}

// 이번 달 계산 수행
analyzeThisMonth();

// 파이 차트 데이터 세팅
const pieChartData = computed(() => ({
  labels: Object.keys(pieDataMap.value),
  datasets: [
    {
      label: `지출 비중`,
      data: Object.values(pieDataMap.value),
      backgroundColor: [
        '#FF6384', '#36A2EB', '#FFCE56',
        '#4BC0C0', '#9966FF', '#FF9F40'
      ],
      hoverOffset: 10
    }
  ]
}))

const pieChartOptions = {
  responsive: true,
  layout: {
    padding: {
      bottom: 30
    }
  },
  plugins: {
    legend: {
      position: 'bottom'
    },
    tooltip: {
      callbacks: {
        label: function (context) {
          return `${context.label}: ${context.parsed}원`
        }
      }
    },
    centerText: true
  }
}

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
.btn-group .btn {
  min-width: 80px;
}
</style>