<!-- CalendarTest.vue -->
<template>
  <div class="calendar-test">
    <h1>지출 페이지</h1>
    <FullCalendar :options="calendarOptions" class="simple-calendar" />
  </div>
</template>

<script setup>
import { ref } from "vue";
import FullCalendar from "@fullcalendar/vue3";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";

const calendarOptions = ref({
  plugins: [dayGridPlugin, interactionPlugin],
  initialView: "dayGridMonth",
  events: [
    { title: "예시1", date: "2025-04-05" },
    { title: "예시2", date: "2025-04-10" },
  ],
});
</script>

<style scoped>
.simple-calendar {
  max-width: 900px;
  margin: 40px auto;
}
</style>
