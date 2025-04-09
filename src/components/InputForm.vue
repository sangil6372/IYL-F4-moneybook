<template>
  <div class="mb-3">
    <label for="amount" class="form-label">금액</label>
    <div class="input-group">
      <input
        id="amount"
        type="number"
        class="form-control"
        v-model="form.amount"
        placeholder="0"
      />
      <span class="input-group-text">원</span>
    </div>
  </div>
  <!-- 수입/지출 선택 -->
  <div class="mb-3">
    <label class="form-label d-block">분류</label>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="radio"
        id="income"
        value="income"
        v-model="form.type"
      />
      <label class="form-check-label" for="income">수입</label>
    </div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="radio"
        id="expense"
        value="expense"
        v-model="form.type"
      />
      <label class="form-check-label" for="expense">지출</label>
    </div>
  </div>
  <!-- 고정 여부 -->
  <div class="mb-3">
    <label class="form-label d-block">고정 지출 여부</label>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="radio"
        id="true"
        value="true"
        v-model="form.fixedCost"
      />
      <label for="true"> 고정 지출 </label>
    </div>
    <div class="form-check form-check-inline">
      <input
        class="form-check-input"
        type="radio"
        id="false"
        value="false"
        v-model="form.fixedCost"
      />
      <label for="false"> 비고정 지출 </label>
    </div>
  </div>
  <!-- 카테고리 -->
  <div class="mb-3">
    <label for="category" class="form-label">카테고리</label>
    <select id="category" class="form-select" v-model="form.category">
      <option disabled value="">카테고리를 선택하세요</option>
      <option>식비</option>
      <option>의료</option>
      <option>교통</option>
      <option>여가</option>
      <option>통신</option>
      <option>급여</option>
      <option>기타</option>
    </select>
  </div>
  <!-- 메모 -->
  <div class="mb-3">
    <label for="memo" class="form-label">메모</label>
    <textarea
      id="memo"
      class="form-control"
      rows="2"
      v-model="form.memo"
      placeholder="자세한 내용을 입력해 주세요"
    ></textarea>
  </div>
</template>

<script setup>
const props = defineProps({
  form: {
    type: Object,
    required: true,
  },
});
const emit = defineEmits(["save"]);

function saveForm() {
  emit("save", props.form);
}
</script>
