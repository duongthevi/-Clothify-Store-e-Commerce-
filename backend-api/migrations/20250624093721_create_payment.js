exports.up = function (knex) {
  return knex.schema.createTable("payments", function (table) {
    table.increments("id").primary();
    table.integer("order_id").unsigned().notNullable();
    table.foreign("order_id").references("orders.id").onDelete("CASCADE");
    table.decimal("amount", 10, 2).notNullable();
    table.string("status").notNullable().defaultTo("pending");
    table.string("payment_method").notNullable();
    table.timestamp("created_at").defaultTo(knex.fn.now());
  });
};

exports.down = function (knex) {
  return knex.schema.dropTableIfExists("payments");
};
