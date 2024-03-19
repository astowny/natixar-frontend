import { MONTH_LAYOUT } from "data/domain/types/time/TimeRelatedTypes"

export const timestampToMonth = (timestamp: number): string => {
  const date = new Date(timestamp)
  const monthNumber = date.getMonth() + 1
  let result = MONTH_LAYOUT[monthNumber]
  if (result) {
    result += ` ${date.getFullYear()}`
  }
  return result ?? ""
}

export const timestampToQuarter = (timestamp: number): string => {
  const date = new Date(timestamp)
  const quarterNumber = 1 + Math.ceil(date.getMonth() / 4)
  return `Q${quarterNumber}`
}

export const timestampToYear = (timestamp: number): string =>
  new Date(timestamp).getFullYear().toString()
