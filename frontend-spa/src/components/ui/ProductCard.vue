<script setup>
defineProps({
  name: String,
  price: String,
  image: String,
  stock: Number,
  size: String,
  link: {
    type: String,
    default: '#',
  },
  buttonText: {
    type: String,
    default: 'Details',
  },
});
</script>

<template>
  <div class="card h-100 border-0 shadow rounded-4 overflow-hidden">
    <div class="position-relative pt-2" style="height: 200px;">
      <img
        :src="image"
        class="w-100 h-100 object-fit-cover rounded-top mb-2"
        alt="Product Image"
      />
      <span
        v-if="stock === 0"
        class="badge bg-danger position-absolute top-0 end-0 m-2"
      >
        Out of Stock
      </span>
    </div>

    <div class="card-body d-flex flex-column">
      <h5 class="card-title text-truncate">{{ name }}</h5>

      <div class="mb-2 text-muted small">
        <strong>Price:</strong>
        {{ Number(price)?.toLocaleString('vi-VN') || 'N/A' }}₫
      </div>

      <div class="mb-2 small">
        <strong>Stock:</strong>
        {{ stock ?? 'N/A' }}
      </div>

      <div class="mb-2 small">
        <strong>Size:</strong>
        {{ size ?? 'N/A' }}
      </div>

      <a :href="link" class="btn btn-outline-primary mt-auto w-100 rounded-pill">
        {{ buttonText }}
      </a>
    </div>
  </div>
</template>

<style scoped>
.card:hover {
  transform: translateY(-4px);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.1);
}

.object-fit-cover {
  object-fit: cover;
}
</style>
