<template>
  <!-- 컨테이너 -->
  <div class="container mt-4">
    <!-- 상단 지표 카드 3개 -->
    <div class="d-flex justify-content-between mb-4">
      <div
        class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm card-hover"
      >
        <h5>
          💸 지출 <strong>{{ displayExpense.toLocaleString() }}원</strong>
        </h5>
      </div>
      <div
        class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm card-hover"
      >
        <h5>
          💵 수입 <strong>{{ displayIncome.toLocaleString() }}원</strong>
        </h5>
      </div>
      <div
        class="flex-fill text-center bg-light mx-2 py-3 rounded shadow-sm card-hover"
      >
        <h5>
          🏦 이익 <strong>{{ displayNet.toLocaleString() }}원</strong>
        </h5>
      </div>
    </div>
    <div>
      <button
        class="btn me-2 fs-5 border-2 shadow-sm"
        :class="{
          'btn-primary': goalTab === 'month',
          'btn-outline-primary': goalTab !== 'month',
        }"
        @click="goalTab = 'month'"
      >
        이번 달
      </button>
      <button
        class="btn fs-5 border-2 shadow-sm"
        :class="{
          'btn-primary': goalTab === 'year',
          'btn-outline-primary': goalTab !== 'year',
        }"
        @click="goalTab = 'year'"
      >
        올해
      </button>
    </div>
    <div class="row">
      <div class="col-md-8">
        <div
          class="bg-ㅈ rounded shadow-sm p-4 h-100 d-flex flex-column justify-content-center align-items-center text-center"
        >
          <h4 class="mb-3">{{ spendingHeadline }}</h4>
          <p class="fs-5 fw-bold">{{ spendingPersonality }}</p>
        </div>
      </div>

      <div class="col-md-4">
        <div class="bg-white rounded shadow-sm p-4 h-100">
          <h6>📢 지출 분석 요약</h6>
          <p>{{ summaryTotalText }}</p>
          <h6 class="mt-3">📂 카테고리별 요약</h6>
          <pre style="white-space: pre-wrap">{{ summaryCategoryText }}</pre>
        </div>
      </div>
    </div>

    <div class="row mt-4">
      <!-- 목표 (상일) -->
      <!-- 총 지출 vs 목표 -->
      <div class="col-md-6 mb-4">
        <div class="bg-white rounded shadow-sm p-3 h-100">
          <h6 class="mb-3">📊 총 지출 vs 목표</h6>
          <Bar
            v-if="goalTab === 'month'"
            :data="horizontalBarDataMonth"
            :options="horizontalBarOptions"
          />
          <Bar
            v-else
            :data="horizontalBarDataYear"
            :options="horizontalBarOptions"
          />
        </div>
      </div>

      <!-- 카테고리별 -->
      <div class="col-md-6 mb-4">
        <div class="bg-white rounded shadow-sm p-3 h-100">
          <h6 class="mb-3">📊 카테고리별 지출 vs 목표</h6>
          <Bar
            v-if="goalTab === 'month'"
            :data="categoryBarDataMonth"
            :options="horizontalBarOptions"
            style="height: 300px"
          />
          <Bar
            v-else
            :data="categoryBarDataYear"
            :options="horizontalBarOptions"
            style="height: 300px"
          />
        </div>
      </div>
    </div>

    <h5
      class="mb-3 px-3 py-2 bg-primary bg-opacity-10 text-primary rounded d-inline-block"
    >
      📆 최근 일주일 소비 성향
    </h5>
    <div class="row">
      <!-- 라인 차트 -->
      <div class="col-md-8 mb-4">
        <div class="bg-white rounded shadow-sm p-3">
          <Line :data="lineChartData" :options="lineChartOptions" />
        </div>
      </div>

      <!-- 도넛 차트 -->
      <div class="col-md-4">
        <div
          class="bg-white rounded shadow-sm p-3 h-100 d-flex flex-column justify-content-center align-items-center"
        >
          <!-- 클릭 가능한 지출과 수입 -->
          <h6 class="mb-3">
            <span
              @click="selectedTab = 'expense'"
              :class="{ 'fw-bold': selectedTab === 'expense' }"
              style="cursor: pointer"
              >지출</span
            >
            <span> | </span>
            <span
              @click="selectedTab = 'income'"
              :class="{ 'fw-bold': selectedTab === 'income' }"
              style="cursor: pointer"
              >수입</span
            >
          </h6>

          <!-- 차트 -->
          <div class="position-relative" style="width: 150px; height: 150px">
            <Doughnut :data="donutData" :options="donutOptions" />
            <span
              class="position-absolute text-center fw-bold"
              style="
                top: 50%;
                left: 50%;
                transform: translate(-50%, -25px);
                font-size: 0.8rem;
              "
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
              style="min-width: 80px"
            >
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
import { ref, computed } from "vue";
// 🐷 이름 나중에 바꾸기
import { useCalendar } from "@/stores/calendar";
import { Line, Doughnut } from "vue-chartjs";
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
} from "chart.js";

// Chart.js 등록
ChartJS.register(
  Title,
  Tooltip,
  Legend,
  ArcElement,
  LineElement,
  PointElement,
  CategoryScale,
  LinearScale
);

// pinia 등록
// 🐷 이름 나중에 바꾸기
const useStore = useCalendar();
// db.json 으로 부터 axios.get
const { fetchTransaction } = useStore;

// 지출 수입 이익
const expense = ref(0);
const income = ref(0);
const net = computed(() => income.value - expense.value);

// 카테고리별 지출 반응형 설정
const pieDataMap = ref({
  expense: {},
  income: {},
});
const lineDataMap = ref({});

// 지출 탭을 디폴트로 설정!
const selectedTab = ref("expense");

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
  const filtered = transaction.filter((item) => {
    const date = new Date(item.date);
    return date.getFullYear() === year && date.getMonth() + 1 === month;
  });

  // 임시 지출, 수입 총합
  let exp = 0;
  let inc = 0;
  // 임시 차트 자료
  const categoryMap = { expense: {}, income: {} };
  const dailyMap = {};

  // 필터링된 거래들을 조건에 따라 정리
  filtered.forEach((item) => {
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

    if (type === "expense") exp += item.amount;
    else if (type === "income") inc += item.amount;
  });

  // 반응형에 대입
  income.value = inc;
  expense.value = exp;
  // 차트 반응형 데이터에 대입
  pieDataMap.value = categoryMap;
  lineDataMap.value = dailyMap;
  console.log(pieDataMap);
};

// 이번 달 계산 수행
// analyzeThisMonth(); <- (상일) 이거 문제인가 싶어서 onMounted에 옮김김

// 도넛 색상 정의
const donutColors = [
  "#FF6384",
  "#36A2EB",
  "#FFCE56",
  "#4BC0C0",
  "#9966FF",
  "#FF9F40",
];

const donutLegend = computed(() => {
  const current = pieDataMap.value[selectedTab.value] || {};
  return Object.entries(current).map(([label, value], i) => ({
    label,
    value: value.toLocaleString() + "원",
    color: donutColors[i % donutColors.length],
  }));
});

const donutData = computed(() => ({
  labels: donutLegend.value.map((i) => i.label),
  datasets: [
    {
      data: donutLegend.value.map((i) =>
        parseInt(i.value.replace(/[^0-9]/g, ""))
      ),
      backgroundColor: donutLegend.value.map((i) => i.color),
      hoverOffset: 10,
    },
  ],
}));

// 도넛 옵션
const donutOptions = {
  responsive: true,
  layout: { padding: { bottom: 30 } },
  plugins: {
    legend: { display: false }, // 커스텀 범례로 대체
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.label}: ${context.parsed.toLocaleString()}원`,
      },
    },
  },
};

// 도넛 차트 금액 총합
const donutTotal = computed(() => {
  const current = pieDataMap.value[selectedTab.value] || {};
  const total = Object.values(current).reduce((a, b) => a + b, 0);
  return total.toLocaleString();
});

// 그래프 차트 데이터 세팅
const lineChartData = computed(() => {
  const labels = Object.keys(lineDataMap.value).map((day) => `${day}일`);
  const incomeData = Object.values(lineDataMap.value).map(
    (item) => item.income
  );
  const expenseData = Object.values(lineDataMap.value).map(
    (item) => item.expense
  );

  return {
    labels,
    datasets: [
      {
        label: "수입",
        data: incomeData,
        borderColor: "#36a2eb",
        backgroundColor: "#36a2eb",
        tension: 0.5,
      },
      {
        label: "지출",
        data: expenseData,
        borderColor: "#ff6384",
        backgroundColor: "#ff6384",
        tension: 0.4,
      },
    ],
  };
});

// 그래프 옵션 세팅
const lineChartOptions = {
  responsive: true,
  plugins: {
    legend: {
      position: "top",
    },
    title: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: (value) => `${value.toLocaleString()}원`,
      },
    },
  },
};

// 상일 코드 (구별하기 위해 아래에 작성함)
import { useAuthStore } from "@/stores/auth";
import { BarElement, BarController } from "chart.js";
import { Bar } from "vue-chartjs";
import { watchEffect } from "vue";
import { onMounted } from "vue";

ChartJS.register(BarElement, BarController);

const authStore = useAuthStore();
const user = computed(() => authStore.user);

// 연간 지출 데이터
const yearlyExpense = ref(0);

// 실제 지출: 이번 달 / 올해 (기존 analyze 함수에서 계산된 값을 사용)
const actualThisMonth = expense; // ref(0)로 선언되어 있음
const actualThisYear = yearlyExpense; // 위에서 새로 선언한 연간 지출

// 목표 지출: 이번 달 / 올해 (user 상태에서 추출)
const goalThisMonth = computed(() => user.value?.goals?.month?.total || 0);
const goalThisYear = computed(() => user.value?.goals?.year?.total || 0);

// "연간" 전체 지출 계산 함수 (올해의 전체 expense 총합을 계산)
const analyzeThisYear = async () => {
  await fetchTransaction();
  const transaction = useStore.transaction;
  const year = new Date().getFullYear();

  let totalExp = 0;
  let totalInc = 0;

  transaction.forEach((item) => {
    const date = new Date(item.date);
    if (date.getFullYear() === year) {
      if (item.type === "expense") totalExp += item.amount;
      if (item.type === "income") totalInc += item.amount;
    }
  });

  yearlyExpense.value = totalExp;
  yearlyIncome.value = totalInc;
};

// 페이지 로드 시 바로 연간 계산 수행 <-- 이거 다르게 해야 하나?
onMounted(async () => {
  await fetchTransaction();
  const transaction = useStore.transaction;

  analyzeThisMonth(transaction);
  analyzeThisYear(transaction);
  analyzeCategoryThisYear(transaction);
});

// 막대 차트 옵션 (공통 사용)
const horizontalBarOptions = {
  responsive: true,
  indexAxis: "y", // ← 가로 막대 차트로 설정 (세로가 아니라 좌우 막대)
  plugins: {
    legend: { position: "top" }, // 범례 상단
    tooltip: {
      callbacks: {
        label: (context) =>
          `${context.dataset.label}: ${context.raw.toLocaleString()}원`,
      },
    },
  },
  scales: {
    x: {
      beginAtZero: true, // y축 0부터 시작
      ticks: {
        callback: (value) => `${value.toLocaleString()}원`,
      },
    },
  },
};

// 막대 차트 생성 유틸 함수 (실제 vs 목표 한 쌍으로 구성된 차트 생성)
const createBarData = (actual, goal, label) => ({
  labels: [label], // x축에 보여질 단일 라벨 (ex. "이번 달", "올해")
  datasets: [
    {
      label: "실제 지출",
      data: [actual],
      backgroundColor: "#ff6384", // 빨간색
    },
    {
      label: "목표 지출",
      data: [goal],
      backgroundColor: "#cccccc", // 회색
    },
  ],
});

// 실제로 사용할 차트 데이터 두 개 (이번 달용 / 올해용)
const horizontalBarDataMonth = computed(() =>
  createBarData(actualThisMonth.value, goalThisMonth.value, "이번 달")
);
const horizontalBarDataYear = computed(() =>
  createBarData(actualThisYear.value, goalThisYear.value, "올해")
);

// 디버깅용
watchEffect(() => {
  console.log("✅ 이번 달 지출:", actualThisMonth.value);
  console.log("🎯 이번 달 목표:", goalThisMonth.value);
  console.log("✅ 올해 지출:", actualThisYear.value);
  console.log("🎯 올해 목표:", goalThisYear.value);
});

//  카테 고리별 시각화
const yearlyCategoryExpenseMap = ref({});

// 연간 카테고리별 실제 지출 계산 함수
const analyzeCategoryThisYear = (transaction) => {
  const year = new Date().getFullYear();
  const userId = user.value?.id;
  const result = {};

  transaction.forEach((item) => {
    const date = new Date(item.date);
    if (
      item.userId === userId &&
      date.getFullYear() === year &&
      item.type === "expense"
    ) {
      if (!result[item.category]) result[item.category] = 0;
      result[item.category] += item.amount;
    }
  });

  yearlyCategoryExpenseMap.value = result;
};

// 목표로 지정된 카테고리만 포함
const createCategoryBarData = (actualMap, goalMap) => {
  const goalCategories = Object.keys(goalMap);

  return {
    labels: goalCategories,
    datasets: [
      {
        label: "실제 지출",
        backgroundColor: "#ff6384",
        data: goalCategories.map((cat) => actualMap[cat] || 0),
      },
      {
        label: "목표 지출",
        backgroundColor: "#cccccc",
        data: goalCategories.map((cat) => goalMap[cat] || 0),
      },
    ],
  };
};

// 컴포넌트용 데이터 바인딩
const categoryBarDataMonth = computed(() =>
  createCategoryBarData(
    pieDataMap.value.expense || {},
    user.value?.goals?.month?.categories || {}
  )
);

const categoryBarDataYear = computed(() =>
  createCategoryBarData(
    yearlyCategoryExpenseMap.value || {},
    user.value?.goals?.year?.categories || {}
  )
);

// 달 <-> 년 change 용 토글
const goalTab = ref("month"); // 또는 "year"

//  총 지출 vs 목표 분석 텍스트
const summaryTotalText = computed(() => {
  const actual =
    goalTab.value === "month" ? actualThisMonth.value : actualThisYear.value;
  const goal =
    goalTab.value === "month" ? goalThisMonth.value : goalThisYear.value;
  const period = goalTab.value === "month" ? "이번 달" : "올해";

  if (!goal) return `${period} 목표 지출이 설정되어 있지 않습니다.`;

  const diff = actual - goal;
  const rate = Math.round((actual / goal) * 100);

  if (diff > 0) {
    return `💥 ${period} 지출이 목표보다 ${diff.toLocaleString()}원 많습니다. (${rate}% 사용)`;
  } else if (diff < 0) {
    return `✅ ${period} 지출이 목표보다 ${Math.abs(
      diff
    ).toLocaleString()}원 적습니다. (${rate}% 사용)`;
  } else {
    return `🎯 ${period} 지출이 목표와 정확히 일치합니다.`;
  }
});

const summaryCategoryText = computed(() => {
  const goalMap =
    goalTab.value === "month"
      ? user.value?.goals?.month?.categories || {}
      : user.value?.goals?.year?.categories || {};

  const actualMap =
    goalTab.value === "month"
      ? pieDataMap.value.expense || {}
      : yearlyCategoryExpenseMap.value || {};

  const results = [];

  Object.keys(goalMap).forEach((cat) => {
    const goal = goalMap[cat];
    const actual = actualMap[cat] || 0;

    if (goal === 0) return; // 목표가 없으면 제외

    const diff = actual - goal;
    const rate = Math.round((actual / goal) * 100);

    if (diff > 0) {
      results.push(
        `📈 [${cat}] 목표보다 ${diff.toLocaleString()}원 초과 (${rate}%)`
      );
    } else if (diff < 0) {
      results.push(
        `📉 [${cat}] 목표보다 ${Math.abs(
          diff
        ).toLocaleString()}원 절약 (${rate}%)`
      );
    } else {
      results.push(`🎯 [${cat}] 목표와 동일`);
    }
  });

  return results.length
    ? results.join("\n")
    : "📊 설정된 카테고리 목표가 없습니다.";
});

// 소비 성향 분석 텍스트
const categoryMessages = {
  식비: "🍱 배는 부르셨나요? 맛있게 드셨다면 됐죠!",
  의료: "💊 병원비가 많았네요. 쾌차하시길 바랍니다 🙏",
  교통: "🚌 오늘도 출퇴근길에 모험을 하셨군요!",
  여가: "🎮 놀 때는 제대로! 인생은 즐기는 거니까요 😎",
  통신: "📱 데이터 폭탄 맞으셨나요? 요금제 점검도 한 번!",
  기타: "📦 예측불허의 소비! 다음 달엔 정체를 밝혀보아요~",
};

const spendingPersonality = computed(() => {
  const actualMap =
    goalTab.value === "month"
      ? pieDataMap.value.expense || {}
      : yearlyCategoryExpenseMap.value || {};

  const goalMap =
    goalTab.value === "month"
      ? user.value?.goals?.month?.categories || {}
      : user.value?.goals?.year?.categories || {};

  // 기타 제외
  const filtered = Object.entries(actualMap).filter(([cat]) => cat !== "기타");

  if (filtered.length === 0) return "📭 이번 기간엔 소비 기록이 없어요.";

  // 가장 지출 많은 항목
  const [topCategory, topAmount] = filtered.reduce((max, curr) =>
    curr[1] > max[1] ? curr : max
  );

  const customMsg =
    categoryMessages[topCategory] || `🧐 [${topCategory}]에 소비가 집중됐어요!`;

  return `${customMsg}`;
});

// 멘트 체인지
const spendingHeadline = computed(() => {
  return goalTab.value === "month"
    ? "🧠 이번 달 소비 성향은?"
    : "🧠 올해 소비 성향은?";
});

// 상단 지출 수입 이익도 계산해서 적용
const displayExpense = computed(() =>
  goalTab.value === "month" ? expense.value : yearlyExpense.value
);

const displayIncome = computed(() =>
  goalTab.value === "month" ? income.value : yearlyIncome.value
);

const displayNet = computed(() => displayIncome.value - displayExpense.value);

// 연간 수입도 필요해서 추가
const yearlyIncome = ref(0);
</script>

<style scoped>
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.2s ease;
}

.card-hover:hover {
  transform: translateY(-6px);
  box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
}
</style>
