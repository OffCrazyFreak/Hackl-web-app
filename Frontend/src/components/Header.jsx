import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Button,
  Tooltip,
  Typography,
} from "@material-ui/core";

import {
  Menu as MenuIcon,
  ExitToApp as ExitToAppIcon,
  Settings as SettingsIcon,
  ExpandMore as ExpandMoreIcon,
} from "@material-ui/icons";

import { Link, Outlet, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";

import "./Header.css";

export default function Header({ setUserIsLoggedIn }) {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);

  function logoutUser() {
    localStorage.removeItem("loginInfo");

    setUserIsLoggedIn(false);
  }

  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  return (
    <>
      <AppBar position="static" sx={{ zIndex: "1000" }}>
        <Container maxWidth="false">
          <Toolbar disableGutters>
            <Box sx={{ flexGrow: 1, display: { xs: "flex", sm: "none" } }}>
              <Tooltip title="Open app menu">
                <IconButton
                  size="medium"
                  onClick={handleOpenNavMenu}
                  color="inherit"
                >
                  <MenuIcon />
                </IconButton>
              </Tooltip>

              <Menu
                className="mobile-nav-menu"
                anchorEl={anchorElNav}
                anchorOrigin={{
                  vertical: "bottom",
                  horizontal: "left",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "left",
                }}
                open={Boolean(anchorElNav)}
                onClose={handleCloseNavMenu}
                style={{ marginTop: "40px" }}
              >
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/">Ven-U Map</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/venues">Venues</Link>
                </MenuItem>
                <MenuItem onClick={handleCloseNavMenu}>
                  <Link to="/users">Users</Link>
                </MenuItem>
              </Menu>
            </Box>

            <Box
              className="desktop-nav"
              sx={{
                flexGrow: 1,
                display: { xs: "none", sm: "flex" },
                gap: "min(2%, 1rem)",
              }}
            >
              <Link to="/" underline="hover">
                Ven-U Map
              </Link>
              <Link to="/venues" underline="hover">
                Venues
              </Link>
              <Link to="/users" underline="hover">
                Users
              </Link>
            </Box>

            <Box sx={{ flexGrow: 0 }}>
              <Box onClick={handleOpenUserMenu}>
                <Tooltip
                  title="Open account menu"
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  <span>
                    <Typography variant="body1" style={{ fontWeight: "bold" }}>
                      {!user ? "Unknown user" : user.username}
                    </Typography>

                    <ExpandMoreIcon sx={{ cursor: "pointer" }} />
                  </span>
                </Tooltip>
              </Box>

              <Menu
                style={{ marginTop: "40px" }}
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                keepMounted
                transformOrigin={{
                  vertical: "top",
                  horizontal: "right",
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
              >
                <MenuItem onClick={(handleCloseUserMenu, logoutUser)}>
                  <Box
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      gap: 8,

                      color: "#333",
                    }}
                  >
                    <ExitToAppIcon />

                    <Typography style={{ fontWeight: "bold" }}>
                      LOGOUT
                    </Typography>
                  </Box>
                </MenuItem>
              </Menu>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      <Outlet />
    </>
  );
}
