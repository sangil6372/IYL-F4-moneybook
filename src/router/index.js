import { createRouter, createWebHistory } from "vue-router";
import Home from "../pages/HomePage.vue";

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
      component: () => import("../pages/CalendarPage.vue"),
    },
    {
      path: "/dashboard",
      name: "dashboard",
      component: () => import("../pages/DashboardPage.vue"),
    },
    {
      path: "/profile",
      name: "profile",
      component: () => import("../pages/ProfilePage.vue"),
    },
    {
      path: "/analytics",
      name: "analytics",
      component: () => import("../pages/AnalyticsPage.vue"),
    },
    {
      path: "/goal",
      name: "goal",
      component: () => import("../pages/GoalPage.vue"),
    },
    // 추가 페이지들은 transaction 참고하여 이 아래에 작성...
    // lazy loading...
  ],
});

export default router;
