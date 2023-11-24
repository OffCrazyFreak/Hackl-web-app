import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  Typography,
  FormControl,
  Box,
  FormGroup,
} from "@material-ui/core";

import { useState, useEffect } from "react";

import { Map, GoogleApiWrapper } from "google-maps-react";

import CustomTextField from "./partial/CustomTextField";

function VenueForm({ google, venue, openModal, setOpenModal, fetchVenues }) {
  const [formData, setFormData] = useState({
    entity: {
      name: null,
      address: null,
      contactName: null,
      contactEmail: null,
      contactTel: null,
      foundAddress: null,
      webUrl: null,
      description: null,
    },
    validation: {
      // optional and predefined fields are valid by default
      nameIsValid: false,
      addressIsValid: false,
      contactNameIsValid: false,
      contactEmailIsValid: false,
      contactTelIsValid: false,
      webUrlIsValid: true,
      descriptionIsValid: true,
    },
  });

  async function submit() {
    const formIsValid = Object.values(formData.validation).every(Boolean); // all validation rules are fulfilled

    if (!formIsValid) {
      return;
    }

    // Object destructuring for venue data
    const {
      name,
      contactName,
      contactEmail,
      contactTel,
      address,
      webUrl,
      description,
    } = formData.entity;

    const venueData = {
      name: name?.trim(),
      contactName: contactName?.trim(),
      contactEmail: contactEmail?.trim(),
      contactTel: contactTel?.trim(),
      address: formData.entity.foundAddress,
      webUrl: webUrl?.trim(),
      description: description?.trim(),
    };

    const request = {
      method: venue ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(venueData),
    };

    try {
      const serverResponse = await fetch(
        "/api/venues" + (venue ? "/" + venue.id : ""),
        request
      );

      if (serverResponse.ok) {
        console.log(
          "Venue " + venueData.name + " " + (venue ? "updated" : "added") + "."
        );

        fetchVenues();
        setOpenModal(false);
      } else if (serverResponse.status === 400) {
        console.error("Invalid venue details.");
      } else if (serverResponse.status === 403) {
        console.error("Admin privileges are required for manipulating venues.");
      } else if (serverResponse.status === 404) {
        console.error("Venue with ID " + venue.id + " does not exist.");
      } else {
        console.error(
          "An unknown error occurred whilst trying to " +
            (venue ? "update" : "add") +
            " venue."
        );
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    if (google) {
      const geocoder = new google.maps.Geocoder();

      const currentAddress = formData.entity.address?.trim();

      if (currentAddress?.length < 2) {
        // Address is empty, reset foundAddress and addressIsValid states
        setFormData((prevFormData) => ({
          ...prevFormData,
          entity: {
            ...prevFormData.entity,
            foundAddress: "",
          },
          validation: {
            ...prevFormData.validation,
            addressIsValid: false,
          },
        }));
      } else {
        // Perform geocoding request for non-empty address
        geocoder.geocode({ address: currentAddress }, (results, status) => {
          if (status === "OK") {
            // Handle geocoding result
            const location = results[0].formatted_address;
            setFormData((prevFormData) => ({
              ...prevFormData,
              entity: {
                ...prevFormData.entity,
                foundAddress: location,
              },
              validation: {
                ...prevFormData.validation,
                addressIsValid: true,
              },
            }));
          } else {
            setFormData((prevFormData) => ({
              ...prevFormData,
              validation: {
                ...prevFormData.validation,
                addressIsValid: false,
              },
            }));
          }
        });
      }
    }
  }, [formData.entity.address, google]);

  useEffect(() => {
    // Object destructuring
    const {
      name,
      address,
      foundAddress,
      contactName,
      contactEmail,
      contactTel,
      webUrl,
      description,
    } = venue || {};

    setFormData({
      entity: {
        name: name,
        address: address,
        foundAddress: address,
        contactName: contactName,
        contactEmail: contactEmail,
        contactTel: contactTel,
        webUrl: webUrl,
        description: description,
      },
      validation: {
        nameIsValid: venue ? true : false,
        addressIsValid: venue ? true : false,
        contactNameIsValid: venue ? true : false,
        contactEmailIsValid: venue ? true : false,
        contactTelIsValid: venue ? true : false,
        webUrlIsValid: true,
        descriptionIsValid: true,
      },
    });
  }, [openModal, venue]);

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
              {!venue ? "Add venue" : "Update venue"}
            </Typography>

            <Box
              style={{
                overflowY: "auto",
              }}
            >
              <CustomTextField
                labelText={"Venue Name"}
                isRequired
                placeholderText={"ZICER"}
                helperText={{
                  error: "Venue name must be between 2 and 120 characters",
                  details: "",
                }}
                inputProps={{
                  name: "name", // This should match the key in your formData.entity
                  minLength: 2,
                  maxLength: 120,
                }}
                validationFunction={(input) => {
                  return input.trim().length >= 2 && input.trim().length <= 120;
                }}
                formData={formData}
                setFormData={setFormData}
              />

              {/* map needed for address geolocation */}
              <Box
                tabIndex="-1"
                style={{
                  display: "none",
                }}
              >
                <Map google={google} />
              </Box>
              <TextField
                label="Address"
                fullWidth
                variant="outlined"
                margin="dense"
                required
                placeholder="Street name and number, City, Country"
                value={formData.entity.address || ""}
                inputProps={{ minLength: 2, maxLength: 120 }}
                error={
                  !formData.validation.addressIsValid && formData.entity.address
                }
                helperText={
                  !formData.validation.addressIsValid && formData.entity.address
                    ? "Invalid address"
                    : formData.entity.foundAddress && (
                        <span style={{ fontSize: "1rem" }}>
                          {"Found address: " + formData.entity.foundAddress}
                        </span>
                      )
                }
                onChange={(e) => {
                  const { value } = e.target;
                  setFormData((prevFormData) => ({
                    ...prevFormData,
                    entity: {
                      ...prevFormData.entity,
                      address: value,
                    },
                    validation: {
                      ...prevFormData.validation,
                      addressIsValid: false, // Reset validation status when address changes
                    },
                  }));
                }}
              />

              {/* contact fields */}
              <FormGroup>
                <CustomTextField
                  labelText={"Contact Name"}
                  placeholderText={"Jane Doe"}
                  isRequired
                  helperText={{
                    error: "Contact name must be between 2 and 120 characters",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactName",
                    minLength: 2,
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    return input.length >= 2 && input.length <= 120;
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Contact Email"}
                  placeholderText={"jane.doe@example.com"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact email",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactEmail",
                    minLength: 2,
                    maxLength: 120,
                  }}
                  validationFunction={(input) => {
                    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;
                    return (
                      input.length >= 2 &&
                      input.length <= 120 &&
                      emailPattern.test(input)
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />

                <CustomTextField
                  labelText={"Contact Tel"}
                  placeholderText={"+1234567890"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact tel",
                    details: "",
                  }}
                  inputProps={{
                    name: "contactTel",
                    minLength: 2,
                    maxLength: 20,
                  }}
                  validationFunction={(input) => {
                    const phoneNumberPattern = /^\+\d{1,3}\s?\d{1,14}$/;
                    return (
                      input.length >= 2 &&
                      input.length <= 20 &&
                      phoneNumberPattern.test(input)
                    );
                  }}
                  formData={formData}
                  setFormData={setFormData}
                />
              </FormGroup>

              <CustomTextField
                labelText={"Webpage URL"}
                placeholderText={"https://hackl.zagreb.hr/"}
                helperText={{
                  error: "Invalid Webpage URL",
                  details: "",
                }}
                inputProps={{
                  name: "webUrl",
                  maxLength: 120,
                }}
                validationFunction={(input) => {
                  const urlPattern = new RegExp(
                    "^(https?:\\/\\/)?" + // validate protocol
                      "((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|" + // validate domain name
                      "((\\d{1,3}\\.){3}\\d{1,3}))" + // validate OR ip (v4) address
                      "(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*" + // validate port and path
                      "(\\?[;&a-z\\d%_.~+=-]*)?" + // validate query string
                      "(\\#[-a-z\\d_]*)?$",
                    "i"
                  ); // validate fragment locator

                  return (
                    input === "" ||
                    (input.length <= 120 && urlPattern.test(input))
                  );
                }}
                formData={formData}
                setFormData={setFormData}
              />

              <CustomTextField
                labelText={"Description"}
                textFieldProps={{
                  multiline: true,
                  minRows: 3,
                  maxRows: 8,
                }}
                helperText={{
                  error: "Description must be under 400 characters",
                  details: "",
                }}
                inputProps={{
                  name: "description", // This should match the key in your formData.entity
                  maxLength: 400,
                }}
                validationFunction={(input) => {
                  return input.length <= 400;
                }}
                formData={formData}
                setFormData={setFormData}
              />
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
                disabled={Object.values(formData.validation).some(
                  (value) => !value
                )}
              >
                {/* span needed because of bug */}
                <span>{!venue ? "Add venue" : "Update venue"}</span>
              </Button>
            </Box>
          </FormControl>
        </Fade>
      </Modal>
    </Backdrop>
  );
}

export default GoogleApiWrapper({
  apiKey: "AIzaSyAaCAGajZa5XI9XgOwsEM9sw2sxM0Oawkc",
})(VenueForm);
