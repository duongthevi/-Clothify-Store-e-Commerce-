exports.up = async (knex) => {
  // Thêm cột role_id vào bảng users
  await knex.schema.table("users", (table) => {
    table
      .integer("role_id")
      .unsigned()
      .references("id")
      .inTable("roles")
      .onDelete("SET NULL")
      .defaultTo(2);
  });

  // Cập nhật role_id cho các user hiện tại dựa trên role
  const users = await knex("users").select("id", "role_id");
  for (const user of users) {
    const role = await knex("roles").where({ name: user.role }).first();
    if (role) {
      await knex("users").where({ id: user.id }).update({ role_id: role.id });
    }
  }

  // Xóa cột role
  await knex.schema.table("users", (table) => {
    table.dropColumn("role");
  });
};

exports.down = async (knex) => {
  // Thêm lại cột role
  await knex.schema.table("users", (table) => {
    table.string("role").defaultTo("user");
  });

  // Cập nhật role cho các user dựa trên role_id
  const users = await knex("users").select("id", "role_id");
  for (const user of users) {
    const role = await knex("roles").where({ id: user.role_id }).first();
    if (role) {
      await knex("users").where({ id: user.id }).update({ role: role.name });
    }
  }

  // Xóa cột role_id
  await knex.schema.table("users", (table) => {
    table.dropColumn("role_id");
  });
};
