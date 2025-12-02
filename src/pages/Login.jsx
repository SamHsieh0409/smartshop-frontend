import { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useNotify } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export default function Login() {
  const notify = useNotify();
  const { login } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    if (!username || !password) {
      notify.show("請輸入帳號與密碼！", "error");
      return;
    }

    try {
      const res = await axios.post("/auth/login", { username, password });
      login(res.data.data);
      notify.show("登入成功！歡迎回來 😄", "success");
      navigate("/");
    } catch (err) {
      const msg = err.response?.data?.message || "登入失敗";
      notify.show(msg, "error");
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ mt: 10 }}>
      <Paper elevation={6} sx={{ p: 4, display: "flex", flexDirection: "column", alignItems: "center", borderRadius: 3 }}>
        <Box sx={{ bgcolor: "primary.main", p: 1, borderRadius: "50%", mb: 1 }}>
          <LoginIcon sx={{ color: "white" }} />
        </Box>
        <Typography component="h1" variant="h5" fontWeight="bold">
          會員登入
        </Typography>
        
        <Box component="form" noValidate sx={{ mt: 3, width: "100%" }}>
          <TextField
            margin="normal"
            required
            fullWidth
            label="帳號"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="normal"
            required
            fullWidth
            label="密碼"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, height: 48, fontSize: "1.1rem" }}
            onClick={handleLogin}
          >
            登入
          </Button>
          
          <Divider sx={{ my: 2 }}>或</Divider>
          
          <Button
            fullWidth
            variant="outlined"
            component={Link}
            to="/register"
          >
            註冊新帳號
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}