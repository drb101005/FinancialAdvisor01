import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const isAuthenticated = localStorage.getItem("token"); // or user data
  return isAuthenticated ? children : <Navigate to="/login" />;
};

export default PrivateRoute;
