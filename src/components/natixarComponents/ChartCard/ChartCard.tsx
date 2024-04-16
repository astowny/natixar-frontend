import {
  Box,
  Button,
  Grid,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import React, { Dispatch, ReactNode, SetStateAction } from "react"
import { CaretDownOutlined, DownloadOutlined } from "@ant-design/icons"
import IconButton from "../../@extended/IconButton"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number | undefined
  date?: string
  slot: string
  setSlot: Dispatch<SetStateAction<string>>
  compareButton?: boolean
  compare?: boolean
  setCompare?: Dispatch<SetStateAction<boolean>>
}

export const ChartCard = ({
  children,
  title,
  value,
  date,
  compareButton,
  slot,
  setSlot,
  compare,
  setCompare,
}: ChartCardProps) => {
  const handleChange = (
    event: React.MouseEvent<HTMLElement>,
    newAlignment: string,
  ) => {
    if (newAlignment) setSlot(newAlignment)
  }

  return (
    <Box
      sx={{
        padding: "24px",
        backgroundColor: "white",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        rowGap: "15px",
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
        <Box sx={{ display: "flex", gap: "10px" }}>
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
        </Box>
      </Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {!compare ? (
          <Box>
            <Typography variant="h5">{value}</Typography>
            <Typography variant="subtitle2" sx={{ color: "#8C8C8C" }}>
              {date}
            </Typography>
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
            <Typography variant="subtitle2" sx={{ color: "#8C8C8C" }}>
              Compare: {date} to {date}
            </Typography>
          </Box>
        )}
        <Box>
          <Grid>
            <Grid item>
              <Box
                sx={{ display: "flex", alignItems: "center", columnGap: "7px" }}
              >
                <Typography>Detail by</Typography>
                <ToggleButtonGroup
                  exclusive
                  onChange={handleChange}
                  size="small"
                  value={slot}
                >
                  <ToggleButton
                    value="month"
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
                    Month
                  </ToggleButton>
                  <ToggleButton
                    value="quarter"
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
                    Quarter
                  </ToggleButton>
                  <ToggleButton
                    value="year"
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
                    Year
                  </ToggleButton>
                </ToggleButtonGroup>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </Box>
      {children}
    </Box>
  )
}
