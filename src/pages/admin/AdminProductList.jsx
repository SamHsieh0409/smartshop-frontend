import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Stack,
  Chip,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNotify } from "../../context/NotificationContext";

export default function AdminProductList() {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const notify = useNotify();

  const fetchProducts = async () => {
    try {
      const res = await axios.get("/products");
      setProducts(res.data.data || []);
    } catch (err) {
      notify.show("無法取得商品列表", "error");
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除這本書嗎？")) return;

    try {
      await axios.delete(`/products/${id}`, { withCredentials: true });
      notify.show("刪除成功", "success");
      fetchProducts(); // 重新整理列表
    } catch (err) {
      notify.show("刪除失敗 (可能權限不足)", "error");
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h4">📚 後台書籍管理</Typography>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => navigate("/admin/product/new")}
        >
          新增書籍
        </Button>
      </Stack>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#f5f5f5" }}>
            <TableRow>
              <TableCell width="50">ID</TableCell>
              <TableCell width="80">圖片</TableCell>
              <TableCell>書名</TableCell>
              <TableCell width="100">分類</TableCell>
              <TableCell width="100" align="right">價格</TableCell>
              <TableCell width="100" align="right">庫存</TableCell>
              <TableCell width="120" align="center">操作</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p.id}>
                <TableCell>{p.id}</TableCell>
                <TableCell>
                  <Box
                    component="img"
                    src={p.imageUrl}
                    sx={{ width: 50, height: 50, objectFit: "cover", borderRadius: 1 }}
                  />
                </TableCell>
                <TableCell>{p.name}</TableCell>
                <TableCell>
                  <Chip label={p.category} size="small" />
                </TableCell>
                <TableCell align="right">{p.price}</TableCell>
                <TableCell align="right" sx={{ color: p.stock < 5 ? "red" : "inherit" }}>
                  {p.stock}
                </TableCell>
                <TableCell align="center">
                  <IconButton color="primary" onClick={() => navigate(`/admin/product/edit/${p.id}`)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton color="error" onClick={() => handleDelete(p.id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}