import {
  Box,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { ReactNode } from "react"
import { CaretDownOutlined } from "@ant-design/icons"
import _ from "lodash"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number
  selectedSlot?: string
  setSelectedSlot: (newSlot: string) => void
  slots?: string[]
  startDate: Date
  endDate: Date
  // compareButton?: boolean
  // compare?: boolean
  // setCompare?: Dispatch<SetStateAction<boolean>>
}

export const ChartCard = ({
  children,
  title,
  value,
  startDate,
  endDate,
  slots,
  selectedSlot,
  setSelectedSlot,
  // compareButton,
  // compare,
  // setCompare,
}: ChartCardProps) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment) setSelectedSlot(newAlignment)
  }

  return (
    <Stack
      direction="column"
      gap="15px"
      sx={{
        padding: "24px",
        backgroundColor: "white",
        width: "100%",
        border: "1px solid",
        borderColor: "#e6ebf1",
        borderRadius: "4px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5">{title}</Typography>
        {/* <Box sx={{ display: "flex", gap: "10px" }}>
          {compareButton && setCompare && (
            <Button
              sx={{
                color: compare ? "#1890FF" : "#000000",
                borderColor: compare ? "#1890FF" : "#D9D9D9",
              }}
              variant="outlined"
              color="secondary"
              onClick={() => setCompare(!compare)}
            >
              Compare to previous year
            </Button>
          )}
          <IconButton
            variant="outlined"
            color="secondary"
            sx={{ borderColor: "#D9D9D9" }}
          >
            <DownloadOutlined style={{ color: "#000" }} />
          </IconButton>
        </Box> */}
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {true ? (
          <Box>
            <Typography variant="h5">{value}</Typography>
            {startDate && endDate && (
              <Typography variant="subtitle2" sx={{ color: "#8C8C8C" }}>
                {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
              </Typography>
            )}
          </Box>
        ) : (
          <Box>
            <Box
              sx={{
                color: "red",
                display: "flex",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <CaretDownOutlined />
              <Typography variant="h5">{value}</Typography>
              <Typography>(45,67%)</Typography>
            </Box>
            {/* <Typography variant="subtitle2" sx={{ color: "#8C8C8C" }}> */}
            {/* Compare: {date} to {date} */}
            {/* </Typography> */}
          </Box>
        )}
        <Box>
          <Grid>
            <Grid item>
              <Box
                sx={{ display: "flex", alignItems: "center", columnGap: "7px" }}
              >
                <Typography>Detail by</Typography>
                {slots && (
                  <ToggleButtonGroup
                    exclusive
                    size="small"
                    value={selectedSlot}
                    onChange={handleChange}
                  >
                    {slots.map((timeDetailSlot) => (
                      <ToggleButton
                        key={timeDetailSlot}
                        value={timeDetailSlot}
                        sx={{
                          px: 2,
                          py: 0.5,
                          color: "#000000",
                          "&.MuiToggleButton-root.Mui-selected": {
                            color: "#FFFFFF",
                            backgroundColor: "#1890FF",
                            borderColor: "#1890FF",
                          },
                        }}
                      >
                        {_.capitalize(timeDetailSlot)}
                      </ToggleButton>
                    ))}
                  </ToggleButtonGroup>
                )}
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {children}
    </Stack>
  )
}
