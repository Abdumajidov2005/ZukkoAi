import { Navigate, useLocation } from "react-router-dom";
import { useAuthStore, ROLE_HOME } from "../../store/authStore";

export default function ProtectedRoute({ children, roles }) {
  const { isAuthenticated, user } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (roles && !roles.includes(user?.role)) {
    return <Navigate to={ROLE_HOME[user?.role] || "/"} replace />;
  }

  return children;
}
