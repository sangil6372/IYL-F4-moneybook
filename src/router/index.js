import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/HomePage.vue";
import { useAuthStore } from "@/stores/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: Home,
    },
    {
      path: "/calendar",
      name: "calendar",
      meta: { requiresAuth: true },
      component: () => import("../pages/CalendarPage.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      meta: { requiresAuth: true },
      component: () => import("../pages/DashboardPage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      meta: { requiresAuth: true },
      component: () => import("../pages/ProfilePage.vue"),
    },
    {
      path: "/analytics",
      name: "analytics",
      meta: { requiresAuth: true },
      component: () => import("../pages/AnalyticsPage.vue"),
    },
    {
      path: "/:pathMatch(.*)*",
      name: "not-found",
      component: () => import("../pages/NotFoundPage.vue"),
    },
  ],
});

//  여기에 네비게이션 가드 추가
router.beforeEach(async (to, from, next) => {
  const authStore = useAuthStore();
  await authStore.loadUserFromStorage(); // 반드시 실행되어야 로그인 상태 복원

  if (to.meta.requiresAuth && !authStore.isLoggedIn) {
    next({ name: "home" }); // 비로그인 시 접근 차단
  } else if (to.path === "/" && authStore.isLoggedIn) {
    next({ name: "dashboard" }); // 로그인된 사용자가 홈으로 가면 대시보드로 이동
  } else {
    next();
  }
});

export default router;
