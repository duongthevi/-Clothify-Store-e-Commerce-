const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  await knex('products').del();

  const products = [];
  for (let i = 1; i <= 20; i++) {
    products.push({
      id: i,
      name: faker.commerce.productName(),
      price: faker.number.int({ min: 100000, max: 500000 }),
      image_url: faker.image.url(),
      description: faker.commerce.productDescription(),
      category_id: faker.helpers.arrayElement([1, 2, 3]),
      stock: faker.number.int({ min: 1, max: 100 }),
    });
  }

  await knex('products').insert(products);
};