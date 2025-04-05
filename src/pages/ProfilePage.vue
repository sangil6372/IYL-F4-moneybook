<template>
  <div class="container mt-5">
    <div class="card mx-auto shadow-sm p-4" style="max-width: 500px">
      <div class="text-center mb-4">
        <img
          :src="`https://i.pravatar.cc/150?u=${user.email}`"
          alt="프로필 이미지"
          class="rounded-circle mb-2"
          width="100"
          height="100"
        />

        <h4 class="mb-0">{{ user.name }}</h4>
        <small class="text-muted">{{ user.email }}</small>
      </div>

      <hr />

      <ul class="list-group list-group-flush mb-3">
        <li class="list-group-item d-flex justify-content-between">
          <span>가입일</span><span>{{ user.signupDate }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>최근 로그인</span><span>{{ user.lastLogin }}</span>
        </li>
        <li class="list-group-item d-flex justify-content-between">
          <span>계정 상태</span><span class="text-success">활성</span>
        </li>
      </ul>

      <div class="d-grid gap-2">
        <button class="btn btn-outline-primary">비밀번호 변경</button>
        <button class="btn btn-outline-danger">로그아웃</button>
      </div>
    </div>
  </div>
</template>

<script setup>
const user = {
  name: "박상일",
  email: "sangil@example.com",
  signupDate: "2024-12-31",
  lastLogin: "2025-04-05",
};
</script>
