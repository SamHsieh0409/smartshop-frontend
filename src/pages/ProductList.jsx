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
  Pagination,
  CircularProgress,
  Container,
  Paper,
  InputAdornment,
  Stack,
  Chip,
  Divider
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import WhatshotIcon from '@mui/icons-material/Whatshot';
import { useNotify } from "../context/NotificationContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {refreshUser} from "../context/AuthContext";

export default function ProductList() {
  const notify = useNotify();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();

  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [size] = useState(12);
  const [totalPages, setTotalPages] = useState(1);

  const [keyword, setKeyword] = useState("");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [sortBy, setSortBy] = useState("id");
  const [direction] = useState("asc");
  const [loading, setLoading] = useState(false);

  const [featuredProducts, setFeaturedProducts] = useState([]);

  // 1. 抓取一般商品
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
      setProducts(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 1);
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

  // 2. 隨機抓取 3 本推薦書
  const fetchFeatured = async () => {
    try {
      // 先抓取前 20 筆 (或者更多)，然後在前端隨機挑 3 筆
      const res = await axios.get("/products/filter", {
        params: { page: 0, size: 20 }
      });

      const all = res.data.data?.content || [];
      if (all.length > 0) {
        // 隨機洗牌
        const shuffled = [...all].sort(() => 0.5 - Math.random());
        // 取前 3 個
        setFeaturedProducts(shuffled.slice(0, 3));
      }
    } catch (err) {
      console.error("無法取得推薦商品");
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchFeatured();
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

  return (
    <Box sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", pb: 5 }}>
      <Box
        sx={{
          height: 300,
          bgcolor: "#2c3e50",
          color: "white",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundImage: "linear-gradient(45deg, #2c3e50 30%, #3498db 90%)",
          mb: 4,
          boxShadow: 3,
        }}
      >
        <Typography variant="h2" fontWeight="bold" gutterBottom>
          SmartShop 書店
        </Typography>
        <Typography variant="h5">探索知識，啟發智慧</Typography>
      </Box>

      <Container maxWidth="lg">

        {/* 3. 店長推薦區塊 */}
        {featuredProducts.length > 0 && (
          <Box sx={{ mb: 6 }}>
            <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
              <WhatshotIcon color="error" fontSize="large" sx={{ transform: 'translateY(3px)' }} />
              <Typography variant="h4" fontWeight="bold" color="#333" sx={{ lineHeight: 1 }}>
                店長強力推薦
              </Typography>
            </Stack>

            <Grid container spacing={3}>
              {featuredProducts.map((p) => (
                <Grid item xs={12} sm={6} md={4} key={p.id}>
                  <Card
                    sx={{
                      height: "100%",
                      display: "flex",
                      flexDirection: "column",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)", boxShadow: 6 },
                      borderRadius: 2,
                      cursor: "pointer",
                      position: "relative",
                      overflow: "hidden"
                    }}
                    onClick={() => navigate(`/product/${p.id}`)}
                  >
                    {/* 右上角紅色標籤 */}
                    <Chip
                      label="HOT"
                      color="error"
                      size="small"
                      icon={<AutoAwesomeIcon />}
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        zIndex: 2,
                        fontWeight: "bold",
                        boxShadow: 2
                      }}
                    />

                    <Box sx={{ pt: 2, px: 2, textAlign: "center", bgcolor: "#fafafa" }}>
                      <CardMedia
                        component="img"
                        image={p.imageUrl || "/images/book.jpg"}
                        alt={p.name}
                        sx={{
                          height: 200,
                          objectFit: "contain",
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                    <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                      <Typography gutterBottom variant="subtitle2" color="text.secondary">
                        {p.category}
                      </Typography>
                      <Typography variant="h6" component="div" sx={{
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        display: "-webkit-box",
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: "vertical",
                        minHeight: 50
                      }}>
                        {p.name}
                      </Typography>

                      <Box sx={{ mt: "auto", pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <Typography variant="h6" color="primary" fontWeight="bold">
                          NT$ {p.price}
                        </Typography>
                        <Button
                          variant="contained"
                          size="small"
                          startIcon={<ShoppingCartIcon />}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleAddToCart(p.id);
                          }}
                          disabled={p.stock <= 0}
                          sx={{ borderRadius: 5 }}
                        >
                          {p.stock > 0 ? "購買" : "缺貨"}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
            <Divider sx={{ mt: 5, mb: 3 }} />
          </Box>
        )}

        {/* 一般商品列表 */}
        <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                placeholder="搜尋書籍..."
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon color="action" />
                    </InputAdornment>
                  ),
                }}
                size="small"
              />
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 140 }}>
                <InputLabel id="category-label">書籍分類</InputLabel>
                <Select
                  labelId="category-label"
                  value={category}
                  label="書籍分類"
                  onChange={(e) => {
                    setCategory(e.target.value);
                    setPage(1);
                  }}
                >
                  <MenuItem value="">所有分類</MenuItem>
                  {categories.map((c) => (
                    <MenuItem key={c} value={c}>{c}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6} md={3}>
              <FormControl fullWidth size="small" sx={{ minWidth: 120 }}>
                <InputLabel id="sort-label">排序方式</InputLabel>
                <Select
                  labelId="sort-label"
                  value={sortBy}
                  label="排序方式"
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <MenuItem value="id">預設</MenuItem>
                  <MenuItem value="price">價格</MenuItem>
                  <MenuItem value="createdAt">最新上架</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={2}>
              <Button fullWidth variant="contained" size="large" onClick={handleSearch} sx={{ height: 40 }}>
                搜尋
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {loading && (
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {!loading && (
          <Grid container spacing={3}>
            {products.map((p) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
                <Card
                  sx={{
                    height: "100%",
                    display: "flex",
                    flexDirection: "column",
                    transition: "transform 0.2s",
                    "&:hover": {
                      transform: "scale(1.02)",
                      boxShadow: 6,
                    },
                    borderRadius: 2,
                    cursor: "pointer"
                  }}
                  onClick={() => navigate(`/product/${p.id}`)}
                >
                  <Box sx={{ pt: 2, px: 2, textAlign: "center", bgcolor: "#fafafa" }}>
                    <CardMedia
                      component="img"
                      image={p.imageUrl || "/images/book.jpg"}
                      alt={p.name}
                      sx={{
                        height: 200,
                        objectFit: "contain",
                        borderRadius: 1,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
                    <Typography gutterBottom variant="subtitle2" color="text.secondary">
                      {p.category}
                    </Typography>
                    <Typography variant="h6" component="div" sx={{
                      overflow: "hidden",
                      textOverflow: "ellipsis",
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      minHeight: 50
                    }}>
                      {p.name}
                    </Typography>

                    <Box sx={{ mt: "auto", pt: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Typography variant="h6" color="primary" fontWeight="bold">
                        NT$ {p.price}
                      </Typography>
                      <Button
                        variant="contained"
                        size="small"
                        startIcon={<ShoppingCartIcon />}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddToCart(p.id);
                        }}
                        disabled={p.stock <= 0}
                        sx={{ borderRadius: 5 }}
                      >
                        {p.stock > 0 ? "購買" : "缺貨"}
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}

        <Box sx={{ mt: 5, display: "flex", justifyContent: "center" }}>
          <Pagination
            count={totalPages}
            page={page}
            onChange={(_, value) => setPage(value)}
            color="primary"
            size="large"
            showFirstButton
            showLastButton
          />
        </Box>
      </Container>
    </Box>
  );
}