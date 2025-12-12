exports.up = async (knex) => {
  await knex.schema.createTable("permission_role", (table) => {
    table.increments("id").primary();
    table
      .integer("permission_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("permissions")
      .onDelete("CASCADE");
    table
      .integer("role_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("roles")
      .onDelete("CASCADE");
    table.timestamps(true, true);
  });
  // Chèn các quyền mặc định cho vai trò admin
  const adminRole = await knex("roles").where({ name: "admin" }).first();
  if (adminRole) {
    const permissions = await knex("permissions").select("id");
    const permissionRoleInserts = permissions.map((permission) => ({
      permission_id: permission.id,
      role_id: adminRole.id,
    }));
    await knex("permission_role").insert(permissionRoleInserts);
  }
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists("permission_role");
};
