exports.up = function (knex) {
  return knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("name");
    table.string("email").unique();
    table.string("password_hash");
    table.string("role").defaultTo("user");
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("users");
};
