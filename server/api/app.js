const { Router } = require("express");
const userRoutes = require("./routes/users");
const expenseRouter = require("./routes/expenses/expenses");

const apiRouter = Router();

apiRouter.use("/users", userRoutes);
apiRouter.use("/expenses", expenseRouter);

//Error handling middleware
apiRouter.use((err, req, res, next) => {
  console.log(`Request made to: ${req.originalUrl}`);
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

module.exports = apiRouter;
