exports.up = function(knex) {
    return knex.schema.createTable('orders', table => {
      table.increments('id').primary();
      table.integer('user_id').unsigned().references('id').inTable('users').onDelete('CASCADE');
      table.string('status').defaultTo('pending'); // pending, confirmed, shipped, cancelled
      table.timestamp('created_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('orders');
  };
  