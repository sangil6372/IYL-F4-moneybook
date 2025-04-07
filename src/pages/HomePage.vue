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
            <form>
              <div class="form-group">
                <label for="exampleInputEmail1">이메일</label>
                <input
                  type="email"
                  class="form-control"
                  id="exampleInputEmail1"
                  placeholder="Enter email"
                />
              </div>
              <div class="form-group mt-3">
                <label for="exampleInputPassword1">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  id="exampleInputPassword1"
                  placeholder="Password"
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
                <label for="email" class="form-label">이메일</label>
                <input
                  type="email"
                  class="form-control"
                  id="email"
                  placeholder="이메일 입력"
                  v-model="regEmail"
                />
              </div>
              <div class="mb-3">
                <label for="password" class="form-label">비밀번호</label>
                <input
                  type="password"
                  class="form-control"
                  id="password"
                  placeholder="비밀번호 입력"
                  v-model="regPassword"
                />
              </div>
              <div class="mb-3">
                <label for="confirm" class="form-label">비밀번호 확인</label>
                <input
                  type="password"
                  class="form-control"
                  id="confirm"
                  placeholder="비밀번호 확인"
                  v-model="regConfirm"
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
import { useRouter } from 'vue-router'

const modalRef = ref(null);
let modalInstance = null;

const regEmail = ref("");
const regPassword = ref("");
const regConfirm = ref("");
// const regName = ref('') 이름은 아직

const router = useRouter()
const authStore = useAuthStore();

onMounted(() => {
  modalInstance = new Modal(modalRef.value);
});

function openModal() {
  modalInstance.show();
}

function closeModal() {
  modalInstance.hide();
}

//  회원가입 버튼 핸들러
async function handleRegister() {
  if (regPassword.value !== regConfirm.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  try {
    // 1. 회원가입
    await authStore.register(regEmail.value, regPassword.value); // regName.value 일단 이름은 빼고

    // 2. 바로 로그인
    await authStore.login(regEmail.value, regPassword.value);

    // 3. 모달 닫기
    closeModal();

    // 4. 리다이렉트 or 알림
    alert("회원가입 및 로그인 완료!");
    // 메인 페이지로 이동
    router.push("/dashboard");
  } catch (e) {
    alert("회원가입 또는 로그인 중 오류가 발생했습니다.");
    console.error(e);
  }
}
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
