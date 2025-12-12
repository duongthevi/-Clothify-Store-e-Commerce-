<script setup>
import { watch } from 'vue'
const model = defineModel({
  type: String,
  default: '',
})

const emit = defineEmits(['search'])

function onClick() {
   console.log('[InputSearch] search query:', model.value)
  emit('search', model.value)
}

watch(model, (newValue) => {
  emit('search', newValue)
})
</script>

<template>
  <div class="input-group">
    <input 
      type="text" 
      class="form-control px-3" 
      placeholder="Nhập thông tin cần tìm" 
      v-model="model"
    />
    <button 
      class="btn btn-outline-secondary" 
      type="button" 
      @click="onClick"
    >
      <i class="fas fa-search"></i>
    </button>
  </div>
</template>
