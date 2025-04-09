<template>
  <nav
    class="sidebar d-none d-lg-flex flex-column align-items-center justify-content-evenly"
  >
    <RouterLink to="/analytics" class="menu-item" active-class="active">
      <i class="fa-solid fa-chart-simple fs-2"></i> <span>Analytics</span>
    </RouterLink>
    <RouterLink to="/calendar" class="menu-item" active-class="active">
      <i class="fa-solid fa-money-bill-transfer fs-2"></i>
      <span>Calendar</span>
    </RouterLink>
    <RouterLink to="/dashboard" class="menu-item" active-class="active">
      <i class="fas fa-table fs-2"></i>
      <span>Dashboard</span>
    </RouterLink>
    <RouterLink to="/profile" class="menu-item" active-class="active">
      <i class="fas fa-user fs-2"></i>
      <span>Profile</span>
    </RouterLink>
  </nav>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;700&display=swap");

.sidebar {
  width: 200px;
  background-color: #5b4f47;
  min-height: 100vh;
  padding: 20px 0;
}

.menu-item {
  width: 128px;
  height: 128px;
  background-color: white;
  color: #1f2b47;
  border-radius: 8px;
  text-align: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-decoration: none;
  font-family: "Orbitron", sans-serif; /* ✅ Orbitron 적용 */
  font-size: 16px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.15);
  transition: transform 0.2s ease;
  gap: 10px;
}

.menu-item:hover {
  background-color: #ced6eb;
  transform: scale(1.15);
}

.menu-item.active {
  background-color: #8893b1;
  color: white;
}
</style>
