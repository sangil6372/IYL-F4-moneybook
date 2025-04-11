<template>
  <div
    class="profile-wrapper d-flex align-items-center justify-content-center min-vh-100"
  >
    <div class="profile-card text-center">
      <!-- 상단 버튼 영역 -->
      <div class="profile-header">
        <button class="btn-top-left" @click="showModal = true">
          목표 설정
        </button>
        <!-- <button class="btn-top-right" @click="activeTab = 'info'">
          기본 정보 변경
        </button> -->
        <div class="profile-image-container position-relative">
          <!-- 프로필 이미지 -->
          <img
            class="avatar"
            :src="previewImage || profileImageUrl"
            alt="profile"
            @click="triggerFileInput"
          />

          <!-- 카메라 아이콘 오버레이 -->
          <div class="camera-overlay" @click="triggerFileInput">
            <i class="fas fa-camera"></i>
          </div>

          <!-- 실제 파일 업로드 input (숨김 처리) -->
          <input
            ref="fileInput"
            id="file-upload"
            type="file"
            class="d-none"
            @change="onFileChange"
          />
        </div>
      </div>
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
        <label class="form-label">비밀번호 변경</label>
        <input v-model="newPassword" class="form-control" type="password" />
      </div>
      <div class="mb-3">
        <label class="form-label">비밀번호 재확인</label>
        <input v-model="confirmPassword" class="form-control" type="password" />
      </div>
      <!-- 변경 및 회원 탈퇴 버튼 -->
      <div class="mt-4 d-flex justify-content-center gap-3">
        <button class="btn-update" @click="saveUserInfo">변경</button>
        <button class="btn-delete" @click="deleteUser">회원 탈퇴</button>
      </div>
    </div>

    <!-- 목표 설정 모달 -->
    <GoalModal
      v-if="showModal"
      :initialGoals="user.goals"
      @close="showModal = false"
    />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useAuthStore } from '@/stores/auth';
import GoalModal from '@/components/GoalModal.vue';
import basicProfile from '@/assets/basicProfile.png';

const activeTab = ref('info');
const showModal = ref(false);

const authStore = useAuthStore();
const fileInput = ref(null); // 📌 파일 업로드 input을 참조할 ref

const user = ref(
  authStore.user ?? {
    name: '',
    email: '',
    password: '',
    profileImage: '',
    settings: { language: 'kor', theme: 'light', currency: 'won' },
  }
);

const previewImage = ref('');

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
    name: '',
    email: '',
    password: '',
    profileImage: '',
    settings: { language: 'kor', theme: 'light', currency: 'won' },
  };

  previewImage.value = user.value.profileImage || '';
});

// 📌 이미지 변경을 트리거하는 메서드
function triggerFileInput() {
  fileInput.value?.click();
}

// 📌 이미지 파일을 읽고 미리보기/저장
function onFileChange(e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    previewImage.value = reader.result;
    user.value.profileImage = reader.result;
    localStorage.setItem('user', JSON.stringify(user.value));
  };
  reader.readAsDataURL(file);
}
const newPassword = ref('');
const confirmPassword = ref('');

async function saveUserInfo() {
  if (newPassword.value !== confirmPassword.value) {
    alert('비밀번호가 일치하지 않습니다.');
    return;
  }
  user.value.password = newPassword;

  await axios.patch(`/api/users/${user.value.id}`, {
    name: user.value.name,
    email: user.value.email,
    password: user.value.password,
    profileImage: user.value.profileImage,
  });
  alert('기본 정보가 저장되었습니다.');
}

async function saveUserSettings() {
  await axios.patch(`/api/users/${user.value.id}`, {
    settings: user.value.settings,
  });
  alert('설정이 저장되었습니다.');
}

async function deleteUser() {
  const confirmed = confirm(
    '정말로 회원 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다.'
  );
  if (!confirmed) return;

  try {
    await axios.delete(`/api/users/${user.value.id}`);
    localStorage.removeItem('user');
    alert('회원 탈퇴가 완료되었습니다.');
    window.location.href = '/';
  } catch (error) {
    alert('회원 탈퇴 중 오류가 발생했습니다.');
    console.error(error);
  }
}
</script>

<style scoped>
.profile-wrapper {
  background: #f5f5f5;
}

.profile-card {
  background: linear-gradient(135deg, #9fdeaf, #96dbe2);
  border-radius: 20px;
  padding: 2rem;
  max-width: 500px;
  width: 100%;
  position: relative;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
  color: #333;
}

.profile-header {
  position: relative;
  margin-bottom: 1rem;
}

.btn-top-left,
.btn-top-right {
  position: absolute;
  top: 16px;
  padding: 8px 16px;
  font-weight: 600;
  font-size: 14px;
  border: 2px solid white;
  border-radius: 20px;
  background-color: rgba(255, 255, 255, 0.1); /* 살짝 반투명 */
  color: white;
  cursor: pointer;
  transition: all 0.3s ease;
  backdrop-filter: blur(4px); /* 글라스 느낌 */
}

.btn-top-left:hover,
.btn-top-right:hover {
  background-color: white;
  color: #333;
  border-color: white;
}

.btn-top-left {
  left: 0;
}

.btn-top-right {
  right: 0;
}

.profile-image-container {
  width: 120px;
  height: 120px;
  margin: 0 auto;
  border-radius: 50%;
  overflow: hidden;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.profile-info h2 {
  font-size: 1.8rem;
  font-weight: bold;
  color: white;
}

.profile-info .location,
.profile-info .job {
  font-size: 0.95rem;
  color: #eee;
}

.stats > div {
  color: white;
  font-weight: bold;
  text-align: center;
}

.btn-show-more {
  background: linear-gradient(to right, #f953c6, #b91d73);
  border: none;
  border-radius: 30px;
  padding: 0.6rem 1.8rem;
  color: white;
  font-weight: bold;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
/* 변경, 탈퇴 버튼 */
.btn-update {
  background-color: #66d482; /* Bootstrap의 success 색상 */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}

.btn-delete {
  background-color: #f43d63; /* Bootstrap의 danger 색상 */
  color: white;
  border: none;
  border-radius: 20px;
  padding: 0.5rem 1.5rem;
  font-weight: bold;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1);
}
/* 여기까지 */

/* 이미지 위의 카메라 모양 */
.profile-image-container {
  position: relative;
  width: 120px;
  height: 120px;
  margin: 0 auto;
}

.avatar {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 50%;
  border: 4px solid #fff;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.15);
  cursor: pointer;
}

.camera-overlay {
  position: absolute;
  bottom: 10px;
  right: 20px;
  background: rgba(0, 0, 0, 0.6);
  width: 30px;
  height: 30px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  color: white;
  font-size: 16px;
}

/* 여기까지 */
</style>
