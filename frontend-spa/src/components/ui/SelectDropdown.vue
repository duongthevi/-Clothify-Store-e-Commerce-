<script setup>
defineProps({
  label: { type: String, default: '' },
  options: {
    type: Array,
    required: true,
  },
  modelValue: [String, Number, Boolean],
})

const emit = defineEmits(['update:modelValue'])

function updateValue(event) {
  emit('update:modelValue', event.target.value)
}
</script>

<template>
  <div class="mb-3">
    <label v-if="label" class="form-label">{{ label }}</label>
    <select class="form-select" :value="modelValue" @change="updateValue">
      <option disabled value="">-- Chọn --</option>
      <option
        v-for="option in options"
        :key="option.value"
        :value="option.value"
      >
        {{ option.label }}
      </option>
    </select>
  </div>
</template>
