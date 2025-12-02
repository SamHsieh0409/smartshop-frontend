import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Box, CircularProgress } from "@mui/material";

export default function ProtectedRoute() {
  const { user, loading } = useAuth();

  // 1. 等待後端確認登入狀態中...
  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
        <CircularProgress />
      </Box>
    );
  }

  // 2. 檢查完畢，如果沒登入，強制導向登入頁
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 3. 有登入，渲染原本要去的頁面 (Outlet 代表子路由)
  return <Outlet />;
}