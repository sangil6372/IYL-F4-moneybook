<!-- CalendarTest.vue -->
<template>
  <div class="d-flex p-4 bg-light" style="min-height: 100vh">
    <!-- 달력 부분 -->
    <div class="flex-grow-1">
      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- 우측 영역 (결제일 or 입력 폼) -->
    <div class="container w-25 ms-4">
      <!-- 날짜 선택이 안될 경우 (초기상태) -->
      <div v-if="!selectedDate" class="card shadow-sm">
        <div class="card-header bg-white">
          <h5 class="mb-0">
            <i class="fa-solid fa-calendar-check me-2 text-primary"></i>
            다가오는 결제일
          </h5>
        </div>
        <div class="card-body">
          <!-- 항목 1: 빨강 -->
          <div
            class="d-flex align-items-center mb-3 border-start border-danger border-4 ps-3"
          >
            <div class="flex-grow-1">
              <div class="fw-bold">넷플릭스</div>
              <small class="text-muted">10일, 13,900원</small>
            </div>
          </div>
          <!-- 항목 2: 주황 -->
          <div
            class="d-flex align-items-center mb-3 border-start border-warning border-4 ps-3"
          >
            <div class="flex-grow-1">
              <div class="fw-bold">유튜브 프리미엄</div>
              <small class="text-muted">20일, 13,900원</small>
            </div>
          </div>
          <!-- 항목 3: 초록 -->
          <div
            class="d-flex align-items-center mb-1 border-start border-success border-4 ps-3"
          >
            <div class="flex-grow-1">
              <div class="fw-bold">월세</div>
              <small class="text-muted">25일, 700,000원</small>
            </div>
          </div>
        </div>
      </div>

      <!-- 날짜 선택이 됨 (목록 및 추가 기능 )  -->
      <div v-else-if="selectedDate && !formView" class="card shadow-sm mt-3">
        <div class="card-body">
          <h5 class="card-title mb-4">
            <i class="fa-solid fa-calendar-day me-2 text-primary"></i>
            {{ selectedDate }} 거래 내역
          </h5>
          <!-- X 아이콘 -->
          <i
            class="fa-solid fa-xmark text-secondary"
            @click="closeForm(true)"
            style="
              position: absolute;
              top: 12px;
              right: 16px;
              cursor: pointer;
              font-size: 1.2rem;
            "
            title="입력 닫기"
          ></i>

          <!-- 리스트 보여주기 -->
          <ul class="list-group mb-3" v-if="selectedDateforEach.length">
            <li
              v-for="item in selectedDateforEach"
              :key="item.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <span
                  :class="
                    item.type === 'income' ? 'text-success' : 'text-danger'
                  "
                  class="fw-bold"
                >
                  {{ item.type === "income" ? "+" : "-"
                  }}{{ item.amount.toLocaleString() }}원
                </span>
                <span class="text-muted ms-2">{{ item.category }}</span>
              </div>
              <div>
                <button
                  class="btn btn-sm btn-outline-primary me-2"
                  @click="editTransaction(item)"
                >
                  수정
                </button>
                <button
                  class="btn btn-sm btn-outline-danger"
                  @click="storeCalendar.deleteTransaction(item.id)"
                >
                  삭제
                </button>
              </div>
            </li>
          </ul>

          <!-- 추가 버튼 -->
          <button
            class="btn btn-outline-success w-100"
            @click="formView = true"
          >
            거래 추가
          </button>
        </div>
      </div>

      <div
        v-else-if="selectedDate && formView"
        class="card shadow-sm position-relative mt-3"
      >
        <div class="card-body">
          <h5 class="card-title mb-4">
            <i class="fa-solid fa-pen-to-square me-2 text-primary"></i>
            {{ selectedDate }} 입력
            <i
              class="fa-solid fa-xmark text-secondary"
              @click="closeForm(false)"
              style="
                position: absolute;
                top: 12px;
                right: 16px;
                cursor: pointer;
              "
              title="입력 닫기"
            ></i>
          </h5>

          <div class="mb-3">
            <label for="amount" class="form-label">금액</label>
            <div class="input-group">
              <input
                id="amount"
                type="number"
                class="form-control"
                v-model="form.amount"
                placeholder="0"
              />
              <span class="input-group-text">원</span>
            </div>
          </div>

          <div class="mb-3">
            <label class="form-label d-block">분류</label>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="income"
                value="income"
                v-model="form.type"
              />
              <label class="form-check-label" for="income">수입</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="expense"
                value="expense"
                v-model="form.type"
              />
              <label class="form-check-label" for="expense">지출</label>
            </div>
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">카테고리</label>
            <select
              id="category"
              class="form-select"
              v-model="form.category"
              placeholder="예: 식비, 교통비, 구독 등"
            >
              <option disabled value="">카테고리를 선택하세요</option>
              <option>식비</option>
              <option>의료</option>
              <option>교통</option>
              <option>여가</option>
              <option>통신</option>
              <option>급여</option>
              <option>기타</option>
            </select>
          </div>

          <div class="mb-3">
            <label for="memo" class="form-label">메모</label>
            <textarea
              id="memo"
              class="form-control"
              rows="2"
              v-model="form.memo"
              placeholder="자세한 내용을 입력해 주세요"
            ></textarea>
          </div>

          <button class="btn btn-success w-100" @click="saveForm">
            <i class="fa-solid fa-floppy-disk me-2"></i>
            저장
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

import { useCalendar } from "@/stores/calendar";

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

// 입력 폼 상태
const form = ref({
  amount: "",
  type: "expense",
  category: "",
  memo: "",
});

// 거래 필터링
const selectedDateforEach = computed(() => {
  return storeCalendar.transaction.filter(
    (item) => item.date === selectedDate.value
  );
});

/* function 들 */

// 날짜 클릭시 얻어오는 것들
function handleDateClick(info) {
  selectedDate.value = info.dateStr;
  formView.value = false;
  editId.value = null;
}

// 입력 폼 닫기
function closeForm(resetAll = false) {
  if (resetAll) {
    selectedDate.value = null; // 다가오는 결제일로 돌아감
  }
  formView.value = false;
  editId.value = null;
  form.value = {
    amount: "",
    type: "expense",
    category: "",
    memo: "",
  };
}

// 거래 내역 추가
const saveForm = async () => {
  if (!form.value.amount || !form.value.type) {
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
  // +/-를 눌러도 작동하게
  eventClick(info) {
    const clickedDate = info.event.startStr;
    handleDateClick({ dateStr: clickedDate });
  },

  dateClick: handleDateClick,
  events: storeCalendar.calendarEvents,
  eventContent(info) {
    const { income, expense } = info.event.extendedProps;

    const plus = income
      ? `<div class="text-success fw-bold">+${income.toLocaleString()}원</div>`
      : "";
    const minus = expense
      ? `<div class="text-danger fw-bold">-${expense.toLocaleString()}원</div>`
      : "";

    return { html: plus + minus };
  },
}));
</script>
