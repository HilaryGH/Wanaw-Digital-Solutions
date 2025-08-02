// src/components/Dashbords/PrivateRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";

// Replace this with your actual method to get user role (context, redux, etc.)
function getUserRole(): string | null {
  // Example: role stored in localStorage under "userRole"
  return localStorage.getItem("userRole");
}

interface PrivateRouteProps {
  requiredRole?: string; // optional required role for route
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
  const userRole = getUserRole();

  if (!userRole) {
    // User not logged in or no role found
    return <Navigate to="/unauthorized" replace />;
  }

  // Super admin bypasses all role checks
  if (userRole === "super_admin") {
    return <>{children}</>;
  }

  // If a requiredRole is set and userRole doesn't match, redirect
  if (requiredRole && userRole !== requiredRole) {
    return <Navigate to="/unauthorized" replace />;
  }

  // Role matches or no role required
  return <>{children}</>;
};

export default PrivateRoute;



