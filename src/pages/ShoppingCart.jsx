import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Grid,
  IconButton,
  Stack,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useNotify } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";

export default function ShoppingCart() {
  const notify = useNotify();
  const navigate = useNavigate();

  const [items, setItems] = useState([]);

  const fetchCart = async () => {
    try {
      const res = await axios.get("/cart", { withCredentials: true });
      setItems(res.data.data || []);
    } catch (err) {
      notify.show("請先登入", "error");
      navigate("/login");
    }
  };

  const updateQty = async (productId, qty) => {
    if (qty <= 0) return;
    try {
      await axios.put(
        `/cart/update/${productId}?quantity=${qty}`,
        {},
        { withCredentials: true }
      );
      fetchCart();
    } catch (err) {
      notify.show("更新數量失敗", "error");
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(`/cart/remove/${productId}`, {
        withCredentials: true,
      });
      fetchCart();
    } catch (err) {
      notify.show("移除失敗", "error");
    }
  };

  const clearCart = async () => {
    try {
      await axios.delete("/cart/clear", { withCredentials: true });
      fetchCart();
    } catch (err) {
      notify.show("清空失敗", "error");
    }
  };

  const checkout = async () => {
    try {
      const res = await axios.post(
        "/orders/checkout",
        {},
        { withCredentials: true }
      );
      notify.show("結帳成功！", "success");
      navigate("/orders");
    } catch (err) {
      notify.show("結帳失敗", "error");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const total = items.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        🛒 購物車
      </Typography>

      {items.length === 0 && (
        <Typography>購物車內沒有任何商品</Typography>
      )}

      <Grid container spacing={2}>
        {items.map((item) => (
          <Grid item xs={12} key={item.productId}>
            <Card>
              <CardContent>
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography>{item.productName}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                    >
                      -
                    </Button>

                    <Typography>{item.qty}</Typography>

                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                    >
                      +
                    </Button>

                    <Typography sx={{ width: 80, textAlign: "right" }}>
                      NT$ {item.price * item.qty}
                    </Typography>

                    <IconButton onClick={() => removeItem(item.productId)}>
                      <DeleteIcon />
                    </IconButton>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {items.length > 0 && (
        <>
          <Typography variant="h6" sx={{ mt: 3 }}>
            總金額：NT$ {total}
          </Typography>

          <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
            <Button variant="outlined" color="error" onClick={clearCart}>
              清空購物車
            </Button>

            <Button variant="contained" color="success" onClick={checkout}>
              結帳
            </Button>
          </Stack>
        </>
      )}
    </Box>
  );
}
