import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"
import { IndexOf } from "data/domain/types/structures/StructuralTypes"
import { RootState } from "data/store"

export const selectEmissionFilter = (state: RootState) =>
  state.emissionRanges.emissionFilterState

export const selectTimeWindow = (state: RootState) =>
  state.emissionRanges.overallTimeWindow

export const selectEmissionRangeRequestParameters = (state: RootState) =>
  state.emissionRanges.dataRetrievalParameters

export const selectRequestTimeRange = (state: RootState) =>
  selectEmissionRangeRequestParameters(state).timeRangeOfInterest

export const selectRequestEmissionProtocol = (state: RootState) =>
  selectEmissionRangeRequestParameters(state).protocol

export const selectAlignedIndexes = (state: RootState) =>
  state.emissionRanges.alignedIndexes

export const selectAllVisibleCategories = (
  state: RootState,
): IndexOf<EmissionCategory> => selectAlignedIndexes(state).categories

export const selectAllVisibleCategoryEras = (state: RootState) => {
  const allCategories = Object.values(selectAllVisibleCategories(state))
  const allCategoryNames: string[] = allCategories
    .map((category) => category.era ?? "")
    .filter((era) => era !== "")
  return [...new Set<string>(allCategoryNames)]
}

export const selectVisiblePoints = (state: RootState) =>
  state.emissionRanges.visibleData.emissionPoints

export const selectAllPoints = (state: RootState) =>
  state.emissionRanges.allPoints

export const selectVisibleEmissionsByCompany = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCompany

export const selectCoordinatesByCountry = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCountry

export const selectSelectedCluster = (state: RootState) => state.selectedCluster
