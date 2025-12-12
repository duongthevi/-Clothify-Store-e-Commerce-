exports.up = function (knex) {
  return knex.schema.table("users", function (table) {
    table.string("address").nullable();
    table.string("phone_number").nullable();
  });
};

exports.down = function (knex) {
  return knex.schema.table("users", function (table) {
    table.dropColumn("address");
    table.dropColumn("phone_number");
  });
};
