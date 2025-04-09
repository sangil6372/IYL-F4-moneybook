<template>
  <div class="p-8 pb-28">
    <div class="container">
      
      <!-- 필터 바 전체 -->
      <div class="filter-bar">
        <!-- 유형 토글 버튼 -->
        <div class="filter-group">
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'expense' }"
            @click="toggleType('expense')"
          >
            지출
          </button>
          <button
            class="toggle-btn"
            :class="{ active: selectedType === 'income' }"
            @click="toggleType('income')"
          >
            수입
          </button>
        </div>
        
        <!-- 날짜 선택 -->
        <div class="filter-group date-group">
          <label>시작일</label>
          <input type="date" v-model="startDate" />
          <span>~</span>
          <label>종료일</label>
          <input type="date" v-model="endDate" />
        </div>

        <!-- 카테고리 필터 -->
        <div class="filter-group">
          <label>카테고리</label>
          <select v-model="selectedCategory" class="category-select">
            <option value="">카테고리 선택</option>
            <option
              v-for="option in categoryOptions"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
        </div>
      </div>

      <div class="table-wrapper">
        <table class="custom-table">
          <thead>
            <tr class="table-head">
              <th class="py-2 px-2">분류</th>
              <th class="py-2 px-2">날짜</th>
              <th class="py-2 px-2">카테고리</th>
              <th class="py-2 px-2">금액</th>
              <th class="py-2 px-2">메모</th>
              <th class="py-2 px-2">관리</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="tx in pagedTransaction" :key="tx.id" class="table-row">
              <td>
                <span
                  :class="[
                    'type-label',
                    tx.type === 'expense' ? 'expense' : 'income',
                  ]"
                >
                  {{ tx.type === "expense" ? "지출" : "수입" }}
                </span>
              </td>
              <td>{{ formatDate(tx.date) }}</td>
              <td>{{ tx.category }}</td>
              <td class="amount">{{ tx.amount.toLocaleString() }} 원</td>
              <td>
                {{
                  tx.memo.length > 8
                    ? tx.memo.slice(0, 8) + "..."
                    : tx.memo || "-"
                }}
              </td>
              <td>
                <button
                  @click="updateCheck(tx)"
                  title="수정"
                  class="action-btn"
                >
                  수정
                </button>
                <button
                  @click="deleteCheck(tx)"
                  title="삭제"
                  class="action-btn text-red"
                >
                  삭제
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div
      v-if="filteredTransaction.length === 0"
      class="text-center text-muted mt-5"
    >
      거래 내역이 없습니다.
    </div>
  </div>

  <!-- 하단 고정된 페이지네이션 -->
  <div class="pagination-container">
    <!-- << -->
    <button
      @click="currentPage--"
      :disabled="currentPage === 1"
      class="pagination-button"
    >
      <i class="fa-solid fa-chevron-left"></i>
    </button>
    <!-- < -->
    <button
      v-if="currentGroup > 0"
      @click="currentPage = (currentGroup - 1) * pageGroupSize + 1"
      class="pagination-button"
    >
      ←
    </button>

    <!-- 페이지 목록 -->
    <button
      v-for="page in pageNumbers"
      :key="page"
      @click="currentPage = page"
      :class="['pagination-button', currentPage === page ? 'active' : '']"
    >
      {{ page }}
    </button>

    <button
      v-if="(currentGroup + 1) * pageGroupSize < totalPages"
      @click="currentPage = (currentGroup + 1) * pageGroupSize + 1"
      class="pagination-button"
    >
      →
    </button>

    <button
      @click="currentPage++"
      :disabled="currentPage === totalPages"
      class="pagination-button"
    >
      <i class="fa-solid fa-chevron-right"></i>
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, reactive } from 'vue';

// 🐷 원래 있던 피니아 가지고 와서 삭제 및 수정 기능 구현으로 바꾸기
import { useCalendar } from '@/stores/calendar'

// 🐷 스토어 등록
const useStore = useCalendar();

// 지출 수입은 이걸로 관리 'all', 'expense', 'income'
const selectedType = ref('');

// 카테고리는 배열로 다중 선택 가능하도록
const selectedCategory = ref('');
const categoryOptions = [
  "식비",
  "의료",
  "교통",
  "여가",
  "통신",
  "급여",
  "기타",
];

//수정 중인 데이터 임시 보관
const editForm = reactive({
  id: null,
  date: "",
  amount: 0,
  type: "expense",
  category: "",
  memo: "",
});

const startDate = ref(""); //시작 날짜 필터
const endDate = ref(""); // 마지막 날짜 필터

const currentPage = ref(1); // 현재 페이지 번호
const itemsPerPage = 8; // 한 페이지당 리스트 8개 표시
const pageGroupSize = 5; // 페이지네이션 5개 단위로 묶기 ex)1,2,3,4,5

const isEditModalVisible = ref(false); // 수정 팝업 상태 관리

// 같은 버튼을 두 번 누르면 전체 보기로 전환
function toggleType(type) {
  selectedType.value = selectedType.value === type ? "" : type;
}

// 선택 값 변경 시 페이지 1로 초기화
watch([selectedType, selectedCategory, startDate, endDate], () => {
  currentPage.value = 1;
});

// 빠른 날짜 설정 (Ex: 최근 7일 최근 30일)
// startDate 와 endDate를 조작함
const setDateRange = (range) => {
  const today = new Date();
  let start = new Date();

  if (range === "7days") {
    // 최근 1주일: 오늘 포함 7일
    start.setDate(today.getDate() - 6);
  } else if (range === "1month") {
    // 최근 1개월: 오늘 포함 30일
    start.setDate(today.getDate() - 29);
  } else if (range === "thisMonth") {
    // 이번 달: 4월 1일 ~ 오늘
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  startDate.value = start.toISOString().slice(0, 10);
  endDate.value = today.toISOString().slice(0, 10);
};

// 전체 기간 초기화 함수
const resetDateRange = () => {
  startDate.value = "";
  endDate.value = "";
};

// 거래 내역 필터링 + 기간에 따른 정렬!
// filteredTransaction 은 필터 조건에 맞는 transaction 목록
const filteredTransaction = computed(() => {
  // !!! Store 파일에서 transaction 가져오기
  const transaction = useStore.transaction;
  
  return transaction.filter((tx) => {
    const matchType = !selectedType.value || tx.type === selectedType.value;
    // 카테고리 다중 선택 필터링
    const matchCategory =
      selectedCategory.value.length === 0 ||
      selectedCategory.value.includes(tx.category);
    const txDate = new Date(tx.date);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;
    const matchDate = (!start || txDate >= start) && (!end || txDate <= end);
    return matchType && matchCategory && matchDate;
    }).sort((a, b) => new Date(a.date) - new Date(b.date));
});

// template 에서 쓰는 날짜 출력용
function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}. ${date.getMonth() + 1}.${date.getDate()}`;
}

// 토탈 페이지 개수
const totalPages = computed(() =>
  Math.ceil(filteredTransaction.value.length / itemsPerPage)
);

// 페이지네이션 그룹 계산
// 4 -> 0 / 6 -> 1
const currentGroup = computed(() =>
  Math.floor((currentPage.value - 1) / pageGroupSize)
);

// 한번에 보여줄 페이지 개수만큼
// 현재 페이지 그룹에 해당하는
// !!! 실제로 사용하는 페이지 번호들을 계산하여 배열로 반환
const pageNumbers = computed(() => {
  const start = (currentGroup.value * pageGroupSize) + 1;
  const end = Math.min(start + pageGroupSize - 1, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

// 현재 페이지에 보여줄 거래 목록
// Example : 1페이지에 보여줄 8개 데이터
const pagedTransaction = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransaction.value.slice(start, end);
});

// 데이터 삭제 할지 물어보기 호출
async function deleteCheck(tx) {
  if (confirm('항목을 삭제할까요?')) {
    try {
      // Store의 함수 사용
      await useStore.deleteTransaction(tx.id);
      await useStore.fetchTransaction();
    } catch (err) {
      alert(err.message);
    }
  }
}

// 데이터 업데이트 할지 물어보기 호출
async function updateCheck(tx) {
  try {
    // Store의 함수 사용
    // update 위한 정보 입력 받기!!
    await useStore.updateTransaction(tx.id, );
    await useStore.fetchTransaction();
  } catch (err) {
    alert(err.message);
  }
  
}

onMounted(async () => {
  await useStore.fetchTransaction();
});
</script>

<style scoped>
.category-select {
  appearance: none;
  padding: 8px 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  background-color: white;
  font-size: 14px;
  color: #333;
  min-width: 160px;
  background-image: url("data:image/svg+xml;utf8,<svg fill='gray' height='16' viewBox='0 0 24 24' width='16' xmlns='http://www.w3.org/2000/svg'><path d='M7 10l5 5 5-5z'/></svg>");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 16px 16px;
}

/* ✅ 테이블 감싸는 wrapper */
.table-wrapper {
  max-width: 1000px; /* 원하는 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 20px;
}

/* ✅ 테이블 기본 스타일 */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* ✅ 테이블 헤더 */
.table-head th {
  padding: 12px;
  background-color: #f9fafb;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

/* ✅ 테이블 내용 행 */
.table-row td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  transition: background 0.2s;
}

.table-row:hover {
  background-color: #f9f9f9;
}

/* ✅ 금액 컬럼 강조 */
.amount {
  font-weight: bold;
  color: #2563eb;
}

/* ✅ 수입/지출 라벨 */
.type-label {
  display: inline-block;
  padding: 4px 10px;
  font-size: 12px;
  border-radius: 999px;
  font-weight: 600;
}

.type-label.income {
  background-color: #d1fae5;
  color: #065f46;
}

.type-label.expense {
  background-color: #fee2e2;
  color: #b91c1c;
}

/* ✅ 수정/삭제 버튼 */
.action-btn {
  background: none;
  border: none;
  color: #3b82f6;
  cursor: pointer;
  padding: 4px 8px;
  font-size: 13px;
  margin-right: 4px;
}

.action-btn:hover {
  text-decoration: underline;
}

.action-btn.text-red {
  color: #ef4444;
}

/* ✅ 페이지네이션 */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 20px;
}

.page-btn {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  color: #374151;
  font-size: 14px;
  cursor: pointer;
}

.page-btn.active {
  background: #2563eb;
  color: white;
}

.page-btn:hover {
  background: #e5e7eb;
}

.pagination-container {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  padding: 12px 0;
  text-align: center;
  z-index: 10;
  background-color: transparent; /* 배경 투명 */
  border-top: none; /* 선 제거 */
}
/* 현재 선택된 페이지 스타일 */
.pagination-button.active {
  background-color: #007bff;
  color: #fff;
  border-color: #007bff;
  font-weight: bold;
}

/* 비활성화된 버튼 */
.pagination-button:disabled {
  color: #aaa;
  border-color: #ddd;
  background-color: #f9f9f9;
  cursor: not-allowed;
}
/* 버튼 기본 스타일 */
.pagination-button {
  display: inline-block;
  margin: 0 4px;
  padding: 6px 14px;
  border: 1px solid #ccc;
  background-color: #fff;
  color: #333;
  border-radius: 20px;
  font-size: 14px;
  cursor: pointer;
  transition: background-color 0.2s, color 0.2s;
}

.filter-bar {
  background-color: #e0f7f9;
  border-radius: 12px;
  padding: 20px;
  margin-bottom: 24px;
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.05);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 10px;
  flex-wrap: wrap;
}

.date-group input[type="date"] {
  padding: 6px 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
}

.toggle-btn {
  padding: 8px 20px;
  border-radius: 20px;
  border: 1px solid #3cb2ac;
  background-color: white;
  color: #3cb2ac;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.toggle-btn.active {
  background-color: #3cb2ac;
  color: white;
}

.primary-btn {
  background-color: #3cb2ac;
  color: white;
  padding: 8px 16px;
  border-radius: 8px;
  border: none;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.primary-btn:hover {
  background-color: #2ca59a;
}

.secondary-btn {
  background-color: white;
  color: #3cb2ac;
  border: 1px solid #3cb2ac;
  padding: 8px 16px;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.3s;
}

.secondary-btn:hover {
  background-color: #ebfafa;
}

.container {
  max-width: 900px; /* 또는 1000px 등 원하는 고정 너비 */
  margin: 0 auto;
}

/* 모달창 css 시작 부분*/
.edit-modal-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999;
}

.modal {
  background-color: white;
  padding: 24px;
  border-radius: 8px;
  width: 400px; /* 크기 조절 */
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.edit-form input,
.edit-form textarea {
  width: 100%;
  margin-bottom: 12px;
  padding: 8px;
  box-sizing: border-box;
}
</style>
