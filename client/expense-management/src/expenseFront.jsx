import React, { useState, useEffect } from "react";
import axios from "axios";
import "./expens.css";

function ExpenseFront() {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    price: "",
    description: "",
  });
  const [editExpense, setEditExpense] = useState(null);

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/expenses");
        setExpenses(response.data);
      } catch (error) {
        console.error("Error fetching expenses:", error);
      }
    };

    fetchExpenses();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewExpense({ ...newExpense, [name]: value });
  };

  const handleAddExpense = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5001/api/expenses",
        newExpense
      );
      setExpenses([...expenses, response.data]);
      setNewExpense({ category: "", price: "", description: "" });
    } catch (error) {
      console.error("Error adding expense:", error);
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/expenses/${id}`, {
        headers: { key: process.env.REACT_APP_SECRET_KEY },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
    } catch (error) {
      console.error("Error deleting expense:", error);
    }
  };

  const handleEditExpense = (expense) => {
    setEditExpense(expense);
    setNewExpense({
      category: expense.category,
      price: expense.price,
      description: expense.description,
    });
  };

  const handleSaveEdit = async () => {
    try {
      const response = await axios.put(
        `http://localhost:5001/api/expenses/${editExpense.id}`,
        newExpense
      );
      setExpenses(
        expenses.map((expense) =>
          expense.id === editExpense.id ? response.data : expense
        )
      );
      setEditExpense(null);
      setNewExpense({ category: "", price: "", description: "" });
    } catch (error) {
      console.error("Error updating expense:", error);
    }
  };

  return (
    <div className="expenseFront">
      <h1>Expense Tracker</h1>
      <div>
        <input
          type="text"
          name="category"
          value={newExpense.category}
          onChange={handleInputChange}
          placeholder="Category"
        />
        <input
          type="number"
          name="price"
          value={newExpense.price}
          onChange={handleInputChange}
          placeholder="Price"
        />
        <input
          type="text"
          name="description"
          value={newExpense.description}
          onChange={handleInputChange}
          placeholder="Description"
        />
        {editExpense ? (
          <button onClick={handleSaveEdit}>Save</button>
        ) : (
          <button onClick={handleAddExpense}>Add Expense</button>
        )}
      </div>

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <div>
              <p>{expense.category}</p>
              <p>{expense.price}</p>
              <p>{expense.description}</p>
            </div>
            <button onClick={() => handleEditExpense(expense)}>Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ExpenseFront;
