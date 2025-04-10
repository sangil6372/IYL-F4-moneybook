<template>
  <ul class="list-group my-3" v-if="transactions.length">
    <li
      v-for="item in transactions"
      :key="item.id"
      class="list-group-item d-flex justify-content-between align-items-center flex-wrap"
    >
      <!-- 금액 + 카테고리 -->
      <div class="flex-grow-1 me-3" style="min-width: 0">
        <span
          :class="item.type === 'income' ? 'text-success' : 'text-danger'"
          class="fw-bold"
        >
          {{ item.type === "income" ? "+" : "-"
          }}{{ item.amount.toLocaleString() }}원
        </span>
        <span class="text-muted ms-2">{{ item.category }}</span>
      </div>

      <!-- 고정 + 버튼들 -->
      <div class="d-flex align-items-center flex-shrink-0">
        <span
          v-if="item.fixedCost === 'true'"
          class="badge bg-warning text-dark me-2"
        >
          고정
        </span>
        <button
          class="btn btn-sm btn-outline-primary me-2"
          @click="editTransaction(item)"
        >
          수정
        </button>
        <button
          class="btn btn-sm btn-outline-danger"
          @click="deleteTransaction(item.id)"
        >
          삭제
        </button>
      </div>
    </li>
  </ul>
</template>

<script setup>
const props = defineProps({
  transactions: {
    type: Array,
    required: true,
  },
});
const emit = defineEmits(["edit", "delete"]);
function editTransaction(item) {
  emit("edit", item);
}
function deleteTransaction(id) {
  emit("delete", id);
}
</script>
