exports.up = function (knex) {
  return knex.schema.alterTable("orders", function (table) {
    table
      .enu("status", ["not_ordered", "ordered"])
      .notNullable()
      .defaultTo("not_ordered");
  });
};

exports.down = function (knex) {
  return knex.schema.alterTable("orders", function (table) {
    table.dropColumn("status");
  });
};
