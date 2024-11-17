const { Router } = require("express");
const { authenticateToken, authorizeAdmin } = require("../../middleware/auth");
const { readExpenses, writeExpenses } = require("../../../../fileHandler");

const expenseRoutes = Router();

expenseRoutes.get("/", (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const expenses = readExpenses();
  const start = (page - 1) * limit;
  const paginatedExpenses = expenses.slice(start, start + limit);
  res.json(paginatedExpenses);
});

expenseRoutes.post("/", authenticateToken, authorizeAdmin, (req, res) => {
  const { category, price, description } = req.body;

  if (price < 10) {
    return res.status(400).json({ error: "Minimum expense amount is 10" });
  }

  const expenses = readExpenses();
  const newExpense = {
    id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
    category,
    price,
    description,
    date: new Date().toISOString(),
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  res.status(201).json(newExpense);
});

expenseRoutes.put("/:id", authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const { category, price, description } = req.body;
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((exp) => exp.id === parseInt(id));

  if (expenseIndex === -1) {
    return res.status(404).json({ error: "Expense not found" });
  }

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    category,
    price,
    description,
  };

  writeExpenses(expenses);
  res.json(expenses[expenseIndex]);
});

expenseRoutes.delete("/:id", authenticateToken, authorizeAdmin, (req, res) => {
  const { id } = req.params;
  const expenses = readExpenses();
  const filteredExpenses = expenses.filter((exp) => exp.id !== parseInt(id));

  if (expenses.length === filteredExpenses.length) {
    return res.status(404).json({ error: "Expense not found" });
  }

  writeExpenses(filteredExpenses);
  res.status(204).end();
});

module.exports = expenseRoutes;
