import { Box, Popover, SxProps, Typography } from "@mui/material"
import SensorsIcon from "@mui/icons-material/Sensors"
import SensorsOffIcon from "@mui/icons-material/SensorsOff"
import { useGetNetworkInformationQuery } from "data/store/features/networkIndication/NetworkCheckClient"
import { memo, useCallback, useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { TimeMeasurement } from "data/domain/types/time/TimeRelatedTypes"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import formatISO from "date-fns/formatISO"
import { formatProtocolForRangesEndpoint } from "data/store/features/emissions/ranges/EndpointTypes"
import {
  useGetEmissionRangesQuery,
  useLazyGetEmissionRangesQuery,
} from "data/store/features/emissions/ranges/EmissionRangesClient"

const NetworkIndicator = (props: SxProps) => {
  const { ...sxProps } = props
  const { data, error } = useGetNetworkInformationQuery(undefined, {
    pollingInterval: 2000,
  })

  const { timeRangeOfInterest, protocol } = useSelector(
    selectEmissionRangeRequestParameters,
  )
  const [getEmissionData, { isLoading }] = useLazyGetEmissionRangesQuery()
  const scale = TimeMeasurement.MINUTES
  const requestParams = useMemo(
    () => ({
      protocol: formatProtocolForRangesEndpoint(protocol),
      scale,
      timeRanges: [
        {
          start: formatISO(timeRangeOfInterest.start),
          end: formatISO(timeRangeOfInterest.end),
          scale,
        },
      ],
    }),
    [protocol, timeRangeOfInterest],
  )
  useGetEmissionRangesQuery(requestParams, {
    pollingInterval: 10000,
  })
  useEffect(() => {
    getEmissionData(requestParams)
  }, [requestParams])

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null)

  const handlePopoverOpen = useCallback(
    (event: React.MouseEvent<HTMLElement>) => {
      setAnchorEl(event.currentTarget)
    },
    [setAnchorEl],
  )

  const handlePopoverClose = useCallback(() => {
    setAnchorEl(null)
  }, [setAnchorEl])

  const networkIsOk = data && !error
  const openPopover = Boolean(anchorEl)
  const popoverText = networkIsOk
    ? "Connected to server"
    : "Lost connection to the server. Contact admins for help."

  return (
    <Box sx={{ ...sxProps }}>
      <Box onMouseEnter={handlePopoverOpen} onMouseLeave={handlePopoverClose}>
        {networkIsOk ? (
          <SensorsIcon color="success" />
        ) : (
          <SensorsOffIcon color="warning" />
        )}
      </Box>
      <Popover
        sx={{
          pointerEvents: "none",
        }}
        open={openPopover}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "left",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "left",
        }}
        onClose={handlePopoverClose}
        disableRestoreFocus
      >
        <Typography sx={{ p: 1 }} variant="h6">
          {popoverText}
        </Typography>
      </Popover>
    </Box>
  )
}

export default memo(NetworkIndicator)
