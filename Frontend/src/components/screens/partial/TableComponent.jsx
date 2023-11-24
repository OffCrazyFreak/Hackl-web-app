import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableSortLabel,
  TableBody,
  IconButton,
  Link,
  Box,
  Tooltip,
  useMediaQuery,
} from "@material-ui/core";
import {
  Visibility as DetailsIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from "@material-ui/icons";

import { useState } from "react";

export default function TableComponent({
  tableColumns,
  filteredData,
  setFilteredData,
  handleView,
  handleEdit,
  handleDelete,
}) {
  const mqSub600 = useMediaQuery("(max-width: 600px)");

  const [sortBy, setSortBy] = useState("");
  const [sortDirection, setSortDirection] = useState("desc");

  function handleSort(column) {
    if (column.key === sortBy) {
      // if same column selected, reverse
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
      setFilteredData([...filteredData].reverse());
    } else {
      // if different column selected, sort desc
      setSortDirection("desc");
      setSortBy(column.key);

      sortTable(column);
    }
  }

  function sortTable(column) {
    setFilteredData(
      filteredData.sort((a, b) => {
        if (a[column.key] === null) {
          return 1;
        } else if (b[column.key] === null) {
          return -1;
        } else {
          // TODO: sorting numbers is still broken
          // toString needed when sorting numbers
          return a[column.key]
            .toString()
            .localeCompare(b[column.key].toString());
        }
      })
    );
  }

  function getFormatedCellValue(column, value) {
    if (column.key === "webUrl") {
      return (
        <Link href={value} target="_blank">
          {value}
        </Link>
      );
    } else if (column.key === "description") {
      return (
        <Tooltip title={value}>
          <span>{value}</span>
        </Tooltip>
      );
    } else {
      return value;
    }
  }

  return (
    <Table
      stickyHeader
      size="small"
      style={{
        paddingBottom: 16,
      }}
    >
      <TableHead>
        <TableRow>
          {tableColumns.map((column) => (
            <TableCell
              key={column.key}
              style={{
                display: column.mdHide && mqSub600 ? "none" : "table-cell",

                padding: 4,

                width: "min-content",

                textAlign: column.centerContent && "center",

                whiteSpace: "nowrap",
              }}
            >
              {column.notSortable ? (
                column.label
              ) : (
                <TableSortLabel
                  active={sortBy === column.key}
                  direction={sortBy === column.key ? sortDirection : "desc"}
                  onClick={() => handleSort(column)}
                >
                  {column.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}

          <TableCell align="center">Actions</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {filteredData.map((result) => (
          <TableRow key={result.id}>
            {tableColumns.map((column) => {
              const cellValue = result[column.key];

              return (
                <TableCell
                  key={column.key}
                  style={{
                    display: column.mdHide && mqSub600 ? "none" : "table-cell",

                    padding: 4,

                    textAlign: column.centerContent && "center",

                    width: "min-content",

                    overflow: "hidden",
                    textOverflow: column.showTooltip ? "ellipsis" : "unset",
                    whiteSpace: column.showTooltip ? "nowrap" : "unset",
                    maxWidth: column.showTooltip ? "30ch" : "60ch", // required so the cell doesnt overflow
                  }}
                >
                  {getFormatedCellValue(column, cellValue)}
                </TableCell>
              );
            })}

            <TableCell
              sx={{
                padding: 4,
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: 4,

                  paddingInline: 4,
                }}
              >
                {handleView && (
                  <Tooltip title="Details" key="Details">
                    <IconButton
                      size="small"
                      onClick={() => handleView(result)}
                      style={{
                        color: "white",
                        backgroundColor: "#3f51b5",

                        borderRadius: 4,
                      }}
                    >
                      <DetailsIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {handleEdit && (
                  <Tooltip title="Edit" key="Edit">
                    <IconButton
                      size="small"
                      onClick={() => handleEdit(result)}
                      style={{
                        color: "white",
                        backgroundColor: "#3f51b5",

                        borderRadius: 4,
                      }}
                    >
                      <EditIcon />
                    </IconButton>
                  </Tooltip>
                )}
                {handleDelete && (
                  <Tooltip title="Delete">
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(result)}
                      style={{
                        color: "white",
                        backgroundColor: "#3f51b5",

                        borderRadius: 4,
                      }}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
