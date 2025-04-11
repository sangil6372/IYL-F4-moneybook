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
        const response = await axios.post("/api/users", {
          name,
          email,
          password,
          profileImage: null, // 프로필 이미지 초기값은 null
          // 기본 settings 값을 설정하여 추가
          settings: {
            language: "kor", // 기본 언어 설정
            theme: "light", // 기본 테마 설정
            currency: "won",
          },
          // 목표 초기화
          goals: {
            month: {
              total: 0,
              categories: {
                식비: 0,
                의료: 0,
                교통: 0,
                여가: 0,
                통신: 0,
                급여: 0,
                기타: 0,
              },
            },
            year: {
              total: 0,
              categories: {
                식비: 0,
                의료: 0,
                교통: 0,
                여가: 0,
                통신: 0,
                급여: 0,
                기타: 0,
              },
            },
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
      if (!email || !password) {
        throw new Error("이메일과 비밀번호를 모두 입력해주세요.");
      }
      try {
        const response = await axios.get(
          `/api/users?email=${email}&password=${password}`
        );

        if (response.data.length > 0) {
          // 정상적으로 반환하면
          const user = response.data[0];
          this.user = user;
          sessionStorage.setItem("userId", user.id); // user 전체 대신 id만 저장

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
      sessionStorage.removeItem("userId");
    },

    // Rotuer의 네비게이션 가드에서 체크함
    // 새로 고침 시 sessonID 로 재요청!
    async loadUserFromStorage() {
      const userId = sessionStorage.getItem("userId");
      if (userId) {
        try {
          const res = await axios.get(`/api/users/${userId}`);
          this.user = res.data;
        } catch (err) {
          console.error("유저 불러오기 실패", err);
          this.user = null;
          sessionStorage.removeItem("userId");
        }
      }
    },
    
    updateGoals(goals) {
      if (this.user) {
        this.user.goals = goals;
      }
    },
  },

});
