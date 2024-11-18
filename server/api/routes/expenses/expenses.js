const { Router } = require("express");
const { authenticateToken, authorizeAdmin } = require("../../middleware/auth");

const {
  getExpenses,
  addExpenses,
  updatedExpense,
  deleteExpense,
} = require("./expenses.service");

const expenseRoutes = Router();

expenseRoutes.get("/", getExpenses);
expenseRoutes.post("/", authenticateToken, authorizeAdmin, addExpenses);
expenseRoutes.put("/:id", authenticateToken, updatedExpense);
expenseRoutes.delete("/:id", authenticateToken, authorizeAdmin, deleteExpense);

module.exports = expenseRoutes;
