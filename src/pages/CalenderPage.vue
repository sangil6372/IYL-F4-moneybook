<!-- CalendarTest.vue -->
<template>
  <div class="d-flex p-4 bg-light" style="min-height: 100vh">
    <!-- 달력 부분 -->
    <div class="flex-grow-1">
      <FullCalendar :options="calendarOptions" />
    </div>

    <!-- 우측 영역 (결제일 or 입력 폼) -->
    <div class="container w-25 ms-4">
      <!-- 다가오는 결제일 -->
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

      <!-- 입력 폼 -->
      <div v-else class="card shadow-sm position-relative mt-2">
        <!-- X 아이콘 -->
        <i
          class="fa-solid fa-xmark text-secondary"
          @click="closeForm"
          style="
            position: absolute;
            top: 12px;
            right: 16px;
            cursor: pointer;
            font-size: 1.2rem;
          "
          title="입력 닫기"
        ></i>

        <div class="card-body">
          <h5 class="card-title mb-4">
            <i class="fa-solid fa-pen-to-square me-2 text-primary"></i>
            {{ selectedDate }} 입력
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
                value="수입"
                v-model="form.type"
              />
              <label class="form-check-label" for="income">수입</label>
            </div>
            <div class="form-check form-check-inline">
              <input
                class="form-check-input"
                type="radio"
                id="expense"
                value="지출"
                v-model="form.type"
              />
              <label class="form-check-label" for="expense">지출</label>
            </div>
          </div>

          <div class="mb-3">
            <label for="category" class="form-label">카테고리</label>
            <input
              id="category"
              type="text"
              class="form-control"
              v-model="form.category"
              placeholder="예: 식비, 교통비, 구독 등"
            />
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
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const selectedDate = ref(null);

function handleDateClick(info) {
  selectedDate.value = info.dateStr;
}
const form = ref({
  amout: "",
  type: "지출",
  category: "",
  memo: "",
});

function closeForm() {
  selectedDate.value = null;
  form.value = {
    amout: "",
    type: "지출",
    category: "",
    memon: "",
  };
}
const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  eventColor: "transparent",
  dateClick: handleDateClick,
  events: [
    { title: "3000", date: "2025-04-05" },
    { title: "커피", date: "2025-04-10" },
    { title: "4500", date: "2025-04-26" },
    { title: "3000", date: "2025-04-14" },
  ],
  eventContent(info) {
    return {
      html: `<span class="text-success fw-bold">${info.event.title}</span>`,
    };
  },
});
</script>
