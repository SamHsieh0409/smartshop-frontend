import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom"; // 引入路由工具
import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Chip,
  Button,
  Grid,
  Divider,
} from "@mui/material";
import { useNotify } from "../context/NotificationContext";

export default function Orders() {
  const notify = useNotify();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams(); // 取得網址參數
  const [orders, setOrders] = useState([]);
  
  // 防止 React StrictMode 重複觸發 (開發環境常見問題)
  const processedRef = useRef(false);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      notify.show("無法取得訂單資料", "error");
    }
  };

  // 1. 檢查是否剛從綠界回來
  useEffect(() => {
    const returnOrderId = searchParams.get("orderId");

    if (returnOrderId && !processedRef.current) {
      processedRef.current = true; // 標記已處理，避免重複呼叫
      
      const handleReturn = async () => {
        try {
          // 呼叫後端模擬付款 API
          await axios.post(`/payments/test/pay/${returnOrderId}`);
          notify.show(`訂單 #${returnOrderId} 付款成功！`, "success");
          
          // 清除網址上的參數，讓網址變回乾淨的 /orders
          setSearchParams({});
          
          // 重新抓取訂單列表，這樣狀態就會變成 PAID
          fetchOrders();
        } catch (err) {
          notify.show("付款狀態更新失敗", "error");
        }
      };

      handleReturn();
    } else {
      // 如果不是剛回來，就正常抓資料
      fetchOrders();
    }
  }, [searchParams, setSearchParams, notify]);

  const handlePayment = (orderId) => {
    // 導向後端產生綠界表單
    window.location.href = `/payments/ecpay/${orderId}`;
  };

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 3 }}>
        📄 我的訂單
      </Typography>

      {orders.length === 0 ? (
        <Typography>目前沒有訂單紀錄</Typography>
      ) : (
        <Stack spacing={2}>
          {orders.map((order) => (
            <Card key={order.id} variant="outlined">
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6">
                    訂單編號: #{order.id}
                  </Typography>
                  <Chip
                    label={order.status === "PAID" ? "已付款" : "待付款"}
                    color={order.status === "PAID" ? "success" : "warning"}
                  />
                </Stack>

                <Typography color="text.secondary" gutterBottom>
                  建立時間: {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Divider sx={{ my: 1 }} />

                {/* 訂單明細 */}
                {order.items && order.items.map((item) => (
                  <Grid container key={item.productId} sx={{ mt: 1 }}>
                    <Grid item xs={8}>
                      {item.productName} x {item.qty}
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      $ {item.subtotal}
                    </Grid>
                  </Grid>
                ))}

                <Divider sx={{ my: 1 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="h6">
                    總金額: NT$ {order.totalAmount}
                  </Typography>

                  {/* 只有狀態不是 PAID 時才顯示按鈕 */}
                  {order.status !== "PAID" && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      onClick={() => handlePayment(order.id)}
                    >
                      前往付款 (綠界)
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}
    </Box>
  );
}