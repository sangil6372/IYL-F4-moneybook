<template>
  <div class="bg-img"></div>
  <div
    class="container content d-flex justify-content-center align-items-center min-vh-100"
  >
    <div class="main-card">
      <!-- 로고 + 타이틀 -->
      <div class="logo-box text-center mb-4">
        <img
          src="@/assets/logo.png"
          alt="Logo"
          class="logo animate__animated animate__bounce"
        />
        <div class="login-label mt-3">Login</div>
      </div>

      <!-- 로그인 입력 -->
      <div class="login-card card">
        <div class="card-body">
          <form @submit="handleLogin">
            <label class="animate__animated animate__lightSpeedInLeft"
              >Email</label
            >
            <input
              type="email"
              class="form-control"
              placeholder="example@example.com"
              v-model="loginEmail"
              @blur="loginEmailTouched = true"
              :class="{ 'is-invalid': loginEmailTouched && !isLoginEmailValid }"
            />
            <div class="invalid-feedback">
              올바른 이메일 형식을 입력해주세요.
            </div>
            <br />
            <label class="mt-3 animate__animated animate__lightSpeedInRight"
              >Password</label
            >
            <input
              type="password"
              class="form-control"
              placeholder="Enter your password"
              v-model="loginPassword"
            />

            <div class="d-flex gap-2 mt-4">
              <button type="submit" class="btn btn-primary w-100">
                로그인
              </button>
              <button
                type="button"
                class="btn btn-secondary w-100"
                @click="openModal"
              >
                회원가입
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- 회원가입 모달 -->
    <div class="modal fade" tabindex="-1" ref="modalRef">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">회원가입</h5>
            <button
              type="button"
              class="btn-close"
              @click="closeModal"
            ></button>
          </div>
          <div class="modal-body">
            <form>
              <div class="mb-3">
                <label class="form-label"
                  >이메일 <span class="text-danger">(필수)</span></label
                >
                <div class="row g-2">
                  <div class="col-9">
                    <input
                      type="email"
                      class="form-control"
                      :class="{
                        'is-invalid':
                          regEmailTouched &&
                          (!isEmailValid || isDuplicateEmail),
                      }"
                      v-model="regEmail"
                      placeholder="이메일 입력"
                      @blur="regEmailTouched = true"
                    />
                    <div
                      class="invalid-feedback"
                      v-if="regEmailTouched && !isEmailValid"
                    >
                      올바른 이메일 형식을 입력해주세요.
                    </div>
                    <div
                      class="invalid-feedback"
                      v-else-if="regEmailTouched && isDuplicateEmail"
                    >
                      이미 등록된 이메일입니다.
                    </div>
                    <div
                      class="valid-feedback"
                      v-if="isEmailValid && !isDuplicateEmail"
                    >
                      사용 가능한 이메일입니다.
                    </div>
                  </div>
                  <div class="col-3">
                    <button
                      type="button"
                      class="btn btn-outline-secondary w-100 check-btn"
                      @click="checkEmailExists"
                    >
                      중복 확인
                    </button>
                  </div>
                </div>
                <div class="mb-3">
                  <label class="form-label"
                    >비밀번호 <span class="text-danger">(필수)</span></label
                  >
                  <input
                    type="password"
                    class="form-control"
                    placeholder="비밀번호 입력"
                    v-model="regPassword"
                  />
                </div>
              </div>

              <div class="mb-3">
                <label class="form-label"
                  >비밀번호 확인 <span class="text-danger">(필수)</span></label
                >
                <input
                  type="password"
                  class="form-control"
                  placeholder="비밀번호 확인"
                  v-model="regConfirm"
                  :class="{
                    'is-invalid': regConfirmTouched && !isPasswordMatch,
                  }"
                  @blur="regConfirmTouched = true"
                />
                <div class="invalid-feedback">
                  비밀번호가 일치하지 않습니다.
                </div>
              </div>

              <div class="mb-3 d-grid justify-content-center">
                <label class="form-label">이름 (선택)</label>
                <input
                  type="text"
                  class="form-control"
                  placeholder="이름 입력"
                  v-model="regName"
                  style="max-width: 200px"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">닫기</button>
            <button
              class="btn btn-primary"
              @click="handleRegister"
              :disabled="!isEmailValid || isDuplicateEmail"
            >
              회원가입
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";
import axios from "axios";

const modalRef = ref(null);
let modalInstance = null;

const regEmail = ref("");
const regPassword = ref("");
const regConfirm = ref("");
const loginEmail = ref("");
const loginPassword = ref("");
const regName = ref("");

const router = useRouter();
const authStore = useAuthStore();

onMounted(() => {
  modalInstance = new Modal(modalRef.value);
});

function openModal() {
  modalInstance.show();
}

function closeModal() {
  modalInstance.hide();

  // 초기화
  regEmail.value = "";
  regPassword.value = "";
  regConfirm.value = "";
  regName.value = "";

  regEmailTouched.value = false;
  regConfirmTouched.value = false;
}

// 로그인 버튼 핸들러
async function handleLogin(e) {
  e.preventDefault(); // form 제출 기본 동작 방지

  try {
    await authStore.login(loginEmail.value, loginPassword.value);
    alert("로그인 성공!");
    router.push("/dashboard");
  } catch (err) {
    alert("이메일 또는 비밀번호가 올바르지 않습니다.");
  }
}

// 로그인 즉각 유효성 검사
const loginEmailTouched = ref(false);

const isLoginEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(loginEmail.value);
});

//  회원가입 버튼 핸들러
async function handleRegister() {
  regEmailTouched.value = true;
  regConfirmTouched.value = true;

  if (!isEmailValid.value || isDuplicateEmail.value) {
    alert("이메일 형식이 잘못됐거나 이미 등록된 이메일입니다.");
    return;
  }

  if (!isPasswordMatch.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  try {
    await authStore.register(
      regName.value.trim(),
      regEmail.value.trim(),
      regPassword.value.trim()
    );
    loginEmail.value = regEmail.value;
    closeModal();
  } catch (e) {
    alert("회원가입 중 오류가 발생했습니다.");
    console.error(e);
  }
}

// 회원 가입 유효성 검사
const regEmailTouched = ref(false);

const isEmailValid = computed(() => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(regEmail.value);
});

const regConfirmTouched = ref(false);

const isPasswordMatch = computed(() => {
  return regPassword.value === regConfirm.value;
});

// 중복 이메일인지 체크
const isDuplicateEmail = ref(false);
const checkingEmail = ref(false);
const emailChecked = ref(false); // 중복 확인 버튼 눌렀는지 여부

async function checkEmailExists() {
  checkingEmail.value = true;
  emailChecked.value = true;

  try {
    const res = await axios.get(
      `http://localhost:3000/users?email=${regEmail.value}`
    );
    isDuplicateEmail.value = res.data.length > 0;
  } catch (err) {
    console.error("이메일 확인 오류:", err);
  } finally {
    checkingEmail.value = false;
  }
}
</script>

<style scoped>
.logo {
  width: 100%;
  max-width: 200px; /* 카드 안에서 너무 커지지 않도록 제한 */
  height: auto;
  display: block;
  margin: 0 auto;
}
.desc {
  font-size: 2rem;
  color: #555;
  text-align: center;
}
.card-body {
  padding: 2rem 2rem;
}
form label {
  display: block; /* 세로로 정렬되도록 유지 */
  text-align: left !important; /* 가운데 정렬을 확실히 덮어쓰기 */
  margin-bottom: 0.4rem;
  font-size: 1rem;
  font-weight: 500;
  color: #333;
}

.form-control {
  height: 40px;
  font-size: 0.95rem;
  padding: 0.7rem 0.9rem;
}
.check-btn {
  padding: 0.35rem !important;
  font-size: 0.85rem !important;
  font-weight: bold !important;
  border-radius: 15px !important;
  height: 40px !important;
  white-space: nowrap;
}

.btn {
  padding: 0.75rem 1rem;
  font-size: 1rem;
  border-radius: 12px;
}

.d-flex.gap-2.mt-4 {
  margin-top: 2rem !important;
  gap: 1rem !important;
}

.invalid-feedback,
.valid-feedback {
  margin-top: -0.8rem;
  margin-bottom: 1rem;
  font-size: 0.85rem;
  color: #d9534f;
}

.modal-body {
  padding: 2rem 2rem;
}
.modal-body form {
  align-items: center;
}

.modal-body .form-label {
  font-size: 1rem;
  margin-bottom: 0.3rem;
}

.modal-body input.form-control {
  padding: 0.8rem 1rem;
  font-size: 0.95rem;
  margin-bottom: 1.2rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  padding: 1rem 1.5rem;
  gap: 1rem; /* 버튼 간격 */
}

.modal {
  z-index: 2000 !important;
}

.modal-backdrop.show {
  z-index: 1500 !important;
}

html,
body {
  width: 100%;
  height: 100%;
  margin: 0;
}

.bg-img {
  position: fixed;
  width: 100%;
  height: 100%;
  background: url("https://unsplash.it/1200x800") center center no-repeat;
  background-size: cover;
  z-index: 0;
}

.bg-img::before {
  content: "";
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: linear-gradient(to bottom right, #002f4b, #dc4225);
  opacity: 0.6;
  z-index: 0; /* 가장 낮게 유지 */
}

.content {
  position: relative;
}

.main-card {
  background: rgba(255, 255, 255, 0.95);
  border-radius: 16px;
  padding: 2rem 2.5rem;
  max-width: 400px;
  min-width: 300px;
  min-height: 400px;
  width: 100%;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  z-index: 2;
}

.login-label {
  font-size: 1rem;
  font-weight: 700;
  color: #fff;
  background-color: #129d72;
  padding: 0.5rem 1.5rem;
  border-radius: 10px;
  margin-top: 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  opacity: 0.8; /* 비활성화된 느낌 주기 (선택사항) */
}

label {
  font-size: 1em !important;
  font-weight: 600;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  /* 기존 스타일 유지 */
  background: linear-gradient(
    0deg,
    rgba(0, 172, 238, 1) 0%,
    rgba(2, 126, 251, 1) 100%
  );
  border: none;
  color: white;
  width: 80px;
  height: 40px;
  border-radius: 50px;
  font-weight: 600;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

/* hover 스타일 */
.btn-primary:hover {
  background: transparent;
  color: rgba(2, 126, 251, 1);
  box-shadow: none;
  border: 2px solid rgba(2, 126, 251, 1);
}

.btn-secondary {
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(
    0deg,
    rgb(135, 125, 216) 0%,
    rgb(160, 148, 180) 100%
  );
  border: none;
  color: white;
  width: 80px;
  height: 40px;
  border-radius: 50px;
  font-weight: 600;
  padding: 0 1rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease;
}

.btn-secondary:hover {
  background: transparent;
  color: rgba(103, 58, 183, 1);
  box-shadow: none;
  border: 2px solid rgba(103, 58, 183, 1);
}
/* 모달 크기 & 반응형 스타일 개선 */
.modal-dialog {
  max-width: 400px;
  min-width: 360px;

  width: 90%;
  margin: 2rem auto;
  transition: all 0.3s ease-in-out;
}

.modal-body {
  padding-left: 2em;
  padding-right: 2em;
}

.modal-body .form-label {
  font-size: 0.95rem;
  margin-bottom: 0.3rem;
  color: #444;
  font-weight: 500;
}

.modal-body input.form-control {
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  border-radius: 8px;
  margin-bottom: 1rem;
}

.modal-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-direction: row;
  gap: 1rem;
}

.modal-footer .btn {
  width: 30%;
  min-width: 100px;
  border-radius: 20px;
}

.modal.fade .modal-dialog {
  transform: translateY(-30px);
  opacity: 0;
  transition: all 0.3s ease-in-out;
}

.modal.fade.show .modal-dialog {
  transform: translateY(0);
  opacity: 1;
}
</style>
