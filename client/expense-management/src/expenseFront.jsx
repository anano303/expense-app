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
  const [error, setError] = useState("");
  const [page, setPage] = useState(1); // Current page state
  const [hasMorePages, setHasMorePages] = useState(false); // Check if more pages exist

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/expenses?page=${page}&limit=5`
        );
        setExpenses(response.data);
        setHasMorePages(response.data.length === 5); // If data length is 5, it might have more pages
      } catch (error) {
        setError("Error fetching expenses");
      }
    };

    fetchExpenses();
  }, [page]);

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
      setNewExpense({ category: "", price: "", description: "" });
      setError("");

      // Check if current page already has 5 expenses and move to the next page
      if (expenses.length >= 5) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setExpenses([...expenses, response.data]);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error adding expense");
    }
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/expenses/${id}`, {
        headers: { key: process.env.REACT_APP_SECRET_KEY },
      });
      setExpenses(expenses.filter((expense) => expense.id !== id));
      setError("");
    } catch (error) {
      setError("Error deleting expense");
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
      setError("");
    } catch (error) {
      setError("Error updating expense");
    }
  };

  const handleNextPage = () => {
    if (hasMorePages) setPage((prevPage) => prevPage + 1);
  };

  const handlePreviousPage = () => {
    if (page > 1) setPage((prevPage) => prevPage - 1);
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

      {/* Error message */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {expenses.map((expense) => (
          <li key={expense.id}>
            <div>
              <p>{expense.category}</p>
              <hr />
              <p>{expense.price}</p>
              <hr />
              <p>{expense.description}</p>
            </div>
            <button onClick={() => handleEditExpense(expense)}>Edit</button>
            <button onClick={() => handleDeleteExpense(expense.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>

      {/* Pagination Controls */}
      <div className="pagination">
        <button onClick={handlePreviousPage} disabled={page === 1}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} disabled={!hasMorePages}>
          Next
        </button>
      </div>
    </div>
  );
}

export default ExpenseFront;
