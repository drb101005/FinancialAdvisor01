// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children }) => {
  const access = localStorage.getItem("access");
  const refresh = localStorage.getItem("refresh");

  // Must have at least an access or refresh token to be "authenticated"
  const isAuthenticated = Boolean(access || refresh);

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;
