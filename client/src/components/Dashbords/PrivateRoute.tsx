import React, { type ReactNode } from "react";
import { Navigate } from "react-router-dom";

function getUserRole(): string | null {
  return localStorage.getItem("userRole");
}

interface PrivateRouteProps {
  requiredRole?: string;
  children: ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ requiredRole, children }) => {
  const userRole = getUserRole();

  if (!userRole) {
    console.warn("Access denied: No user role found");
    return <Navigate to="/unauthorized" replace />;
  }

  // ✅ Allow super_admin to access everything
  if (userRole === "super_admin") {
    return <>{children}</>;
  }

  if (requiredRole && userRole !== requiredRole) {
    console.warn(`Access denied: Role "${userRole}" does not match required "${requiredRole}"`);
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;





