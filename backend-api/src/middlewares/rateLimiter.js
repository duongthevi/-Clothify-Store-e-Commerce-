const rateLimit = require("express-rate-limit");
const JSend = require("../utils/jsend");

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1 phút
  max: 50, // giới hạn 50 request
  message: JSend.fail("Too many requests, please try again later."),
  statusCode: 429,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = limiter;
