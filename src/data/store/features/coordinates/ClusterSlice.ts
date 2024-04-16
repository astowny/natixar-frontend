import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit"
import {
  DataPoint,
  SelectedCluster,
} from "data/store/features/coordinates/Types"

const initialState: SelectedCluster = {
  dataPoints: [],
}

const selectClusterPointsReducer: CaseReducer<
  SelectedCluster,
  PayloadAction<Array<DataPoint>>
> = (state, action) => {
  state.dataPoints = action.payload
}

export const selectedClusterSlice = createSlice({
  name: "selectedCluster",
  initialState,
  reducers: {
    selectClusterPoints: selectClusterPointsReducer,
    clearSelectedCluster: (state: SelectedCluster) => {
      state.dataPoints = []
    },
  },
})

export const { selectClusterPoints, clearSelectedCluster } =
  selectedClusterSlice.actions
export default selectedClusterSlice.reducer
