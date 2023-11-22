import {
  useMediaQuery,
  Box,
  Typography,
  ButtonGroup,
  Button,
  TextField,
  InputAdornment,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  ListItemIcon,
  ListItemText,
  Checkbox,
  Link,
} from "@material-ui/core";
import {
  AddCircle as AddCircleIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Search as SearchIcon,
  PinDrop as PinDropIcon,
  LockOpen as LockOpenIcon,
  Lock as LockIcon,
  CloudDownload as CloudDownloadIcon,
  CloudUpload as CloudUploadIcon,
} from "@material-ui/icons";

import { useEffect, useState } from "react";

// import data from "./data/organizations.json";

import OrganizationForm from "./components/OrganizationForm";
import UserForm from "./components/UserForm";
import LoginForm from "./components/LoginForm";
import GMap from "./components/GMap";

const workDomains = ["Science", "Technology", "Ecology", "Art", "Crafts"];
const legalStatuses = ["For-profit", "Non-profit", "Individual"];

const admins = [
  { username: "Cultivamos Cultura", password: "ccultura#Possw0rd" },
  { username: "Casa do Rio", password: "cdr#SecurePassword23" },
  { username: "UR Institut", password: "ur#MyS3cretPoss" },
  { username: "BioArt Society", password: "bas#Passworda2023" },
  { username: "IamAadmin", password: "TotesC00lpa5#" },
];

export default function App() {
  const [organizations, setOrganizations] = useState([]);

  const [visibleOrganizations, setVisibleOrganizations] = useState([]);

  const [openOrganizationFormModal, setOpenOrganizationFormModal] =
    useState(false);
  const [organization, setOrganization] = useState();

  const [openUserFormModal, setOpenUserFormModal] = useState(false);
  const [userFormMode, setUserFormMode] = useState("");

  const [openLoginFormModal, setOpenLoginFormModal] = useState(false);
  const [loginErrorMsg, setLoginErrorMsg] = useState("");

  const [activeWorkDomains, setActiveWorkDomains] = useState(workDomains);
  const [activeLegalStatuses, setActiveLegalStatuses] = useState(legalStatuses);

  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  const mqSub600 = useMediaQuery("(max-width: 600px)");

  async function fetchOrganizations() {
    try {
      const serverResponse = await fetch("/api/organizations", {
        method: "GET",
      });

      if (serverResponse.ok) {
        const json = await serverResponse.json();

        // console.log(json);
        setOrganizations(json);
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

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
      const ccLoginInfo = {
        userData: userData,
        lastLogin: new Date(),
        automaticLoginDaysDuration: 7,
      };
      localStorage.setItem("ccLoginInfo", JSON.stringify(ccLoginInfo));

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

        const ccLoginInfo = {
          userData: userData,
          lastLogin: new Date(),
          automaticLoginDaysDuration: 7,
        };
        localStorage.setItem("ccLoginInfo", JSON.stringify(ccLoginInfo));

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

  function handleEditOrganization(organization) {
    setOrganization(organization);
    setOpenOrganizationFormModal(true);
  }

  async function handleDeleteOrganization(organization) {
    try {
      const serverResponse = await fetch(
        "/api/organizations/" + organization.id,
        {
          method: "DELETE",
        }
      );

      if (serverResponse.ok) {
        console.log("Organization " + organization.name + " deleted.");
        fetchOrganizations();
      } else {
        console.error("A server error occurred whilst fetching data.");
      }
    } catch (error) {
      console.error("An error occurred whilst trying to connect to server.");
    }
  }

  function handleOrganizationsFileUpload(file) {
    const fileReader = new FileReader();

    fileReader.onload = async (e) => {
      try {
        const organizationsData = JSON.parse(e.target.result);
        // console.log("Organizations imported successfully:", organizationsData);

        try {
          const serverResponse = await fetch("/api/organizations/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(organizationsData),
          });

          if (serverResponse.ok) {
            const json = await serverResponse.json();
            console.log("Organizations imported:", json);

            fetchOrganizations();
          } else if (serverResponse.status === 400) {
            console.error("Invalid organizations details.");
          } else if (serverResponse.status === 403) {
            console.error(
              "Admin privileges are required for manipulating organizations."
            );
          } else {
            console.error(
              "An unknown error occurred whilst trying to add organizations."
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
    fetchOrganizations();
    // setOrganizations(data);

    if (!userIsLoggedIn) {
      const ccLoginInfo = JSON.parse(localStorage.getItem("ccLoginInfo"));

      if (
        ccLoginInfo !== null &&
        (new Date() - Date.parse(Date(ccLoginInfo.lastLogin))) /
          (1000 * 3600 * 24) <
          ccLoginInfo.automaticLoginDaysDuration
      ) {
        // if userData exists in local storage and user has logged in the last X days
        login(ccLoginInfo.userData);
      }
    }
  }, []);

  useEffect(() => {
    setVisibleOrganizations(
      organizations.filter((organization) => {
        const organizationWorkDomains = [];

        if (organization.workDomainIncludesScience) {
          organizationWorkDomains.push("Science");
        }
        if (organization.workDomainIncludesTechnology) {
          organizationWorkDomains.push("Technology");
        }
        if (organization.workDomainIncludesEcology) {
          organizationWorkDomains.push("Ecology");
        }
        if (organization.workDomainIncludesArt) {
          organizationWorkDomains.push("Art");
        }
        if (organization.workDomainIncludesCrafts) {
          organizationWorkDomains.push("Crafts");
        }

        return (
          activeWorkDomains.some((workDomain) =>
            organizationWorkDomains.includes(workDomain)
          ) && activeLegalStatuses.includes(organization.legalStatus)
        );
      })
    );
  }, [organizations, activeWorkDomains, activeLegalStatuses]);

  return (
    <>
      <OrganizationForm
        organization={organization}
        openModal={openOrganizationFormModal}
        setOpenModal={setOpenOrganizationFormModal}
        fetchOrganizations={fetchOrganizations}
      />

      <UserForm
        openModal={openUserFormModal}
        setOpenModal={setOpenUserFormModal}
        mode={userFormMode}
      />

      <LoginForm
        openModal={openLoginFormModal}
        setOpenModal={setOpenLoginFormModal}
        login={login}
        loginErrorMsg={loginErrorMsg}
      />

      <Box
        style={{
          marginInline: "3%",

          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 1000,
        }}
      >
        {/* TODO: Login to have access to add organization form */}
        {/* TODO: Add logos to organizations */}
        {/* TODO: Users form modal functionality etc. */}
        {/* TODO: Import & Export organizations functionality */}

        {/* TODO: DEPLOY */}

        <Typography variant="h2" align="center">
          Restorative Practices Creative Cluster
        </Typography>

        <Box
          style={{
            marginBlock: 16,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexDirection: mqSub600 ? "column" : "row",
          }}
        >
          <Button
            variant="contained"
            color="primary"
            startIcon={<PinDropIcon />}
            href="https://forms.gle/QP1Asbk4TAhh4yoAA"
            target="_blank"
          >
            Apply
          </Button>

          {userIsLoggedIn && (
            <Box
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 8,
                flexDirection: "column",
              }}
            >
              <ButtonGroup
                variant="contained"
                orientation={mqSub600 ? "vertical" : "horizontal"}
              >
                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => {
                    setOrganization();
                    setOpenOrganizationFormModal(true);
                  }}
                >
                  Add organization
                </Button>

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
                      handleOrganizationsFileUpload(file);
                    };

                    fileInput.click();
                  }}
                >
                  Import organizations
                </Button>

                <Button
                  variant="contained"
                  color="primary"
                  startIcon={<CloudDownloadIcon />}
                  onClick={async () => {
                    await fetchOrganizations();

                    const organizationsData = organizations.map(
                      ({ id, ...org }) => org
                    ); // remove ID
                    const organizationsJSON = JSON.stringify(organizationsData);

                    // Generate and download JSON file
                    const jsonBlob = new Blob([organizationsJSON], {
                      type: "application/json",
                    });
                    const jsonUrl = URL.createObjectURL(jsonBlob);
                    const jsonLink = document.createElement("a");
                    jsonLink.href = jsonUrl;
                    jsonLink.download = `rp_cc-organizations_export-${new Date()
                      .toISOString()
                      .slice(0, 10)}.json`;
                    jsonLink.click();
                  }}
                >
                  Export organizations
                </Button>
              </ButtonGroup>

              <ButtonGroup
                style={{ marginInline: "auto" }}
                variant="contained"
                orientation={mqSub600 ? "vertical" : "horizontal"}
              >
                {/* <Button
                  variant="contained"
            color="primary"
                  startIcon={<AddCircleIcon />}
                  onClick={() => {
                    setUserFormMode("add");
                    setOpenUserFormModal(true);
                  }}
                >
                  Add user
                </Button> */}

                {/* <Button
                  variant="contained"
            color="primary"
                  startIcon={<EditIcon />}
                  onClick={() => {
                    setUserFormMode("edit");
                    setOpenUserFormModal(true);
                  }}
                >
                  Edit user
                </Button> */}

                {/* <Button
                  variant="contained"
            color="primary"
                  startIcon={<DeleteIcon />}
                  onClick={() => {
                    setUserFormMode("delete");
                    setOpenUserFormModal(true);
                  }}
                >
                  Delete user
                </Button> */}
              </ButtonGroup>
            </Box>
          )}

          <Button
            variant="contained"
            color="primary"
            startIcon={!userIsLoggedIn ? <LockOpenIcon /> : <LockIcon />}
            onClick={() => {
              if (userIsLoggedIn) {
                localStorage.removeItem("ccLoginInfo");
                setUserIsLoggedIn(false);
              } else {
                setLoginErrorMsg("");
                setOpenLoginFormModal(true);
              }
            }}
          >
            {!userIsLoggedIn ? "Login" : "Logout"}
          </Button>
        </Box>

        <Box
          style={{
            marginBlock: 16,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 8,
            flexDirection: mqSub600 ? "column" : "row",
          }}
        >
          <TextField
            label="Search organizations"
            size="small"
            variant="outlined"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
            }}
            fullWidth={mqSub600}
            style={{ flex: 1 }}
            onChange={(e) =>
              setVisibleOrganizations(
                organizations.filter((item) => {
                  if (e.target.value)
                    return item.name
                      .toLowerCase()
                      .includes(e.target.value.toLowerCase());
                  else return true;
                })
              )
            }
          />

          <FormControl
            size="small"
            variant="outlined"
            fullWidth={mqSub600}
            style={{ flex: 1 }}
          >
            <InputLabel
              style={{
                background: "#fafafa",
                paddingInline: "8px",
                marginLeft: "-8px",

                paddingBlock: "2px",

                maxWidth: "125%", // Display label on full width of the input

                // Prevent label from wrapping
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Display organizations with legal status
            </InputLabel>
            <Select
              multiple
              value={activeLegalStatuses}
              onChange={(e) => {
                setActiveLegalStatuses(e.target.value);
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
              {legalStatuses.map((legalStatus, index) => (
                <MenuItem
                  key={index}
                  value={legalStatus}
                  style={{ paddingBlock: "0" }}
                >
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      checked={activeLegalStatuses.includes(legalStatus)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={legalStatus} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl
            size="small"
            variant="outlined"
            fullWidth={mqSub600}
            style={{ flex: 1 }}
          >
            <InputLabel
              style={{
                background: "#fafafa",
                paddingInline: "8px",
                marginLeft: "-8px",

                paddingBlock: "2px",

                maxWidth: "125%", // Display label on full width of the input

                // Prevent label from wrapping
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
              }}
            >
              Display organizations with work domains
            </InputLabel>
            <Select
              multiple
              value={activeWorkDomains}
              onChange={(e) => {
                setActiveWorkDomains(e.target.value);
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
              {workDomains.map((workDomain, index) => (
                <MenuItem
                  key={index}
                  value={workDomain}
                  style={{
                    paddingBlock: "0",
                  }}
                >
                  <ListItemIcon>
                    <Checkbox
                      color="primary"
                      checked={activeWorkDomains.includes(workDomain)}
                    />
                  </ListItemIcon>
                  <ListItemText primary={workDomain} />
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Box
          style={{
            position: "relative",
            height: "100%",
          }}
        >
          <GMap
            userIsLoggedIn={userIsLoggedIn}
            visibleOrganizations={visibleOrganizations}
            handleEdit={handleEditOrganization}
            handleDelete={handleDeleteOrganization}
          />
        </Box>

        <Box
          style={{
            height: 50,

            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Typography
            variant="body2"
            style={{
              fontStyle: "italic",
              color: "#ccc",
              width: 150,
              maxWidth: "30%",
            }}
          >
            Restorative Practices project Ref. Ares (2022) 6461361
          </Typography>

          <Link
            href="https://restorativepractices.eu"
            style={{ width: 150, maxWidth: "30%" }}
          >
            <img
              src={require("./img/rp.png")}
              alt="Restorative practices logo"
              style={{ width: "100%" }}
            />
          </Link>

          <img
            src={require("./img/eu_flag.png")}
            alt="EU Flag Creative Europe"
            style={{ width: 150, maxWidth: "30%" }}
          />
        </Box>
      </Box>
    </>
  );
}
