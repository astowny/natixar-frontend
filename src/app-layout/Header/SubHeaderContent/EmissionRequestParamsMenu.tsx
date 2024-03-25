import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import ReportGeneratorControl from "components/reports/ReportGeneratorControl"
import { EmissionProtocol } from "data/domain/types/emissions/EmissionTypes"
import { useAppDispatch } from "data/store"
import {
  selectEmissionFilter as filterStateSelector,
  selectEmissionRangeRequestParameters,
  selectAlignedIndexes as indexesSelector,
} from "data/store/api/EmissionSelectors"
import { selectProtocol } from "data/store/features/emissions/ranges/EmissionRangesSlice"
import { memo, useCallback, useState } from "react"
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

const RequestParametersControl = ({ ...sxProps }: SxProps) => {
  const { protocol } = useSelector(selectEmissionRangeRequestParameters)
  const alignedIndexes = useSelector(indexesSelector)
  const globalFilter = useSelector(filterStateSelector)

  return (
    <Stack direction="row" gap=".5rem" sx={{ ...sxProps }}>
      <ReportGeneratorControl indexes={alignedIndexes} filter={globalFilter} />
      <Protocol selectedProtocol={protocol} />
    </Stack>
  )
}

export default RequestParametersControl
