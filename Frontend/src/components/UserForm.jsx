import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
  Select,
  MenuItem,
} from "@material-ui/core";
import { useState, useEffect } from "react";

import TextInput from "./TextInput";

export default function UserForm({ openModal, setOpenModal, mode }) {
  const [users, setUsers] = useState([
    { id: 1, username: "john.doe", password: "P@ssw0rd" },
    { id: 2, username: "jane.smith", password: "SecurePassword123" },
    { id: 3, username: "mike123", password: "MySecretPass" },
    { id: 4, username: "emma", password: "Password!2022" },
    { id: 5, username: "alexander", password: "StrongP@ss" },
  ]);

  // atributes states
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // validation states
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  async function fetchUsers() {
    try {
      const serverResponse = await fetch("/api/users", {
        method: "GET",
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        console.log(json);
        setUsers(json);
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  async function submit() {
    if (!usernameIsValid || !passwordIsValid) {
      return;
    }

    // TODO: const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;
    const userData = {
      username: username.trim(),
      password: password,
    };

    const request = {
      method: mode === "add" ? "POST" : mode === "edit" ? "PUT" : "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    };

    // TODO: (temp) remove after backend is connected
    if (mode === "add") {
      setUsers((prevUsers) => [...prevUsers, userData]);
    } else if (mode === "edit") {
      setUsers(
        users.map((user) =>
          user.username === username ? { ...user, password: password } : user
        )
      );
    } else if (mode === "delete") {
      setUsers(users.filter((user) => user.username !== username));

      setUsername(users[0].username);
    }
    setOpenModal(false);

    // try {
    //   const serverResponse = await fetch(
    //     `/api/users${mode === "edit" || mode === "delete" ? "/" + user.id : ""}`,
    //     request
    //   );

    //   if (serverResponse.ok) {
    //     console.log(
    //       "Organization " +
    //         organization.name +
    //         " " +
    //         (organization ? "updated" : "added") +
    //         "."
    //     );

    //     setOpenModal(false);
    //   } else if (serverResponse.status === 400) {
    //     console.error("Invalid company details.");
    //   } else if (serverResponse.status === 403) {
    //     console.error(
    //       "Admin privileges are required for manipulating organizations."
    //     );
    //   } else if (serverResponse.status === 404) {
    //     console.error(
    //       "Organization with id " + organization.id + " does not exist."
    //     );
    //   } else {
    //     console.error(
    //       "An unknown error occurred whilst trying to " +
    //         (organization ? "update" : "add") +
    //         " organization."
    //     );
    //   }
    // } catch (error) {
    //   console.error("An error occurred whilst trying to connect to server.");
    // }
  }

  useEffect(() => {
    if (mode === "add") {
      setUsername("");
      setPassword("");

      setUsernameIsValid(false);
      setPasswordIsValid(false);
    } else if (mode === "edit" || mode === "delete") {
      // fetchUsers()

      setUsername(users[0].username);
      setUsernameIsValid(true);

      if (mode === "edit") {
        setPasswordIsValid(false);
      } else if (mode === "delete") {
        setPasswordIsValid(true);
      }
    }
  }, [openModal]);

  return (
    <Backdrop open={openModal}>
      <Modal
        open={openModal}
        closeAfterTransition
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            // submit on Enter key
            submit();
          } else if (e.key === "Escape") {
            // close on Escape key
            setOpenModal(false);
          }
        }}
        onClose={() => {
          setOpenModal(false);
        }}
      >
        <Fade in={openModal}>
          <FormControl
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",

              maxWidth: "95%",
              width: "30rem",

              maxHeight: "95%",

              borderRadius: "1.5rem",
              padding: "1rem",

              backgroundColor: "whitesmoke",
              boxShadow: "#666 2px 2px 8px",
            }}
          >
            <Typography
              variant="h5"
              gutterBottom
              style={{ textTransform: "uppercase", fontWeight: "bold" }}
            >
              {mode === "add"
                ? "Add user"
                : mode === "edit"
                ? "Edit user"
                : "Delete user"}
            </Typography>

            <Box
              style={{
                overflowY: "auto",
              }}
            >
              {mode === "add" ? (
                <TextInput
                  labelText={"Username"}
                  isRequired
                  helperText={{
                    error: "Username must be between 6 and 20 characters",
                    details: "",
                  }}
                  inputProps={{ minLength: 6, maxLength: 20 }}
                  validationFunction={(input) => {
                    return input.length >= 6 && input.length <= 20;
                  }}
                  value={username}
                  setValue={setUsername}
                  valueIsValid={usernameIsValid}
                  setValueIsValid={setUsernameIsValid}
                ></TextInput>
              ) : (
                <FormControl variant="outlined" size="small" fullWidth>
                  <Select
                    value={username}
                    onChange={(e) => {
                      const selectedUserFromMenu = users.find(
                        (user) => user.username === e.target.value
                      );
                      setUsername(selectedUserFromMenu.username);
                    }}
                  >
                    {users.map((user) => (
                      <MenuItem key={user.id} value={user.username}>
                        {user.username}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}

              {mode !== "delete" && (
                <TextInput
                  labelText={"Password"}
                  inputType={"password"}
                  isRequired
                  helperText={{
                    error:
                      "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character (!@#$%^&*()-_+=[]{}|/<>?~:;\"',.), and be between 12 and 20 characters",
                    details: "",
                  }}
                  inputProps={{ minLength: 12, maxLength: 20 }}
                  validationFunction={(input) => {
                    const passwordPattern =
                      /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{12,20}$/;

                    return (
                      input === "" ||
                      (input.length >= 12 &&
                        input.length <= 20 &&
                        passwordPattern.test(input))
                    );
                  }}
                  value={password}
                  setValue={setPassword}
                  valueIsValid={passwordIsValid}
                  setValueIsValid={setPasswordIsValid}
                ></TextInput>
              )}
            </Box>

            <Box
              style={{
                marginBlock: "3%",

                display: "flex",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <Button
                variant="outlined"
                color="primary"
                onClick={() => {
                  setOpenModal(false);
                }}
              >
                Cancel
              </Button>

              <Button
                variant="contained"
                color="primary"
                onClick={submit}
                disabled={!usernameIsValid || !passwordIsValid}
              >
                {mode === "add"
                  ? "Add user"
                  : mode === "edit"
                  ? "Edit user"
                  : "Delete user"}
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
