import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token || role !== "teacher") {
    return <Navigate to="/teacher/login" />;
  }

  return children;
};

export default ProtectedRoute;
