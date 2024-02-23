import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"
import { DownloadOutlined } from "@ant-design/icons"
import IconButton from "../../@extended/IconButton"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number | undefined
  date?: string
  compareButton?: boolean
  slot: string
  setSlot: Dispatch<SetStateAction<string>>
}

export const ChartCard = ({
  children,
  title,
  value,
  date,
  compareButton,
  slot,
  setSlot,
}: ChartCardProps) => (
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
        {compareButton && (
          <Button variant="outlined" color="secondary">
            Compare to previous year
          </Button>
        )}
        <IconButton variant="outlined" color="secondary">
          <DownloadOutlined />
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
      <Box>
        <Typography variant="h5">{value}</Typography>
        <Typography variant="subtitle2">{date}</Typography>
      </Box>
      <Box>
        <Grid>
          <Grid item>
            <Box
              sx={{ display: "flex", alignItems: "center", columnGap: "7px" }}
            >
              <Typography>Detalisation by</Typography>
              <Button
                size="small"
                sx={{ color: slot === "week" ? "#FFF" : "#000" }}
                onClick={() => setSlot("week")}
                color={slot === "week" ? "primary" : "secondary"}
                variant={slot === "week" ? "contained" : "outlined"}
              >
                Week
              </Button>
              <Button
                size="small"
                sx={{ color: slot === "quarter" ? "#FFF" : "#000" }}
                onClick={() => setSlot("quarter")}
                color={slot === "quarter" ? "primary" : "secondary"}
                variant={slot === "quarter" ? "contained" : "outlined"}
              >
                Quarter
              </Button>
              <Stack direction="row" alignItems="center" spacing={0}>
                <Button
                  size="small"
                  sx={{ color: slot === "month" ? "#FFF" : "#000" }}
                  onClick={() => setSlot("month")}
                  color={slot === "month" ? "primary" : "secondary"}
                  variant={slot === "month" ? "contained" : "outlined"}
                >
                  Month
                </Button>
              </Stack>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
    {children}
  </Box>
)
