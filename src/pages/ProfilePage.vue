<template>
  <div class="container py-5">
    <div class="container py-5 text-center">
      <button class="btn btn-primary" @click="showModal = true">
        목표 설정
      </button>

      <!-- 모달이 true일 때만 표시 -->
      <GoalModal
        v-if="showModal"
        :initialGoals="user.goals"
        @close="showModal = false"
      />
    </div>

    <!-- 상단 프로필 -->
    <div class="text-center mb-5">
      <!-- 이미지가 있으면 -->
      <img
        v-if="previewImage || user.profileImage"
        :src="previewImage || user.profileImage"
        class="rounded-circle mb-3"
        alt="프로필"
        width="360"
        height="360"
      />

      <!-- 이미지가 없으면 아이콘 표시 -->
      <div
        v-else
        class="rounded-circle d-flex align-items-center justify-content-center bg-secondary mb-3 mx-auto"
        style="width: 360px; height: 360px"
      >
        <i style="font-size: 10rem" class="fas fa-user fa-7x text-white"></i>
      </div>

      <p class="text-muted small">{{ user.name }}</p>
      <p class="text-muted small">{{ user.email }}</p>
    </div>

    <!-- 하단: 버튼 + 카드 -->
    <div class="row">
      <!-- 버튼 -->
      <div class="col-md-3 d-flex flex-column gap-2">
        <button
          class="btn"
          :class="activeTab === 'info' ? 'btn-primary' : 'btn-outline-primary'"
          @click="activeTab = 'info'"
        >
          기본 정보 변경
        </button>
        <button
          class="btn"
          :class="
            activeTab === 'settings' ? 'btn-primary' : 'btn-outline-primary'
          "
          @click="activeTab = 'settings'"
        >
          설정 변경
        </button>
      </div>

      <!-- 카드 (1개만 보여짐) -->
      <div class="col-md-9">
        <div class="card">
          <div class="card-body">
            <!-- 기본 정보 변경 -->
            <div v-if="activeTab === 'info'">
              <h5 class="card-title">기본 정보 변경</h5>

              <div class="mb-3">
                <label class="form-label">프로필 사진 변경</label>
                <input
                  type="file"
                  @change="onFileChange"
                  class="form-control"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">이름</label>
                <input v-model="user.name" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label">이메일</label>
                <input v-model="user.email" class="form-control" />
              </div>

              <div class="mb-3">
                <label class="form-label">비밀번호</label>
                <input
                  v-model="newPassword"
                  class="form-control"
                  type="password"
                />
              </div>

              <div class="mb-3">
                <label class="form-label">비밀번호 확인</label>
                <input
                  v-model="confirmPassword"
                  class="form-control"
                  type="password"
                />
              </div>

              <button class="btn btn-success mt-2" @click="saveUserInfo">
                변경
              </button>
            </div>

            <!-- 설정 -->
            <div v-else-if="activeTab === 'settings'">
              <h5 class="card-title">설정 변경</h5>
              <select class="form-select mb-2" v-model="user.settings.language">
                <option value="kor">한국어</option>
                <option value="eng">영어</option>
              </select>

              <select class="form-select mb-2" v-model="user.settings.theme">
                <option value="light">라이트</option>
                <option value="dark">다크</option>
              </select>

              <select class="form-select mb-2" v-model="user.settings.currency">
                <option value="won">원화</option>
                <option value="usd">달러</option>
              </select>

              <button class="btn btn-success mt-2" @click="saveUserSettings">
                변경
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- 하단 탈퇴 버튼 -->
      <div class="text-center mt-4">
        <button class="btn btn-danger" @click="deleteUser">회원 탈퇴</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import GoalModal from "@/components/GoalModal.vue";

const activeTab = ref("info");

const authStore = useAuthStore();
const user = ref(
  authStore.user ?? {
    name: "",
    email: "",
    password: "",
    profileImage: "",
    settings: { language: "kor", theme: "light", currency: "won" },
  }
);
const previewImage = ref("");

onMounted(() => {
  if (!authStore.user) {
    authStore.loadUserFromSession();
  }

  // fallback 설정
  user.value = authStore.user || {
    name: "",
    email: "",
    password: "",
    profileImage: "",
    settings: { language: "kor", theme: "light", currency: "won" },
  };

  previewImage.value = user.value.profileImage || "";
});

function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result; // base64 인코딩된 이미지 데이터
    user.value.profileImage = reader.result;

    // localStorage에 즉시 반영
    localStorage.setItem("user", JSON.stringify(user.value));
  };
  reader.readAsDataURL(file); // base64 문자열로 변환
}

async function saveUserInfo() {
  await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
    name: user.value.name,
    email: user.value.email,
    password: user.value.password,
    profileImage: user.value.profileImage,
  });
  alert("기본 정보가 저장되었습니다.");
}

async function saveUserSettings() {
  await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
    settings: user.value.settings,
  });
  alert("설정이 저장되었습니다.");
}

async function deleteUser() {
  const confirmed = confirm(
    "정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."
  );
  if (!confirmed) return;

  try {
    await axios.delete(`http://localhost:3000/users/${user.value.id}`);
    localStorage.removeItem("user");
    alert("회원 탈퇴가 완료되었습니다.");

    // 선택: 페이지 이동 또는 새로고침
    window.location.href = "/"; // 홈으로 이동하거나
    // location.reload(); // 또는 그냥 새로고침
  } catch (error) {
    alert("회원 탈퇴 중 오류가 발생했습니다.");
    console.error(error);
  }
}

//  목표 설정
const showModal = ref(false);
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s ease;
}
</style>
