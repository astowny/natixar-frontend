// material-ui
import {
  Box,
  List,
  ListItemButton,
  ListItemText,
  Stack,
  Typography,
} from "@mui/material"

// project import
import MainCard from "components/MainCard"
import AcquisitionChart from "./AcquisitionChart"

// ==============================|| ANALYTICS - ACQUISITION CHANNELS ||============================== //

function AcquisitionChannels() {
  return (
    <MainCard content={false}>
      <Stack>
        <List sx={{ p: 0, "& .MuiListItemButton-root": { pt: 2, pb: 0 } }}>
          <ListItemButton
            sx={{
              "&:hover": { backgroundColor: "transparent" },
              cursor: "text",
            }}
          >
            <ListItemText
              primary={
                <Typography variant="subtitle1">
                  Trend stacked bars CO2
                </Typography>
              }
            />
          </ListItemButton>
        </List>
        <Box sx={{ pr: 2 }}>
          <AcquisitionChart slot="month" />
        </Box>
      </Stack>
    </MainCard>
  )
}

export default AcquisitionChannels
