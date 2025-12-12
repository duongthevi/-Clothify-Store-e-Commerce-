exports.up = async (knex) => {
  return knex("roles").insert([
    {
      name: "admin",
      description: "Quản trị viên hệ thống",
    },
    {
      name: "user",
      description: "Người dùng bình thường",
    },
  ]);
};

exports.down = async (knex) => {
  return knex("roles").whereIn("name", ["admin", "user"]).del();
};
