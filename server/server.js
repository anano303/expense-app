require("dotenv").config(); // dotenv-ის დამატება

const express = require("express");
const fs = require("fs");
const path = require("path");
const cors = require("cors");
const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to expenses file
const expensesFilePath = path.join(__dirname, "expenses.json");

// Utility function to read expenses data
function readExpenses() {
  try {
    const data = fs.readFileSync(expensesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

// Utility function to write expenses data
function writeExpenses(data) {
  fs.writeFileSync(expensesFilePath, JSON.stringify(data, null, 2));
}

// Get expenses with pagination
app.get("/api/expenses", (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const expenses = readExpenses();
  const start = (page - 1) * limit;
  const paginatedExpenses = expenses.slice(start, start + limit);
  res.json(paginatedExpenses);
});

// Create a new expense
app.post("/api/expenses", (req, res) => {
  const { category, price, date, description } = req.body;

  if (price < 10) {
    return res.status(400).json({ error: "Minimum expense amount is 10" });
  }

  const expenses = readExpenses();
  const newExpense = {
    id: expenses.length ? expenses[expenses.length - 1].id + 1 : 1,
    category,
    price,
    date: date || new Date().toISOString(),
    description,
  };

  expenses.push(newExpense);
  writeExpenses(expenses);

  res.status(201).json(newExpense);
});

// Update an expense
app.put("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { category, price, date, description } = req.body;
  const expenses = readExpenses();
  const expenseIndex = expenses.findIndex((exp) => exp.id === parseInt(id));

  if (expenseIndex === -1) {
    return res.status(404).json({ error: "Expense not found" });
  }

  expenses[expenseIndex] = {
    ...expenses[expenseIndex],
    category,
    price,
    date,
    description,
  };

  writeExpenses(expenses);
  res.json(expenses[expenseIndex]);
});

// Delete an expense (requires key in headers)
app.delete("/api/expenses/:id", (req, res) => {
  const { id } = req.params;
  const { key } = req.headers;

  if (key !== process.env.SECRET_KEY) {
    // Reading secret from .env file
    return res.status(403).json({ error: "Unauthorized" });
  }

  const expenses = readExpenses();
  const filteredExpenses = expenses.filter((exp) => exp.id !== parseInt(id));

  if (expenses.length === filteredExpenses.length) {
    return res.status(404).json({ error: "Expense not found" });
  }

  writeExpenses(filteredExpenses);
  res.status(204).end();
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
