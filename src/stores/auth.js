import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => (state.user ? state.user.name : ""),
  },
  actions: {
    async register(name, email, password) {
      // 회원 가입 로직
      try {
        const response = await axios.post("http://localhost:3000/users", {
          name,
          email,
          password,
          profileImage: null, // 프로필 이미지 초기값은 null
          // 기본 settings 값을 설정하여 추가
          settings: {
            language: "kor", // 기본 언어 설정
            theme: "light", // 기본 테마 설정
          },
        });
        if (response.status === 201) {
          alert("회원가입이 완료되었습니다.");
        } else {
          throw new Error("형식을 확인해주세요");
        }
      } catch (error) {
        console.error("회원가입 오류:", error);
        throw error;
      }
    },
    async login(email, password) {
      try {
        const response = await axios.get(
          `http://localhost:3000/users?email=${email}&password=${password}`
        );

        if (response.data.length > 0) {
          // 정상적으로 반환하면
          const user = response.data[0];
          this.user = user;
          localStorage.setItem("user", JSON.stringify(user)); // 사용자 정보도 저장

          // settings 테이블을 추가하려고 했는데 그냥 속성으로 추가
        } else {
          throw new Error("이메일 혹은 비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("로그인 오류:", error);
        throw error;
      }
    },
    logout() {
      // 상태 초기화
      this.user = null;
      localStorage.removeItem("user");
    },
    // Rotuer의 네비게이션 가드에서 체크함
    loadUserFromStorage() {
      const user = localStorage.getItem("user");
      if (user) {
        // 여기선 일단 단순히 user가 localStorage에 있으면 로그인 중이라고 체크
        this.user = JSON.parse(user);
      }
    },
  },
});
