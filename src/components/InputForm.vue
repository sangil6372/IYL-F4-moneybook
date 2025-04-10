<template>
  <div class="mb-3">
    <label :for="`amount-${uid}`" class="form-label fw-bold">
      <i class="fas fa-coins me-1 text-warning"></i> 금액
    </label>
    <div class="input-group">
      <input
        :id="`amount-${uid}`"
        type="number"
        class="form-control"
        v-model="form.amount"
        placeholder="0"
        min="0"
      />
      <span class="input-group-text">원</span>
    </div>
  </div>
  <!-- 분류 -->
  <div class="mb-3">
    <fieldset class="form-group">
      <legend class="form-label fw-bold mb-2">
        <i class="fas fa-money-bill-wave me-1 text-success"></i> 분류
      </legend>
      <div class="btn-group w-100" role="group" aria-label="분류 선택">
        <input
          type="radio"
          class="btn-check"
          :id="`${uid}-income`"
          value="income"
          v-model="form.type"
        />
        <label class="btn btn-outline-primary" :for="`${uid}-income`">
          <i class="fas fa-plus-circle me-1"></i> 수입
        </label>

        <input
          type="radio"
          class="btn-check"
          :id="`${uid}-expense`"
          value="expense"
          v-model="form.type"
        />
        <label class="btn btn-outline-danger" :for="`${uid}-expense`">
          <i class="fas fa-minus-circle me-1"></i> 지출
        </label>
      </div>
    </fieldset>
  </div>

  <!-- 고정 지출 여부 -->
  <div class="mb-3">
    <fieldset class="form-group">
      <legend class="form-label fw-bold mb-2">
        <i class="fas fa-thumbtack me-1 text-info"></i> 고정 지출 여부
      </legend>
      <div class="btn-group w-100" role="group" aria-label="고정 여부 선택">
        <input
          type="radio"
          class="btn-check"
          :id="`${uid}-fixed-true`"
          value="true"
          v-model="form.fixedCost"
        />
        <label class="btn btn-outline-secondary" :for="`${uid}-fixed-true`">
          <i class="fas fa-lock me-1"></i> 고정
        </label>

        <input
          type="radio"
          class="btn-check"
          :id="`${uid}-fixed-false`"
          value="false"
          v-model="form.fixedCost"
        />
        <label class="btn btn-outline-secondary" :for="`${uid}-fixed-false`">
          <i class="fas fa-unlock me-1"></i> 비고정
        </label>
      </div>
    </fieldset>
  </div>

  <div class="mb-3">
    <label :for="`category-${uid}`" class="form-label fw-bold">
      <i class="fas fa-list-ul me-1 text-primary"></i> 카테고리
    </label>
    <select
      :id="`category-${uid}`"
      class="form-select"
      v-model="form.category"
      required
    >
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

  <div class="mb-3">
    <label :for="`memo-${uid}`" class="form-label fw-bold">
      <i class="fas fa-pen me-1 text-muted"></i> 메모
    </label>
    <textarea
      :id="`memo-${uid}`"
      class="form-control"
      rows="3"
      v-model="form.memo"
      placeholder="자세한 내용을 입력해 주세요"
    ></textarea>
  </div>

  <!-- 저장 -->
  <div class="mb-3">
    <button class="btn btn-success w-100" @click="saveForm">
      <i class="fa-solid fa-floppy-disk me-2"></i> 저장
    </button>
  </div>
  
</template>

<script setup>
import { useId } from "vue";
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

const uid = useId();
</script>
