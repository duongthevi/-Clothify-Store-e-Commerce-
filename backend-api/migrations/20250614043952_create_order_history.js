exports.up = function(knex) {
    return knex.schema.createTable('order_history', table => {
      table.increments('id').primary();
      table.integer('order_id').unsigned().notNullable()
        .references('id').inTable('orders').onDelete('CASCADE');
      table.string('status').notNullable(); // e.g. pending, shipped, cancelled
      table.text('note'); // optional
      table.timestamp('changed_at').defaultTo(knex.fn.now());
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('order_history');
  };
  