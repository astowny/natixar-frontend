import { EmissionDataPoint } from "../features/emissions/ranges/EmissionTypes"

export const extractNameOfEra = (era: string | undefined) => {
  if (typeof era === "undefined") {
    return ""
  }
  switch (era.toLowerCase()) {
    case "d":
      return "Downstream"
    case "u":
      return "Upstream"
    case "o":
      return "Operation"
    default:
      return era
  }
}

export const dataPointsGroupBySomeIdAndCategory = (
  points: EmissionDataPoint[],
  groupKeyFunc: (dataPoint: EmissionDataPoint) => number,
): Record<string, Record<number, number>> => {
  const result: Record<string, Record<number, number>> = {}
  points.forEach((emissionPoint) => {
    const categoryEra = emissionPoint.categoryEraName
    if (typeof result[categoryEra] === "undefined") {
      result[categoryEra] = {}
    }
    const byCategory = result[categoryEra]

    const groupKey = groupKeyFunc(emissionPoint)
    if (!byCategory[groupKey]) {
      byCategory[groupKey] = 0
    }
    byCategory[groupKey] += emissionPoint.totalEmissionAmount
  })

  return result
}

export const dataPointsGroupByCompanyAndCategory = (
  points: EmissionDataPoint[],
) => dataPointsGroupBySomeIdAndCategory(points, (point) => point.companyId)

export const dataPointsGroupByCountryAndCategory = (
  points: EmissionDataPoint[],
) => dataPointsGroupBySomeIdAndCategory(points, (point) => point.countryId)
