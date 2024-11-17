const fs = require("fs");
const path = require("path");

const expensesFilePath = path.join(__dirname, "expenses.json");
const usersFilePath = path.join(__dirname, "users.json");
console.log(__dirname, expensesFilePath);

function readUsers() {
  try {
    const data = fs.readFileSync(usersFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function readExpenses() {
  try {
    const data = fs.readFileSync(expensesFilePath, "utf-8");
    return JSON.parse(data);
  } catch (error) {
    return [];
  }
}

function writeExpenses(data) {
  fs.writeFileSync(expensesFilePath, JSON.stringify(data, null, 2));
}

module.exports = { readUsers, readExpenses, writeExpenses };
