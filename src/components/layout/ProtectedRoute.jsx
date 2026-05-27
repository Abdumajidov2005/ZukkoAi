import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore } from "../../store/authStore";
import { ROLE_HOME } from "../../data/mockData";

// Guards routes by authentication + role.
// Usage: <ProtectedRoute roles={["student"]}><StudentLayout/></ProtectedRoute>
export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user.role)) {
    // logged in but wrong role → send to their own home
    return <Navigate to={ROLE_HOME[user.role] || "/"} replace />;
  }

  return children;
}
