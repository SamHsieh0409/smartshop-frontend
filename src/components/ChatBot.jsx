import { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
    Box,
    TextField,
    IconButton,
    Paper,
    Typography,
    Avatar,
    Stack,
    Card,
    CardContent,
    CardMedia,
    Button,
    CircularProgress,
    Fab,
    Collapse,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import SmartToyIcon from "@mui/icons-material/SmartToy"; // 機器人圖示
import CloseIcon from "@mui/icons-material/Close";
import ChatIcon from "@mui/icons-material/Chat";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function ChatBot() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [isOpen, setIsOpen] = useState(false); // 控制聊天視窗開關
    const [input, setInput] = useState("");
    const [messages, setMessages] = useState([
        { sender: "ai", text: "你好！我是 SmartShop 的 AI 助手，想找什麼商品嗎？" },
    ]);
    const [loading, setLoading] = useState(false);
    const messagesEndRef = useRef(null);

    // 自動捲動到底部
    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages, isOpen]);

    const handleSend = async () => {
        if (!input.trim()) return;

        // 1. 顯示使用者訊息
        const userMsg = { sender: "user", text: input };
        setMessages((prev) => [...prev, userMsg]);
        setInput("");
        setLoading(true);

        try {
            // 2. 呼叫後端 API
            const res = await axios.post("/ai/chat", { message: userMsg.text });

            // 3. 處理 AI 回應 (包含文字與推薦商品)
            const { reply, products } = res.data.data;

            const aiMsg = {
                sender: "ai",
                text: reply,
                products: products || [], // 如果有推薦商品
            };

            setMessages((prev) => [...prev, aiMsg]);
        } catch (err) {
            setMessages((prev) => [
                ...prev,
                { sender: "ai", text: "抱歉，我現在有點累，請稍後再試..." },
            ]);
        } finally {
            setLoading(false);
        }
    };

    // 按下 Enter 發送
    const handleKeyPress = (e) => {
        if (e.key === "Enter") handleSend();
    };

    return (
        <>
            {/* 1. 右下角懸浮按鈕 (FAB) */}
            <Fab
                color="primary"
                aria-label="chat"
                onClick={() => setIsOpen(!isOpen)}
                sx={{
                    position: "fixed",
                    bottom: 24,
                    right: 24,
                    zIndex: 9999,
                }}
            >
                {isOpen ? <CloseIcon /> : <ChatIcon />}
            </Fab>

            {/* 2. 聊天視窗本體 */}
            <Collapse in={isOpen}>
                <Paper
                    elevation={6}
                    sx={{
                        position: "fixed",
                        bottom: 100,
                        right: 24,
                        width: 350,
                        height: 500,
                        display: "flex",
                        flexDirection: "column",
                        zIndex: 9999,
                        borderRadius: 4,
                        overflow: "hidden",
                    }}
                >
                    {/* 標題列 */}
                    <Box sx={{ p: 2, bgcolor: "primary.main", color: "white", display: "flex", alignItems: "center", gap: 1 }}>
                        <SmartToyIcon />
                        <Typography variant="h6">AI 購物助手</Typography>
                    </Box>

                    {/* 訊息顯示區 */}
                    <Box sx={{ flex: 1, p: 2, overflowY: "auto", bgcolor: "#f5f5f5" }}>
                        {messages.map((msg, index) => (
                            <Box
                                key={index}
                                sx={{
                                    display: "flex",
                                    justifyContent: msg.sender === "user" ? "flex-end" : "flex-start",
                                    mb: 2,
                                }}
                            >
                                <Stack direction="row" spacing={1} sx={{ maxWidth: "85%" }}>
                                    {msg.sender === "ai" && <Avatar sx={{ bgcolor: "secondary.main", width: 32, height: 32 }}><SmartToyIcon fontSize="small" /></Avatar>}

                                    <Box>
                                        {/* 文字訊息 */}
                                        <Paper
                                            sx={{
                                                p: 1.5,
                                                bgcolor: msg.sender === "user" ? "primary.light" : "white",
                                                color: msg.sender === "user" ? "white" : "text.primary",
                                                borderRadius: 2,
                                            }}
                                        >
                                            <Typography variant="body2">{msg.text}</Typography>
                                        </Paper>

                                        {/* 如果有推薦商品，顯示商品卡片 */}
                                        {msg.products && msg.products.length > 0 && (
                                            <Stack spacing={1} sx={{ mt: 1 }}>
                                                {msg.products.map((p) => (
                          <Card key={p.id} sx={{ display: "flex", width: "100%", cursor: "pointer" }} onClick={() => {setIsOpen(false); navigate(`/product/${p.id}`);}}>
                            <CardMedia
                              component="img"
                              sx={{ width: 60, height: 60, objectFit: "cover" }}
                              image={p.imageUrl || "/public/images/book.jpg"}
                              alt={p.name}
                            />
                            <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", p: 1 }}>
                              <Typography variant="subtitle2" noWrap>{p.name}</Typography>
                              <Typography variant="body2" color="primary">NT$ {p.price}</Typography>
                            </Box>
                          </Card>
                                        ))}
                                </Stack>
                    )}
                            </Box>
                </Stack>
                </Box>
            ))}

                {/* 載入中動畫 */}
                {loading && (
                    <Box sx={{ display: "flex", gap: 1, alignItems: "center", ml: 1 }}>
                        <CircularProgress size={20} />
                        <Typography variant="caption" color="text.secondary">AI 思考中...</Typography>
                    </Box>
                )}
                <div ref={messagesEndRef} />
            </Box>

            {/* 輸入區 */}
            <Box sx={{ p: 1, bgcolor: "white", display: "flex", gap: 1 }}>
                <TextField
                    fullWidth
                    size="small"
                    placeholder={user ? "請輸入問題..." : "請先登入才能對話"}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading || !user} // 沒登入不能用
                />
                <IconButton color="primary" onClick={handleSend} disabled={loading || !user}>
                    <SendIcon />
                </IconButton>
            </Box>
        </Paper >
      </Collapse >
    </>
  );
}