const knex = require("../database/knex");
const Paginator = require("./paginator");

function categoryRepository() {
  return knex("categories");
}

function readCategoryData(payload) {
  return {
    ...(payload.name && { name: payload.name }),
  };
}

async function getAllCategories(query) {
  const { name, page = 1, limit = 20 } = query;
  const paginator = new Paginator(page, limit);

  const results = await categoryRepository()
    .where((builder) => {
      if (name) {
        builder.where("name", "like", `%${name}%`);
      }
    })
    .select(knex.raw("COUNT(id) OVER() AS record_count"), "id", "name")
    .orderBy("id", "asc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const categories = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    categories,
  };
}

async function getCategoryById(id) {
  return categoryRepository().where("id", id).select("*").first();
}

async function createCategory(payload) {
  const categoryData = readCategoryData(payload);
  const [newCategory] = await categoryRepository()
    .insert(categoryData)
    .returning(["id", "name"]);
  return newCategory;
}

async function updateCategory(id, payload) {
  const category = await categoryRepository().where("id", id).first();
  if (!category) {
    return null;
  }

  const updateFields = readCategoryData(payload);
  if (Object.keys(updateFields).length > 0) {
    await categoryRepository().where("id", id).update(updateFields);
  }

  return {
    ...category,
    ...updateFields,
  };
}

async function deleteCategory(id) {
  return await categoryRepository().where("id", id).del();
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
