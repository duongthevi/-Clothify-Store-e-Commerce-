exports.up = function(knex) {
    return knex.schema.createTable('products', table => {
      table.increments('id').primary();
      table.string('name').notNullable();
      table.decimal('price').notNullable();
      table.string('image_url');
      table.text('description');
      table.integer('category_id').unsigned().references('id').inTable('categories').onDelete('SET NULL');
      table.integer('stock').defaultTo(0);
    });
  };
  
  exports.down = function(knex) {
    return knex.schema.dropTableIfExists('products');
  };
  