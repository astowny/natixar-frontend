import { memo, useCallback, useState } from "react"
import { Box, Card, Fade, SxProps } from "@mui/material"
import ClusteredMap from "components/leaflet-maps/cluster-map"
import CategoriesLegend from "components/categories/CategoriesLegend"
import EmissionsByCluster from "components/emissions/clusters/EmissionsByCluster"

import { useSelector } from "react-redux"
import { clearSelectedCluster } from "data/store/features/coordinates/ClusterSlice"
import {
  selectAllVisibleCategories,
  selectSelectedCluster,
} from "data/store/features/coordinates/Selectors"
import { useAppDispatch } from "data/store"

const ClusteredMapSection = (props: SxProps) => {
  const { ...sxProps } = props
  const dispatch = useAppDispatch()
  const [tableCloseVeto, setTableCloseVeto] = useState(false)
  const onAnimationEndListener = useCallback(() => {
    dispatch(clearSelectedCluster())
    setTableCloseVeto(false)
  }, [dispatch, setTableCloseVeto])

  const onTableClose = useCallback(
    () => setTableCloseVeto(true),
    [setTableCloseVeto],
  )
  const selectedCluster = useSelector(selectSelectedCluster)
  let categories = useSelector(selectAllVisibleCategories)

  if (categories.length > 0) {
    // We deconstruct here, because redux has immutable values
    categories = [...categories, "cluster"]
  }

  const thereAreDataPoints = selectedCluster.dataPoints.length > 0

  return (
    <Box
      sx={{
        width: "100%",
        height: "576px",
        position: "relative",
        ...sxProps,
      }}
    >
      <Box
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <ClusteredMap />
        <Fade in={categories.length > 0} timeout={300}>
          <Card
            sx={{
              zIndex: 1100,
              position: "absolute",
              bottom: "40px",
              left: "50%",
              transform: "translateX(-50%)",
              px: "15px",
              py: "10px",
              borderRadius: "10px",
            }}
            elevation={5}
          >
            <CategoriesLegend categories={categories} />
          </Card>
        </Fade>
      </Box>
      <Fade
        in={thereAreDataPoints && !tableCloseVeto}
        timeout={300}
        onExited={onAnimationEndListener}
      >
        <Box
          style={{
            top: 0,
            bottom: 0,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
          zIndex={1101}
        >
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
