import { v4 as uuid } from "uuid"
import { TimeWindow } from "data/domain/types/time/TimeRelatedTypes"
import { CountryLocation } from "data/domain/types/participants/ContributorsTypes"
import {
  AirEmissionMeasureUnits,
  AlignedIndexes,
  CdpLayoutItem,
  CompressedDataPoint,
  EmissionDataPoint,
} from "../types/emissions/EmissionTypes"
import { detectCompany, detectCountry } from "./DataDetectors"
import { getTimeOffsetForSlot } from "./TimeTransformers"

const emptyDecimal = ".0"

const MEASURE_UNIT_GRADATION = 1000

export const formatAmount = (amount: number): string => {
  const addK = amount >= 1000
  let formattedAmount = (addK ? amount / 1000 : amount).toFixed(1)
  if (formattedAmount.endsWith(emptyDecimal)) {
    const index = formattedAmount.lastIndexOf(emptyDecimal)
    formattedAmount = formattedAmount.slice(0, index)
  }
  if (addK) formattedAmount += "k"
  return formattedAmount
}

export const formatEmissionAmount = (kgCO2eqAmount: number): string => {
  // The logic here is basically same for mg, g, kg, tons
  // Or milliseconds, seconds, minutes, hours and so on.
  // It's just the measurement unit are mass of emissions

  let measureUnitIndex = 0
  let amount = kgCO2eqAmount
  const measureUnits = Object.values(AirEmissionMeasureUnits)
  while (
    measureUnitIndex < measureUnits.length - 1 && // while we are in the array
    amount >= MEASURE_UNIT_GRADATION // We can pick a bigger measurement
  ) {
    amount /= MEASURE_UNIT_GRADATION
    measureUnitIndex += 1
  }

  let formattedAmount = amount.toFixed(1)
  if (formattedAmount.endsWith(emptyDecimal)) {
    // Remove .0, because we don't need it
    const index = formattedAmount.lastIndexOf(emptyDecimal)
    formattedAmount = formattedAmount.slice(0, index)
  }

  return `${formattedAmount} ${measureUnits[measureUnitIndex]}`
}

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

const calculateTotalAmount = (
  dataPoint: CompressedDataPoint,
  timeWindow: TimeWindow,
): number => {
  const startTimeSlot = dataPoint[CdpLayoutItem.CDP_LAYOUT_START]
  const endTimeSlot = dataPoint[CdpLayoutItem.CDP_LAYOUT_END]

  let currentTimeSlot = startTimeSlot
  let totalAmount = 0
  do {
    const currentSlotDuration = getTimeOffsetForSlot(
      currentTimeSlot,
      timeWindow,
    )

    let amount =
      dataPoint[CdpLayoutItem.CDP_LAYOUT_INTENSITY] * currentSlotDuration
    switch (currentTimeSlot) {
      case startTimeSlot:
        amount *= dataPoint[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE]
        break
      case endTimeSlot:
        amount *= dataPoint[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE]
        break
      default:
        break
    }

    totalAmount += amount
    currentTimeSlot += 1
  } while (currentTimeSlot <= endTimeSlot)

  return totalAmount
}

export const cdpToEdp = (
  cdp: CompressedDataPoint,
  indexes: AlignedIndexes,
  timeWindow: TimeWindow,
): EmissionDataPoint => {
  const categoryId = cdp[CdpLayoutItem.CDP_LAYOUT_CATEGORY]
  const origEra = indexes.categories[categoryId]?.era
  const entityId = cdp[CdpLayoutItem.CDP_LAYOUT_ENTITY]
  const company = detectCompany(entityId, indexes)

  const geoAreaId = cdp[CdpLayoutItem.CDP_LAYOUT_AREA]
  const geoArea = indexes.areas[geoAreaId]
  const country = detectCountry(geoAreaId, indexes)
  const countryLocation: CountryLocation = {
    lat: country.details?.lat ?? geoArea.details?.lat ?? 0,
    lon: country.details?.long ?? geoArea.details?.long ?? 0,
    country: country.name,
  }

  const totalAmount = calculateTotalAmount(cdp, timeWindow)

  return {
    id: uuid(),
    totalEmissionAmount: totalAmount,
    categoryId,
    categoryEraName: extractNameOfEra(origEra),
    entityId,
    companyId: company.id,
    companyName: company.name,
    geoAreaId,
    countryId: country.id,
    location: countryLocation,

    startTimeSlot: cdp[CdpLayoutItem.CDP_LAYOUT_START],
    startEmissionPercentage: cdp[CdpLayoutItem.CDP_LAYOUT_START_PERCENTAGE],
    endTimeSlot: cdp[CdpLayoutItem.CDP_LAYOUT_END],
    endEmissionPercentage: cdp[CdpLayoutItem.CDP_LAYOUT_END_PERCENTAGE],
    emissionIntensity: cdp[CdpLayoutItem.CDP_LAYOUT_INTENSITY],
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

export const emissionsGroupByTime = (
  points: EmissionDataPoint[],
  timeWindow: TimeWindow,
  timeMeasureKeyFn: (timestamp: number) => string,
): Record<string, Record<string, number>> => {
  const result: Record<string, Record<string, number>> = {}

  points.forEach((emissionPoint) => {
    const categoryEra = emissionPoint.categoryEraName
    if (typeof result[categoryEra] === "undefined") {
      result[categoryEra] = {}
    }
    const byCategory = result[categoryEra]

    let currentTimeSlot = emissionPoint.startTimeSlot
    let totalTimeOffset: number = 0
    do {
      const timeKey = timeMeasureKeyFn(
        timeWindow.startTimestamp + totalTimeOffset,
      )
      const currentSlotOffset = getTimeOffsetForSlot(
        currentTimeSlot,
        timeWindow,
      )

      if (!byCategory[timeKey]) {
        byCategory[timeKey] = 0
      }

      let amount = emissionPoint.emissionIntensity * currentSlotOffset
      switch (currentTimeSlot) {
        case emissionPoint.startTimeSlot:
          amount *= emissionPoint.startEmissionPercentage
          break
        case emissionPoint.endTimeSlot:
          amount *= emissionPoint.endEmissionPercentage
          break
        default:
          break
      }
      byCategory[timeKey] = amount

      totalTimeOffset += getTimeOffsetForSlot(currentTimeSlot, timeWindow)
      currentTimeSlot += 1
    } while (currentTimeSlot <= emissionPoint.endTimeSlot)
  })

  return result
}
