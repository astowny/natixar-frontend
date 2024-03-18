import { CaseReducer, PayloadAction, createSlice } from "@reduxjs/toolkit"
import { SelectedCluster } from "data/store/features/coordinates/Types"
import { EmissionDataPoint } from "../emissions/ranges/EmissionTypes"

const initialState: SelectedCluster = {
  dataPoints: [],
}

const selectClusterPointsReducer: CaseReducer<
  SelectedCluster,
  PayloadAction<Array<EmissionDataPoint>>
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
