import React from "react";
import { AuthProvider } from "./AuthContext";
import ExpenseFront from "./ExpenseFront";
import AdminPage from "./AdminPage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminDashboard from "./AdminDashboard";
import AdminRoute from "./AdminRoute";

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
