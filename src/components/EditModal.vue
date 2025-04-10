<template>
    <div class="modal-overlay">
      <div class="modal">
        <h3>거래 수정</h3>
        
        <!-- 날짜 -->
        <label>날짜</label>
        <input type="date" v-model="form.date" />
  
        <!-- 금액 -->
        <label>금액</label>
        <input type="number" v-model="form.amount" />
  
        <!-- 유형 -->
        <label>분류</label>
        <select v-model="form.type">
          <option value="expense">지출</option>
          <option value="income">수입</option>
        </select>
  
        <!-- 카테고리 -->
        <label>카테고리</label>
        <select v-model="form.category">
          <option disabled value="">카테고리를 선택하세요</option>
          <option value="식비">식비</option>
          <option value="의료">의료</option>
          <option value="교통">교통</option>
          <option value="여가">여가</option>
          <option value="통신">통신</option>
          <option value="급여">급여</option>
          <option value="기타">기타</option>
        </select>
  
        <!-- 메모 -->
        <label>메모</label>
        <input type="text" v-model="form.memo" />
  
        <!-- 버튼 -->
        <div class="modal-actions">
          <button @click="handleUpdate">수정</button>
          <button @click="$emit('close')">닫기</button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { reactive, watch } from 'vue';
  import { useCalendar } from '@/stores/calendar'
  
  const props = defineProps({
    editForm: Object, // 부모로부터 전달된 수정 대상
  });
  
  const emit = defineEmits(['close', 'updated']);
  
  const useStore = useCalendar();
  
  // 내부 수정 폼 (reactive로 따로 감지)
  const form = reactive({
    id: null,
    date: "",
    amount: 0,
    type: "expense",
    category: "",
    memo: "",
  });
  
  // editForm 값이 바뀌면 내부 form에 복사
  watch(() => props.editForm, (newForm) => {
    Object.assign(form, newForm);
  }, { immediate: true });
  
  // 수정 요청 실행 함수
  async function handleUpdate() {
    try {
      await useStore.updateTransaction(form.id, form); // store의 업데이트 함수 호출
      emit('updated');  // 부모에게 수정 완료 알림
      emit('close');    // 모달 닫기
    } catch (err) {
      alert("수정 중 오류 발생: " + err.message);
    }
  }
  </script>
  
  <style scoped>
  .modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;

    z-index: 1000;

    background-color: rgba(0, 0, 0, 0.4);
    display: flex;
    justify-content: center;
    align-items: center;
  }
  .modal {
    z-index: 1001;
    position: relative;
    background: white;
    padding: 20px;
    border-radius: 12px;
    width: 300px;

  display: block;
  opacity: 1;
  visibility: visible;
  }
  .modal-actions {
    display: flex;
    justify-content: space-between;
    margin-top: 16px;
  }
  </style>
  