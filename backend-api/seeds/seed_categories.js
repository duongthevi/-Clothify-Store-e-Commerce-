exports.seed = async function(knex) {
  await knex('categories').del();
  await knex('categories').insert([
    { id: 1, name: 'Áo thun' },
    { id: 2, name: 'Quần jean' },
    { id: 3, name: 'Giày dép' },
  ]);
};