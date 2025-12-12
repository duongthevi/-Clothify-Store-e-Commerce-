const knex = require("../database/knex");
const Paginator = require("./paginator");

function userRepository() {
  return knex("users");
}

function readUserData(payload) {
  return {
    ...(payload.name && { name: payload.name }),
    ...(payload.email && { email: payload.email }),
    ...(payload.password && { password: payload.password }),
    ...(payload.role_id && { role_id: payload.role_id }),
    ...(payload.address && { address: payload.address }),
    ...(payload.phone_number && { phone_number: payload.phone_number }),
  };
}

// Lấy thông tin người dùng theo id
async function getUserById(id) {
  return userRepository()
    .where("id", id)
    .select("id", "name", "email", "role_id", "address", "phone_number")
    .first();
}

// Lấy tất cả người dùng
async function getAllUsers(query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await userRepository()
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "name",
      "email",
      "role_id",
      "address",
      "phone_number"
    )
    .orderBy("id", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const users = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    users,
  };
}

// Xóa người dùng
async function deleteUser(id) {
  const deletedUser = await userRepository()
    .where("id", id)
    .select("id", "name", "email", "role_id", "address", "phone_number")
    .first();

  if (!deletedUser) {
    return null;
  }
  await userRepository().where("id", id).del();
  return deletedUser;
}

// Chỉnh sửa thông tin người dùng
async function updateUser(id, updateData) {
  const updatedUser = await userRepository()
    .where("id", id)
    .select("*")
    .first();

  if (!updatedUser) {
    return null;
  }
  const userData = readUserData(updateData);

  if (Object.keys(userData).length > 0) {
    await userRepository().where("id", id).update(userData);
  }

  return {
    ...updatedUser,
    ...userData,
  };
}

module.exports = {
  getUserById,
  getAllUsers,
  deleteUser,
  updateUser,
  readUserData,
};
