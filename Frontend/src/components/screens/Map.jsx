import { useMediaQuery, Box, Link } from "@material-ui/core";
import { AddCircle as AddCircleIcon } from "@material-ui/icons";

import { useEffect, useState } from "react";

import GMap from "./partial/GMap";
import SearchBar from "./partial/SearchBar";

export default function Home() {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const mqSub600 = useMediaQuery("(max-width: 600px)");

  async function fetchData() {
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
  }

  useEffect(() => {
    setFilteredData(
      data.filter((venue) => {
        // TODO: filter by datetime and myb price
        return true;
      })
    );
  }, [data]);

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <>
      <Box
        style={{
          marginInline: "3%",

          display: "flex",
          flexDirection: "column",
          height: "100%",
          minHeight: 1000,
        }}
      >
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
          <SearchBar
            type="venues"
            data={data}
            setSearchResults={setFilteredData}
          />

          {/* TODO: filters */}
        </Box>

        <Box
          style={{
            position: "relative",
            height: "100%",
          }}
        >
          <GMap visibleVenues={filteredData} />
        </Box>

        <Box
          style={{
            height: 50,

            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Link
            href="https://hackl.zagreb.hr"
            style={{ width: 120, maxWidth: "30%" }}
          >
            <img
              src={require("../../img/grad-zagreb-color.png")}
              alt="Grad Zagreb logo"
              style={{ width: "100%" }}
            />
          </Link>
        </Box>
      </Box>
    </>
  );
}
