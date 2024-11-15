require("dotenv").config(); // .env ფაილის გამოყენება
const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const sha256 = require("js-sha256");

const app = express();
const PORT = 5001;

// Middleware
app.use(cors());
app.use(express.json());

// Path to expenses file
const expensesFilePath = path.join(__dirname, "expenses.json");
const usersFilePath = path.join(__dirname, "users.json");

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

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

// JWT Authentication Middleware
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1]; // Header-იდან ტოკენის მიღება
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Forbidden" });
    req.user = user; // მომხმარებლის ინფორმაციის დამატება req ობიექტში
    next();
  });
}

// Admin Authorization Middleware
function authorizeAdmin(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({ error: "Access Denied" });
  }
  next();
}

// Login Endpoint - ტოკენის გენერირება
app.post("/api/login", (req, res) => {
  const users = readUsers();
  const { password } = req.body;
  const user = users.find((user) => user.password === sha256(password));
  // ამ ეტაპზე უბრალო ლოგინ-პაროლს ვამოწმებთ
  //admin123
  if (user) {
    const role = user.role;
    const token = jwt.sign({ role }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });
    return res.json({ token });
  }

  return res.status(403).json({ error: "Invalid credentials" });
});

// Get Expenses (No Authentication Required)
app.get("/api/expenses", (req, res) => {
  const { page = 1, limit = 5 } = req.query;
  const expenses = readExpenses();
  const start = (page - 1) * limit;
  const paginatedExpenses = expenses.slice(start, start + limit);
  res.json(paginatedExpenses);
});

// Create Expense (Admin Only)
app.post("/api/expenses", authenticateToken, authorizeAdmin, (req, res) => {
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

// Update Expense (Admin Only)
app.put("/api/expenses/:id", authenticateToken, authorizeAdmin, (req, res) => {
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

// Delete Expense (Admin Only)
app.delete(
  "/api/expenses/:id",
  authenticateToken,
  authorizeAdmin,
  (req, res) => {
    const { id } = req.params;
    const expenses = readExpenses();
    const filteredExpenses = expenses.filter((exp) => exp.id !== parseInt(id));

    if (expenses.length === filteredExpenses.length) {
      return res.status(404).json({ error: "Expense not found" });
    }

    writeExpenses(filteredExpenses);
    res.status(204).end();
  }
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: "Internal Server Error" });
});

app.listen(PORT, () =>
  console.log(`Server running on http://localhost:${PORT}`)
);
