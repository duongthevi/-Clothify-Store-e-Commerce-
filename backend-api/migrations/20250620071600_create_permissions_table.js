exports.up = function (knex) {
  return knex.schema.createTable("permissions", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable().unique(); // e.g., 'create_user', 'delete_post'
    table.string("description").nullable();
    table.timestamps(true, true);
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("permissions");
};
