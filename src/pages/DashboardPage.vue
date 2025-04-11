<template>
  <div class="container-fluid">
    <form>
      <div class="card p-4 m-3 my-5 border-0 shadow-sm rounded-4 bg-custom">
        <div class="row g-4 align-items-end">
          <!-- 고정 여부 버튼 -->
          <div
            class="col-auto d-flex flex-column align-items-center justify-content-end"
          >
            <label
              for="fixedCostToggle"
              class="form-label text-muted small fw-semibold"
              >고정</label
            >
            <button
              id="fixedCostToggle"
              name="fixedCostToggle"
              type="button"
              @click="
                addForm.fixedCost =
                  addForm.fixedCost === 'true' ? 'false' : 'true'
              "
              class="btn"
              :class="
                addForm.fixedCost === 'true'
                  ? 'btn-dark text-white'
                  : 'btn-outline-secondary'
              "
              style="padding: 6px 10px"
              title="고정 여부"
            >
              <i class="fa-solid fa-thumbtack"></i>
            </button>
          </div>

          <!-- 수입/지출 선택 -->
          <div class="col-auto">
            <label
              for="formType"
              class="form-label text-muted small fw-semibold text-center d-block"
              >분류</label
            >
            <select
              id="formType"
              name="type"
              class="form-select text-center"
              v-model="addForm.type"
            >
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select>
          </div>

          <!-- 날짜 -->
          <div class="col-auto">
            <label
              for="formDate"
              class="form-label text-muted small fw-semibold text-center d-block"
              >날짜</label
            >
            <input
              id="formDate"
              name="date"
              type="date"
              class="form-control text-center"
              v-model="addForm.date"
            />
          </div>

          <!-- 카테고리 선택 -->
          <div class="col-auto">
            <label
              for="formCategory"
              class="form-label text-muted small fw-semibold text-center d-block"
              >카테고리</label
            >
            <select
              id="formCategory"
              name="category"
              class="form-select text-center"
              v-model="addForm.category"
            >
              <option value="">선택</option>
              <option
                v-for="item in categoryOptions"
                :key="item.label"
                :value="item.label"
              >
                {{ item.emoji }} {{ item.label }}
              </option>
            </select>
          </div>

          <!-- 금액 -->
          <div class="col">
            <label
              for="formAmount"
              class="form-label text-muted small fw-semibold text-center d-block"
              >금액</label
            >
            <div class="d-flex align-items-center">
              <input
                id="formAmount"
                name="amount"
                type="number"
                class="form-control"
                v-model="addForm.amount"
                placeholder="Price..."
              />
            </div>
          </div>

          <!-- 메모 -->
          <div class="col flex-grow-1">
            <label
              for="formMemo"
              class="form-label text-muted small fw-semibold text-center d-block"
              >메모</label
            >
            <input
              id="formMemo"
              name="memo"
              type="text"
              class="form-control"
              v-model="addForm.memo"
              placeholder="Enter..."
            />
          </div>

          <!-- 추가 버튼 -->
          <div class="col-auto text-center">
            <label
              for="formSubmit"
              class="form-label text-muted small fw-semibold text-center d-block"
              >추가</label
            >
            <button
              id="formSubmit"
              name="submit"
              type="button"
              class="btn btn-outline-secondary px-3 py-2"
              @click="addCheck"
            >
              <i class="fa-solid fa-plus"></i>
            </button>
          </div>
        </div>
      </div>
    </form>

    <div class="top-filter-bar d-flex justify-content-between">
      <div>
        <div class="category-filter">
          <select v-model="selectedFixed" class="simple-select">
            <option value="">고정 전체보기</option>
            <option value="true">고정</option>
            <option value="false">일반</option>
          </select>
        </div>
        <div class="category-filter">
          <select v-model="selectedType" class="simple-select">
            <option value="">내역 전체보기</option>
            <option value="expense">지출</option>
            <option value="income">수입</option>
          </select>
        </div>
        <div class="category-filter">
          <select v-model="selectedCategory" class="simple-select">
            <option value="">카테고리 전체보기</option>
            <option
              v-for="item in categoryOptions"
              :key="item.label"
              :value="item.label"
            >
              {{ item.emoji }} {{ item.label }}
            </option>
          </select>
        </div>

        <!-- 날짜별 전체보기 -->
        <div class="category-filter position-relative">
          <select
            v-model="selectedDateRange"
            class="simple-select"
            @change="onDateRangeChange"
          >
            <option value="">요일 전체보기</option>
            <option value="7days">최근 1주일</option>
            <option value="1month">최근 1개월</option>
            <option value="thisMonth">이번 달</option>
            <option value="custom">기간 설정</option>
          </select>

          <!-- 👇 이 안에 팝업 포함시키기 -->
          <div v-if="showCustomPopup" class="custom-popup">
            <label class="form-label">
              시작일:
              <input
                type="date"
                id="customStartDate"
                name="startDate"
                v-model="startDate"
                class="form-control"
              />
            </label>
            <label class="form-label mt-2">
              종료일:
              <input
                type="date"
                id="customEndDate"
                name="endDate"
                v-model="endDate"
                class="form-control"
              />
            </label>
            <div class="d-flex justify-content-end gap-2 mt-3">
              <button class="btn btn-primary btn-sm" @click="applyCustomDate">
                적용
              </button>
              <button
                class="btn btn-secondary btn-sm"
                @click="closeCustomPopup"
              >
                취소
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- !!! 여기에 total 개수 추가 -->
      <div class="total-number ml-auto">
        전체 거래 : {{ useStore.totalTransaction }}건
      </div>
    </div>

    <div class="table-wrapper">
      <table class="custom-table">
        <thead>
          <tr class="table-head">
            <th class="fixed-col">고정</th>
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
            <td class="fixed-col">
              <span v-if="tx.fixedCost === 'true'">
                <i class="fa-solid fa-thumbtack me-1"></i>
              </span>
            </td>
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
            <td>
              <span>
                {{ categoryEmoji[tx.category] || "" }} {{ tx.category }}
              </span>
            </td>
            <td :class="tx.type === 'income' ? 'income' : 'expense'">
              {{ tx.amount.toLocaleString() }} 원
            </td>
            <td>
              {{
                tx.memo.length > 8
                  ? tx.memo.slice(0, 8) + "..."
                  : tx.memo || "-"
              }}
            </td>
            <td>
              <button @click="updateCheck(tx)" title="수정" class="action-btn">
                수정
              </button>
              <!-- 위의 수정을 누르면 updateCheck 호출 후 해당 거래를 모달로 수정! -->
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

  <!-- 거래 수정 모달 -->
  <!-- 🟡 Bootstrap 모달 컴포넌트 추가 -->
  <div
    class="modal fade"
    id="editModal"
    tabindex="-1"
    aria-labelledby="editModalLabel"
    aria-hidden="true"
    ref="editModalRef"
  >
    <div class="modal-dialog">
      <div class="modal-content p-3">
        <div class="modal-header">
          <h5 class="modal-title" id="editModalLabel">거래 수정</h5>
          <button
            type="button"
            class="btn-close"
            data-bs-dismiss="modal"
            aria-label="Close"
            @click="resetForm"
          ></button>
        </div>

        <div class="modal-body">
          <!-- 여기에 InputForm 컴포넌트 삽입 -->
          <InputForm :form="editForm" @save="handleUpdate" />
        </div>
      </div>
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
import { ref, computed, onMounted, watch, reactive } from "vue";

// 🐷 부트스트랩 모달 가져오기
import { Modal } from "bootstrap";

// 🐷 수정 모달 불러오기
import InputForm from "@/components/InputForm.vue";

// 🐷 원래 있던 피니아 가지고 와서 삭제 및 수정 기능 구현으로 바꾸기
import { useCalendar } from "@/stores/calendar";

// 이모지 가져오기
import { categoryEmoji, categories } from "@/utils/categoryEmoji";

// 고정 셀렉트 이용하기 위함
const selectedFixed = ref("");

// 🐷 스토어 등록
const useStore = useCalendar();

// 🐷 userID 쓰기 위해 피니아 임포트
import { useAuthStore } from "@/stores/auth";
const authStore = useAuthStore();

// 🐷 userId 가져오기
const userId = authStore.user.id;

// 지출 수입은 이걸로 관리 'all', 'expense', 'income'
const selectedType = ref("");

// 카테고리는 배열로 다중 선택 가능하도록
const selectedCategory = ref("");
const categoryOptions = categories;

//수정 중인 데이터 임시 보관
const editForm = reactive({
  // id: null,
  date: "",
  amount: 0,
  type: "expense",
  category: "",
  memo: "",
  fixedCost: "false",
  userId: userId,
});

// 입력폼 데이터 보관
const addForm = reactive({
  date: new Date().toISOString().slice(0, 10),
  amount: 0,
  type: "expense",
  category: "",
  memo: "",
  fixedCost: "false",
  userId: userId,
});

const startDate = ref(""); //시작 날짜 필터
const endDate = ref(""); // 마지막 날짜 필터

const currentPage = ref(1); // 현재 페이지 번호
const itemsPerPage = 8; // 한 페이지당 리스트 8개 표시
const pageGroupSize = 5; // 페이지네이션 5개 단위로 묶기 ex)1,2,3,4,5

// 모달 DOM 참조
const editModalRef = ref(null);
let editModalInstance = null;

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

const selectedDateRange = ref(""); // 드롭다운에서 선택한 날짜 범위
const showCustomPopup = ref(false); // 사용자 설정 팝업 표시 여부
const popupStyle = ref({}); // 팝업 위치 스타일

// 날짜 범위 선택 시 처리
function onDateRangeChange() {
  if (selectedDateRange.value === "custom") {
    showCustomPopup.value = true;
  } else {
    showCustomPopup.value = false;
    if (selectedDateRange.value === "") {
      resetDateRange();
    } else {
      setDateRange(selectedDateRange.value);
    }
  }
}

// 사용자 지정 날짜 적용
function applyCustomDate() {
  showCustomPopup.value = false;
}

// 사용자 지정 날짜 팝업 닫기 (취소)
function closeCustomPopup() {
  showCustomPopup.value = false;
  selectedDateRange.value = ""; // 선택 취소
  resetDateRange();
}

// 거래 내역 필터링 + 기간에 따른 정렬!
// filteredTransaction 은 필터 조건에 맞는 transaction 목록
const filteredTransaction = computed(() => {
  // !!! Store 파일에서 transaction 가져오기
  const transaction = useStore.transaction;
  return transaction
    .filter((tx) => {
      const matchType = !selectedType.value || tx.type === selectedType.value;
      // 카테고리 다중 선택 필터링
      const matchCategory =
        selectedCategory.value.length === 0 ||
        selectedCategory.value.includes(tx.category);
      const matchFixed =
        !selectedFixed.value || tx.fixedCost === selectedFixed.value;
      const txDate = new Date(tx.date);
      const start = startDate.value ? new Date(startDate.value) : null;
      const end = endDate.value ? new Date(endDate.value) : null;
      const matchDate = (!start || txDate >= start) && (!end || txDate <= end);
      return matchType && matchCategory && matchFixed && matchDate;
    })
    .sort((a, b) => new Date(a.date) - new Date(b.date));
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
  const start = currentGroup.value * pageGroupSize + 1;
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
  if (confirm("항목을 삭제할까요?")) {
    try {
      // Store의 함수 사용
      await useStore.deleteTransaction(tx.id);
      await useStore.fetchTransaction();
    } catch (err) {
      alert(err.message);
    }
  }
}

// 데이터 업데이트 호출
async function updateCheck(tx) {
  // 여기서 거래를 수정!!

  // 선택한 거래 정보를 editForm에 복사
  editForm.id = tx.id;
  editForm.date = tx.date;
  editForm.amount = tx.amount;
  editForm.type = tx.type;
  editForm.category = tx.category;
  editForm.memo = tx.memo;
  editForm.fixedCost = tx.fixedCost;

  // 모달 인스턴스 열기
  if (editModalInstance) {
    editModalInstance.show();
  }
}

async function addCheck() {
  const { category, amount } = addForm;

  // 올바른 유효성 검사
  if (!category || !amount || amount <= 0) {
    alert("금액과 카테고리는 반드시 작성해주세요.");
    return;
  }

  const newTransaction = { ...addForm };
  delete newTransaction.id;

  await useStore.addTransaction(newTransaction);
  await resetForm();
}

function resetForm() {
  addForm.type = "expense";
  addForm.date = new Date().toISOString().slice(0, 10);
  addForm.amount = 0;
  addForm.category = "";
  addForm.memo = "";
  addForm.fixedCost = "false";
}

// 모달이 저장 클릭하면 핸들러 작동
async function handleUpdate(formFromChild) {
  await useStore.updateTransaction(formFromChild.id, formFromChild);
  resetForm();

  if (editModalInstance) {
    editModalInstance.hide();
    resetForm(); // 모달 닫기
  }
}

onMounted(async () => {
  await useStore.fetchTransaction();

  // 🐷 모달 인스턴스 초기화
  if (editModalRef.value) {
    editModalInstance = new Modal(editModalRef.value);
    editModalRef.value.addEventListener("hide.bs.modal", () => {
      document.activeElement.blur();
      resetForm();
    });
  }
});
</script>

<style scoped>
/* 테이블 감싸는 wrapper */
.table-wrapper {
  max-width: 100%; /* 원하는 최대 너비 */
  margin: 0 auto; /* 가운데 정렬 */
  padding: 20px;
}

/* 테이블 기본 스타일 */
.custom-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
  color: #333;
  text-align: center;
}

/* 테이블 헤더 */
.table-head th {
  padding: 12px;
  font-weight: 600;
  border-bottom: 1px solid #e5e7eb;
}

/* 테이블 내용 행 */
.table-row td {
  padding: 12px;
  border-bottom: 1px solid #f0f0f0;
  /* transition: backround 0.2s; */
}
/* 고정칸 넓이 줄이기 */
th.fixed-col,
td.fixed-col {
  width: 40px;
  min-width: 40px;
  text-align: center;
  vertical-align: middle;
  white-space: nowrap; /* ✅ 줄바꿈 방지 */
}

.table-row:hover {
  background-color: rgba(0, 0, 0, 0.01);
}

/* ✅ 금액 컬럼 강조 지출 / 수입 */
.income {
  font-weight: bold;
  color: #42aaaa;
}
.expense {
  font-weight: bold;
  color: #ff6384;
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
  background-color: #ddf9ea;
  color: #42aaaa;
}

.type-label.expense {
  background-color: #ffeaea;
  color: #ff6384;
}

/* ✅ 수정/삭제 버튼 */
.action-btn {
  background: none;
  border: none;
  color: #36a2eb;
  cursor: pointer;
  padding: 4px 8px;
  margin-right: 4px;
  font-size: 13px;
  font-weight: bold;
}

.action-btn:hover {
  text-decoration: underline;
}

.action-btn.text-red {
  color: #ff6384;
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
  color: #333;
  font-size: 14px;
  cursor: pointer;
}

.page-btn.active {
  background: #36a2eb;
  color: white;
}

.page-btn:hover {
  background: #a3a5a9;
}

.pagination-container {
  position: fixed;
  bottom: 20px;
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
  background-color: #36a2eb;
  color: #fff;
  border-color: #36a2eb;
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

.add-bar {
  background-color: #aaa;
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

/* 폼 요소 스타일 */
.edit-form input,
.edit-form textarea {
  width: 100%;
  margin-bottom: 16px;
  padding: 10px 12px;
  font-size: 14px;
  border: 1px solid #ccc;
  border-radius: 6px;
  box-sizing: border-box;
}

/* 카테고리 css부분 */
.simple-select {
  appearance: none;
  background-color: transparent;
  border: none;
  font-size: 16px;
  color: #4a4a4a;
  font-weight: bold;
  padding-right: 20px; /* 오른쪽 여백은 화살표 공간 */
  cursor: pointer;

  background-image: url("data:image/svg+xml,%3Csvg width='10' height='6' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0l5 6 5-6z' fill='%234a4a4a'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right center;
  background-size: 10px;
}

.simple-select:focus {
  outline: none;
}

.category-filter {
  display: inline-block;
  padding: 0 12px;
  border-right: 1px solid #ddd;
  margin-right: 12px;
}

/* 기간 설정 팝업 css */
.custom-popup {
  position: absolute;
  top: 40px;
  left: 0;
  z-index: 100;
  background: white;
  border: 1px solid #ccc;
  padding: 12px;
  border-radius: 10px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
  display: flex;
  flex-direction: column;
  gap: 8px;
  min-width: 220px;
}

.custom-popup input[type="date"] {
  width: 100%;
  padding: 4px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.popup-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 6px;
}

.popup-buttons button {
  padding: 4px 10px;
  border-radius: 6px;
  border: none;
  background-color: #6a5acd;
  color: white;
  cursor: pointer;
  transition: 0.2s;
}

.popup-buttons button:hover {
  background-color: #574fcf;
}

/* totalTransaction 스타일링 */
.total-number {
  display: inline;
  font-size: 16px;
  font-weight: bold;
  color: black;
  border-radius: 5px;
  width: 130px;
  text-align: center;
}

/* 스핀 버튼 제거 */
input[type="number"]::-webkit-inner-spin-button,
input[type="number"]::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

.bg-custom {
  background: linear-gradient(135deg, #cfefdc, #d1f1f5);
}
</style>
