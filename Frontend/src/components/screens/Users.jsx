import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  useMediaQuery,
} from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import UserForm from "../forms/UserForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  {
    key: "username",
    label: "Username",
  },
  {
    key: "authority",
    label: "Authority",
  },
];

export default function Venues() {
  const navigate = useNavigate();

  const [openUserFormModal, setOpenUserFormModal] = useState(false);
  const [user, setUser] = useState();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  const mqSub320 = useMediaQuery("(max-width: 320px)");

  async function populateTable() {
    setLoading(true);

    // const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/users", {
        method: "GET",
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setData(json);
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }

    setLoading(false);
  }

  function handleView(user) {
    navigate(`/users/${user.id}`);
  }

  function handleEdit(user) {
    setUser(user);
    setOpenUserFormModal(true);
  }

  async function handleDelete(user) {
    try {
      const serverResponse = await fetch("/api/users/" + user.id, {
        method: "DELETE",
      });

      if (serverResponse.ok) {
        console.log("User " + user.name + " deleted.");
        populateTable();
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    populateTable();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((user) => {
        // TODO: filter by datetime and myb price
        return true;
      })
    );
  }, [data]);

  return (
    <>
      <UserForm
        user={user}
        openModal={openUserFormModal}
        setOpenModal={setOpenUserFormModal}
        fetchUsers={populateTable}
      />

      <Container
        maxWidth="false"
        style={{
          paddingBlock: 16,

          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexDirection: mqSub320 ? "column" : "row",
          gap: 8,
        }}
      >
        <SearchBar
          type="users"
          data={data}
          setSearchResults={setFilteredData}
        />

        <Button
          variant="contained"
          color="primary"
          startIcon={<AddCircleIcon />}
          onClick={() => {
            setUser();
            setOpenUserFormModal(true);
          }}
          style={{ width: mqSub320 ? "100%" : "auto" }}
        >
          Add user
        </Button>
      </Container>

      <Container maxWidth="false">
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress size={100} />
          </Box>
        ) : data?.length <= 0 ? (
          <Typography variant="h4" align="center">
            {"No users :("}
          </Typography>
        ) : (
          <TableComponent
            tableColumns={tableColumns}
            filteredData={filteredData}
            setFilteredData={setFilteredData}
            handleView={handleView}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        )}
      </Container>
    </>
  );
}
