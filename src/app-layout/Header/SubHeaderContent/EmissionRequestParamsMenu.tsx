import DateRangeIcon from "@mui/icons-material/DateRange"
import {
  Box,
  Button,
  ButtonGroup,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Popover,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { DatePicker } from "@mui/x-date-pickers"
import {
  getShortDescriptionForTimeRange,
  getTimeRangeFor,
} from "data/domain/transformers/TimeTransformers"
import { EmissionProtocol } from "data/domain/types/emissions/EmissionTypes"
import { TimeRange } from "data/domain/types/time/TimeRelatedTypes"
import { useAppDispatch } from "data/store"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import {
  selectProtocol,
  selectTimeRange,
} from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { memo, useCallback, useMemo, useState } from "react"
import { useSelector } from "react-redux"

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Protocol = memo(
  ({ selectedProtocol }: { selectedProtocol: EmissionProtocol }) => {
    const theme = useTheme()
    const dispatch = useAppDispatch()
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
    const allProtocols = Object.values(EmissionProtocol)
    const handleClick = useCallback(
      (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget)
      },
      [setAnchorEl],
    )

    const handleClose = useCallback(() => {
      setAnchorEl(null)
    }, [setAnchorEl])

    const selectProtocolCallback = useCallback(
      (newProtocol: EmissionProtocol) => {
        dispatch(selectProtocol(newProtocol))
        handleClose()
      },
      [dispatch, selectProtocol],
    )

    const open = Boolean(anchorEl)
    const id = open ? "simple-popover" : undefined

    return (
      <Box sx={{ flexShrink: 0, ml: 0.75 }}>
        <Button
          variant="outlined"
          sx={{ color: `${theme.palette.grey[900]}` }}
          onClick={handleClick}
        >
          <Typography noWrap>{selectedProtocol}</Typography>
        </Button>
        <Popover
          id={id}
          open={open}
          anchorEl={anchorEl}
          onClose={handleClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "center",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "center",
          }}
        >
          <List sx={{ width: 220 }}>
            {allProtocols.map((protocol) => (
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => selectProtocolCallback(protocol)}
                >
                  <ListItemText primary={protocol} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Popover>
      </Box>
    )
  },
)

const DateRangeControlForm = memo(({ timeRange }: { timeRange: TimeRange }) => {
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const dispatch = useAppDispatch()

  const handleClick = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      setAnchorEl(event.currentTarget)
    },
    [setAnchorEl],
  )

  const handleClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const changeTimeRange = useCallback(
    (scale: number) => {
      const newTimeRange = getTimeRangeFor(scale)
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const startChangeCallback = useCallback(
    (startTime: Date) => {
      const newTimeRange: TimeRange = {
        start: startTime.getTime(),
        end: timeRange.end,
      }
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const endChangeCallback = useCallback(
    (endTime: Date) => {
      const newTimeRange: TimeRange = {
        start: timeRange.start,
        end: endTime.getTime(),
      }
      dispatch(selectTimeRange(newTimeRange))
    },
    [dispatch, selectTimeRange],
  )

  const timeRangeStr = useMemo(
    () => getShortDescriptionForTimeRange(timeRange),
    [timeRange],
  )

  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined
  const monthRanges = [6, 12, 24]

  return (
    <>
      <Button
        sx={{
          color: "primary",
        }}
        aria-describedby={id}
        variant="outlined"
        color="primary"
        onClick={handleClick}
        endIcon={<DateRangeIcon />}
      >
        <Typography noWrap>{timeRangeStr}</Typography>
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Paper elevation={3} sx={{ p: "1rem" }}>
          <Stack gap="1rem">
            <Stack
              direction="row"
              gap="1.5rem"
              alignItems="center"
              justifyContent="center"
            >
              <ButtonGroup>
                {monthRanges.map((monthsAmount) => (
                  <Button
                    key={monthsAmount}
                    variant="outlined"
                    onClick={() => changeTimeRange(monthsAmount)}
                  >
                    {monthsAmount} months
                  </Button>
                ))}
              </ButtonGroup>
            </Stack>
            <Stack gap="1.5rem" direction="row">
              <DatePicker
                sx={{ width: "10rem" }}
                label="From"
                value={new Date(timeRange.start)}
                onChange={startChangeCallback}
              />
              <DatePicker
                sx={{ width: "10rem" }}
                label="To"
                value={new Date(timeRange.end)}
                onChange={endChangeCallback}
              />
            </Stack>
          </Stack>
        </Paper>
      </Popover>
    </>
  )
})

const RequestParametersControl = ({ ...sxProps }: SxProps) => {
  const { timeRangeOfInterest, protocol } = useSelector(
    selectEmissionRangeRequestParameters,
  )

  return (
    <Stack direction="row" gap=".5rem" sx={{ ...sxProps }}>
      <DateRangeControlForm timeRange={timeRangeOfInterest} />
      <Protocol selectedProtocol={protocol} />
    </Stack>
  )
}

export default RequestParametersControl
