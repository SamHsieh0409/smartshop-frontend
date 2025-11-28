import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav
      style={{
        padding: "10px 20px",
        background: "#eee",
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        zIndex: 999,
        display: "flex",
        gap: "10px",
        alignItems: "center",
      }}
    >
      <Link to="/products">商品列表</Link>

      {user ? (
        <>
          <Link to="/cart">購物車</Link>
          <Link to="/orders">我的訂單</Link>
          <span>Hi, {user.username}</span>
          <button onClick={logout}>登出</button>
        </>
      ) : (
        <>
          <Link to="/login">登入</Link>
          <Link to="/register">註冊</Link>
        </>
      )}
    </nav>
  );
}
