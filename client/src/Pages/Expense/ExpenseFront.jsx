import React, { useState, useEffect } from "react";
import axios from "axios";
import "./expens.css";

function ExpenseFront({ isAdminView = false }) {
  const [expenses, setExpenses] = useState([]);
  const [newExpense, setNewExpense] = useState({
    category: "",
    price: "",
    description: "",
  });
  const [editExpenseId, setEditExpenseId] = useState(null);
  const [editedFields, setEditedFields] = useState({});
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(false);

  const authToken = localStorage.getItem("token");
  console.log(localStorage.getItem("token")); // ტოკენის ამოწმება

  // Fetch expenses
  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/expenses?page=${page}&limit=5`
        );
        setExpenses(response.data);
        setHasMorePages(response.data.length === 5);
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
        newExpense,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setNewExpense({ category: "", price: "", description: "" });
      setError("");

      if (expenses.length >= 5) {
        setPage((prevPage) => prevPage + 1);
      } else {
        setExpenses((prevExpenses) => [...prevExpenses, response.data]);
      }
    } catch (error) {
      setError(error.response?.data?.error || "Error adding expense");
    }
  };

  const handleEditChange = (id, field, value) => {
    setEditedFields((prev) => ({
      ...prev,
      [id]: { ...prev[id], [field]: value },
    }));
  };

  const handleEditExpense = (expense) => {
    setEditExpenseId(expense.id);
    setEditedFields((prev) => ({
      ...prev,
      [expense.id]: { ...expense },
    }));
  };

  const handleSaveEdit = async (id) => {
    try {
      const updatedExpense = editedFields[id];
      const response = await axios.put(
        `http://localhost:5001/api/expenses/${id}`,
        updatedExpense,
        {
          headers: { Authorization: `Bearer ${authToken}` },
        }
      );
      setExpenses((prevExpenses) =>
        prevExpenses.map((expense) =>
          expense.id === id ? response.data : expense
        )
      );
      setEditExpenseId(null);
      setError("");
    } catch (error) {
      setError("Error updating expense");
    }
  };

  const handleCancelEdit = () => {
    setEditExpenseId(null);
    setEditedFields({});
  };

  const handleDeleteExpense = async (id) => {
    try {
      await axios.delete(`http://localhost:5001/api/expenses/${id}`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      setExpenses((prevExpenses) =>
        prevExpenses.filter((expense) => expense.id !== id)
      );
      setError("");
    } catch (error) {
      setError("Error deleting expense");
    }
  };

  return (
    <div className="expense-container">
      {error && <p className="error-message">{error}</p>}
      <div className="add-expense">
        <h3>Add New Expense</h3>
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newExpense.category}
          onChange={handleInputChange}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={newExpense.price}
          onChange={handleInputChange}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={newExpense.description}
          onChange={handleInputChange}
        />
        <button onClick={handleAddExpense}>Add Expense</button>
      </div>

      <div className="expenses-list">
        <h3>Expenses</h3>
        {expenses.map((expense) => (
          <div key={expense.id} className="expense-item">
            {editExpenseId === expense.id ? (
              <div>
                <input
                  type="text"
                  value={editedFields[expense.id]?.category || ""}
                  onChange={(e) =>
                    handleEditChange(expense.id, "category", e.target.value)
                  }
                />
                <input
                  type="number"
                  value={editedFields[expense.id]?.price || ""}
                  onChange={(e) =>
                    handleEditChange(expense.id, "price", e.target.value)
                  }
                />
                <input
                  type="text"
                  value={editedFields[expense.id]?.description || ""}
                  onChange={(e) =>
                    handleEditChange(expense.id, "description", e.target.value)
                  }
                />
                <button onClick={() => handleSaveEdit(expense.id)}>Save</button>
                <button onClick={handleCancelEdit}>Cancel</button>
              </div>
            ) : (
              <div>
                <p>{expense.category}</p>
                <p>{expense.price} ₾ </p>
                <p>{expense.description}</p>
                {isAdminView && (
                  <>
                    <button onClick={() => handleEditExpense(expense)}>
                      Edit
                    </button>
                    <button onClick={() => handleDeleteExpense(expense.id)}>
                      Delete
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        ))}
        {error && <p className="error-message">{error}</p>}
        <div className="pagination">
          <button
            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
            disabled={page === 1}
          >
            Previous
          </button>
          <span>Page {page}</span>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={!hasMorePages}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}

export default ExpenseFront;
