const orderItemService = require("../services/order_items.service");
const JSend = require("../utils/jsend");
const ApiError = require("../utils/api-error");

async function getAllOrderItemsByOrderId(req, res, next) {
  try {
    const order_id = req.params.id || req.query.order_id;
    const { page = 1, limit = 5 } = req.query;

    const result = await orderItemService.getAllOrderItemsByOrderId({
      order_id,
      page,
      limit,
    });

    return res.json(
      JSend.success({
        order_items: result.orderItems,
        metadata: result.metadata,
      })
    );
  } catch (error) {
    console.error("Error getAllOrderItemsByOrderId:", error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}



async function getOrderItemById(req, res, next) {
  const { id } = req.params;
  try {
    const orderItem = await orderItemService.getOrderItemById(id);
    if (!orderItem) {
      return next(new ApiError(404, "Order item not found"));
    }
    return res.status(200).json(JSend.success({ order_item: orderItem }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function createOrderItem(req, res, next) {
  try {
    const orderItemData = {
      ...req.body,
      order_id: req.params.orderId,
    }
    const newOrderItem = await orderItemService.createOrderItem(orderItemData);
    res.setHeader("Content-Type", "application/json");
    return res.status(201).json(JSend.success({ order_item: newOrderItem }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function updateOrderItem(req, res, next) {
  try {
    const orderItemId = req.params.id;
    const updateData = req.body;
    const updatedOrderItem = await orderItemService.updateOrderItem(
      orderItemId,
      updateData
    );
    if (!updatedOrderItem) {
      return next(new ApiError(404, "Order item not found"));
    }
    res.setHeader("Content-Type", "application/json");
    return res
      .status(200)
      .json(JSend.success({ order_item: updatedOrderItem }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}

async function deleteOrderItem(req, res, next) {
  try {
    const orderItemId = req.params.id;
    const deleted = await orderItemService.deleteOrderItem(orderItemId);
    if (!deleted) {
      return next(new ApiError(404, "Order item not found"));
    }
    res.setHeader("Content-Type", "application/json");
    return res.status(200).json(JSend.success({ deleted: true }));
  } catch (error) {
    if (error instanceof ApiError) {
      return res
        .status(error.statusCode)
        .json(JSend.fail(error.message, error.headers));
    }
    next(error);
  }
}


module.exports = {
  getAllOrderItemsByOrderId,
  getOrderItemById,
  createOrderItem,
  updateOrderItem,
  deleteOrderItem,
};
