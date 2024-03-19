import {
  BusinessEntity,
  GeographicalArea,
} from "data/domain/types/participants/ContributorsTypes"
import { AlignedIndexes } from "../types/emissions/EmissionTypes"

export const detectCompany = (
  entityId: number,
  indexes: AlignedIndexes,
): BusinessEntity => {
  let entity = indexes.entities[entityId]
  while (
    entity.parent &&
    indexes.entities[entity.parent] &&
    entity.type !== "Company"
  ) {
    entity = indexes.entities[entity.parent]
  }
  return entity
}

export const TOP_ORDER_AREAS = ["World region", "Continent", "Country"]
export const detectCountry = (
  geoAreaId: number,
  indexes: AlignedIndexes,
): GeographicalArea => {
  let area = indexes.areas[geoAreaId]
  while (
    area.parent &&
    indexes.areas[area.parent] &&
    !TOP_ORDER_AREAS.includes(area.type)
  ) {
    area = indexes.areas[area.parent]
  }
  return area
}
