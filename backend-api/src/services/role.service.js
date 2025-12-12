const knex = require("../database/knex");

async function getAllRoles() {
  return await knex("roles").select("id", "name", "description");
}

async function getRoleById(id) {
  const role = await knex("roles").where({ id }).first();
  return role || null;
}

async function createRole(roleData) {
  const [role] = await knex("roles")
    .insert(roleData)
    .returning(["id", "name", "description"]);
  return role;
}

async function updateRole(id, roleData) {
  // Không cho update id
  delete roleData.id;
  const [role] = await knex("roles")
    .where({ id })
    .update(roleData)
    .returning(["id", "name", "description"]);
  return role || null;
}

async function deleteRole(id) {
  const deleted = await knex("roles").where({ id }).del();
  return deleted > 0;
}

async function getRoleIdByName(name) {
  const role = await knex("roles").where({ name }).first();
  return role ? role.id : null;
}

module.exports = {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  getRoleIdByName,
};
