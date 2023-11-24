import {
  Container,
  Box,
  Button,
  Typography,
  CircularProgress,
  useMediaQuery,
  ButtonGroup,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
} from "@material-ui/icons";

import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";

import VenueForm from "../forms/VenueForm";

import SearchBar from "./partial/SearchBar";
import TableComponent from "./partial/TableComponent";

const tableColumns = [
  {
    key: "name",
    label: "Venue name",
  },
  {
    key: "webUrl",
    label: "Webpage URL",
    mdHide: true,
  },
  {
    key: "description",
    label: "Description",
    mdHide: true,
    showTooltip: true,
  },
];

export default function Venues() {
  const navigate = useNavigate();

  const [openVenueFormModal, setOpenVenueFormModal] = useState(false);
  const [venue, setVenue] = useState();

  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);

  const [loading, setLoading] = useState(true);

  const mqSub320 = useMediaQuery("(max-width: 320px)");
  const mqSub600 = useMediaQuery("(max-width: 600px)");

  async function populateTable() {
    setLoading(true);

    // const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;

    try {
      const serverResponse = await fetch("/api/venues", {
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

  function handleView(venue) {
    navigate(`/venues/${venue.id}`);
  }

  function handleEdit(venue) {
    setVenue(venue);
    setOpenVenueFormModal(true);
  }

  async function handleDelete(venue) {
    try {
      const serverResponse = await fetch("/api/venues/" + venue.id, {
        method: "DELETE",
      });

      if (serverResponse.ok) {
        console.log("Venue " + venue.name + " deleted.");
        populateTable();
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  function handleVenuesFileUpload(file) {
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const venuesData = JSON.parse(e.target.result);
        // console.log("Venues imported successfully:", venuesData);

        try {
          const serverResponse = await fetch("/api/venues/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(venuesData),
          });

          if (serverResponse.ok) {
            const json = await serverResponse.json();
            console.log("Venues imported:", json);

            populateTable();
          } else if (serverResponse.status === 400) {
            console.error("Invalid venues details.");
          } else if (serverResponse.status === 403) {
            console.error(
              "Admin privileges are required for manipulating venues."
            );
          } else {
            console.error(
              "An unknown error occurred whilst trying to add venues."
            );
          }
        } catch (error) {
          console.error(
            "An error occurred whilst trying to connect to server."
          );
        }
      } catch (error) {
        console.error("Error parsing JSON file: ", error);
      }
    };

    fileReader.readAsText(file);
  }

  useEffect(() => {
    populateTable();
  }, []);

  useEffect(() => {
    setFilteredData(
      data.filter((venue) => {
        // TODO: filter by datetime and myb price
        return true;
      })
    );
  }, [data]);

  return (
    <>
      <VenueForm
        venue={venue}
        openModal={openVenueFormModal}
        setOpenModal={setOpenVenueFormModal}
        fetchVenues={populateTable}
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
          type="venues"
          data={data}
          setSearchResults={setFilteredData}
        />

        <ButtonGroup
          variant="contained"
          orientation={mqSub320 ? "vertical" : "horizontal"}
          style={{ width: mqSub320 ? "100%" : "auto" }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddCircleIcon />}
            onClick={() => {
              setVenue();
              setOpenVenueFormModal(true);
            }}
          >
            Add venue
          </Button>

          {!mqSub600 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudUploadIcon />}
              onClick={() => {
                const fileInput = document.createElement("input");
                fileInput.type = "file";
                fileInput.accept = ".json";
                fileInput.onchange = (e) => {
                  const file = e.target.files[0];
                  handleVenuesFileUpload(file);
                };

                fileInput.click();
              }}
            >
              Import venues
            </Button>
          )}

          {!mqSub600 && (
            <Button
              variant="contained"
              color="primary"
              startIcon={<CloudDownloadIcon />}
              onClick={async () => {
                await populateTable();

                const venuesData = data.map(({ id, ...venue }) => venue); // remove ID
                const venuesJSON = JSON.stringify(venuesData);

                // Generate and download JSON file
                const jsonBlob = new Blob([venuesJSON], {
                  type: "application/json",
                });
                const jsonUrl = URL.createObjectURL(jsonBlob);
                const jsonLink = document.createElement("a");
                jsonLink.href = jsonUrl;
                jsonLink.download = `venu-venues_export-${new Date()
                  .toISOString()
                  .slice(0, 10)}.json`;
                jsonLink.click();
              }}
            >
              Export venues
            </Button>
          )}
        </ButtonGroup>
      </Container>

      <Container maxWidth="false">
        {loading ? (
          <Box sx={{ display: "grid", placeItems: "center" }}>
            <CircularProgress size={100} />
          </Box>
        ) : data?.length <= 0 ? (
          <Typography variant="h4" align="center">
            {"No venues :("}
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
