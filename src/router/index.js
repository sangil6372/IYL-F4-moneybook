import { createRouter, createWebHistory } from 'vue-router';
import Home from '../pages/HomePage.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/transaction',
      name: 'transaction',
      component: () => import('../pages/TransactionPage.vue'),
    },
    // 추가 페이지들은 transaction 참고하여 이 아래에 작성...
    // lazy loading...
  ],
});

export default router;
