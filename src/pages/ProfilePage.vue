<template>
  <div class="container py-5">
    <!-- 상단 프로필 -->
    <div class="text-center mb-5">
      <img
        :src="previewImage || user.profileImage"
        class="rounded-circle mb-3"
        alt="프로필"
        width="360"
        height="360"
      />
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
                저장
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
              <button class="btn btn-success mt-2" @click="saveUserSettings">
                저장
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const activeTab = ref("info");
const user = ref({
  name: "",
  email: "",
  password: "",
  profileImage: "",
  settings: { language: "kor", notifications: true, theme: "light" },
});
const previewImage = ref("");

onMounted(() => {
  const storedUser = localStorage.getItem("user");
  if (storedUser) {
    user.value = JSON.parse(storedUser);
    previewImage.value = user.value.profileImage; // 현재 사진도 미리 보기로 세팅
  }
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

  // localStorage 업데이트
  localStorage.setItem("user", JSON.stringify(user.value));

  alert("기본 정보가 저장되었습니다.");
}

async function saveUserSettings() {
  await axios.patch(`http://localhost:3000/users/${user.value.id}`, {
    settings: user.value.settings,
  });
  alert("설정이 저장되었습니다.");
}
</script>
