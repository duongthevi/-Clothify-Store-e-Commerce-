<script setup>
defineProps({
  user: { type: Object, required: true },
})

// Map role_id sang tên hiển thị
function getRoleLabel(roleId) {
  if (roleId === 1) return 'Quản trị viên'
  if (roleId === 2) return 'Người dùng'
  return 'Không xác định'
}

// Map role_id sang class Bootstrap
function roleClass(roleId) {
  if (roleId === 1) return 'badge bg-danger text-uppercase'
  if (roleId === 2) return 'badge bg-primary text-uppercase'
  return 'badge bg-dark text-uppercase'
}
</script>

<template>
  <div class="card shadow rounded-4 border-0">
    <div class="card-header bg-primary text-white rounded-top-4">
      <h4 class="mb-0">Thông tin người dùng</h4>
    </div>
    <div class="card-body px-4 py-3">
      <div class="row mb-2 border-bottom pb-2">
        <div class="col-sm-4 fw-bold">ID:</div>
        <div class="col-sm-8">{{ user.id }}</div>
      </div>
      <div class="row mb-2 border-bottom pb-2">
        <div class="col-sm-4 fw-bold">Tên:</div>
        <div class="col-sm-8">{{ user.name }}</div>
      </div>
      <div class="row mb-2 border-bottom pb-2">
        <div class="col-sm-4 fw-bold">E-mail:</div>
        <div class="col-sm-8">{{ user.email }}</div>
      </div>
      <div class="row mb-2 border-bottom pb-2">
        <div class="col-sm-4 fw-bold">Địa chỉ:</div>
        <div class="col-sm-8">{{ user.address }}</div>
      </div>
      <div class="row mb-2 border-bottom pb-2">
        <div class="col-sm-4 fw-bold">Điện thoại:</div>
        <div class="col-sm-8">{{ user.phone_number }}</div>
      </div>
      <div class="row mb-0">
        <div class="col-sm-4 fw-bold">Vai trò:</div>
        <div class="col-sm-8">
          <span :class="roleClass(user.role_id)">
            {{ getRoleLabel(user.role_id) }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
