import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Grid,
  Typography,
  Button,
  Chip,
  Stack,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useNotify } from "../context/NotificationContext";
import { useAuth } from "../context/AuthContext";

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const notify = useNotify();
  const { user, refreshUser } = useAuth();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`/products/${id}`)
      .then((res) => {
        setProduct(res.data.data);
      })
      .catch(() => {
        notify.show("找不到該商品", "error");
        navigate("/products");
      })
      .finally(() => setLoading(false));
  }, [id, navigate, notify]);

  const handleAddToCart = async (productId) => {
    try {
      await axios.post("/cart/add", { productId, qty: 1 });
      notify.show("加入購物車成功", "success"); // 步驟 1: 確保成功通知發出

      if (user) {
        // 步驟 2: 將 refreshUser 放在獨立的 try/catch
        try {
          await refreshUser();
        } catch (e) {
          // 靜默處理 refresh 失敗，因為加入購物車本體是成功的
          console.error("Failed to refresh user cart count:", e);
        }
      }

    } catch (err) {
      // 只有當 axios.post("/cart/add") 失敗時，才會執行這裡
      if (err.response?.status === 401) {
        notify.show("請先登入！", "error");
        navigate("/login");
      } else {
        notify.show("加入失敗", "error");
      }
    }
  };

  if (loading) return <Box sx={{ textAlign: "center", mt: 10 }}><CircularProgress /></Box>;
  if (!product) return null;

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate(-1)} sx={{ mb: 2 }}>
        返回
      </Button>

      <Paper elevation={3} sx={{ p: 4, borderRadius: 4 }}>
        <Grid container spacing={4} alignItems="center">

          {/* 左側圖片 */}
          <Grid item xs={12} md={6}>
            <Box
              component="img"
              src={product.imageUrl || `/images/book.jpg`}
              alt={product.name}
              sx={{
                width: "100%",
                height: 400,
                objectFit: "contain",
                borderRadius: 2,
                bgcolor: "#f9f9f9",
              }}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={2}>
              <Chip label={product.category} color="primary" size="small" sx={{ width: "fit-content" }} />

              <Typography variant="h4" fontWeight="bold">
                {product.name}
              </Typography>

              <Typography variant="h5" color="error" fontWeight="bold">
                NT$ {product.price}
              </Typography>

              <Typography variant="body1" color="text.secondary" sx={{ minHeight: 100 }}>
                {product.description || "這項商品目前沒有詳細說明。"}
              </Typography>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                <Typography variant="body1" color="text.secondary">
                  庫存剩餘：<span style={{ fontWeight: "bold", color: "#333" }}>{product.stock}</span> 件
                </Typography>

                <Box sx={{ flexGrow: 1 }} />

                <Button
                  variant="contained"
                  size="large"
                  startIcon={<ShoppingCartIcon />}
                  onClick={handleAddToCart}
                  disabled={product.stock <= 0}
                  sx={{
                    borderRadius: 8,
                    px: 4,
                    textTransform: "none",
                    fontSize: "1rem",
                    boxShadow: 3
                  }}
                >
                  {product.stock > 0 ? "放入購物車" : "已售完"}
                </Button>
              </Box>

            </Stack>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}