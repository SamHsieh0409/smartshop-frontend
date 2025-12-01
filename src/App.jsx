import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShoppingCart from "./pages/ShoppingCart";
import Orders from "./pages/Orders";
import ProductDetail from "./pages/ProductDetail";
import AdminProductList from "./pages/admin/AdminProductList";
import AdminProductForm from "./pages/admin/AdminProductForm";
import ChatBot from "./components/ChatBot";
import ProtectedRoute from "./components/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <div style={{ paddingTop: "70px" }}>
            <Routes>
              {/* --- 公開區域 --- */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
                <Route path="/" element={<ProductList />} />
                <Route path="/products" element={<ProductList />} />

              {/* --- 限制區域 --- */}
              <Route element={<ProtectedRoute />}>
                <Route path="/product/:id" element={<ProductDetail />} />
                <Route path="/cart" element={<ShoppingCart />} />
                <Route path="/orders" element={<Orders />} />
                
                {/* 後台 */}
                <Route path="/admin/products" element={<AdminProductList />} />
                <Route path="/admin/product/new" element={<AdminProductForm />} />
                <Route path="/admin/product/edit/:id" element={<AdminProductForm />} />
              </Route>
            </Routes>
          </div>
          
          {/* 懸浮元件區 */}
          <ChatBot /> 
          <ScrollToTop /> 
          
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;