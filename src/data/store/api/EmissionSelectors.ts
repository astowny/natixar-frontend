import { RootState } from "data/store"
import {
  EmissionCategory,
  IndexOf,
} from "../features/emissions/ranges/EmissionTypes"

export const selectEmissionFilter = (state: RootState) =>
  state.emissionRanges.emissionFilterState

export const selectTimeWindow = (state: RootState) =>
  state.emissionRanges.overallTimeWindow

export const selectAllVisibleCategories = (
  state: RootState,
): IndexOf<EmissionCategory> => state.emissionRanges.alignedIndexes.categories

export const selectAllVisibleCategoryEras = (state: RootState) => {
  const allCategories = Object.values(selectAllVisibleCategories(state))
  const allCategoryNames: string[] = allCategories
    .map((category) => category.era ?? "")
    .filter((era) => era !== "")
  return [...new Set<string>(allCategoryNames)]
}

export const selectAlignedIndexes = (state: RootState) =>
  state.emissionRanges.alignedIndexes

export const selectVisiblePoints = (state: RootState) =>
  state.emissionRanges.visibleData.emissionPoints

export const selectVisibleEmissionsByCompany = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCompany

export const selectCoordinatesByCountry = (state: RootState) =>
  state.emissionRanges.visibleData.emissionsByCountry

export const selectSelectedCluster = (state: RootState) => state.selectedCluster
