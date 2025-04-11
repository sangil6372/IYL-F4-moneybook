<template>
  <div class="container">
    <div class="overlay" id="overlay" ref="overlay">
      <div class="sign-in" id="sign-in" ref="leftText">
        <h1>Welcome SADARI</h1>
        <p>To keep connected with us please login with your personal info</p>
        <button
          class="switch-button"
          id="slide-right-button"
          ref="slideRightButton"
        >
          Sign In
        </button>
      </div>
      <div class="sign-up" id="sign-up" ref="rightText">
        <h1>Hello, Friend!</h1>
        <p>Enter your personal details and start a journey with us</p>
        <button
          class="switch-button"
          id="slide-left-button"
          ref="slideLeftButton"
        >
          Sign Up
        </button>
      </div>
    </div>
    <div class="form">
      <div class="sign-in" id="sign-in-info" ref="accountForm">
        <h1>Sign In</h1>
        <p class="small">or use your email account:</p>
        <form id="sign-in-form" @submit.prevent="handleLogin">
          <input type="email" placeholder="Email" v-model="loginEmail" />
          <input
            type="password"
            placeholder="Password"
            v-model="loginPassword"
          />
          <button class="control-button in">Sign In</button>
        </form>
      </div>
      <div class="sign-up" id="sign-up-info" ref="signinForm">
        <h1>Create Account</h1>
        <p class="small">or use your email for registration:</p>
        <form id="sign-up-form" @submit.prevent="handleRegister">
          <input type="text" placeholder="Name" v-model="regName" />
          <input
            type="email"
            placeholder="Email"
            v-model="regEmail"
            @blur="regEmailTouched = true"
            :class="{
              'is-invalid':
                regEmailTouched && (!isEmailValid || isDuplicateEmail),
            }"
          />
          <div v-if="regEmailTouched && !isEmailValid" class="invalid-feedback">
            올바른 이메일 형식을 입력해주세요.
          </div>
          <div
            v-else-if="regEmailTouched && isDuplicateEmail"
            class="invalid-feedback"
          >
            이미 등록된 이메일입니다.
          </div>
          <div v-if="isEmailValid && !isDuplicateEmail" class="valid-feedback">
            사용 가능한 이메일입니다.
          </div>
          <input type="password" placeholder="Password" v-model="regPassword" />
          <input
            type="password"
            placeholder="rePassword"
            v-model="regConfirm"
            @blur="regConfirmTouched = true"
            input="isDuplicateEmail = false"
            :class="{ 'is-invalid': regConfirmTouched && !isPasswordMatch }"
          />
          <div
            class="invalid-feedback"
            v-if="regConfirmTouched && !isPasswordMatch"
          >
            비밀번호가 일치하지 않습니다.
          </div>
          <button class="control-button up" type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  </div>
  <!-- 여기 위에서부터 내가 커스텀 -->
</template>

<script setup>
import { ref, onMounted } from "vue";
import { Modal } from "bootstrap";
import { useAuthStore } from "@/stores/auth";
import { useRouter } from "vue-router";
import { computed } from "vue";
import axios from "axios";
import { watch } from "vue";

const modalRef = ref(null);
let modalInstance = null;

const regEmail = ref("");
const regPassword = ref("");
const regConfirm = ref("");
const loginEmail = ref("");
const loginPassword = ref("");
const regName = ref("");
// 여기서부터
const overlay = ref(null);
const leftText = ref(null);
const rightText = ref(null);
const accountForm = ref(null); // sign-in-info
const signinForm = ref(null); // sign-up-info
const slideRightButton = ref(null);
const slideLeftButton = ref(null);
// 여기까지 asd1.html script
const router = useRouter();
const authStore = useAuthStore();

watch(regEmail, () => {
  isDuplicateEmail.value = false;
});

// onMounted(() => {
//   // modalInstance = new Modal(modalRef.value); 아마도 기존의 modal 창
// });
//여기서 부터
onMounted(() => {
  const overlayEl = overlay.value;
  const leftTextEl = leftText.value;
  const rightTextEl = rightText.value;
  const accountFormEl = accountForm.value;
  const signinFormEl = signinForm.value;

  accountFormEl.style.display = "flex";
  signinFormEl.style.display = "none";

  overlayEl.classList.add("open-sign-in");
  leftTextEl.classList.add("overlay-text-left-animation");
  rightTextEl.classList.add("overlay-text-right-animation");

  const openSignUp = () => {
    leftTextEl.classList.remove("overlay-text-left-animation-out");
    overlayEl.classList.remove("open-sign-in");
    rightTextEl.classList.remove("overlay-text-right-animation");

    accountFormEl.classList.add("form-left-slide-out");
    rightTextEl.classList.add("overlay-text-right-animation-out");
    overlayEl.classList.add("open-sign-up");
    leftTextEl.classList.add("overlay-text-left-animation");

    setTimeout(() => {
      accountFormEl.classList.remove("form-left-slide-in");
      accountFormEl.style.display = "none";
      accountFormEl.classList.remove("form-left-slide-out");
    }, 700);

    setTimeout(() => {
      signinFormEl.style.display = "flex";
      signinFormEl.classList.add("form-right-slide-in");
    }, 200);
  };

  const openSignIn = () => {
    leftTextEl.classList.remove("overlay-text-left-animation");
    overlayEl.classList.remove("open-sign-up");
    rightTextEl.classList.remove("overlay-text-right-animation-out");

    signinFormEl.classList.add("form-right-slide-out");
    leftTextEl.classList.add("overlay-text-left-animation-out");
    overlayEl.classList.add("open-sign-in");
    rightTextEl.classList.add("overlay-text-right-animation");

    setTimeout(() => {
      signinFormEl.classList.remove("form-right-slide-in");
      signinFormEl.style.display = "none";
      signinFormEl.classList.remove("form-right-slide-out");
    }, 700);

    setTimeout(() => {
      accountFormEl.style.display = "flex";
      accountFormEl.classList.add("form-left-slide-in");
    }, 200);
  };
  slideRightButton.value?.addEventListener("click", openSignIn);
  slideLeftButton.value?.addEventListener("click", openSignUp);
});
//여기까지가 asd1.html script

// 이거를 모달로 나왔을 때는 사용하지만 지금은 사용하지 않으니까 주석처리함. 안하면 회원가입 안됨.
// function openModal() { openModal(),closeModal() 이거를 모달로 나왔을 때는 사용하지만 지금은 사용하지 않으니까 주석처리함.
//   modalInstance.show();
// }

// function closeModal() {
//   modalInstance.hide();

//   // 초기화
//   regEmail.value = '';
//   regPassword.value = '';
//   regConfirm.value = '';
//   regName.value = '';

//   regEmailTouched.value = false;
//   regConfirmTouched.value = false;
// }

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

//  회원가입 버튼 핸들러
async function handleRegister() {
  regEmailTouched.value = true;
  regConfirmTouched.value = true;

  if (!isEmailValid.value) {
    alert("이메일 형식이 잘못됐거나 이미 등록된 이메일입니다.");
    return;
  }
  // 중복 확인 먼저 실행
  await checkEmailExists();

  if (isDuplicateEmail.value) {
    alert("이미 등록된 이메일입니다.");
    return;
  }

  if (!isPasswordMatch.value) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }
  console.log("try 들어오기 전");
  try {
    await authStore.register(
      regName.value.trim(),
      regEmail.value.trim(),
      regPassword.value.trim()
    );
    console.log("try 들어오기 후");
    loginEmail.value = regEmail.value;
    // closeModal(); 이거를 모달로 나왔을 때는 사용하지만 지금은 사용하지 않으니까 주석처리함. 안하면 회원가입 안됨.
    slideRightButton.value?.click();
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

async function checkEmailExists() {
  checkingEmail.value = true;

  try {
    const res = await axios.get(
      `/api/users?email=${regEmail.value}`
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
/* 여기 body,html이렇게 되어있었음, 근데 내가 * 로 해볼라고 */
/* body,
html {
  width: 100%;
  height: 100%;
  margin: 0;
  font-family: 'Helvetica Neue', sans-serif;
  letter-spacing: 0.5px;
} */

.container {
  width: var(--form-width);
  height: var(--form-height);
  position: relative;
  margin: auto;
  box-shadow: 2px 10px 40px rgba(22, 20, 19, 0.4);
  border-radius: 10px;
  margin-top: 50px;
  padding: 0;
}

.container,
.container * {
  box-sizing: content-box;
}

/* Overlay*/
.overlay {
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  background-image: linear-gradient(
    to right,
    var(--left-color),
    var(--right-color)
  );
  border-radius: 10px;
  color: white;
  clip: rect(0, 385px, var(--form-height), 0);
}

.open-sign-up {
  animation: slideleft 1s linear forwards;
}

.open-sign-in {
  animation: slideright 1s linear forwards;
}

.overlay .sign-in,
.overlay .sign-up {
  /*  Width is 385px - padding  */
  --padding: 50px;
  width: calc(385px - var(--padding) * 2);
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0px var(--padding);
  text-align: center;
}

.overlay .sign-in {
  float: left;
}

.overlay-text-left-animation {
  animation: text-slide-in-left 1s linear;
}
.overlay-text-left-animation-out {
  animation: text-slide-out-left 1s linear;
}

.overlay .sign-up {
  float: right;
}

.overlay-text-right-animation {
  animation: text-slide-in-right 1s linear;
}

.overlay-text-right-animation-out {
  animation: text-slide-out-right 1s linear;
}

.overlay h1 {
  margin: 0px 5px;
  font-size: 2.1rem;
}

.overlay p {
  margin: 20px 0px 30px;
  font-weight: 200;
}
/* Buttons*/
.switch-button,
.control-button {
  cursor: pointer;
  display: block;
  margin-left: auto;
  margin-right: auto;
  width: 140px;
  height: 40px;
  font-size: 14px;
  text-transform: uppercase;
  background: none;
  border-radius: 20px;
  color: white;
}

.switch-button {
  border: 2px solid;
}

.control-button {
  border: none;
  margin-top: 15px;
}

.switch-button:focus,
.control-button:focus {
  outline: none;
}

.control-button.up {
  background-color: var(--left-color);
}

.control-button.in {
  background-color: var(--right-color);
}

/*Forms*/
.form {
  width: 100%;
  height: 100%;
  position: absolute;
  border-radius: 10px;
}

.form .sign-in,
.form .sign-up {
  --padding: 50px;
  position: absolute;
  /*  Width is 100% - 385px - padding  */
  width: calc(var(--form-width) - 385px - var(--padding) * 2);
  height: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 0px var(--padding);
  text-align: center;
}

/* Sign in is initially not displayed */
/* .form .sign-in {
  display: none;
} */

.form .sign-in {
  left: 0;
}

.form .sign-up {
  right: 0;
}

.form-right-slide-in {
  animation: form-slide-in-right 1s;
}

.form-right-slide-out {
  animation: form-slide-out-right 1s;
}

.form-left-slide-in {
  animation: form-slide-in-left 1s;
}

.form-left-slide-out {
  animation: form-slide-out-left 1s;
}

.form .sign-in h1 {
  color: var(--right-color);
  margin: 0;
}

.form .sign-up h1 {
  color: var(--left-color);
  margin: 0;
}

.social-media-buttons {
  display: flex;
  justify-content: center;
  width: 100%;
  margin: 15px;
}

.social-media-buttons .icon {
  width: 40px;
  height: 40px;
  border: 1px solid #dadada;
  border-radius: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  margin: 10px 7px;
}

.small {
  font-size: 13px;
  color: grey;
  font-weight: 200;
  margin: 5px;
}

.social-media-buttons .icon svg {
  width: 25px;
  height: 25px;
}

#sign-in-form input,
#sign-up-form input {
  margin: 12px;
  font-size: 14px;
  padding: 15px;
  width: 260px;
  font-weight: 300;
  border: none;
  background-color: #e4e4e494;
  font-family: "Helvetica Neue", sans-serif;
  letter-spacing: 1.5px;
  padding-left: 20px;
}

#sign-in-form input::placeholder {
  letter-spacing: 1px;
}

.forgot-password {
  font-size: 12px;
  display: inline-block;
  border-bottom: 2px solid #efebeb;
  padding-bottom: 3px;
}

.forgot-password:hover {
  cursor: pointer;
}

/* Animation*/
@keyframes slideright {
  0% {
    clip: rect(0, 385px, var(--form-height), 0);
  }
  30% {
    clip: rect(0, 480px, var(--form-height), 0);
  }
  /*  we want the width to be slightly larger here  */
  50% {
    clip: rect(
      0px,
      calc(var(--form-width) / 2 + 480px / 2),
      var(--form-height),
      calc(var(--form-width) / 2 - 480px / 2)
    );
  }
  80% {
    clip: rect(
      0px,
      var(--form-width),
      var(--form-height),
      calc(var(--form-width) - 480px)
    );
  }
  100% {
    clip: rect(
      0px,
      var(--form-width),
      var(--form-height),
      calc(var(--form-width) - 385px)
    );
  }
}

@keyframes slideleft {
  100% {
    clip: rect(0, 385px, var(--form-height), 0);
  }
  70% {
    clip: rect(0, 480px, var(--form-height), 0);
  }
  /*  we want the width to be slightly larger here  */
  50% {
    clip: rect(
      0px,
      calc(var(--form-width) / 2 + 480px / 2),
      var(--form-height),
      calc(var(--form-width) / 2 - 480px / 2)
    );
  }
  30% {
    clip: rect(
      0px,
      var(--form-width),
      var(--form-height),
      calc(var(--form-width) - 480px)
    );
  }
  0% {
    clip: rect(
      0px,
      var(--form-width),
      var(--form-height),
      calc(var(--form-width) - 385px)
    );
  }
}

@keyframes text-slide-in-left {
  0% {
    padding-left: 20px;
  }
  100% {
    padding-left: 50px;
  }
}

@keyframes text-slide-in-right {
  0% {
    padding-right: 20px;
  }
  100% {
    padding-right: 50px;
  }
}

@keyframes text-slide-out-left {
  0% {
    padding-left: 50px;
  }
  100% {
    padding-left: 20px;
  }
}

@keyframes text-slide-out-right {
  0% {
    padding-right: 50px;
  }
  100% {
    padding-right: 20px;
  }
}

@keyframes form-slide-in-right {
  0% {
    padding-right: 100px;
  }
  100% {
    padding-right: 50px;
  }
}

@keyframes form-slide-in-left {
  0% {
    padding-left: 100px;
  }
  100% {
    padding-left: 50px;
  }
}

@keyframes form-slide-out-right {
  0% {
    padding-right: 50px;
  }
  100% {
    padding-right: 80px;
  }
}

@keyframes form-slide-out-left {
  0% {
    padding-left: 50px;
  }
  100% {
    padding-left: 80px;
  }
}
</style>
