import { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Stack,
  Pagination,
  CircularProgress,
} from "@mui/material";
import { useNotify } from "../context/NotificationContext";

export default function ProductList() {
  const notify = useNotify();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);

  const [sortBy, setSortBy] = useState("id");
  const [direction, setDirection] = useState("asc");

  const [loading, setLoading] = useState(false);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const res = await axios.get("/products/filter", {
        params: {
          page: page - 1,
          size,
          sortBy,
          direction,
          keyword: keyword || null,
          category: category || null,
        },
      });

      const data = res.data.data;
      setProducts(data?.content || []);
      setTotalPages(data?.totalPages || 1);
    } catch (err) {
      notify.show("商品載入失敗", "error");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await axios.get("/products/categories");
      setCategories(res.data.data || []);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [page, category, sortBy, direction]);

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  const handleAddToCart = async (productId) => {
    try {
      await axios.post("/cart/add", { productId, qty: 1 }, { withCredentials: true });
      notify.show("加入購物車成功", "success");
    } catch (err) {
      if (err.response?.status === 401) {
        notify.show("請先登入！", "error");
      } else {
        notify.show("加入購物車失敗", "error");
      }
    }
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* 搜尋欄 */}
      <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
        <TextField
          label="關鍵字搜尋"
          size="small"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />

        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>分類</InputLabel>
          <Select
            value={category}
            label="分類"
            onChange={(e) => {
              setCategory(e.target.value);
              setPage(1);
            }}
          >
            <MenuItem value="">全部</MenuItem>
            {categories.map((c) => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl size="small">
          <InputLabel>排序</InputLabel>
          <Select
            value={sortBy}
            label="排序"
            onChange={(e) => setSortBy(e.target.value)}
          >
            <MenuItem value="id">預設</MenuItem>
            <MenuItem value="price">價格</MenuItem>
            <MenuItem value="name">名稱</MenuItem>
            <MenuItem value="createdAt">最新</MenuItem>
          </Select>
        </FormControl>

        <Button variant="contained" onClick={handleSearch}>
          搜尋
        </Button>
      </Stack>

      {/* 載入中 */}
      {loading && (
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <CircularProgress />
        </Box>
      )}

      {/* 商品列表 */}
      <Grid container spacing={2} justifyContent="center">
        {products.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card>
              <CardMedia
                component="img"
                image={p.imageUrl || `https://picsum.photos/300/200?random=${p.id}`}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: 180,
                  objectFit: "cover",
                  backgroundColor: "#f2f2f2",
                }}
              />
              <CardContent>
                <Typography variant="h6" noWrap sx={{ mb: 1 }}>
                  {p.name}
                </Typography>

                <Box sx={{ textAlign: "right" }}>
                  <Typography sx={{ fontWeight: "bold" }}>
                    NT$ {p.price}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    庫存：{p.stock}
                  </Typography>
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 1 }}
                  onClick={() => handleAddToCart(p.id)}
                  disabled={p.stock <= 0}
                >
                  {p.stock > 0 ? "加入購物車" : "已售完"}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 分頁 */}
      {totalPages > 1 && (
        <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Box>
  );
}
