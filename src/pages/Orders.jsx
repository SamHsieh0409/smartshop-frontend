import { useEffect, useState } from "react";
import axios from "axios";
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
  Dialog,
  DialogContent,
  CircularProgress,
  DialogTitle,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useNotify } from "../context/NotificationContext";

export default function Orders() {
  const notify = useNotify();
  const [orders, setOrders] = useState([]);
  
  // 控制模擬付款視窗
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [paymentStep, setPaymentStep] = useState("processing"); // processing | success
  const [currentOrderId, setCurrentOrderId] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("/orders");
      setOrders(res.data.data || []);
    } catch (err) {
      notify.show("無法取得訂單資料", "error");
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  // 觸發模擬付款
  const handlePayment = (orderId) => {
    setCurrentOrderId(orderId);
    setPaymentStep("processing");
    setPaymentOpen(true);

    // 模擬 2 秒後付款成功
    setTimeout(() => {
      handlePaymentSuccess(orderId);
    }, 2000);
  };

  const handlePaymentSuccess = async (orderId) => {
    try {
      // 呼叫後端「模擬付款 API」來真正更新資料庫狀態
      // 注意：我們直接用之前寫給開發測試用的那個 API
      await axios.post(`/payments/test/pay/${orderId}`);
      
      setPaymentStep("success");
      
      // 1.5 秒後關閉視窗並重整列表
      setTimeout(() => {
        setPaymentOpen(false);
        fetchOrders(); // 重抓訂單，狀態會變 PAID
        notify.show(`訂單 #${orderId} 付款成功！`, "success");
      }, 1500);

    } catch (err) {
      setPaymentOpen(false);
      notify.show("付款失敗，請稍後再試", "error");
    }
  };

  return (
    <Box sx={{ p: 3, maxWidth: 800, mx: "auto" }}>
      <Typography variant="h4" sx={{ mb: 3, fontWeight: "bold" }}>
        📄 我的訂單
      </Typography>

      {orders.length === 0 ? (
        <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
          目前沒有訂單紀錄
        </Typography>
      ) : (
        <Stack spacing={3}>
          {orders.map((order) => (
            <Card key={order.id} variant="outlined" sx={{ borderRadius: 2, boxShadow: 1 }}>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mb: 2 }}
                >
                  <Typography variant="h6" fontWeight="bold">
                    訂單編號: #{order.id}
                  </Typography>
                  <Chip
                    label={order.status === "PAID" ? "已付款" : "待付款"}
                    color={order.status === "PAID" ? "success" : "warning"}
                    variant={order.status === "PAID" ? "filled" : "outlined"}
                  />
                </Stack>

                <Typography variant="body2" color="text.secondary" gutterBottom>
                  下單時間: {new Date(order.createdAt).toLocaleString()}
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* 訂單明細 */}
                {order.items && order.items.map((item) => (
                  <Grid container key={item.productId} sx={{ mb: 1 }}>
                    <Grid item xs={8}>
                      <Typography variant="body1">
                        {item.productName} <span style={{ color: "#888", fontSize: "0.9em" }}>x {item.qty}</span>
                      </Typography>
                    </Grid>
                    <Grid item xs={4} sx={{ textAlign: "right" }}>
                      <Typography variant="body1" fontWeight="medium">
                        $ {item.subtotal}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}

                <Divider sx={{ my: 2 }} />

                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  sx={{ mt: 2 }}
                >
                  <Typography variant="h6" fontWeight="bold" color="primary">
                    總金額: NT$ {order.totalAmount}
                  </Typography>

                  {/* 按鈕區 */}
                  {order.status !== "PAID" && (
                    <Button 
                      variant="contained" 
                      color="primary"
                      size="large"
                      onClick={() => handlePayment(order.id)}
                      sx={{ borderRadius: 20, px: 4 }}
                    >
                      立即付款
                    </Button>
                  )}
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      )}

      {/* --- 模擬付款對話框 --- */}
      <Dialog 
        open={paymentOpen} 
        maxWidth="xs" 
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, p: 2 } }}
      >
        <DialogTitle sx={{ textAlign: "center", fontWeight: "bold" }}>
          {paymentStep === "processing" ? "付款處理中..." : "付款成功！"}
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", py: 3 }}>
            {paymentStep === "processing" ? (
              <>
                <CircularProgress size={60} thickness={4} />
                <Typography sx={{ mt: 3, color: "text.secondary" }}>
                  正在連接銀行端安全閘道...
                </Typography>
              </>
            ) : (
              <>
                <CheckCircleIcon color="success" sx={{ fontSize: 80, mb: 2 }} />
                <Typography variant="h6" color="success.main">
                  交易已完成
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  感謝您的購買！
                </Typography>
              </>
            )}
          </Box>
        </DialogContent>
      </Dialog>

    </Box>
  );
}