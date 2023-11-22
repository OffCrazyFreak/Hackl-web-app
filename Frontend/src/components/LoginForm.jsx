import {
  Backdrop,
  Modal,
  Fade,
  Button,
  Typography,
  FormControl,
  Box,
} from "@material-ui/core";
import { useState, useEffect } from "react";

import TextInput from "./TextInput";

export default function LoginForm({
  openModal,
  setOpenModal,
  login,
  loginErrorMsg,
}) {
  // atributes states
  // const [errorMsg, setErrorMsg] = useState("");

  const [username, setUsername] = useState();
  const [password, setPassword] = useState();

  // validation states
  const [usernameIsValid, setUsernameIsValid] = useState(false);
  const [passwordIsValid, setPasswordIsValid] = useState(false);

  async function submit() {
    if (!usernameIsValid || !passwordIsValid) {
      return;
    }

    const userData = {
      username: username.trim(),
      password: password,
    };

    login(userData);
  }

  useEffect(() => {
    setUsername("");
    setPassword("");

    setUsernameIsValid(false);
    setPasswordIsValid(false);
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
              Login
            </Typography>

            <Box
              style={{
                overflowY: "auto",
              }}
            >
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

              <TextInput
                labelText={"Password"}
                inputType={"password"}
                isRequired
                helperText={{
                  error:
                    "Password must contain at least one uppercase letter, one lowercase letter, one number, one special character (!@#$%^&*), and be between 12 and 20 characters",
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
            </Box>

            <Typography>{loginErrorMsg}</Typography>

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
                Login
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}
