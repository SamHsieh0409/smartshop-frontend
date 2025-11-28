import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { NotificationProvider } from "./context/NotificationContext";
import Navbar from "./components/Navbar";
import ProductList from "./pages/ProductList";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ShoppingCart from "./pages/ShoppingCart";

function App() {
  return (
    <NotificationProvider>
      <AuthProvider>
        <Router>
          <Navbar />
          <div style={{ paddingTop: "70px" }}>
            <Routes>
              <Route path="/" element={<ProductList />} />
              <Route path="/products" element={<ProductList />} />
              <Route path="/cart" element={<ShoppingCart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </NotificationProvider>
  );
}

export default App;
