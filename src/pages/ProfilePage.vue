<template>
  <div
    class="container min-vh-100 d-flex align-items-center justify-content-center"
  >
    <div class="text-center mb-4">
      <GoalModal
        v-if="showModal"
        :initialGoals="user.goals"
        @close="showModal = false"
      />
    </div>

    <!-- 통합 카드 시작 -->
    <div class="card w-100 mx-auto" style="max-width: 80em">
      <div class="row gx-4 gy-5 p-4">
        <!-- 왼쪽: 프로필 -->
        <div class="col-lg-7">
          <div class="content-profile-page mb-3">
            <div class="profile-user-page">
              <div class="img-user-profile">
                <button class="goal-button" @click="showModal = true">
                  목표 설정
                </button>

                <!-- 배경 이미지 -->
                <img
                  class="profile-bgHome"
                  src="https://37.media.tumblr.com/88cbce9265c55a70a753beb0d6ecc2cd/tumblr_n8gxzn78qH1st5lhmo1_1280.jpg"
                />
                <img class="avatar" :src="profileImageUrl" alt="profile" />
              </div>
              <div class="user-profile-data">
                <h1>{{ user.name || "이름 없음" }}</h1>
                <p>{{ user.email || "이메일 없음" }}</p>
              </div>
              <!-- 프로필 변경 버튼 -->
              <div class="text-center mt-3">
                <label for="file-upload" class="btn btn-outline-secondary">
                  프로필 사진 변경
                </label>
                <input
                  id="file-upload"
                  type="file"
                  @change="onFileChange"
                  class="d-none"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- 오른쪽: 수정 폼 -->
        <div class="col-lg-5">
          <div class="p-3">
            <div class="card-body p-0">
              <!-- 버튼 탭 -->
              <div class="d-flex gap-2 mb-2">
                <button
                  class="btn"
                  :class="
                    activeTab === 'info' ? 'btn-primary' : 'btn-outline-primary'
                  "
                  @click="activeTab = 'info'"
                >
                  기본 정보 변경
                </button>
                <button
                  class="btn"
                  :class="
                    activeTab === 'settings'
                      ? 'btn-primary'
                      : 'btn-outline-primary'
                  "
                  @click="activeTab = 'settings'"
                >
                  설정 변경
                </button>
              </div>

              <!-- 탭 내용 -->
              <div v-if="activeTab === 'info'">
                <div class="card p-3">
                  <div class="mb-3"></div>
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
                  <button
                    class="btn btn-success w-100 mt-2"
                    @click="saveUserInfo"
                  >
                    변경
                  </button>
                  <!-- 탈퇴 버튼 -->
                  <button class="btn btn-danger mt-2" @click="deleteUser">
                    회원 탈퇴
                  </button>
                </div>
              </div>

              <div v-else-if="activeTab === 'settings'">
                <div class="card p-3">
                  <select
                    class="form-select mb-2"
                    v-model="user.settings.language"
                  >
                    <option value="kor">한국어</option>
                    <option value="eng">영어</option>
                  </select>
                  <select
                    class="form-select mb-2"
                    v-model="user.settings.theme"
                  >
                    <option value="light">라이트</option>
                    <option value="dark">다크</option>
                  </select>
                  <select
                    class="form-select mb-2"
                    v-model="user.settings.currency"
                  >
                    <option value="won">원화</option>
                    <option value="usd">달러</option>
                  </select>
                  <button
                    class="btn btn-success w-100 mt-2"
                    @click="saveUserSettings"
                  >
                    변경
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useAuthStore } from "@/stores/auth";
import GoalModal from "@/components/GoalModal.vue";
import basicProfile from "@/assets/basicProfile.png";

const activeTab = ref("info");
const showModal = ref(false);

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

const profileImageUrl = computed(() => {
  return (
    previewImage.value ||
    (user.value.profileImage && user.value.profileImage.trim()) ||
    basicProfile
  );
});

onMounted(() => {
  if (!authStore.user) {
    authStore.loadUserFromSession();
  }

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
    previewImage.value = reader.result;
    user.value.profileImage = reader.result;
    localStorage.setItem("user", JSON.stringify(user.value));
  };
  reader.readAsDataURL(file);
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
    window.location.href = "/";
  } catch (error) {
    alert("회원 탈퇴 중 오류가 발생했습니다.");
    console.error(error);
  }
}
</script>

<style scoped>
.modal {
  background-color: rgba(0, 0, 0, 0.3);
  transition: opacity 0.2s ease;
}

.content-profile-page {
  margin: 1em auto;
  max-width: 100%;
  width: 90%;
}

/* 복 방지: .card에 width 지정 시 max-width로 대체 */
.card {
  width: 100%;
  max-width: 60em;
  background: #fff;
  border-radius: 0.3rem;
  box-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
  border: 0.1em solid rgba(0, 0, 0, 0.2);
  margin-bottom: 1em;
}

.profile-user-page .img-user-profile {
  margin: 0 auto;
  text-align: center;
}

.profile-user-page .img-user-profile .profile-bgHome {
  border-bottom: 0.2em solid #f5f5f5;
  width: 100%; /*반응형으로 수정 */
  height: 24em;
}

.profile-bgHome {
  vertical-align: top;
  width: 100%;
  height: auto;
  object-fit: cover;
}

.profile-user-page .img-user-profile .avatar {
  margin: 0 auto;
  background: #fff;
  width: 14em;
  height: 14em;
  padding: 0.25em;
  border-radius: 0.4em;
  margin-top: -10em;
  box-shadow: 0 0 0.1em rgba(0, 0, 0, 0.35);
}

.profile-user-page button {
  position: absolute;
  font-size: 1.2em;
  font-weight: bold;
  cursor: pointer;
  width: 7em;
  background: #6377ac;
  border: 1px solid #ffffff;
  color: #fff;
  outline: none;
  border-radius: 0 0.6em 0.6em 0;
  padding: 0.6em;
}

.profile-user-page button:hover {
  background: #aeb9cf;
  color: #33477e;
  transition: background 0.2s ease-in-out;
  border: 1px solid #455a64;
}

.profile-user-page .user-profile-data,
.profile-user-page .description-profile {
  text-align: center;
  padding: 0 1.5em;
}

.profile-user-page .user-profile-data h1 {
  font-family: "Lato", sans-serif;
  margin-top: 0.35em;
  color: #292f33;
  margin-bottom: 0;
}

.profile-user-page .user-profile-data p {
  font-family: "Lato", sans-serif;
  color: #8899a6;
  font-size: 1.1em;
  margin-top: 0;
  margin-bottom: 0.5em;
}

.profile-user-page .description-profile {
  color: #75787b;
  font-size: 0.98em;
}

.profile-user-page .data-user {
  font-family: "Quicksand", sans-serif;
  margin-bottom: 0;
  cursor: pointer;
  padding: 0;
  list-style: none;
  display: table;
  width: 100.15%;
}

.profile-user-page .data-user li {
  margin: 0;
  padding: 0;
  width: 33.33334%;
  display: table-cell;
  text-align: center;
  border-left: 0.1em solid transparent;
}

.profile-user-page .data-user li:first-child {
  border-left: 0;
}

.profile-user-page .data-user li:first-child a {
  border-bottom-left-radius: 0.3rem;
}

.profile-user-page .data-user li:last-child a {
  border-bottom-right-radius: 0.3rem;
}

.profile-user-page .data-user li a {
  background-color: #f7f7f7;
  border-top: 1px solid rgba(242, 242, 242, 0.5);
  border-bottom: 0.2em solid #f7f7f7;
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.4),
    0 1px 1px rgba(255, 255, 255, 0.4);
  padding: 0.93em 0;
  color: #46494c;
}

.profile-user-page .data-user li a:hover {
  background: rgba(0, 0, 0, 0.05);
  border-bottom: 0.2em solid #3498db;
  color: #3498db;
}

.profile-user-page .data-user li a strong {
  font-size: 2em;
}

.profile-user-page .data-user li a span {
  color: #717a7e;
}

/* 버튼 디자인 */
.goal-button {
  background-color: #3498db;
}
</style>
