<template>
  <div class="p-8 pb-28">
    <!-- bottom padding -->
    <div class="flex justify-between items-center mb-6">
      <div class="flex flex-wrap gap-4">
        <!-- 거래유형 필터 -->
        <select v-model="selectedType" class="border px-3 py-2 rounded text-sm">
          <option value="all">내역 전체보기</option>
          <option value="expense">지출</option>
          <option value="income">수입</option>
        </select>

        <!-- 날짜 필터 버튼 -->
        <div class="flex flex-wrap gap-2">
          <button
            @click="setDateRange('7days')"
            class="px-3 py-1 border rounded"
          >
            최근 1주일
          </button>
          <button
            @click="setDateRange('1month')"
            class="px-3 py-1 border rounded"
          >
            최근 1개월
          </button>
          <button
            @click="setDateRange('thisMonth')"
            class="px-3 py-1 border rounded"
          >
            이번 달
          </button>
          <button @click="resetDateRange" class="px-3 py-1 border rounded">
            전체 기간
          </button>
        </div>

        <!-- 사용자 직접 날짜 선택 -->
        <div class="flex flex-wrap gap-2 items-center">
          <label>
            시작일:
            <input
              type="date"
              v-model="startDate"
              class="border px-2 py-1 rounded"
            />
          </label>
          <label>
            종료일:
            <input
              type="date"
              v-model="endDate"
              class="border px-2 py-1 rounded"
            />
          </label>
        </div>

        <Multiselect
          v-model="selectedCategory"
          :options="categoryOptions"
          :multiple="true"
          :close-on-select="false"
          :clear-on-select="false"
          placeholder="카테고리 선택"
          class="text-sm w-48"
        />
      </div>
    </div>

    <table class="w-full text-sm border-t">
      <thead>
        <tr class="text-left border-b bg-gray-50">
          <th class="py-2 px-2">분류</th>
          <th class="py-2 px-2">날짜</th>
          <th class="py-2 px-2">카테고리</th>
          <th class="py-2 px-2">금액</th>
          <th class="py-2 px-2">메모</th>
          <th class="py-2 px-2">관리</th>
        </tr>
      </thead>
      <tbody>
        <tr
          v-for="tx in pagedTransactions"
          :key="tx.id"
          class="border-b hover:bg-gray-50"
        >
          <td class="py-2 px-2">
            <span
              :class="[
                'px-2 py-1 rounded-full text-xs font-bold',
                tx.type === 'expense'
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              ]"
            >
              {{ tx.type === 'expense' ? '지출' : '수입' }}
            </span>
          </td>
          <td class="py-2 px-2">{{ formatDate(tx.date) }}</td>
          <td class="py-2 px-2">{{ tx.category }}</td>
          <td class="py-2 px-2 text-blue-600 font-bold">
            {{ tx.amount.toLocaleString() }} 원
          </td>
          <td class="py-2 px-2">
            {{
              tx.memo.length > 8 ? tx.memo.slice(0, 8) + '...' : tx.memo || '-'
            }}
          </td>
          <td class="py-2 px-2">
            <button
              @click="editTransaction(tx)"
              title="수정"
              class="text-blue-500 mr-2"
            >
              수정
            </button>
            <button
              @click="deleteTransaction(tx)"
              title="삭제"
              class="text-red-500"
            >
              삭제
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <div v-if="editModalVisible" class="modal-overlay">
      <div class="modal">
        <h2>거래 내역 수정</h2>
        <form @submit.prevent="updateTransaction">
          <label>날짜: <input type="date" v-model="editForm.date" /></label>
          <label>금액: <input type="number" v-model="editForm.amount" /></label>
          <label
            >타입:
            <select v-model="editForm.type">
              <option value="income">수입</option>
              <option value="expense">지출</option>
            </select></label
          >
          <label
            >카테고리: <input type="text" v-model="editForm.category"
          /></label>
          <label>메모: <input type="text" v-model="editForm.memo" /></label>

          <div class="modal-buttons">
            <button type="submit">저장</button>
            <button type="button" @click="closeEditModal">취소</button>
          </div>
        </form>
      </div>
    </div>

    <div
      v-if="filteredTransactions.length === 0"
      class="text-center text-muted mt-5"
    >
      거래 내역이 없습니다.
    </div>
  </div>

  <!-- 하단 고정된 페이지네이션 -->
  <div
    class="fixed bottom-0 left-0 w-full bg-white py-3 border-t text-center z-10"
  >
    <button
      @click="currentPage--"
      :disabled="currentPage === 1"
      class="mx-1 px-2 py-1 border rounded"
    >
      이전
    </button>

    <button
      v-if="currentGroup > 0"
      @click="currentPage = (currentGroup - 1) * pageGroupSize + 1"
      class="mx-1 px-2 py-1 border rounded"
    >
      ←
    </button>

    <button
      v-for="page in pageNumbers"
      :key="page"
      @click="currentPage = page"
      :class="[
        'mx-1 px-3 py-1 border rounded',
        currentPage === page ? 'bg-blue-500 text-white' : 'bg-white',
      ]"
    >
      {{ page }}
    </button>

    <button
      v-if="(currentGroup + 1) * pageGroupSize < totalPages"
      @click="currentPage = (currentGroup + 1) * pageGroupSize + 1"
      class="mx-1 px-2 py-1 border rounded"
    >
      →
    </button>

    <button
      @click="currentPage++"
      :disabled="currentPage === totalPages"
      class="mx-1 px-2 py-1 border rounded"
    >
      다음
    </button>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useDashBoardStore } from '@/stores/dashBoard';
import { storeToRefs } from 'pinia';
import Multiselect from 'vue-multiselect';
import 'vue-multiselect/dist/vue-multiselect.min.css';

const store = useDashBoardStore();
const { transactions } = storeToRefs(store);

const selectedType = ref('all'); //'all', 'expense', 'income'
const selectedCategory = ref([]); //배열로 다중 선택
const categoryOptions = [
  '식비',
  '의료',
  '교통',
  '여가',
  '통신',
  '급여',
  '기타',
];
const startDate = ref(''); //시작 날짜 필터
const endDate = ref(''); // 마지막 날짜 필터
const currentPage = ref(1); //현재 페이지 번호
const itemsPerPage = 8; //한 페이지당 리스트 8개 표시
const pageGroupSize = 5; //페이지네이션 5개 단위로 묶기 ex)1,2,3,4,5
const editModalVisible = ref(false); // 수정 팝업 상태
const editForm = ref({
  //수정 중인 데이터 임시 보관
  id: null,
  date: '',
  amount: 0,
  type: '',
  category: '',
  memo: '',
});

//  선택 값 변경 시 페이지 1로 초기화
watch([selectedType, selectedCategory, startDate, endDate], () => {
  currentPage.value = 1;
});

//빠른 날짜 설정 함수
const setDateRange = (range) => {
  const today = new Date();
  let start = new Date();

  if (range === '7days') {
    // 최근 1주일: 오늘 포함 7일
    start.setDate(today.getDate() - 6);
  } else if (range === '1month') {
    // 최근 1개월: 오늘 포함 30일
    start.setDate(today.getDate() - 29);
  } else if (range === 'thisMonth') {
    // 이번 달: 4월 1일 ~ 오늘
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  }

  startDate.value = start.toISOString().slice(0, 10);
  endDate.value = today.toISOString().slice(0, 10);
};

// 전체 기간 초기화 함수
const resetDateRange = () => {
  startDate.value = '';
  endDate.value = '';
};

// 거래 내역 필터링
const filteredTransactions = computed(() => {
  return transactions.value.filter((tx) => {
    const matchType =
      selectedType.value === 'all' || tx.type === selectedType.value;

    // 카테고리 다중 선택 필터링
    const matchCategory =
      selectedCategory.value.length === 0 ||
      selectedCategory.value.includes(tx.category);

    const txDate = new Date(tx.date);
    const start = startDate.value ? new Date(startDate.value) : null;
    const end = endDate.value ? new Date(endDate.value) : null;

    const matchDate = (!start || txDate >= start) && (!end || txDate <= end);

    return matchType && matchCategory && matchDate;
  });
});

function formatDate(dateStr) {
  const date = new Date(dateStr);
  return `${date.getFullYear()}. ${date.getMonth() + 1}.${date.getDate()}`;
}

const totalPages = computed(() =>
  Math.ceil(filteredTransactions.value.length / itemsPerPage)
);

// 현재 페이지에 보여줄 데이터
const pagedTransactions = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  return filteredTransactions.value.slice(start, end);
});

//데이터 삭제
async function deleteTransaction(tx) {
  alert(tx.id);
  if (confirm(`"${tx.memo}" 항목을 삭제할까요?`)) {
    try {
      const response = await fetch(
        `http://localhost:3000/transaction/${tx.id}`,
        {
          method: 'DELETE',
        }
      );
      console.log(response);
      if (response.ok) {
        alert('삭제 완료!');
        // 리스트 갱신이 필요함
        // location.reload(); // 삭제 시 새로고침
        const index = transactions.value.findIndex((t) => t.id === tx.id);
        if (index !== -1) {
          transactions.value.splice(index, 1); // 리스트에서 삭제
        }
      } else {
        throw new Error('삭제 실패');
      }
    } catch (err) {
      alert(err.message);
    }
  }
}

//수정 버튼 눌렀을 때 호출되는 함수
function editTransaction(tx) {
  editForm.value = { ...tx }; // 기존 데이터 불러오기
  editModalVisible.value = true;
}
//수정 팝업 모달 닫기
function closeEditModal() {
  editModalVisible.value = false;
}

//수정 요청 보내기
async function updateTransaction() {
  const tx = editForm.value;
  try {
    const response = await fetch(`http://localhost:3000/transaction/${tx.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(tx),
    });

    if (!response.ok) throw new Error('수정 실패');

    // 리스트 갱신
    const index = transactions.value.findIndex((t) => t.id === tx.id);
    if (index !== -1) {
      transactions.value[index] = { ...tx };
    }

    alert('수정 완료!');
    closeEditModal();
  } catch (err) {
    alert(err.message);
  }
}

// 페이지네이션 그룹 계산
const currentGroup = computed(() =>
  Math.floor((currentPage.value - 1) / pageGroupSize)
);

const pageNumbers = computed(() => {
  const start = currentGroup.value * pageGroupSize + 1;
  const end = Math.min(start + pageGroupSize - 1, totalPages.value);
  return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

onMounted(() => {
  store.fetchTransactions();
});
</script>

<style scoped>
table td,
table th {
  padding-top: 12px;
  padding-bottom: 12px;
}
.action-buttons {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

.action-buttons button {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 18px;
  padding: 4px;
}

.action-buttons button:hover {
  transform: scale(1.2);
  transition: 0.2s ease;
}

.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  width: 300px;
}
</style>
