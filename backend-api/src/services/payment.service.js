const knex = require("../database/knex");
const Paginator = require("./paginator");

function paymentRepository() {
  return knex("payments");
}

function readPaymentData(payload) {
  return {
    ...(payload.order_id && { order_id: payload.order_id }),
    ...(payload.amount !== undefined && { amount: payload.amount }),
    ...(payload.status && { status: payload.status }),
    ...(payload.payment_method && { payment_method: payload.payment_method }),
    ...(payload.created_at && { created_at: payload.created_at }),
  };
}

async function getAllPayments(query) {
  const { status, payment_method, page = 1, limit = 20 } = query;
  const paginator = new Paginator(page, limit);

  const results = await paymentRepository()
    .where((builder) => {
      if (status) {
        builder.where("status", status);
      }
      if (payment_method) {
        builder.where("payment_method", payment_method);
      }
    })
    .select(
      knex.raw("COUNT(id) OVER() AS record_count"),
      "id",
      "order_id",
      "amount",
      "status",
      "payment_method",
      "created_at"
    )
    .orderBy("created_at", "desc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const payments = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    payments,
  };
}

async function getPaymentById(id) {
  return paymentRepository().where("id", id).select("*").first();
}

async function createPayment(payload) {
  const paymentData = readPaymentData(payload);

  return await knex.transaction(async (trx) => {
    // 1. Insert payment
    const [insertedPayment] = await trx("payments")
      .insert(paymentData)
      .returning("*"); // OK với PostgreSQL

    const orderId = paymentData.order_id;

    // 2. Cập nhật trạng thái đơn hàng nếu hợp lệ
    if (
      paymentData.status === "pending" ||
      paymentData.status === "completed"
    ) {
      await trx("orders")
        .where({ id: orderId, status: "not_ordered" })
        .update({ status: "ordered" });
    }

    // 3. Lấy order_items tương ứng
    const orderItems = await trx("order_items")
      .where({ order_id: paymentData.order_id })
      .select("product_id", "quantity");

    // 4. Giảm stock sản phẩm
    for (const item of orderItems) {
      const affectedRows = await trx("products")
        .where({ id: item.product_id })
        .decrement("stock", item.quantity);

      if (affectedRows === 0) {
        throw new Error(
          `Không thể giảm tồn kho sản phẩm ID ${item.product_id}`
        );
      }
    }

    return { ...insertedPayment };
  });
}

// get payment by user id ( user_id không có trong bảng payments, cần lấy từ bảng orders)
async function getPaymentsByUserId(userId, query) {
  const { page = 1, limit = 5 } = query;
  const paginator = new Paginator(page, limit);

  const results = await paymentRepository()
    .join("orders", "payments.order_id", "orders.id")
    .where("orders.user_id", userId)
    .select(
      knex.raw("COUNT(payments.id) OVER() AS record_count"),
      "payments.id",
      "payments.order_id",
      "payments.amount",
      "payments.status",
      "payments.payment_method",
      "payments.created_at"
    )
    .orderBy("payments.created_at", "desc")
    .limit(paginator.limit)
    .offset(paginator.offset);

  const totalRecords = results[0]?.record_count ?? 0;

  const payments = results.map((result) => {
    result.record_count = undefined;
    return result;
  });

  return {
    metadata: paginator.getMetadata(totalRecords),
    payments,
  };
}

async function updatePayment(id, updateData) {
  const payment = await paymentRepository().where("id", id).first();
  if (!payment) {
    return null;
  }

  const statusData = {};
  if (updateData.status) {
    statusData.status = updateData.status;
  }
  if (Object.keys(statusData).length > 0) {
    await paymentRepository().where("id", id).update(statusData);
  }

  return {
    ...payment,
    ...statusData,
  };
}

module.exports = {
  getAllPayments,
  getPaymentById,
  getPaymentsByUserId,
  createPayment,
  updatePayment,
};
