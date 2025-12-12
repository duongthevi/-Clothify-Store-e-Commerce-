exports.up = function (knex) {
  return knex.schema.createTable("password_resets", function (table) {
    table.increments("id").primary();
    table.string("email").notNullable();
    table.string("code").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("password_resets");
};
