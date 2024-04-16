import { useCallback, useEffect, useRef } from "react"
import { useSelector } from "react-redux"

import L from "leaflet"
import MarkerClusterGroup from "react-leaflet-cluster"

import MapMarker from "components/third-party/map/MapMarker"

// import 'leaflet/dist/leaflet.css'
import "./map-style.css"

import { useAppDispatch } from "data/store"
import { formatAmount } from "utils/formatAmounts"
import { selectClusterPoints } from "data/store/features/coordinates/ClusterSlice"
import { selectVisibleData } from "data/store/features/coordinates/Selectors"

const customIcon = new L.Icon({
  iconUrl: MapMarker,
  iconSize: new L.Point(40, 47),
})

const MIN_EMISSION = 2
const MAX_EMISSION = 200
const MIN_ICON_SIZE = 40
const MAX_ICON_SIZE = 130
const CLUSTER_RADIUS = MAX_ICON_SIZE * 1.75

const sizeByValue = (value) => {
  const clampedValue = Math.min(Math.max(value, MIN_EMISSION), MAX_EMISSION)

  const ratio = (clampedValue - MIN_EMISSION) / (MAX_EMISSION - MIN_EMISSION)
  const newSize = MIN_ICON_SIZE + ratio * (MAX_ICON_SIZE - MIN_ICON_SIZE)
  return Math.min(Math.max(newSize, MIN_ICON_SIZE), MAX_ICON_SIZE)
}

const createClusterCustomIcon = (cluster) => {
  // https://github.com/Leaflet/Leaflet.markercluster/blob/master/src/MarkerClusterGroup.js#L821
  const childCount = cluster.getChildCount()

  let category = "cluster"
  if (childCount > 0) {
    const childMarkers = cluster.getAllChildMarkers()
    category = childMarkers[0].options.dataPoint.category
    const thereIsOtherCategory = childMarkers.some(
      (marker) => category !== marker.options.dataPoint.category,
    )
    if (thereIsOtherCategory) {
      category = "cluster"
    }
  }
  category = category.toLowerCase()

  const amountLabel = formatAmount(childCount)

  const size = sizeByValue(childCount)
  const iconClass = `marker-cluster-category-${category}`

  return L.divIcon({
    html: `<div class="marker-cluster-icon"><span>${amountLabel}</span></div>`,
    className: `cluster-icon-container ${iconClass}`,
    iconSize: L.point(size, size, true),
  })
}

const ClusterByCategoryLayer = () => {
  const clusterGroupRef = useRef()
  const dispatch = useAppDispatch()
  const dataPoints = useSelector(selectVisibleData)

  const onClusterClick = useCallback(
    (e) => {
      const childMarkers = e.layer.getAllChildMarkers()
      // eslint-disable-next-line @typescript-eslint/no-shadow
      const dataPoints = childMarkers.map(
        (cluster) => cluster.options.dataPoint,
      )
      dispatch(selectClusterPoints(dataPoints))
    },
    [dispatch, dataPoints],
  )

  useEffect(() => {
    let acceptTransformation = true

    const retrieveMarkers = async () => {
      const markers = dataPoints.map((dataPoint) => {
        const address = dataPoint.location
        const marker = L.marker(new L.LatLng(address.lat, address.lon), {
          key: dataPoint.id,
          title: dataPoint.country,
          icon: customIcon,
          dataPoint,
        })
        return marker
      })

      if (acceptTransformation) {
        const clusterGr = clusterGroupRef.current
        clusterGr.clearLayers()
        clusterGr.addLayers(markers)
      }
    }

    retrieveMarkers()

    return () => {
      acceptTransformation = false
    }
  }, [dataPoints])

  return (
    <MarkerClusterGroup
      chunkedLoading
      singleMarkerMode
      iconCreateFunction={createClusterCustomIcon}
      maxClusterRadius={CLUSTER_RADIUS}
      zoomToBoundsOnClick={false}
      onClick={onClusterClick}
      onClusterClick={onClusterClick}
      ref={clusterGroupRef}
    />
  )
}

export default ClusterByCategoryLayer
