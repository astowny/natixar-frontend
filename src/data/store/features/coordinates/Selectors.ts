import { RootState } from "data/store"

export const selectGlobalFilter = (state: RootState) =>
  state.coordinates.globalFilter

export const selectAllVisibleCategories = (state: RootState) =>
  state.coordinates.globalFilter.availableValues.categories

export const selectCoordinatesDataSet = (state: RootState) =>
  state.coordinates.wholeDataSet

export const selectVisibleData = (state: RootState) =>
  state.coordinates.visibleFrame.allPoints

export const selectCoordinatesByCompany = (state: RootState) =>
  state.coordinates.visibleFrame.byCompany

export const selectCoordinatesByCountry = (state: RootState) =>
  state.coordinates.visibleFrame.byCountry

export const selectSelectedCluster = (state: RootState) => state.selectedCluster
