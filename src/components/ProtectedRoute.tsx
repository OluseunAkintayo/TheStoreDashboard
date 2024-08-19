import { Navigate, Outlet } from "react-router-dom";

export default function ProtectedRoute() {
  const token: string | null = sessionStorage.getItem('command');
  if(token) {
    return <Outlet />
  } else {
    return <Navigate to="/auth/login" />
  }
}
