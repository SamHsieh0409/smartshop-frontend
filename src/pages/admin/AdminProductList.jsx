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
  CircularProgress, 
  Pagination, 
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import { useNotify } from "../../context/NotificationContext";
import { useAuth } from "../../context/AuthContext"; // 新增：檢查 Admin 身份

export default function AdminProductList() {
  const { user, loading: authLoading } = useAuth(); // 取得登入使用者資訊
  const [products, setProducts] = useState([]);
  
  // 1. 新增分頁相關的 State
  const [page, setPage] = useState(1);
  const [size] = useState(10); 
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // 預設載入中

  const navigate = useNavigate();
  const notify = useNotify();
  
  // 檢查是否為 Admin 的工具函式
  const isAdmin = user && user.role === "ADMIN";

  // 2. 更新 fetchProducts 函式，確保正確解析分頁資料
  const fetchProducts = async (currentPage = page) => {
    // 如果不是 Admin，則不應該執行此操作，直接跳出。
    if (!isAdmin) {
        setLoading(false);
        return;
    }
      
    try {
      setLoading(true);
      // 呼叫 /products/filter API，傳入分頁參數
      const res = await axios.get("/products/filter", {
        params: {
          page: currentPage - 1, 
          size,
          sortBy: "id", 
          direction: "desc", 
        },
      });
      
      // 修正：從分頁結構中讀取資料 (content 和 totalPages)
      setProducts(res.data.data?.content || []);
      setTotalPages(res.data.data?.totalPages || 1);

    } catch (err) {
      // 處理後端拋出的 RuntimeException (例如 Session 過期或權限不足)
      const errMsg = err.response?.data?.message || "無法取得商品列表 (請重新登入)";
      notify.show(errMsg, "error");
    } finally {
      setLoading(false);
    }
  };

  // 3. 使用 useEffect 監聽 page 變化和 user 載入完成
  useEffect(() => {
    if (authLoading) return; // 正在檢查登入狀態，等待

    if (!isAdmin) {
        // 如果確定不是 Admin，導向回首頁
        navigate("/"); 
        return;
    }
    
    fetchProducts(page); 
  }, [page, user, authLoading]); // 依賴 user/authLoading 確保登入狀態更新時能重新檢查

  // 刪除後要停留在同一頁，並重新載入
  const handleDelete = async (id) => {
    if (!window.confirm("確定要刪除這本書嗎？")) return;
    if (!isAdmin) {
        notify.show("您沒有權限執行此操作", "error");
        return;
    }

    try {
      // 刪除操作，後端會檢查權限
      await axios.delete(`/products/${id}`, { withCredentials: true });
      notify.show("刪除成功", "success");
      fetchProducts(page); // 重新抓取當前頁面資料
    } catch (err) {
      const errMsg = err.response?.data?.message || "刪除失敗 (請確認權限)";
      notify.show(errMsg, "error");
    }
  };
  
  // 4. 分頁變更處理函式
  const handlePageChange = (event, value) => {
    setPage(value);
  };

  // 渲染邏輯：如果 Auth 正在載入或確認不是 Admin
  if (authLoading || loading) {
      return (
        <Box sx={{ textAlign: "center", mt: 10 }}>
          <CircularProgress />
          <Typography sx={{ mt: 2 }} color="text.secondary">正在載入管理員介面...</Typography>
        </Box>
      );
  }
  
  // 如果載入完畢但不是 Admin，理論上會被 useEffect 導向，但這裡做最終防線
  if (!isAdmin) {
    return null; 
  }

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

        <>
          {products.length === 0 && page === 1 && (
            <Typography variant="h6" color="text.secondary" textAlign="center" sx={{ mt: 5 }}>
              目前沒有商品紀錄
            </Typography>
          )}
          {products.length > 0 && (
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
          )}

          {/* 分頁元件 */}
          {totalPages > 1 && (
            <Box sx={{ mt: 3, display: "flex", justifyContent: "center" }}>
              <Pagination
                count={totalPages}
                page={page}
                onChange={handlePageChange}
                color="primary"
                size="large"
                showFirstButton 
                showLastButton
              />
            </Box>
          )}
        </>
    </Box>
  );
}