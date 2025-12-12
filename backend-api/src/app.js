const express = require("express");
const cors = require("cors");
const swaggerUi = require("swagger-ui-express");
const rateLimiter = require("./middlewares/rateLimiter");

const JSend = require("./utils/jsend");
const {
  resourceNotFound,
  handleError,
} = require("./controllers/errors.controller");

//import routers
const authRouter = require("./routes/auth.router");
const usersRouter = require("./routes/users.router");
const categoriesRoutes = require("./routes/categories.router");
const productsRoutes = require("./routes/products.router");
const ordersRouter = require("./routes/orders.router");
const roleRouter = require("./routes/role.router");
const paymentRouter = require("./routes/payment.router");

const swaggerDocument = require("../docs/openapiSpec.json");

const app = express();
app.use(rateLimiter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  return res.json(JSend.success());
});

authRouter.setup(app);
categoriesRoutes.setup(app);
usersRouter.setup(app);
roleRouter.setup(app);
productsRoutes.setup(app);
ordersRouter.setup(app);
paymentRouter.setup(app);

app.use(resourceNotFound);
app.use(handleError);

module.exports = app;
