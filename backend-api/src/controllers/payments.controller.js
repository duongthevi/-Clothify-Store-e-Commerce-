const paymentsService = require("../services/payment.service");
const JSend = require("../utils/jsend");
const ApiError = require("../utils/api-error");

async function getAllPayments(req, res, next) {
  let result = {
    payments: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  try {
    result = await paymentsService.getAllPayments(req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
  return res.json(
    JSend.success({
      payments: result.payments,
      metadata: result.metadata,
    })
  );
}

async function getPaymentbyId(req, res, next) {
  const { id } = req.params;

  try {
    const payment = await paymentsService.getPaymentById(id);
    if (!payment) {
      return next(new ApiError(404, "Payment not found"));
    }
    return res.json(JSend.success({ payment }));
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

//get payment by user id
async function getPaymentByUserId(req, res, next) {
  let result = {
    payments: [],
    metadata: {
      totalRecords: 0,
      firstPage: 1,
      lastPage: 1,
      page: 1,
      limit: 5,
    },
  };
  const { userId } = req.params;
  try {
    result = await paymentsService.getPaymentsByUserId(userId, req.query);
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
  return res.json(
    JSend.success({
      payments: result.payments,
      metadata: result.metadata,
    })
  );
}


async function createPayment(req, res, next) {
  try {
    const paymentData = {
      ...req.body,
    };

    const payment = await paymentsService.createPayment(paymentData);
    return res
      .status(201)
      .set({
        Location: `${req.baseUrl}/${payment.id}`,
      })
      .json(
        JSend.success({
          payment,
        })
      );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

async function updatePayment(req, res, next) {
  const { id } = req.params;

  try {
    const { status } = req.body;
    if (!status) {
      return next(new ApiError(400, "Status is required"));
    }

    const update = await paymentsService.updatePayment(id, { status });
    if (!update) {
      return next(new ApiError(404, "Payment not found"));
    }

    return res.json(
      JSend.success({
        payment: update,
      })
    );
  } catch (error) {
    console.log(error);
    return next(new ApiError(500, "Internal Server Error"));
  }
}

module.exports = {
  getAllPayments,
  getPaymentbyId,
  getPaymentByUserId,
  createPayment,
  updatePayment,
};