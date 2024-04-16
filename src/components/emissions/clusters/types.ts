import {
  DataPoint,
  SelectedCluster,
} from "data/store/features/coordinates/Types"

interface EmissionsByClusterProps {
  cluster: SelectedCluster
  onClose?: Function
}

type DataPointKey = keyof DataPoint

export type { EmissionsByClusterProps }
export type { DataPointKey }
