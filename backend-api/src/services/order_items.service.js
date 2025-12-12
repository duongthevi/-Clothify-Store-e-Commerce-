const knex = require("../database/knex");
const Paginator = require("./paginator");

function orderItemRepository() {
  return knex("order_items");
}

function readOrderItemData(payload) {
  return {
    ...(payload.order_id && { order_id: payload.order_id }),
    ...(payload.product_id && { product_id: payload.product_id }),
    ...(payload.quantity !== undefined && { quantity: payload.quantity }),
  };
}

async function getAllOrderItemsByOrderId(query) {
  const { order_id, page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  if (!order_id) {
    throw new Error('order_id is required');
  }

  const results = await orderItemRepository()
    .from('order_items as oi') // alias bảng order_items
    .join('products as p', 'oi.product_id', 'p.id')
    .where('oi.order_id', order_id)
    .select(
      knex.raw('COUNT(oi.id) OVER() AS record_count'),
      'oi.id',
      'oi.order_id',
      'oi.product_id',
      'oi.quantity',
      'oi.total_price',
      'p.name as product_name',
      'p.price as product_price',
      'p.image_url as product_image_url',
      'p.stock as product_stock'
    )
    .orderBy('oi.id', 'asc')
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const orderItems = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    orderItems,
  };
}



async function getOrderItemById(id) {
  return orderItemRepository().where("id", id).select("*").first();
}

async function createOrderItem(payload) {
  const orderItemData = readOrderItemData(payload);

  // Lấy giá sản phẩm theo product_id
  const product = await knex('products')
    .select('price')
    .where('id', orderItemData.product_id)
    .first();

  if (!product) {
    throw new Error(`Product with ID ${orderItemData.product_id} not found`);
  }

  // Tính tổng tiền
  const total_price = product.price * orderItemData.quantity;

  // Chèn vào bảng order_items với total_price
  const [insertedOrderItem] = await orderItemRepository()
    .insert({
      ...orderItemData,
      total_price,
    })
    .returning([
      'id',
      'order_id',
      'product_id',
      'quantity',
      'total_price',
    ]);

  return insertedOrderItem;
}


// Cập nhật quantity của 1 sản phẩm trong đơn hàng
async function updateOrderItem(id, updateData) {
  const updateFields = readOrderItemData(updateData);

  if (!id || Object.keys(updateFields).length === 0) {
    throw new Error("Missing required fields to update order item");
  }

  const [orderItem] = await knex("order_items")
    .where({ id })
    .update(updateFields)
    .returning(["id", "order_id", "product_id", "quantity"]);

  return orderItem || null;
}

async function deleteOrderItem(orderItemId) {
  // Lấy thông tin order_id trước khi xóa
  const item = await knex('order_items').where({ id: orderItemId }).first()
  if (!item) throw new Error('Order item not found')

  // Xóa order_item
  await knex('order_items').where({ id: orderItemId }).delete()

  // Kiểm tra xem order đó còn item nào không
  const remainingItems = await knex('order_items').where({ order_id: item.order_id })

  // Nếu không còn item nào -> xóa luôn order
  if (remainingItems.length === 0) {
    await knex('orders').where({ id: item.order_id }).delete()
  }

  return { success: true }
}

module.exports = {
  getAllOrderItemsByOrderId,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
