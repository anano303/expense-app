import { Navigate } from "react-router-dom";

// JWT დეცოდირება

function AdminRoute({ children }) {
  const token = localStorage.getItem("token");

  if (token) {
    return children;
  }

  return <Navigate to="/admin-dashboard" />;
}

export default AdminRoute;
