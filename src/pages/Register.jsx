import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useNotify } from "../context/NotificationContext";

export default function Register() {
  const navigate = useNavigate();
  const notify = useNotify();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    if (!username || !password || !email) {
      notify.show("請完整填寫所有欄位！", "error");
      return;
    }

    try {
      const res = await axios.post(
        "/auth/register",
        { username, email, password },
        { withCredentials: true }
      );

      notify.show("註冊成功！請登入 😄", "success");
      setTimeout(() => {
        navigate("/login");
      }, 1200);

    } catch (err) {
      const msg = err.response?.data?.message || "註冊失敗";
      notify.show(msg, "error");
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>註冊</h2>

      <input
        placeholder="帳號"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      /><br />

      <input
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      /><br />

      <input
        type="password"
        placeholder="密碼"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      /><br />

      <button onClick={handleRegister}>註冊</button>
    </div>
  );
}
