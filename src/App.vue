<template>
  <h1>App.vue</h1>

  <!-- Header -->
  <Header></Header>

  <!-- NavBar -->
  <NavBar></NavBar>

  <!-- Page 렌더링 -->
  <RouterView></RouterView>

  <!-- Footer -->
  <Footer></Footer>
</template>

<script setup>
import Header from './components/Header.vue';
import NavBar from './components/NavBar.vue';
import Footer from './components/Footer.vue';
</script>
