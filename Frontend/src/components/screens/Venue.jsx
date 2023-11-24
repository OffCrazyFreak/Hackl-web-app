import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Container,
  Button,
  Link,
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Tooltip,
  CircularProgress,
} from "@material-ui/core";
import {
  KeyboardArrowLeft as KeyboardArrowLeftIcon,
  ExpandMore as ExpandMoreIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  Work as WorkIcon,
  Description as DescriptionIcon,
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import VenueForm from "../forms/VenueForm";
// import ContactForm from "../forms/ContactForm";

import SearchBar from "./partial/SearchBar";

export default function Venue() {
  const { venueId } = useParams();
  const navigate = useNavigate();

  const [openVenueFormModal, setOpenVenueFormModal] = useState(false);
  const [venue, setVenue] = useState([]);
  const [openContactFormModal, setOpenContactFormModal] = useState(false);
  const [contact, setContact] = useState();

  const [filteredData, setFilteredData] = useState([]);

  async function fetchVenue() {
    try {
      const serverResponse = await fetch("/api/venues/" + venueId, {
        method: "GET",
      });
      if (serverResponse.ok) {
        const json = await serverResponse.json();

        setVenue(json);
        // setFilteredData(); // TODO
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  function handleEditVenue(venue) {
    setVenue(venue);
    setOpenVenueFormModal(true);
  }

  async function handleDeleteVenue(venue) {
    try {
      const serverResponse = await fetch("/api/venues/" + venue.id, {
        method: "DELETE",
      });

      if (serverResponse.ok) {
        console.log("Venue " + venue.name + " deleted.");
        navigate("/venues");
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  function handleEditContact(contact) {
    setContact(contact);
    setOpenContactFormModal(true);
  }

  async function handleDeleteContact(contact) {
    try {
      const serverResponse = await fetch("/api/contacts/" + contact.id, {
        method: "DELETE",
      });

      if (serverResponse.ok) {
        console.log("Contact " + contact.name + " deleted.");
        navigate("/contacts");
      } else {
        console.error("A server error occurred whilst deleting data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    fetchVenue();
  }, []);

  return (
    <>
      <VenueForm
        openModal={openVenueFormModal}
        setOpenModal={setOpenVenueFormModal}
        fetchUpdatedData={fetchVenue}
        object={venue}
      />

      {/* <ContactForm
        openModal={openContactFormModal}
        setOpenModal={setOpenVenueFormModal}
        fetchUpdatedData={fetchVenue}
        object={contact}
      /> */}

      <Box
        style={{
          display: "flex",

          maxHeight: "calc(100% - 64px)",
        }}
      >
        {/* details */}
        <Box
          style={{
            flexBasis: "30%",

            overflowY: "auto",
          }}
        >
          <Box
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 4,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              startIcon={<KeyboardArrowLeftIcon />}
              onClick={() => {
                navigate("/venues");
              }}
              style={{
                borderTopLeftRadius: 0,
                borderBottomLeftRadius: 0,

                marginBlock: 16,
              }}
            >
              Venues
            </Button>

            <Box
              style={{
                marginRight: 16,

                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 4,
              }}
            >
              <Tooltip title="Edit" key="Edit">
                <IconButton
                  size="small"
                  onClick={handleEditVenue}
                  style={{
                    color: "white",
                    backgroundColor: "#3f51b5",

                    borderRadius: 8,
                  }}
                >
                  <EditIcon />
                </IconButton>
              </Tooltip>
              <Tooltip title="Delete" key="Delete">
                <IconButton
                  size="small"
                  onClick={handleDeleteVenue}
                  style={{
                    color: "white",
                    backgroundColor: "#3f51b5",

                    borderRadius: 8,
                  }}
                >
                  <DeleteIcon />
                </IconButton>
              </Tooltip>
            </Box>
          </Box>

          <Box
            style={{
              marginBottom: 16,
              marginInline: 16,
            }}
          >
            <Typography
              variant="h4"
              gutterBottom
              style={{
                fontWeight: 500,
                textAlign: "center",
                textTransform: "uppercase",
              }}
            >
              {venue.name}
            </Typography>

            <Accordion defaultExpanded style={{ marginBlock: 16 }}>
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  style={{
                    textTransform: "uppercase",
                  }}
                >
                  VENUE INFO
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  <ListItem disablePadding>
                    <ListItemText primary={"Address: " + venue.address} />
                  </ListItem>

                  {venue.webURL && (
                    <ListItem disablePadding>
                      <ListItemText
                        primary={
                          <Typography variant="body2">
                            Web:{" "}
                            <Link
                              href={venue.webURL}
                              underline="hover"
                              target="_blank"
                              rel="noopener"
                            >
                              {venue.webURL}
                            </Link>
                          </Typography>
                        }
                      />
                    </ListItem>
                  )}

                  {venue.description && (
                    <ListItem disablePadding>
                      <ListItemText
                        primary={"Description: " + venue.description}
                        style={{ maxHeight: 60, overflowY: "auto" }}
                      />
                    </ListItem>
                  )}
                </List>
              </AccordionDetails>
            </Accordion>

            <Accordion
              style={{
                marginBlock: 16,
              }}
            >
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography
                  style={{
                    textTransform: "uppercase",
                  }}
                >
                  CONTACTS
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                {venue.contacts?.map((contact) => (
                  <Box key={contact.id} style={{ marginBlock: 16 }}>
                    <Box
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography>{contact.name}</Typography>
                      <Box>
                        <IconButton
                          aria-label="edit contact"
                          onClick={(e) => handleEditContact(e, contact.id)}
                          style={{
                            width: 160,
                            height: 160,

                            margin: 0.125,

                            color: "white",
                            backgroundColor: "#3f51b5",
                            borderRadius: 8,
                          }}
                        >
                          <EditIcon
                            style={{
                              width: 85,
                              height: 85,
                            }}
                          />
                        </IconButton>

                        <IconButton
                          aria-label="delete contact"
                          onClick={(e) => handleDeleteContact(e, contact.id)}
                          style={{
                            width: 160,
                            height: 160,

                            margin: 0.125,

                            color: "white",
                            backgroundColor: "#3f51b5",
                            borderRadius: 8,
                          }}
                        >
                          <DeleteIcon
                            style={{
                              width: 85,
                              height: 85,
                            }}
                          />
                        </IconButton>
                      </Box>
                    </Box>

                    <List dense>
                      <ListItem disablePadding>
                        <ListItemIcon style={{ minWidth: 165 }}>
                          <EmailIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.email}
                          style={{
                            overflow: "hidden",
                          }}
                        />
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemIcon style={{ minWidth: 165 }}>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.tel}
                          style={{ overflow: "hidden" }}
                        />
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemIcon style={{ minWidth: 165 }}>
                          <WorkIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.jobTitle}
                          style={{ overflow: "hidden" }}
                        />
                      </ListItem>

                      <ListItem disablePadding>
                        <ListItemIcon style={{ minWidth: 165 }}>
                          <DescriptionIcon />
                        </ListItemIcon>
                        <ListItemText
                          primary={contact.description}
                          style={{ overflow: "hidden" }}
                        />
                      </ListItem>
                    </List>
                  </Box>
                ))}

                <Box style={{ display: "grid", placeItems: "center" }}>
                  <Button
                    variant="contained"
                    startIcon={<AddCircleIcon />}
                    onClick={() => setOpenContactFormModal(true)}
                  >
                    Add contact
                  </Button>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Box>
        </Box>

        {/* reservations */}
        <Box
          style={{
            flex: 8,

            overflowY: "auto",
          }}
        >
          <Container
            maxWidth="false"
            style={{
              paddingBlock: 16,

              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 8,
            }}
          >
            <SearchBar
              type="reservations"
              data={[]}
              setSearchResults={setFilteredData}
            />
          </Container>

          <Container maxWidth="false">
            {/* TODO: schedule with reservations */}
          </Container>
        </Box>
      </Box>
    </>
  );
}
