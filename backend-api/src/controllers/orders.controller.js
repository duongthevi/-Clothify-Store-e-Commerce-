const ordersService = require("../services/orders.service");
const orderItemsService = require("../services/order_items.service");
const JSend = require("../utils/jsend");
const ApiError = require("../utils/api-error");

async function getAllOrders(req, res, next) {
  let result = {
    orders: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await ordersService.getAllOrders(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
  return res.json(
    JSend.success({
      orders: result.orders,
      metadata: result.metadata,
    })
  );
}

async function getOrderById(req, res, next) {
  const { id } = req.params;
  try {
    const order = await ordersService.getOrderById(id);
    if (!order) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.json(JSend.success({ order }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function getOrdersByUserId(req, res, next) {
  const { userId } = req.params;
  try {
    const orders = await ordersService.getOrdersByUserId(userId);
    if (!orders || orders.length === 0) {
      return next(new ApiError(404, "No orders found for this user"));
    }
    return res.json(JSend.success({ orders }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}



async function createOrder(req, res, next) {
  try {
    const orderData = {
      ...req.body,
    };
    const newOrder = await ordersService.createOrder({
      user_id: orderData.user_id,
    });
    if (!newOrder) {
      return next(new ApiError(400, "Failed to create order"));
    }

    const orderItems = orderData.order_items || [];
    const createdItems = [];
    for (const item of orderItems) {
      const itemData = {
        ...item,
        order_id: newOrder.id,
      };
      const createdItem = await orderItemsService.createOrderItem(itemData);
      createdItems.push(createdItem);
    }

    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${newOrder.id}`,
      })
      .json(
        JSend.success({
          order: {
            ...newOrder,
            order_items: createdItems,
          },
        })
      );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updateOrder(req, res, next) {
  const { id } = req.params;
  try {
    const updateData = {
      ...req.body,
    };
    const updatedOrder = await ordersService.updateOrder(id, updateData);
    if (!updatedOrder) {
      return next(new ApiError(404, "Order not found"));
    }
    return res.json(
      JSend.success({
        order: updatedOrder,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}


module.exports = {
  getAllOrders,
  getOrderById,
  getOrdersByUserId,
  createOrder,
  updateOrder,
};
