exports.up = function (knex) {
  return knex.schema.table("orders", function (table) {
    table.dropColumn("status");
  });
};

exports.down = function (knex) {
  return knex.schema.table("orders", function (table) {
    table.string("status").defaultTo("cart");
  });
};
