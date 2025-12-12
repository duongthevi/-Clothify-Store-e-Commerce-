<script setup>
defineProps({
  users: { type: Array, default: () => [] },
  selectedUserId: { type: Number, default: -1 },
})

const emit = defineEmits(['select'])

function handleClick(user) {
  emit('select', user)
}
</script>

<template>
  <ul class="list-group list-group-flush">
    <li
      v-for="user in users"
      :key="user.id"
      class="list-group-item list-group-item-action d-flex align-items-center gap-3 py-3 px-4"
      :class="{ active: user.id === selectedUserId }"
      @click="handleClick(user)"
      style="cursor: pointer"
    >
      <div class="avatar flex-shrink-0 bg-secondary text-white rounded-circle d-flex justify-content-center align-items-center" style="width: 40px; height: 40px;">
        {{ user.name.charAt(0).toUpperCase() }}
      </div>
      <div class="flex-grow-1">
        <div class="fw-semibold">{{ user.name }}</div>
        <div class="text-muted small">{{ user.email }}</div>
      </div>
    </li>
  </ul>
</template>
