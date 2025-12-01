import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  Badge,
  IconButton,
  Menu,
  MenuItem,
  Container,
} from "@mui/material";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import PersonIcon from "@mui/icons-material/Person";
import StorefrontIcon from "@mui/icons-material/Storefront";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import LoginIcon from "@mui/icons-material/Login";
import { useState } from "react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleMenu = (event) => setAnchorEl(event.currentTarget);
  const handleClose = () => setAnchorEl(null);

  const handleLogout = () => {
    handleClose();
    logout();
    navigate("/login");
  };

  return (
    <AppBar position="fixed" sx={{ bgcolor: "#2c3e50", boxShadow: 3 }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* LOGO */}
          <StorefrontIcon sx={{ display: { xs: "none", md: "flex" }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={Link}
            to="/"
            sx={{
              mr: 2,
              display: { xs: "none", md: "flex" },
              fontFamily: "monospace",
              fontWeight: 700,
              letterSpacing: ".1rem",
              color: "inherit",
              textDecoration: "none",
              flexGrow: 1,
            }}
          >
            SMART SHOP
          </Typography>

          {/* 右側選單 */}
          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button color="inherit" component={Link} to="/products">
              所有商品
            </Button>

            {user ? (
              <>
                <IconButton color="inherit" component={Link} to="/cart">
                  <Badge badgeContent={user.cartItemCount || 0} color="error">
                    <ShoppingCartIcon />
                  </Badge>
                </IconButton>

                <Button
                  onClick={handleMenu}
                  color="inherit"
                  startIcon={<PersonIcon />}
                  sx={{ textTransform: "none" }}
                >
                  {user.username}
                </Button>

                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleClose}
                  sx={{ mt: 1 }}
                >
                  <MenuItem onClick={() => { handleClose(); navigate("/orders"); }}>
                    我的訂單
                  </MenuItem>
                  {user.role === "ADMIN" && (
                    <MenuItem onClick={() => { handleClose(); navigate("/admin/products"); }}>
                      <SettingsIcon fontSize="small" sx={{ mr: 1 }} />
                      後台管理
                    </MenuItem>
                  )}
                  <MenuItem onClick={handleLogout}>
                    <LogoutIcon fontSize="small" sx={{ mr: 1 }} />
                    登出
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button 
                variant="outlined" 
                color="inherit" 
                component={Link} 
                to="/login"
                startIcon={<LoginIcon />}
              >
                登入 / 註冊
              </Button>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}