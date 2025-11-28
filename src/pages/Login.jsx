import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const notify = useNotify();
  const { login } = useAuth(); // 設定全域登入狀態
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      notify.show("請輸入帳號與密碼！", "error");
      return;
    }

    try {
      const res = await axios.post(
        "/auth/login",
        { username, password },
        { withCredentials: true }
      );

      login(res.data.data); // ⬅ 設定全域登入狀態
      notify.show("登入成功！歡迎回來 😄", "success");

      navigate("/"); // 導回首頁
    } catch (err) {
      const msg = err.response?.data?.message || "登入失敗";
      notify.show(msg, "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>登入</h2>

      <input
        placeholder="帳號"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleLogin}>
        登入
      </button>
    </div>
  );
}
