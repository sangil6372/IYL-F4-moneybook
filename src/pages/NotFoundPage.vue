<template>
  <div class="notfound-wrapper">
    <div class="content">
      <h1 class="error-code">404</h1>
      <p class="message">페이지를 찾을 수 없습니다.</p>
      <router-link to="/" class="btn btn-primary mt-3">
        로그인 화면으로 이동
      </router-link>
    </div>
  </div>
</template>

<style scoped>
.notfound-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  text-align: center;
  background-color: #f8f9fa;
}

.error-code {
  font-size: 10rem;
  font-weight: bold;
  color: #343a40;
  margin-bottom: 1rem;
}

.message {
  font-size: 3rem;
  color: #6c757d;
}

.btn-primary {
  font-size: 3rem;
}
</style>
