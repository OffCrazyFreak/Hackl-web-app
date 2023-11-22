import {
  Backdrop,
  Modal,
  Fade,
  Button,
  TextField,
  MenuItem,
  Typography,
  FormControl,
  Box,
  Checkbox,
  FormGroup,
  FormHelperText,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
  FormControlLabel,
  Radio,
} from "@material-ui/core";

import { useState, useEffect } from "react";

import { Map, GoogleApiWrapper } from "google-maps-react";

import TextInput from "./TextInput";

const workDomains = ["Science", "Technology", "Ecology", "Art", "Crafts"];
const legalStatuses = ["For-profit", "Non-profit", "Individual"];

function OrganizationForm({
  google,
  organization,
  openModal,
  setOpenModal,
  fetchOrganizations,
}) {
  // atributes states
  const [name, setName] = useState();
  const [description, setDescription] = useState();

  const [contactName, setContactName] = useState();
  const [contactEmail, setContactEmail] = useState();
  const [contactTel, setContactTel] = useState();

  const [references, setReferences] = useState();
  const [lookingFor, setLookingFor] = useState();

  const [address, setAddress] = useState();
  const [foundAddress, setFoundAddress] = useState();

  const [webUrl, setWebUrl] = useState();
  const [facebookUrl, setFacebookUrl] = useState();
  const [instagramUrl, setInstagramUrl] = useState();
  const [linkedInUrl, setLinkedInUrl] = useState();

  const [legalStatus, setLegalStatus] = useState();

  const [workDomainIncludesScience, setWorkDomainIncludesScience] = useState();
  const [workDomainIncludesTechnology, setWorkDomainIncludesTechnology] =
    useState();
  const [workDomainIncludesEcology, setWorkDomainIncludesEcology] = useState();
  const [workDomainIncludesArt, setWorkDomainIncludesArt] = useState();
  const [workDomainIncludesCrafts, setWorkDomainIncludesCrafts] = useState();

  // validation states
  const [nameIsValid, setNameIsValid] = useState(false);
  const [descriptionIsValid, setDescriptionIsValid] = useState(false);

  const [contactNameIsValid, setContactNameIsValid] = useState(false);
  const [contactEmailIsValid, setContactEmailIsValid] = useState(false);
  const [contactTelIsValid, setContactTelIsValid] = useState(false);

  const [referencesIsValid, setReferencesIsValid] = useState(true);
  const [lookingForIsValid, setLookingForIsValid] = useState(true);

  const [addressIsValid, setAddressIsValid] = useState(false);

  const [webUrlIsValid, setWebUrlIsValid] = useState(true);
  const [facebookUrlIsValid, setFacebookUrlIsValid] = useState(true);
  const [instagramUrlIsValid, setInstagramUrlIsValid] = useState(true);
  const [linkedInUrlIsValid, setLinkedInUrlIsValid] = useState(true);

  const [legalStatusIsValid, setLegalStatusIsValid] = useState(true);

  const [workDomainIsValid, setWorkDomainIsValid] = useState(true);

  async function submit() {
    if (
      !nameIsValid ||
      !descriptionIsValid ||
      !contactNameIsValid ||
      !contactEmailIsValid ||
      !contactTelIsValid ||
      !referencesIsValid ||
      !lookingForIsValid ||
      !addressIsValid ||
      !webUrlIsValid ||
      !facebookUrlIsValid ||
      !instagramUrlIsValid ||
      !linkedInUrlIsValid ||
      !legalStatusIsValid ||
      !workDomainIsValid
    ) {
      return;
    }

    // TODO: const JWToken = JSON.parse(localStorage.getItem("loginInfo")).JWT;
    const organizationData = {
      name: name.trim(),
      description: description.trim(),

      contactName: contactName.trim(),
      contactEmail: contactEmail.trim(),
      contactTel: contactTel.trim(),

      references: references?.trim(),
      lookingFor: lookingFor?.trim(),

      address: foundAddress,

      webUrl: webUrl?.trim(),
      facebookUrl: facebookUrl?.trim(),
      instagramUrl: instagramUrl?.trim(),
      linkedInUrl: linkedInUrl?.trim(),

      legalStatus: legalStatus,

      workDomainIncludesScience: workDomainIncludesScience,
      workDomainIncludesTechnology: workDomainIncludesTechnology,
      workDomainIncludesEcology: workDomainIncludesEcology,
      workDomainIncludesArt: workDomainIncludesArt,
      workDomainIncludesCrafts: workDomainIncludesCrafts,
    };

    const request = {
      method: organization ? "PUT" : "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(organizationData),
    };

    try {
      const serverResponse = await fetch(
        "/api/organizations" + (organization ? "/" + organization.id : ""),
        request
      );

      if (serverResponse.ok) {
        console.log(
          "Organization " +
            organizationData.name +
            " " +
            (organization ? "updated" : "added") +
            "."
        );

        fetchOrganizations();
        setOpenModal(false);
      } else if (serverResponse.status === 400) {
        console.error("Invalid organization details.");
      } else if (serverResponse.status === 403) {
        console.error(
          "Admin privileges are required for manipulating organizations."
        );
      } else if (serverResponse.status === 404) {
        console.error(
          "Organization with ID " + organization.id + " does not exist."
        );
      } else {
        console.error(
          "An unknown error occurred whilst trying to " +
            (organization ? "update" : "add") +
            " organization."
        );
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  useEffect(() => {
    if (google) {
      const geocoder = new google.maps.Geocoder();

      if (address === "") {
        // Address is empty, reset foundAddress and addressIsValid states
        setFoundAddress("");
        setAddressIsValid(false);
      } else {
        // Perform geocoding request for non-empty address
        geocoder.geocode({ address }, (results, status) => {
          if (status === "OK") {
            // Handle geocoding result
            const location = results[0].formatted_address;
            setFoundAddress(location);
            setAddressIsValid(true);
          } else {
            setAddressIsValid(false);
          }
        });
      }
    }
  }, [address, google]);

  useEffect(() => {
    // atributes states
    setName(organization?.name);
    setDescription(organization?.description);

    setContactName(organization?.contactName);
    setContactEmail(organization?.contactEmail);
    setContactTel(organization?.contactTel);

    setReferences(organization?.references);
    setLookingFor(organization?.lookingFor);

    setAddress(organization?.address ?? "");

    setWebUrl(organization?.webUrl);
    setFacebookUrl(organization?.facebookUrl);
    setInstagramUrl(organization?.instagramUrl);
    setLinkedInUrl(organization?.linkedInUrl);

    setLegalStatus(organization?.legalStatus || legalStatuses[0]);

    setWorkDomainIncludesScience(
      organization?.workDomainIncludesScience ?? true
    );
    setWorkDomainIncludesTechnology(
      organization?.workDomainIncludesTechnology ?? true
    );
    setWorkDomainIncludesEcology(
      organization?.workDomainIncludesEcology ?? true
    );
    setWorkDomainIncludesArt(organization?.workDomainIncludesArt ?? true);
    setWorkDomainIncludesCrafts(organization?.workDomainIncludesCrafts ?? true);

    // validation states
    setNameIsValid(organization ? true : false);
    setDescriptionIsValid(organization ? true : false);

    setContactNameIsValid(organization ? true : false);
    setContactEmailIsValid(organization ? true : false);
    setContactTelIsValid(organization ? true : false);

    setReferencesIsValid(true);
    setLookingForIsValid(true);

    setAddressIsValid(organization ? true : false);

    setWebUrlIsValid(true);
    setFacebookUrlIsValid(true);
    setInstagramUrlIsValid(true);
    setLinkedInUrlIsValid(true);

    setLegalStatusIsValid(true);

    setWorkDomainIsValid(true);
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
              width: "40rem",

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
              {!organization ? "Add organization" : "Update organization"}
            </Typography>

            <Box
              style={{
                overflowY: "auto",
              }}
            >
              <TextInput
                labelText={"Organization name"}
                placeholderText={"Vision <O>"}
                isRequired
                helperText={{
                  error:
                    "Organization name must be between 2 and 120 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 120 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 120;
                }}
                value={name}
                setValue={setName}
                valueIsValid={nameIsValid}
                setValueIsValid={setNameIsValid}
              ></TextInput>
              <TextInput
                labelText={"Description"}
                isRequired
                textFieldProps={{
                  multiline: true,
                  minRows: 3,
                  maxRows: 8,
                }}
                helperText={{
                  error: "Description must be between 2 and 2000 characters",
                  details: "",
                }}
                inputProps={{ minLength: 2, maxLength: 2000 }}
                validationFunction={(input) => {
                  return input.length >= 2 && input.length <= 2000;
                }}
                value={description}
                setValue={setDescription}
                valueIsValid={descriptionIsValid}
                setValueIsValid={setDescriptionIsValid}
              ></TextInput>

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
                value={address || ""}
                inputProps={{ minLength: 2, maxLength: 120 }}
                error={!addressIsValid && address}
                helperText={
                  !addressIsValid && address
                    ? "Invalid address"
                    : foundAddress && (
                        <span style={{ fontSize: "1rem" }}>
                          {"Found address: " + foundAddress}
                        </span>
                      )
                }
                onChange={(e) => {
                  setAddressIsValid(false); // Reset validation status when address changes
                  setAddress(e.target.value);
                }}
              />

              <TextField
                label="Legal status"
                fullWidth
                select
                variant="outlined"
                margin="dense"
                helperText={!legalStatusIsValid && "Invalid legal status"}
                value={legalStatus}
                error={!legalStatusIsValid}
                onChange={(e) => {
                  const input = e.target.value;

                  setLegalStatusIsValid(legalStatuses.includes(input));

                  setLegalStatus(input);
                }}
                SelectProps={{
                  MenuProps: {
                    getContentAnchorEl: null,
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left", // required
                    },
                  },
                  renderValue: (selected) => selected,
                }}
              >
                {legalStatuses.map((option) => (
                  <MenuItem
                    key={option}
                    value={option}
                    style={{
                      paddingBlock: "0",
                    }}
                  >
                    <FormControlLabel
                      value={option}
                      control={
                        <Radio
                          color="primary"
                          checked={legalStatus === option}
                        />
                      }
                      label={option}
                      labelPlacement="end"
                    />
                  </MenuItem>
                ))}
              </TextField>

              <FormControl fullWidth variant="outlined" margin="dense">
                <InputLabel
                  style={{
                    background: "whitesmoke",
                    paddingInline: "8px",
                    marginLeft: "-8px",
                  }}
                >
                  Work domains
                </InputLabel>
                <Select
                  multiple
                  value={workDomains.filter((workDomain) =>
                    eval("workDomainIncludes" + workDomain)
                  )}
                  onChange={(e) => {
                    const selectedOptions = e.target.value;
                    // console.log(selectedOptions);

                    workDomains.forEach((workDomain) => {
                      eval(
                        "setWorkDomainIncludes" +
                          workDomain +
                          "(" +
                          selectedOptions.includes(workDomain) +
                          ")"
                      );
                    });

                    setWorkDomainIsValid(selectedOptions.length > 0);
                  }}
                  renderValue={(selected) => selected.join(", ")}
                  MenuProps={{
                    getContentAnchorEl: null, // ensures that the menu is positioned relative to the select input
                    anchorOrigin: {
                      vertical: "bottom",
                      horizontal: "left", // required
                    },
                  }}
                >
                  {workDomains.map((workDomain) => (
                    <MenuItem
                      key={workDomain}
                      value={workDomain}
                      style={{ paddingBlock: "0" }}
                    >
                      <ListItemIcon>
                        <Checkbox
                          color="primary"
                          checked={eval("workDomainIncludes" + workDomain)}
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          "Work domain includes " + workDomain.toLowerCase()
                        }
                      />
                    </MenuItem>
                  ))}
                </Select>
                <FormHelperText error={!workDomainIsValid}>
                  {workDomainIsValid
                    ? "Select one or more work domains"
                    : "Select at least one work domain"}
                </FormHelperText>
              </FormControl>

              {/* contact fields */}
              <FormGroup>
                <TextInput
                  labelText={"Contact name"}
                  placeholderText={"Jane Doe"}
                  isRequired
                  helperText={{
                    error: "Contact name must be between 2 and 120 characters",
                    details: "",
                  }}
                  inputProps={{ minLength: 2, maxLength: 120 }}
                  validationFunction={(input) => {
                    return input.length >= 2 && input.length <= 120;
                  }}
                  value={contactName}
                  setValue={setContactName}
                  valueIsValid={contactNameIsValid}
                  setValueIsValid={setContactNameIsValid}
                ></TextInput>
                <TextInput
                  labelText={"Contact email"}
                  placeholderText={"jane.doe@example.com"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact email",
                    details: "",
                  }}
                  inputProps={{ minLength: 2, maxLength: 120 }}
                  validationFunction={(input) => {
                    const emailPattern = /^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/;

                    return (
                      input.length >= 2 &&
                      input.length <= 120 &&
                      emailPattern.test(input)
                    );
                  }}
                  value={contactEmail}
                  setValue={setContactEmail}
                  valueIsValid={contactEmailIsValid}
                  setValueIsValid={setContactEmailIsValid}
                ></TextInput>
                <TextInput
                  labelText={"Contact tel"}
                  placeholderText={"+1234567890"}
                  isRequired
                  helperText={{
                    error: "Invalid Contact tel",
                    details: "",
                  }}
                  inputProps={{ minLength: 2, maxLength: 20 }}
                  validationFunction={(input) => {
                    const phoneNumberPattern = /^\+\d{1,3}\s?\d{1,14}$/;

                    return (
                      input.length >= 2 &&
                      input.length <= 20 &&
                      phoneNumberPattern.test(input)
                    );
                  }}
                  value={contactTel}
                  setValue={setContactTel}
                  valueIsValid={contactTelIsValid}
                  setValueIsValid={setContactTelIsValid}
                ></TextInput>
              </FormGroup>

              <TextInput
                labelText={"References"}
                textFieldProps={{
                  multiline: true,
                  minRows: 1,
                  maxRows: 8,
                }}
                helperText={{
                  error: "References must be under 2000 characters",
                  details: "",
                }}
                inputProps={{ maxLength: 2000 }}
                validationFunction={(input) => {
                  return input.length <= 2000;
                }}
                value={references}
                setValue={setReferences}
                valueIsValid={referencesIsValid}
                setValueIsValid={setReferencesIsValid}
              ></TextInput>
              <TextInput
                labelText={"Looking for"}
                textFieldProps={{
                  multiline: true,
                  minRows: 1,
                  maxRows: 8,
                }}
                helperText={{
                  error: "Looking for must be under 2000 characters",
                  details: "",
                }}
                inputProps={{ maxLength: 2000 }}
                validationFunction={(input) => {
                  return input.length <= 2000;
                }}
                value={lookingFor}
                setValue={setLookingFor}
                valueIsValid={lookingForIsValid}
                setValueIsValid={setLookingForIsValid}
              ></TextInput>

              {/* urls */}
              <FormGroup>
                <TextInput
                  labelText={"Webpage URL"}
                  helperText={{
                    error: "Invalid Webpage URL",
                    details: "",
                  }}
                  placeholderText={"https://restorativepractices.eu/"}
                  inputProps={{ maxLength: 120 }}
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
                  value={webUrl}
                  setValue={setWebUrl}
                  valueIsValid={webUrlIsValid}
                  setValueIsValid={setWebUrlIsValid}
                ></TextInput>
                <TextInput
                  labelText={"Facebook URL"}
                  helperText={{
                    error: "Invalid facebook URL",
                    details: "",
                  }}
                  placeholderText={"https://www.facebook.com/"}
                  inputProps={{ maxLength: 120 }}
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
                  value={facebookUrl}
                  setValue={setFacebookUrl}
                  valueIsValid={facebookUrlIsValid}
                  setValueIsValid={setFacebookUrlIsValid}
                ></TextInput>
                <TextInput
                  labelText={"Instagram URL"}
                  helperText={{
                    error: "Invalid instagram URL",
                    details: "",
                  }}
                  placeholderText={"https://www.instagram.com/"}
                  inputProps={{ maxLength: 120 }}
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
                  value={instagramUrl}
                  setValue={setInstagramUrl}
                  valueIsValid={setInstagramUrl}
                  setValueIsValid={setInstagramUrlIsValid}
                ></TextInput>
                <TextInput
                  labelText={"LinkedIn URL"}
                  helperText={{
                    error: "Invalid linkedIn URL",
                    details: "",
                  }}
                  placeholderText={"https://www.linkedin.com/"}
                  inputProps={{ maxLength: 120 }}
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
                  value={linkedInUrl}
                  setValue={setLinkedInUrl}
                  valueIsValid={linkedInUrlIsValid}
                  setValueIsValid={setLinkedInUrlIsValid}
                ></TextInput>
              </FormGroup>
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
                disabled={
                  !nameIsValid ||
                  !descriptionIsValid ||
                  !contactNameIsValid ||
                  !contactEmailIsValid ||
                  !contactTelIsValid ||
                  !referencesIsValid ||
                  !lookingForIsValid ||
                  !addressIsValid ||
                  !webUrlIsValid ||
                  !facebookUrlIsValid ||
                  !instagramUrlIsValid ||
                  !linkedInUrlIsValid ||
                  !legalStatusIsValid ||
                  !workDomainIsValid
                }
              >
                {!organization ? "Add organization" : "Update organization"}
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
})(OrganizationForm);
