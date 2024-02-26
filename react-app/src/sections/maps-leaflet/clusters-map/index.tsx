import { FunctionComponent, memo, useCallback, useState } from "react"
import { Box, Fade } from "@mui/material";
import ClusteredMap from "components/leaflet-maps/cluster-map"
import EmissionsByCluster from "components/emissions/clusters/EmissionsByCluster";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "data/store";
import { clearSelectedCluster } from "data/store/features/coordinates/ClusterSlice";

const selectSelectedCluster = (state: RootState) => state.selectedCluster

const ClusteredMapSection: FunctionComponent = () => {
  const dispatch = useDispatch()
  const [tableCloseVeto, setTableCloseVeto] = useState(false)
  const onAnimationEndListener = useCallback(() => {
    dispatch(clearSelectedCluster())
    setTableCloseVeto(false)
  }, [dispatch, setTableCloseVeto])

  const onTableClose = useCallback(() => setTableCloseVeto(true), [setTableCloseVeto])
  const selectedCluster = useSelector(selectSelectedCluster)
  const thereAreDataPoints = selectedCluster.dataPoints.length > 0

  return (
    <Box style={{ width: '100%', height: '576px', position: "relative" }}>
      <Box style={{
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: "100%",
        height: "100%"
      }}>
        <ClusteredMap />
      </Box>
      <Fade
        in={thereAreDataPoints && !tableCloseVeto}
        timeout={300}
        onExited={onAnimationEndListener}
      >
        <Box style={{
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
          position: "absolute"
        }} zIndex={1100}>
          <EmissionsByCluster
            cluster={selectedCluster}
            onClose={onTableClose}
          />
        </Box>
      </Fade>
    </Box>
  )
}

export default memo(ClusteredMapSection)
