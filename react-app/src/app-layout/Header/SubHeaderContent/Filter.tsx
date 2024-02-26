// material-ui
import { Box, FormControl, MenuItem, Select, Typography } from "@mui/material";
import { AreaCheckbox } from "../../../components/natixarComponents/AreaCheckbox"
import NavigationBar from 'components/NavBar';

// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Search = () => (
  <Box
    sx={{
      display: "flex",
      alignItems: "center",
      width: "100%",
      ml: { xs: 0, md: 1, lg: -1 },
    }}
  >
    <Typography sx={{ mr: 2.5 }}>Filter</Typography>
    <FormControl sx={{ minwidth: 80, mr: 2.5 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        placeholder="Business Entity / Facility"
        sx={{ width: "160px" }}
      >
        {/* <MenuItem value={10}>Business Entity / Facility</MenuItem> */}
        {/* <MenuItem value={20}>Business Entity / Facility</MenuItem> */}
        {/* <MenuItem value={30}>Business Entity / Facility</MenuItem> */}
        <AreaCheckbox />
      </Select>
    </FormControl>
    <FormControl sx={{ minwidth: 80, mr: 2.5 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        placeholder="Geographic Area"
        sx={{
          width: "160px",
          "& .MuiList-root": {
            padding: "12px",
          },
        }}
      >
        {/* <MenuItem value={10}>Geographic Area</MenuItem> */}
        {/* <MenuItem value={20}>Geographic Area</MenuItem> */}
        {/* <MenuItem value={30}>Geographic Area</MenuItem> */}
        <AreaCheckbox />
      </Select>
    </FormControl>
    <FormControl sx={{ minwidth: 80, mr: 2.5 }}>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        placeholder="Age"
        defaultValue={10}
      >
        <MenuItem value={10}>Tags</MenuItem>
        <MenuItem value={20}>Tags</MenuItem>
        <MenuItem value={30}>Tags</MenuItem>
      </Select>
    </FormControl>
    <FormControl sx={{ minwidth: 80, mr: 2.5 }}>
      {/* <DateRangePicker slots={{ field: SingleInputDateRangeField }} name="allowedRange" /> */}
    </FormControl>
    <NavigationBar />
  </Box>
)

export default Search
