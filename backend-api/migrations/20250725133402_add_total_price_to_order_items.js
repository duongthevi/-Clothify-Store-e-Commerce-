exports.up = function(knex) {
  return knex.schema.alterTable('order_items', function(table) {
    table.decimal('total_price', 10, 2).notNullable().defaultTo(0);
  });
};

exports.down = function(knex) {
  return knex.schema.alterTable('order_items', function(table) {
    table.dropColumn('total_price');
  });
};
