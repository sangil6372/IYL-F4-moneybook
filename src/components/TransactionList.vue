<template>
  <ul class="list-group mb-3" v-if="transactions.length">
    <li
      v-for="item in transactions"
      :key="item.id"
      class="list-group-item d-flex justify-content-between align-items-center flex-wrap"
    >
      <div>
        <span
          :class="item.type === 'income' ? 'text-success' : 'text-danger'"
          class="fw-bold"
        >
          {{ item.type === "income" ? "+" : "-"
          }}{{ item.amount.toLocaleString() }}원
        </span>
        <span class="text-muted ms-2">{{ item.category }}</span>
        <span
          v-if="item.fixedCost === 'true'"
          class="badge bg-warning text-dark ms-2"
          >고정</span
        >
      </div>
      <div>
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
