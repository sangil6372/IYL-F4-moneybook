<template>
  <div class="container">
    <div class="row align-items-center min-vh-100">
      <!-- 좌측 로고 -->
      <div class="col-md-8 text-center mb-4 mb-md-0">
        <div class="d-flex flex-column align-items-center">
          <img src="@/assets/logo.png" alt="Logo" class="logo mb-3" />
          <div class="desc">임시로 적은 상세 설명</div>
        </div>
      </div>

      <!-- 로그인 카드 -->
      <div class="col-md-4 d-flex justify-content-center">
        <div class="card" style="width: 100%">
          <div class="card-body">
            <h5 class="card-title mb-4">로그인</h5>
            <!-- 제출하면 로그인! -->
            <form @submit="handleLogin">
              <label for="exampleInputEmail">이메일</label>
              <input
                type="email"
                class="form-control"
                id="exampleInputEmail1"
                placeholder="이메일 입력"
                v-model="loginEmail"
                @blur="loginEmailTouched = true"
                :class="{
                  'is-invalid': loginEmailTouched && !isLoginEmailValid,
                }"
              />
              <div class="invalid-feedback">
                올바른 이메일 형식을 입력해주세요.
              </div>
              <div class="form-group mt-3">
                <label for="exampleInputPassword1">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="비밀번호 입력"
                  v-model="loginPassword"
                />
              </div>
              <div class="d-flex gap-2 mt-4">
                <button type="submit" class="btn btn-primary">로그인</button>
                <button
                  type="button"
                  class="btn btn-secondary"
                  @click="openModal"
                >
                  회원가입
                </button>
              </div>
            </form>
          </div>
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
                <label for="email" class="form-label"
                  >이메일 <span class="text-danger">(필수)</span></label
                >
                <input
                  type="email"
                  class="form-control"
                  :class="{ 'is-invalid': regEmailTouched && !isEmailValid }"
                  id="email"
                  placeholder="이메일 입력"
                  v-model="regEmail"
                  @blur="regEmailTouched = true"
                />
                <div class="invalid-feedback">
                  올바른 이메일 형식을 입력해주세요.
                </div>
              </div>
              <div class="mb-3">
                <label for="password" class="form-label"
                  >비밀번호 <span class="text-danger">(필수)</span></label
                >
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="비밀번호 입력"
                  v-model="regPassword"
                />
              </div>
              <div class="mb-3">
                <label for="confirm" class="form-label"
                  >비밀번호 확인 <span class="text-danger">(필수)</span></label
                >
                <input
                  type="password"
                  class="form-control"
                  id="confirm"
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
              <div class="mb-3">
                <label for="name" class="form-label"
                  >이름 <span class="text-muted">(선택)</span></label
                >
                <input
                  type="text"
                  class="form-control"
                  id="name"
                  placeholder="이름 입력"
                  v-model="regName"
                />
              </div>
            </form>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" @click="closeModal">닫기</button>
            <button class="btn btn-primary" @click="handleRegister">
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

  if (!isEmailValid.value) {
    alert("이메일 형식을 다시 확인해주세요.");
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
    await authStore.login(regEmail.value, regPassword.value);
    // 로그인 정보는 지우고, 로그인 email 가져다가 ㄱ
    loginEmail.value = regEmail.value;
    loginPassword.value = "";
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
</script>

<style scoped>
.logo {
  width: 500px;
  height: auto;
}
.desc {
  font-size: 2rem;
  color: #555;
  text-align: center;
}
</style>
