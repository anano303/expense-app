const { Router } = require("express");
const { authenticateToken, authorizeAdmin } = require("../../middleware/auth");
const { readExpenses, writeExpenses } = require("../../../../fileHandler");
const {
  getExpenses,
  addExpenses,
  updatedExpense,
  deleteExpense,
} = require("./expenses.service");

const expenseRoutes = Router();

expenseRoutes.get("/", getExpenses);
expenseRoutes.post("/", authenticateToken, authorizeAdmin, addExpenses);
expenseRoutes.put("/:id", authenticateToken, authorizeAdmin, updatedExpense);
expenseRoutes.delete("/:id", authenticateToken, authorizeAdmin, deleteExpense);

module.exports = expenseRoutes;
