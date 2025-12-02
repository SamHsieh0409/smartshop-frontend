import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import {
  Box,
  TextField,
  Button,
  Typography,
  Paper,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { useNotify } from "../../context/NotificationContext";

export default function AdminProductForm() {
  const { id } = useParams(); // 有 id 代表是編輯模式
  const navigate = useNavigate();
  const notify = useNotify();
  const isEditMode = !!id;

  const [formData, setFormData] = useState({
    name: "",
    price: "",
    stock: "",
    category: "",
    description: "",
    imageUrl: "",
  });
  
  const [categories, setCategories] = useState([]);

  const fetchCategories = async () => {
    try {
      // 使用與 ProductList.jsx 相同的 API
      const res = await axios.get("/products/categories"); 
      setCategories(res.data.data || []);
    } catch (err) {
      notify.show("無法載入分類列表", "error");
    }
  };
  // 如果是編輯模式，先抓資料
  useEffect(() => {
    fetchCategories();

    if (isEditMode) {
      axios.get(`/products/${id}`)
        .then((res) => {
          const p = res.data.data;
          setFormData({
            name: p.name,
            price: p.price,
            stock: p.stock,
            category: p.category,
            description: p.description,
            imageUrl: p.imageUrl,
          });
        })
        .catch(() => notify.show("載入資料失敗", "error"));
    }
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      if (isEditMode) {
        // 修改
        await axios.put(`/products/${id}`, formData, { withCredentials: true });
        notify.show("更新成功！", "success");
      } else {
        // 新增
        await axios.post("/products", formData, { withCredentials: true });
        notify.show("新增成功！", "success");
      }
      navigate("/admin/products");
    } catch (err) {
      notify.show("儲存失敗 (請確認是否為管理員)", "error");
    }
  };

  return (
    <Box sx={{ p: 4, maxWidth: 600, mx: "auto" }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h5" sx={{ mb: 3 }}>
          {isEditMode ? "編輯書籍" : "新增書籍"}
        </Typography>

        <Stack spacing={3}>
          <TextField label="書名" name="name" value={formData.name} onChange={handleChange} fullWidth />
          
          <Stack direction="row" spacing={2}>
            <TextField label="價格" name="price" type="number" value={formData.price} onChange={handleChange} fullWidth />
            <TextField label="庫存" name="stock" type="number" value={formData.stock} onChange={handleChange} fullWidth />
          </Stack>

          <FormControl fullWidth>
            <InputLabel>分類</InputLabel>
            <Select name="category" value={formData.category} label="分類" onChange={handleChange}>
              {categories.map((c) => (
                <MenuItem key={c} value={c}>{c}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <TextField label="圖片網址" name="imageUrl" value={formData.imageUrl} onChange={handleChange} fullWidth placeholder="https://..." />
          
          {/* 圖片預覽 */}
          {formData.imageUrl && (
            <Box sx={{ textAlign: "center" }}>
              <img src={formData.imageUrl} alt="預覽" style={{ maxHeight: 200, maxWidth: "100%" }} />
            </Box>
          )}

          <TextField label="書籍簡介" name="description" value={formData.description} onChange={handleChange} multiline rows={4} fullWidth />

          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={() => navigate("/admin/products")}>取消</Button>
            <Button variant="contained" onClick={handleSubmit}>儲存</Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}