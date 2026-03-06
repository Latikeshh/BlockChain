import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  // Allow both teacher and admin roles
  if (!token || (role !== "teacher" && role !== "admin")) {
    return <Navigate to="/teacher/login" />;
  }

  return children;
};

export default ProtectedRoute;
