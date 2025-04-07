import { defineStore } from "pinia";
import axios from "axios";

export const useAuthStore = defineStore("auth", {
  state: () => ({
    user: null,
    token: localStorage.getItem("token") || "",
  }),
  getters: {
    isLoggedIn: (state) => !!state.user,
    userName: (state) => (state.user ? state.user.name : ""),
  },
  actions: {
    async register(email, password) {  // 회원 가입 로직 
      try {
        let name = "";  // 일단 임시로 이름은 공백
        //  이곳에 로직 필요! <-- 유효성 검사 
        const response = await axios.post("http://localhost:3000/users", {
          name,
          email,
          password,
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

        if (response.data.length > 0) { // 정상적으로 반환하면 
          const user = response.data[0];
          this.user = user;
          this.token = btoa(`${user.email}:${user.password}`); // Base64 암호화
          localStorage.setItem("token", this.token);
          localStorage.setItem("user", JSON.stringify(user)); // 사용자 정보도 저장

        // settings 추가  <--- 일단 나중에 진행
        //   const settingsResponse = await axios.get(
        //     `http://localhost:3000/settings?userId=${user.id}`
        //   );
        //   if (settingsResponse.data.length === 0) {
        //     // 없는 경우 추가(첫 생성)
        //     await axios.post("http://localhost:3000/settings", {
        //       userId: user.id,
        //       notifications: true,
        //       language: "kor",
        //       theme: "light",
        //     });
        //   }
        } else {
          throw new Error("이메일 혹은 비밀번호가 일치하지 않습니다.");
        }
      } catch (error) {
        console.error("로그인 오류:", error);
        throw error;
      }
    },
    logout() {   // 상태 초기화 
      this.user = null;
      this.token = "";
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    },
    loadUserFromStorage() {
      const user = localStorage.getItem("user");
      if (user) {
        this.user = JSON.parse(user);
        this.token = localStorage.getItem("token");
      }
    },
  },
});
