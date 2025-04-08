<template>
  <div class="layout">
    <div id="sidebar">
      <header>
        <RouterLink to="/">SADARI</RouterLink>
      </header>
      <ul class="nav">
        <li>
          <RouterLink to="/analytics" class="nav-link" active-class="active">
            <i class="fa-solid fa-chart-simple"></i> Analytics
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/transaction" class="nav-link" active-class="active">
            <i class="fa-solid fa-money-bill-transfer"></i> Calendar
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/dashboard" class="nav-link" active-class="active">
            <i class="fas fa-table"></i> Dashboard
          </RouterLink>
        </li>
        <li>
          <RouterLink to="/profile" class="nav-link" active-class="active">
            <i class="fas fa-user"></i> Profile
          </RouterLink>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from "vue-router";
</script>

<style scoped>
@import url("https://fonts.googleapis.com/css?family=Roboto:300,400,400i,500");

.layout {
  display: flex;
  min-height: 100vh;
}

#sidebar {
  z-index: 1000;
  width: 250px;
  height: 100vh;
  overflow-y: auto;
  background: #37474f;
  transition: all 0.5s ease;
  font-family: "Roboto", sans-serif;
  flex-shrink: 0;
}

#sidebar header {
  background-color: #263238;
  font-size: 20px;
  line-height: 52px;
  text-align: center;
}

#sidebar header a {
  color: #fff;
  display: block;
  text-decoration: none;
}

#sidebar .nav {
  list-style: none;
  margin: 0;
  padding: 0;
}

#sidebar .nav li {
  display: block;
  width: 100%;

}

#sidebar .nav .nav-link {
  width: 100%;
  display: block;
  border-bottom: 1px solid #455a64;
  color: #cfd8dc;
  font-size: 14px;
  padding: 16px 24px;
  text-decoration: none;
  transition: background 0.3s, color 0.3s;
}

#sidebar .nav .nav-link:hover {
  background: #57bfb8;
  color: #eceff1;
}

#sidebar .nav .nav-link.active {
  background: #546e7a;
  color: #fff;
}

#sidebar .nav .nav-link i {
  margin-right: 16px;
}
</style>
