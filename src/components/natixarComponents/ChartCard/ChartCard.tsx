import {
  Box,
  Button,
  Grid,
  Stack,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material"
import { Dispatch, ReactNode, SetStateAction } from "react"
import _ from "lodash"
import ArrowDropUpIcon from "@mui/icons-material/ArrowDropUp"
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown"
import { jsx } from "@emotion/react"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number
  selectedSlot?: string
  setSelectedSlot: (newSlot: string) => void
  slots?: string[]
  startDate: Date
  endDate: Date
  percentage?: number
  showCompareButton?: boolean
  compare?: boolean
  setCompare?: Dispatch<SetStateAction<boolean>>
}

const AmountLabel = ({
  value,
  percentage,
}: {
  value?: string | number
  percentage?: number
}) => {
  let color: string
  let arrowNode: JSX.Element | null

  if (typeof percentage === "undefined") {
    color = "primary"
    arrowNode = null
  } else {
    color = percentage > 0 ? "red" : "green"
    arrowNode = percentage > 0 ? <ArrowDropUpIcon /> : <ArrowDropDownIcon />
  }

  return (
    <Stack
      width="fit-content"
      direction="row"
      justifyContent="center"
      alignItems="center"
      color={color}
      gap=".1rem"
      sx={{
        color,
      }}
    >
      {arrowNode}
      <Typography variant="h5">{value}</Typography>
      {arrowNode && (
        <Typography sx={{ ml: ".3rem", fontWeight: "bold" }}>
          ({percentage}%)
        </Typography>
      )}
      <Typography variant="subtitle2" />
    </Stack>
  )
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
  percentage,
  showCompareButton,
  compare,
  setCompare,
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
        {showCompareButton && setCompare && (
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
      </Box>
      <Typography variant="h5">{title}</Typography>
      <AmountLabel value={value} percentage={percentage} />
      {startDate && endDate && (
        <Typography variant="subtitle2" sx={{ color: "#8C8C8C" }}>
          {`${startDate.toLocaleDateString()} - ${endDate.toLocaleDateString()}`}
        </Typography>
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
      {children}
    </Stack>
  )
}
