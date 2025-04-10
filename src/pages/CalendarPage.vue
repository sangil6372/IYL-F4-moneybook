<!-- CalendarTest.vue -->
<template>
  <div class="container-fluid py-4 bg-light">
    <div class="row">
      <!-- 캘린더 영역 (넓은 비율) -->
      <div class="col-12 col-lg-9 mb-4">
        <div class="card shadow-sm">
          <div class="card-body">
            <FullCalendar :options="calendarOptions" :key="calendarKey" />
          </div>
        </div>
      </div>

      <!-- 우측 결제일/입력폼 영역 -->
      <div class="col-12 col-lg-3">
        <!-- 초기 상태: 다가오는 결제일 -->
        <div v-if="!selectedDate || cardStacked" class="card shadow-sm w-100">
          <div class="card-header bg-white">
            <h5 class="mb-0">
              <i class="fa-solid fa-calendar-check me-2 text-primary"></i>
              다가오는 결제일
            </h5>
          </div>
          <div class="card-body">
            <div
              v-for="item in remindFixedCost"
              :key="item.id"
              class="d-flex align-items-start mb-3 cursor-pointer"
              @click="goTransaction(item.date)"
            >
              <div
                class="d-flex align-items-center justify-content-center me-3 rounded-2"
                :class="getClass(item.date)"
                style="width: 50px; height: 50px; font-weight: bold"
              >
                {{ getDate(item.date) }}일
              </div>
              <div class="d-flex flex-column">
                <div class="fw-bold">{{ item.category }}</div>
                <div class="text-muted">
                  {{ formatDate(item.date) }},
                  {{ item.amount.toLocaleString() }}원
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- 거래 내역 보기 -->
        <div v-else-if="selectedDate && !formView" class="card shadow-sm mt-3">
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="fa-solid fa-calendar-day me-2 text-primary"></i>
              {{ selectedDate }} 거래 내역
            </h5>
            <i
              class="fa-solid fa-xmark text-secondary position-absolute"
              @click="closeForm(true)"
              style="top: 12px; right: 16px; cursor: pointer; font-size: 1.2rem"
              title="입력 닫기"
            ></i>
            <TransactionList
              :transactions="selectedDateforEach"
              @edit="editTransaction"
              @delete="storeCalendar.deleteTransaction"
            />
            <button
              class="btn btn-outline-success w-100 text-nowrap"
              @click="formView = true"
            >
              거래 추가
            </button>
          </div>
        </div>

        <!-- 거래 입력 폼 -->
        <div
          v-else-if="selectedDate && formView"
          class="card shadow-sm position-relative mt-3"
        >
          <div class="card-body">
            <h5 class="card-title mb-4">
              <i class="fa-solid fa-pen-to-square me-2 text-primary"></i>
              {{ selectedDate }} 입력
              <i
                class="fa-solid fa-xmark text-secondary position-absolute"
                @click="closeForm(false)"
                style="top: 12px; right: 16px; cursor: pointer"
              ></i>
            </h5>
            <InputForm :form="form" @save="saveForm" />
          </div>
        </div>
      </div>
    </div>
  </div>

  <div
    class="modal fade"
    id="transactionModal"
    tabindex="-1"
    aria-labelledby="transactionModalLabel"
    aria-hidden="true"
  >
    <div class="modal-dialog modal-dialog-scrollable modal-lg">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="transactionModalLabel">
            <template v-if="formView">
              <i class="fa-solid fa-calendar-day me-2 text-primary"></i>
              {{ selectedDate }} 입력
            </template>
            <template v-else>
              <i class="fa-solid fa-pen-to-square me-2 text-primary"></i>
              {{ selectedDate }} 거래 내역
            </template>
          </h5>
          <button
            type="button"
            class="btn-close"
            aria-label="Close"
            @click.stop="handleModalClose"
          ></button>
        </div>
        <div class="modal-body">
          <template v-if="formView">
            <InputForm :form="form" @save="saveForm" />
          </template>
          <template v-else>
            <TransactionList
              :transactions="selectedDateforEach"
              @edit="editTransaction"
              @delete="storeCalendar.deleteTransaction"
            />
            <button
              class="btn btn-outline-success w-100 mt-3"
              @click="
                closeForm(false);
                formView = true;
              "
            >
              거래 추가
            </button>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, nextTick, onUnmounted, watch } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import koLocale from "@fullcalendar/core/locales/ko";
// npm install date-fns 필요!
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { useCalendar } from "@/stores/calendar";
import InputForm from "@/components/InputForm.vue";
import TransactionList from "@/components/TransactionList.vue";
import { Modal } from "bootstrap";

// pinia 연결
const storeCalendar = useCalendar();
onMounted(() => {
  storeCalendar.fetchTransaction();
});

// 선택된 날짜 초기화
const selectedDate = ref(null);

// 입력창 뷰 상태 만들기
const formView = ref(false);

// 수정하기위한 id
const editId = ref(null);

// 사이드카드가 아래로 내려갔는지 확인
const cardStacked = ref(false);

onMounted(() => {
  window.addEventListener("resize", detectCardStack);
  nextTick(detectCardStack); // 초기 체크
});
onUnmounted(() => {
  window.removeEventListener("resize", detectCardStack);
});

function detectCardStack() {
  const calendarEl = document.querySelector(".col-lg-9");
  const cardEl = document.querySelector(".col-lg-3");

  if (calendarEl && cardEl) {
    const calendarTop = calendarEl.getBoundingClientRect().top;
    const cardTop = cardEl.getBoundingClientRect().top;
    cardStacked.value = cardTop > calendarTop + 20; // 20px은 여유값
  }
}

watch(cardStacked, (newVal) => {
  const el = document.getElementById("transactionModal");

  if (newVal && selectedDate.value) {
    nextTick(() => {
      if (el) {
        const modal = Modal.getInstance(el) || new Modal(el);
        modal.show();
      }
    });
  }

  if (!newVal) {
    nextTick(() => {
      if (el) {
        const modal = Modal.getInstance(el);
        modal?.hide();
      }
    });
  }

  calendarKey.value++;
});

// 입력 폼 상태
const form = ref({
  amount: "",
  type: "expense",
  category: "",
  memo: "",
  fixedCost: false,
  // 🐷 여기서 userId 받아와서 추가해줘야돼!!
  userId: "6c9d",
});

// 거래 필터링
const selectedDateforEach = computed(() => {
  return storeCalendar.transaction.filter(
    (item) => item.date === selectedDate.value
  );
});

// 기한 지났는지 확인해서 목록 출력
const remindFixedCost = computed(() => {
  return storeCalendar.fixedCostTransaction
    .filter((item) => getDate(item.date) >= 0)
    .sort((a, b) => getDate(a.date) - getDate(b.date));
});

// 모바일일때 '원' 빼기 위한 변수 선언
const calendarKey = ref(0);

/* function 들 */

// 모달 닫기 함수
function handleModalClose() {
  const el = document.getElementById("transactionModal");
  const modal = Modal.getOrCreateInstance(el);
  if (formView.value) {
    formView.value = false;
    editId.value = null;
  } else {
    modal.hide(); // 모달 닫기

    // 선택 날짜 및 상태 초기화
    closeForm(true);
  }
}

// 고정 지출 날짜 계산 후 bootstrap 넣기
function getClass(dateStr) {
  const date = getDate(dateStr);
  if (date <= 7) {
    return "bg-danger-soft fw-bold text-white";
  } else if (date <= 14) {
    return "bg-warning-soft fw-bold text-white";
  } else {
    return "bg-success-soft fw-bold text-white";
  }
}

// 오늘이랑 고정 지출일 날짜 차이 계산
function getDate(dateStr) {
  const today = new Date();
  const target = new Date(dateStr);
  const diffTime = target - today;
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

// 날짜 포맷
function formatDate(dateStr) {
  return format(new Date(dateStr), "d일", { locale: ko });
}

// 다가오는 결제일에 있는 목록 클릭시 -> 해당하는 날짜의 목록으로 이동
function goTransaction(date) {
  selectedDate.value = date;
  formView.value = false;
  editId.value = null;

  highlight(date);
  if (cardStacked.value) {
    nextTick(() => {
      const el = document.getElementById("transactionModal");
      if (el) {
        const modal = new Modal(el);
        modal.show();
      }
    });
  }
}

// 날짜 클릭시 얻어오는 것들
function handleDateClick(info) {
  closeForm(false);
  selectedDate.value = info.dateStr;
  formView.value = false;
  editId.value = null;
  highlight(info.dateStr);

  if (cardStacked.value) {
    nextTick(() => {
      const el = document.getElementById("transactionModal");
      if (el) {
        const modal = new Modal(el);
        modal.show();
      }
    });
  }
}

// 캘린더에서 클릭하면 해당 날짜 하이라이트
function highlight(dateStr) {
  removeHighlight();
  document.querySelectorAll(".fc-daygrid-day").forEach((cell) => {
    cell.classList.remove("fc-day-selected");
  });
  const target = document.querySelector(
    `.fc-daygrid-day[data-date="${dateStr}"]`
  );
  if (target) {
    target.classList.add("fc-day-selected");
  }
}

// 입력 폼 닫기
function closeForm(resetAll = false) {
  if (resetAll) {
    selectedDate.value = null;
    removeHighlight();
  }
  document.activeElement?.blur?.();
  formView.value = false;
  editId.value = null;
  form.value = {
    amount: "",
    type: "expense",
    category: "",
    memo: "",
    fixedCost: false,
    userId: "d3e6",
  };
}

function removeHighlight() {
  const prev = document.querySelector(".fc-day-selected");
  if (prev) {
    prev.classList.remove("fc-day-selected");
  }
}

// 거래 내역 추가
const saveForm = async () => {
  if (!form.value.amount || !form.value.category) {
    alert("금액과 분류는 반드시 작성해주세요.");
    return;
  }

  const newTransaction = {
    ...form.value,
    date: selectedDate.value,
    amount: parseInt(form.value.amount),
  };

  try {
    if (editId.value) {
      await storeCalendar.updateTransaction(editId.value, newTransaction);
    } else {
      await storeCalendar.addTransaction(newTransaction);
    }
    closeForm();
  } catch (error) {
    alert("에러발생:" + error);
  }
};

// 수정
const editTransaction = (item) => {
  form.value = { ...item, amount: item.amount.toString() };
  selectedDate.value = item.date;
  editId.value = item.id;
  formView.value = true;
};

// fullcalendar 사용
const calendarOptions = computed(() => ({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  eventColor: "transparent",
  locale: koLocale,
  contentHeight: 650,

  fixedWeekCount: false,

  // 상단 헤더
  headerToolbar: {
    left: "prev",
    center: "title",
    right: "next",
  },
  titleFormat: { month: "long" },

  dateClick: handleDateClick,
  // +/-를 눌러도 작동하게
  eventClick(info) {
    const clickedDate = info.event.startStr;
    handleDateClick({ dateStr: clickedDate });
  },

  events: storeCalendar.calendarEvents,
  eventContent(info) {
    const width = cardStacked.value;
    const { income, expense } = info.event.extendedProps;

    const plus = income
      ? `<div class="text-success fw-bold">+${income.toLocaleString()}${
          width ? "" : "원"
        }</div>`
      : "";
    const minus = expense
      ? `<div class="text-danger fw-bold">-${expense.toLocaleString()}${
          width ? "" : "원"
        }</div>`
      : "";

    return { html: plus + minus };
  },
  dayCellClassNames(arg) {
    const day = arg.date.getDay(); // 0: 일, 6: 토
    if (day === 0) return ["fc-day-sun"];
    if (day === 6) return ["fc-day-sat"];
    return ["fc-day-else"];
  },
}));
</script>

<style>
.fc-day-other .fc-daygrid-day-number {
  visibility: hidden;
}
/* 다가오는 결제일 색상 변경 */
.bg-danger-soft {
  background-color: #ff6384;
}

.bg-warning-soft {
  background-color: #ffce56;
}

.bg-success-soft {
  background-color: #9fdeaf;
}

/* 캘린더 전체 */
.fc {
  font-family: "Noto Sans KR", sans-serif;
  font-size: 14px;
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);
  padding: 20px;
}

/* 헤더 (제목 및 네비게이션) */
.fc-toolbar-title {
  font-size: 1.5rem;
  font-weight: 700;
}

.fc-button {
  background-color: #96dbe2;
  border: none;
  color: white;
  padding: 6px 12px;
  font-size: 14px;
  border-radius: 6px;
  transition: background-color 0.2s ease-in-out;
}

.fc-button:hover {
  background-color: #96dbe2;
}

.fc-button:disabled {
  background-color: #adb5bd;
}
.fc-daygrid-day {
  padding: 4px;
  border-radius: 12px;
  border: 1px solid #96dbe2 !important;
  transition: 0.2s ease-in-out;
}

.fc-daygrid-day:hover {
  background-color: #f1f9fb;
  box-shadow: 0 0 4px rgba(0, 0, 0, 0.1);
  cursor: pointer;
}

/* 헤더 버튼 간격 */
.fc-header-toolbar {
  margin-bottom: 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

/* 요일 헤더 색상 */
.fc-col-header-cell {
  background-color: #e9f7fd;
  padding: 10px 0;
  font-weight: 600;
  border-bottom: 1px solid #a7d0e4 !important; /* 💙 파란색 테두리 */
  border-top: 1px solid #a7d0e4 !important;
  border-left: 1px solid #a7d0e4 !important;
  border-right: 1px solid #a7d0e4 !important;
}

/* 날짜 칸 (일자 영역) */
.fc .fc-daygrid-day-number {
  font-size: 13px;
  font-weight: 600;
  margin: 2px 4px;
  color: #212529;
  text-decoration: none !important;
}
.fc .fc-day-today {
  background: transparent !important;
  border: none !important;
  box-shadow: none !important;
}
.fc .fc-daygrid-day {
  cursor: default !important;
}
/* 이벤트 카드 영역 */
.fc-event {
  font-size: 12px;
  padding: 3px 6px;
  border-radius: 10px;
  background-color: #d1ecf1;
  color: #0c5460;
  margin-top: 6px;
}

/* 요일별 색상 */
.fc-day-sun .fc-daygrid-day-number {
  color: #ff6384 !important;
}

.fc-day-sat .fc-daygrid-day-number {
  color: #36a2eb !important;
}

.fc-day-else .fc-daygrid-day-number {
  color: #6c757d !important;
}

/* 요일 헤더 (한글 요일 텍스트) */
.fc-col-header-cell.fc-day-sun .fc-col-header-cell-cushion {
  color: #ff6384 !important;
  font-weight: bold;
  text-decoration: none !important;
}

.fc-col-header-cell.fc-day-sat .fc-col-header-cell-cushion {
  color: #36a2eb !important;
  font-weight: bold;
  text-decoration: none !important;
}

.fc-col-header-cell:not(.fc-day-sat):not(.fc-day-sun)
  .fc-col-header-cell-cushion {
  color: #6c757d !important;
  font-weight: bold;
  text-decoration: none !important;
}
.fc-day-selected {
  background-color: #e0f7fa !important;
  border-radius: 12px;
  border: 2px solid #96dbe2;
}
</style>
