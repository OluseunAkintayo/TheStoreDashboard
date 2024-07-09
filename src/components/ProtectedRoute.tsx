import { Navigate, Outlet } from "react-router-dom";

const token: string | null = sessionStorage.getItem('command');

export default function ProtectedRoute() {
  if(!token) {
    return <Navigate to="/auth/login" />
  }
  return <Outlet />
}
