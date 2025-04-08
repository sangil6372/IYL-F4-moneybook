<!-- src/components/GoalModal.vue -->
<template>
  <div
    class="modal d-block fade show"
    tabindex="-1"
    style="background-color: rgba(0, 0, 0, 0.5)"
  >
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content p-3">
        <!-- 헤더 -->
        <div class="modal-header border-0 pb-1">
          <h5 class="modal-title">
            <i class="fas fa-bullseye text-primary me-2"></i> 목표 설정
          </h5>
          <button type="button" class="btn-close" @click="handleClose"></button>
        </div>

        <!-- 탭 버튼 -->
        <div class="d-flex justify-content-center mb-3">
          <button
            class="btn me-2"
            :class="
              activeTab === 'month' ? 'btn-primary' : 'btn-outline-primary'
            "
            @click="activeTab = 'month'"
          >
            이번 달
          </button>
          <button
            class="btn"
            :class="
              activeTab === 'year' ? 'btn-primary' : 'btn-outline-primary'
            "
            @click="activeTab = 'year'"
          >
            올 해
          </button>
        </div>

        <!-- 모달 본문 -->
        <div class="modal-body">
          <div class="mb-3 text-center">
            <label class="form-label">목표 지출 금액</label>
            <div class="d-flex justify-content-center align-items-center gap-2">
              <input
                type="number"
                class="form-control"
                style="max-width: 150px"
                v-model="targetTotal"
              />
              <span>원</span>
            </div>
          </div>

          <div class="text-center">
            <label class="form-label">카테고리별 목표</label>

            <div
              v-for="(name, index) in categoryNames"
              :key="index"
              class="d-flex justify-content-center"
            >
              <div class="input-group mb-2 w-50">
                <span class="input-group-text" style="width: 80px">{{
                  name
                }}</span>
                <input
                  type="number"
                  v-model.number="categoryValues[name]"
                  class="form-control"
                  placeholder="금액"
                />
                <span class="input-group-text">원</span>
              </div>
            </div>
          </div>
        </div>

        <!-- 푸터 -->
        <div class="modal-footer border-0 pt-1">
          <button class="btn btn-secondary" @click="handleClose">닫기</button>
          <button class="btn btn-primary" @click="saveGoals">저장</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";

const emit = defineEmits(["close"]);
const activeTab = ref("month");
const auth = useAuthStore();

const user = computed(() => auth.user);

// category 이름 고정
const categoryNames = ["식비", "의료", "교통", "여가", "통신", "급여", "기타"];

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

// user가 바뀌거나 모달 열릴 때 데이터를 불러옴
// watch(
//   () => user.value,
//   (newUser) => {
//     if (newUser && newUser.goals) {
//       monthGoal.value = structuredClone(
//         newUser.goals.month || { total: 0, categories: {} }
//       );
//       yearGoal.value = structuredClone(
//         newUser.goals.year || { total: 0, categories: {} }
//       );
//     }
//   },
//   { immediate: true }
// );
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

const handleClose = () => emit("close");

//  targetTotal 바인딩
const targetTotal = computed({
  get() {
    return activeTab.value === "month"
      ? monthGoal.value.total
      : yearGoal.value.total;
  },
  set(value) {
    if (activeTab.value === "month") {
      monthGoal.value.total = value;
    } else {
      yearGoal.value.total = value;
    }
  },
});

const categoryValues = computed(() => {
  return activeTab.value === "month"
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
    await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
      goals: updatedGoals,
    });
    alert("목표 설정을 완료했습니다.");
    emit("close");
  } catch (err) {
    console.error("저장 실패:", err);
  }
};
</script>

<style>
* {
  text-align: center;
}
</style>
