<!-- src/components/GoalModal.vue -->
<template>
  <div class="goal-modal-overlay">
    <div class="goal-modal-container">
      <!-- 헤더 -->
      <div class="goal-modal-header text-center">
        <h2>
          <i class="fa-solid fa-medal"></i> 목표 설정
          <i class="fa-solid fa-medal"></i>
        </h2>
        <button class="close-btn" @click="handleClose">&times;</button>
      </div>

      <!-- 탭 버튼 -->
      <div class="goal-modal-tabs">
        <button
          :class="['tab-btn', activeTab === 'month' ? 'active' : '']"
          @click="activeTab = 'month'"
        >
          이번 달
        </button>
        <button
          :class="['tab-btn', activeTab === 'year' ? 'active' : '']"
          @click="activeTab = 'year'"
        >
          올 해
        </button>
      </div>

      <!-- 본문 -->
      <div class="goal-modal-body">
        <div class="input-group-section">
          <label>목표 지출 금액</label>
          <div class="input-row">
            <input
              type="number"
              v-model="targetTotal"
              placeholder="금액 입력"
            />
            <span>원</span>
          </div>
        </div>

        <div class="input-group-section">
          <label>카테고리별 목표</label>
          <div class="category-inputs">
            <div
              v-for="(name, index) in categoryNames"
              :key="index"
              class="input-row"
            >
              <span class="label">{{ name }}</span>
              <input
                type="number"
                v-model.number="categoryValues[name]"
                placeholder="금액"
              />
              <span>원</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 푸터 -->
      <div class="goal-modal-footer">
        <button class="cancel-btn" @click="handleClose">닫기</button>
        <button class="save-btn" @click="saveGoals">저장</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

const emit = defineEmits(['close']);
const activeTab = ref('month');
const auth = useAuthStore();

const user = computed(() => auth.user);

// category 이름 고정
const categoryNames = ['식비', '의료', '교통', '여가', '통신', '급여', '기타'];

const props = defineProps({
  initialGoals: Object,
});

const monthGoal = ref({
  total: 0,
  categories: {},
});
const yearGoal = ref({
  total: 0,
  categories: {},
});

const fillCategories = (source = {}) => {
  return Object.fromEntries(
    categoryNames.map((name) => [name, source?.[name] || 0])
  );
};

onMounted(() => {
  // 모달이 생성될 때 한 번만 복사
  monthGoal.value = {
    total: props.initialGoals?.month?.total || 0,
    categories: fillCategories(props.initialGoals?.month?.categories),
  };
  yearGoal.value = {
    total: props.initialGoals?.year?.total || 0,
    categories: fillCategories(props.initialGoals?.year?.categories),
  };
});

const handleClose = () => emit('close');

//  targetTotal 바인딩
const targetTotal = computed({
  get() {
    return activeTab.value === 'month'
      ? monthGoal.value.total
      : yearGoal.value.total;
  },
  set(value) {
    if (activeTab.value === 'month') {
      monthGoal.value.total = value;
    } else {
      yearGoal.value.total = value;
    }
  },
});

const categoryValues = computed(() => {
  return activeTab.value === 'month'
    ? monthGoal.value.categories
    : yearGoal.value.categories;
});

//  상태에도 반영하자
const saveGoals = async () => {
  const updatedGoals = {
    month: monthGoal.value,
    year: yearGoal.value,
  };

  // 1. 스토어 업데이트
  auth.updateGoals(updatedGoals);

  // 2. 서버 반영 (axios로 전환)
  try {
    await axios.patch(`/api/users/${user.value.id}`, {
      goals: updatedGoals,
    });
    alert('목표 설정을 완료했습니다.');
    emit('close');
  } catch (err) {
    console.error('저장 실패:', err);
  }
};
</script>

<style>
.goal-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.goal-modal-container {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(10px);
  border-radius: 20px;
  width: 90%;
  max-width: 500px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
  padding: 24px;
  animation: fadeIn 0.3s ease;
}

/* .goal-modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
} */
.goal-modal-header {
  position: relative;
  text-align: center;
  margin-bottom: 16px;
}

/* .goal-modal-header h2 {
  font-weight: bold;
  font-size: 1.4rem;
  display: flex;
  align-items: center;
  gap: 8px;
} */
.goal-modal-header h2 {
  margin: 0 auto;
  font-weight: bold;
  font-size: 1.4rem;
}

/* .close-btn {
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
} */
.close-btn {
  position: absolute;
  top: 0;
  right: 0;
  background: transparent;
  border: none;
  font-size: 1.5rem;
  color: #333;
  cursor: pointer;
}

.goal-modal-tabs {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-bottom: 20px;
}

.tab-btn {
  padding: 8px 20px;
  border-radius: 999px;
  border: 1px solid #007bff;
  background: white;
  color: #007bff;
  font-weight: 500;
  transition: 0.3s ease;
}

.tab-btn.active {
  background: #007bff;
  color: white;
}

.goal-modal-body {
  padding: 8px 0;
}

.input-group-section {
  margin-bottom: 20px;
}

.input-group-section label {
  display: block;
  margin-bottom: 6px;
  font-weight: 600;
  color: #333;
}

.input-row {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 10px;
}

.input-row input {
  flex: 1;
  padding: 6px 12px;
  border: 1px solid #ccc;
  border-radius: 10px;
  outline: none;
}

.input-row span.label {
  width: 70px;
  font-weight: 500;
  text-align: left;
}

.goal-modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  margin-top: 12px;
}

.cancel-btn,
.save-btn {
  padding: 8px 16px;
  border-radius: 10px;
  font-weight: 500;
  border: none;
  transition: background 0.2s;
}

.cancel-btn {
  background: #e0e0e0;
  color: #333;
}

.save-btn {
  background: #007bff;
  color: white;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.96);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
</style>
