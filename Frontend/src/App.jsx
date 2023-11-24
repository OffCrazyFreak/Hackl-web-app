import { Box, CircularProgress } from "@material-ui/core";

import { useEffect, useState } from "react";
import { Route, Routes, useNavigate, useLocation } from "react-router-dom";

import Map from "./components/screens/Map";
import Venues from "./components/screens/Venues";
import Venue from "./components/screens/Venue";
import Users from "./components/screens/Users";
// import User from "./components/screens/User";
import NotFound from "./components/screens/NotFound";

import UserForm from "./components/forms/UserForm";
import LoginForm from "./components/forms/LoginForm";

import Header from "./components/Header";

const admins = [{ username: "IamAadmin", password: "TotesC00lpa5#" }];

export default function App() {
  const [openLoginFormModal, setOpenLoginFormModal] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [loadingUser, setLoadingUser] = useState(false);

  async function login(userData) {
    const request = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    // TODO: (temp) remove after backend is connected
    if (
      admins.some(
        (admin) =>
          admin.username === userData.username &&
          admin.password === userData.password
      )
    ) {
      const venuLoginInfo = {
        userData: userData,
        lastLogin: new Date(),
        automaticLoginDaysDuration: 7,
      };
      localStorage.setItem("venuLoginInfo", JSON.stringify(venuLoginInfo));

      setUserIsLoggedIn(true);
      setOpenLoginFormModal(false);
    } else {
      setLoginErrorMsg("Invalid username or password.");
      console.error("Invalid username or password.");
    }

    try {
      const serverResponse = await fetch("/api/login", request);

      if (serverResponse.ok) {
        console.log("Login successful. Welcome " + userData.username + ".");

        const venuLoginInfo = {
          userData: userData,
          lastLogin: new Date(),
          automaticLoginDaysDuration: 7,
        };
        localStorage.setItem("venuLoginInfo", JSON.stringify(venuLoginInfo));

        setUserIsLoggedIn(true);
        setOpenLoginFormModal(false);
      } else if (serverResponse.status === 400) {
        setLoginErrorMsg("Invalid username or password.");
        console.error("Invalid username or password.");
      } else {
        console.error("An unknown error occurred whilst trying to login.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    if (!userIsLoggedIn) {
      const venuLoginInfo = JSON.parse(localStorage.getItem("venuLoginInfo"));

      if (
        venuLoginInfo !== null &&
        (new Date() - Date.parse(Date(venuLoginInfo.lastLogin))) /
          (1000 * 3600 * 24) <
          venuLoginInfo.automaticLoginDaysDuration
      ) {
        // if userData exists in local storage and user has logged in the last X days
        login(venuLoginInfo.userData);
      }
    }
  }, []);

  return (
    <>
      {loadingUser ? (
        <Box sx={{ display: "grid", placeItems: "center", height: "100%" }}>
          <CircularProgress size={100} />
        </Box>
      ) : (
        <Routes>
          <Route
            path="/"
            element={<Header setUserIsLoggedIn={setUserIsLoggedIn} />}
          >
            <Route index element={<Map />} />

            <Route path="venues">
              <Route index element={<Venues />} />

              <Route path=":venueId" element={<Venue />} />
            </Route>

            <Route path="users">
              <Route index element={<Users />} />

              {/* <Route path=":userId" element={<User />} /> */}
            </Route>

            <Route path="*" element={<NotFound />} />
          </Route>

          {/* <Route
            path="login"
            element={<Login loginUser={loginUser} loading={loadingUser} />}
          /> */}
          {/* <Route path="setup" element={<Setup setAppIsSetup={setAppIsSetup} />} /> */}
        </Routes>
      )}

      {/* <UserForm
        openModal={openUserFormModal}
        setOpenModal={setOpenUserFormModal}
        mode={userFormMode}
      />

      <LoginForm
        openModal={openLoginFormModal}
        setOpenModal={setOpenLoginFormModal}
        login={login}
        loginErrorMsg={loginErrorMsg}
      /> */}
    </>
  );
}
