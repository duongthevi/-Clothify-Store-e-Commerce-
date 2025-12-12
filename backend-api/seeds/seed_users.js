const { faker } = require('@faker-js/faker');

exports.seed = async function(knex) {
  await knex('users').del();

  const users = [
    { id: 1, name: 'Admin', email: 'admin@example.com', password_hash: '...', role_id: 1 },
    { id: 2, name: 'User', email: 'user@example.com', password_hash: '...', role_id: 2 },
  ];

  for (let i = 3; i <= 12; i++) {
    users.push({
      id: i,
      name: faker.person.fullName(),
      email: faker.internet.email(),
      password_hash: faker.internet.password(),
      role_id: faker.helpers.arrayElement([1, 2]),
    });
  }

  await knex('users').insert(users);
};