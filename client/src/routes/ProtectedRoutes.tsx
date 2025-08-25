import { useAppSelector } from "@/hooks/hook";
import type { ReactNode } from "react";
import { Navigate, Outlet } from "react-router-dom";

interface Prop {
  allowedRole: string[];
  children: ReactNode;
}

const ProtectedRoutes = ({ allowedRole, children }: Prop) => {
  const user = useAppSelector((state) => state.auth.user);
  if (!user) {
    return <Navigate to="/" replace />;
  }
  if (!allowedRole.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }
  return children ? <>{children}</> : <Outlet />;
};

export default ProtectedRoutes;
