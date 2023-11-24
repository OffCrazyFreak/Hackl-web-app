import { TextField, InputAdornment, useMediaQuery } from "@material-ui/core";
import SearchIcon from "@material-ui/icons/Search";

export default function SearchBar({ type, data, setSearchResults }) {
  const mqSub320 = useMediaQuery("(max-width: 320px)");

  function handleChange(event) {
    const value = event.target.value.toLowerCase();

    const results = data.filter((item) => {
      switch (type) {
        case "users":
          return (item.firstName + " " + item.lastName)
            .toLowerCase()
            .includes(value);
        case "venues":
          return item.name.toLowerCase().includes(value);
        default:
          return true;
      }
    });

    setSearchResults(results);
  }

  return (
    <TextField
      label={`Search ${type}`}
      size="small"
      fullWidth={mqSub320}
      variant="outlined"
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      onChange={handleChange}
      // Add any additional styles or props you need
    />
  );
}
