<script setup>
defineProps({
  title: { type: String, default: 'Thông báo' },
  show: { type: Boolean, default: false },
})

const emit = defineEmits(['close'])
</script>

<template>
  <Teleport to="body">
    <div v-if="show">
      <!-- Modal -->
      <div class="modal fade show d-block" tabindex="-1" role="dialog">
        <div class="modal-dialog modal-dialog-centered" role="document">
          <div class="modal-content">
            <!-- Header -->
            <div class="modal-header">
              <h5 class="modal-title">
                <i class="fa-solid fa-circle-info me-2"></i> {{ title }}
              </h5>
              <button type="button" class="btn-close" @click="emit('close')" />
            </div>

            <!-- Body -->
            <div class="modal-body">
              <slot>
                <p>Nội dung modal...</p>
              </slot>
            </div>

            <!-- Footer -->
            <div class="modal-footer">
              <slot name="footer">
                <button class="btn btn-secondary" @click="emit('close')">
                  <i class="fa-solid fa-xmark"></i> Đóng
                </button>
              </slot>
            </div>
          </div>
        </div>
      </div>

      <!-- Backdrop -->
      <div class="modal-backdrop fade show"></div>
    </div>
  </Teleport>
</template>
