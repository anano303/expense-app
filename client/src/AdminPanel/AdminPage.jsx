import React, { useState } from "react";
import { useAuth } from "../Hooks/AuthContext"; // AuthContext-ის შემოტანა
import { useNavigate } from "react-router-dom"; // სტრუქტურაში გადასვლა
import axios from "axios";

function AdminPage() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { isAdmin } = useAuth();
  const navigate = useNavigate();

  const login = async (password) => {
    try {
      const { data } = await axios.post("http://localhost:5001/api/login", {
        password,
      });
      localStorage.setItem("token", data.token);
      return true;
    } catch (e) {
      console.log(e);
      return false;
    }
  };
  const handleLogin = async () => {
    if (await login(password)) {
      navigate("/admin-dashboard");
    } else {
      setError("Incorrect password");
    }
  };

  if (isAdmin) {
    return (
      <div>
        <h2>Welcome Admin</h2>
        <button onClick={() => navigate("/admin-dashboard")}>
          Go to Dashboard
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1>Admin Login</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <input
        type="password"
        placeholder="Enter Admin Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}

export default AdminPage;
