import React from "react";
import { useNavigate } from "react-router-dom"; // useNavigate ჰუკი
import ExpenseFront from "./ExpenseFront";
import { useAuth } from "./AuthContext";
import "./adminDashboard.css";

function AdminDashboard() {
  const { logout } = useAuth();
  const navigate = useNavigate(); // Navigate ფუნქციის ინიციალიზაცია

  const handleLogout = () => {
    logout(); // ლოგაუთ ფუნქცია
    navigate("/admin"); // გადამისამართება /admin გვერდზე
  };

  return (
    <div>
      <div className="header">
        <h1>Admin Dashboard</h1>
        <button className="logout-button" onClick={handleLogout}>
          Logout
        </button>
      </div>

      <ExpenseFront isAdminView />
    </div>
  );
}

export default AdminDashboard;
