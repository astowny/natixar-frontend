import { RootState } from "data/store"

export const selectEmissionFilter = (state: RootState) =>
  state.emissionRanges.emissionFilterState

export const selectAllVisibleCategories = (state: RootState) =>
  state.emissionRanges.alignedIndexes.categories

export const selectAlignedIndexes = (state: RootState) =>
  state.emissionRanges.alignedIndexes

export const selectVisibleData = (state: RootState) =>
  state.emissionRanges.visiblePoints

/*
export const selectCoordinatesByCompany = (state: RootState) => {
  const visiblePoints = selectVisibleData(state)


  const pointsByCompany: ByCompanyDataPoint = visiblePoints.reduce(
    (accumulator: any, currentPoint: DataPoint) => {
      const currentCompany = currentPoint.company
      if (!accumulator[currentCompany]) {
        accumulator[currentCompany] = {}
      }
      const accumulatorForCompany = accumulator[currentCompany]
      if (!accumulatorForCompany.emissionsByCategory) {
        accumulatorForCompany.emissionsByCategory = {}
      }

      const currCategory = currentPoint.category.toLowerCase()
      if (!accumulatorForCompany.emissionsByCategory[currCategory]) {
        accumulatorForCompany.emissionsByCategory[currCategory] = 0
      }

      accumulatorForCompany.company = currentCompany
      accumulatorForCompany.emissionsByCategory[currCategory] +=
        currentPoint.emission_amount

      return accumulator
    },
    {},
  )
  return pointsByCompany
}

export const selectCoordinatesByCountry = (state: RootState) =>
  state.emissionRanges.visibleFrame.byCountry
*/

export const selectSelectedCluster = (state: RootState) => state.selectedCluster
