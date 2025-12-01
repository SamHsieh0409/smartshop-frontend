import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Stack,
  Divider,
  Container,
  Avatar
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import { useNotify } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const notify = useNotify();
  const navigate = useNavigate();
  const [items, setItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart");
      setItems(res.data.data || []);
    } catch (err) {
      notify.show("請先登入", "error");
      navigate("/login");
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty <= 0) return;
    try {
      await axios.put(`/cart/update`, { productId, qty });
      fetchCart();
    } catch (err) {
      notify.show("更新失敗", "error");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`/cart/remove/${productId}`);
      fetchCart();
      notify.show("商品已移除", "warning");
    } catch (err) {
      notify.show("移除失敗", "error");
    }
  };

  const checkout = async () => {
    try {
      await axios.post("/orders/checkout");
      notify.show("訂單建立成功！請前往付款", "success");
      navigate("/orders");
    } catch (err) {
      notify.show(err.response?.data?.message || "結帳失敗", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <ShoppingBagIcon fontSize="large" /> 
        我的購物車
      </Typography>

      {items.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: "center" }}>
          <Typography variant="h6" color="text.secondary">購物車是空的</Typography>
          <Button variant="contained" sx={{ mt: 2 }} onClick={() => navigate("/products")}>
            去逛逛
          </Button>
        </Paper>
      ) : (
        <Stack spacing={3}>
          <TableContainer component={Paper} elevation={2}>
            <Table>
              <TableHead sx={{ bgcolor: "#f5f5f5" }}>
                <TableRow>
                  <TableCell>商品資訊</TableCell>
                  <TableCell align="center">單價</TableCell>
                  <TableCell align="center">數量</TableCell>
                  <TableCell align="center">小計</TableCell>
                  <TableCell align="center">操作</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar 
                          variant="rounded" 
                          src={item.imageUrl || "/images/book.jpg"} 
                          sx={{ width: 60, height: 60 }} 
                        />
                        <Typography variant="subtitle1" fontWeight="bold">
                          {item.productName}
                        </Typography>
                      </Stack>
                    </TableCell>
                    <TableCell align="center">NT$ {item.price}</TableCell>
                    <TableCell align="center">
                      <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #ddd", borderRadius: 1 }}>
                        <IconButton size="small" onClick={() => updateQty(item.productId, item.qty - 1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <Typography sx={{ mx: 1 }}>{item.qty}</Typography>
                        <IconButton size="small" onClick={() => updateQty(item.productId, item.qty + 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="center" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      NT$ {item.price * item.qty}
                    </TableCell>
                    <TableCell align="center">
                      <IconButton color="error" onClick={() => removeItem(item.productId)}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Paper elevation={3} sx={{ p: 3, bgcolor: "#fffbf2" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="h5">
                總金額：
                <span style={{ color: "#d32f2f", fontWeight: "bold" }}>
                  NT$ {total}
                </span>
              </Typography>
              <Button 
                variant="contained" 
                size="large" 
                color="primary" 
                onClick={checkout}
                sx={{ px: 5, borderRadius: 10, fontSize: "1.2rem" }}
              >
                前往結帳
              </Button>
            </Stack>
          </Paper>
        </Stack>
      )}
    </Container>
  );
}