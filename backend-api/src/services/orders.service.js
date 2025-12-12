const knex = require("../database/knex");
const Paginator = require("./paginator");

function orderRepository() {
  return knex("orders");
}

function readOrderData(payload) {
  return {
    ...(payload.user_id && { user_id: payload.user_id }),
    ...(payload.status && { status: payload.status }),
    ...(payload.created_at && { created_at: payload.created_at }),
  };
}

async function getAllOrders(query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await orderRepository()
    .where((builder) => {
      builder.select(
        knex.raw("COUNT(id) OVER() AS record_count"),
        "id",
        "user_id",
        "status",
        "created_at"
      );
    })
    .orderBy("created_at", "desc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const orders = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    orders,
  };
}

async function getOrderById(id) {
  return orderRepository().where("id", id).select("*").first();
}

//get order by user_id
async function getOrdersByUserId(userId) {
  return orderRepository().where("user_id", userId).select("*");
}

async function createOrder(payload) {
  const orderData = readOrderData(payload);
  const [insertedOrder] = await orderRepository()
    .insert(orderData)
    .returning(["id", "user_id", "created_at", "status"]);
  return insertedOrder;
}


async function updateOrder(id, updateData) {
  const order = await orderRepository().where("id", id).first();
  if (!order) {
    return null;
  }

  const updateFields = readOrderData(updateData);
  if (Object.keys(updateFields).length > 0) {
    await orderRepository().where("id", id).update(updateFields);
  }

  return {
    ...order,
    ...updateFields,
  };
}



module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrder,
};
