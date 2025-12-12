/**
 * @param {import('knex')} knex
 */
exports.up = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.string("size").nullable();
  });
};

/**
 * @param {import('knex')} knex
 */
exports.down = function (knex) {
  return knex.schema.alterTable("products", function (table) {
    table.dropColumn("size");
  });
};
