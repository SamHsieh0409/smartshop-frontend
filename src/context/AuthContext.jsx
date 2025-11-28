import { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // 初次載入檢查登入狀態

  // App 啟動時，向後端查詢登入狀態
  useEffect(() => {
    axios.get("/auth/isLoggedIn", { withCredentials: true })
      .then(res => {
        if (res.data.data) {
          // 已登入 → 取得使用者資料
          axios.get("/auth/me", { withCredentials: true })
            .then(res2 => setUser(res2.data.data))
        }
      })
      .finally(() => setLoading(false));
  }, []);

  const login = (userInfo) => setUser(userInfo);

  const logout = async () => {
    await axios.get("/auth/logout", { withCredentials: true });
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
