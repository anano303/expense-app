import React from "react";
import { AuthProvider } from "./Hooks/AuthContext";
import ExpenseFront from "./Pages/Expense/ExpenseFront";
import AdminPage from "./AdminPanel/AdminPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminPanel/AdminDashboard";
import AdminRoute from "./AdminPanel/AdminRoute";

function App() {
  return (
    // <ExpenseFront />
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<ExpenseFront />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route
            path="/admin-dashboard"
            element={
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
