import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 初次載入檢查登入狀態

  const fetchUser = async () => {
    try {
        const res = await axios.get("/auth/me", { withCredentials: true });
        setUser(res.data.data);
    } catch (e) {
        // 如果抓取使用者資料失敗（例如 Session 過期），則視為未登入
        setUser(null);
    }
  };

  // App 啟動時，向後端查詢登入狀態
  useEffect(() => {
    axios.get("/auth/isLoggedIn", { withCredentials: true })
      .then(res => {
        if (res.data.data) {
          // 已登入 → 取得使用者資料，使用 fetchUser 函式
          fetchUser();
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userInfo) => setUser(userInfo);

  const logout = async () => {
    await axios.get("/auth/logout", { withCredentials: true });
    setUser(null);
  };

  const refreshUser = fetchUser;
  
  return (
    <AuthContext.Provider value={{ user, login, logout, loading, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);