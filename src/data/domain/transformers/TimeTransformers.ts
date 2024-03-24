import {
  MONTH_LAYOUT,
  TimeRange,
  TimeSection,
  TimeWindow,
} from "data/domain/types/time/TimeRelatedTypes"
import { format, subMonths } from "date-fns"

export const timestampToHour = (timestamp: number): string =>
  new Date(timestamp).getHours().toString()

export const timestampToDay = (timestamp: number): string =>
  new Date(timestamp).getDay().toString()

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

export const compareTimeSections = (a: TimeSection, b: TimeSection): number =>
  b.year - a.year || a.name.localeCompare(b.name)

export const fillTimeSections = (
  begin: TimeSection,
  end: TimeSection,
): TimeSection[] => {
  if (begin.scale !== end.scale || compareTimeSections(begin, end) > 0) {
    return []
  }

  const currentTimeSection: TimeSection = { ...begin }
  const result: TimeSection[] = []
  do {
    result.push(currentTimeSection)
  } while (compareTimeSections(currentTimeSection, end) <= 0)
  return result
}

export const getTimeDeltaForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => {
  const n = timeWindow.timeStepInSecondsPattern.length
  if (n === 0) {
    return 0
  }
  return timeWindow.timeStepInSecondsPattern[slotNumber % n] * 1000
}

export const getTimeOffsetForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => {
  let offset = 0
  let curSlot = 0
  while (curSlot < slotNumber) {
    offset += getTimeDeltaForSlot(curSlot, timeWindow)
    curSlot += 1
  }
  return offset
}

export const getTimeRangeFor = (scale: number): TimeRange => {
  const now = new Date().getTime()
  return { start: subMonths(now, Math.abs(scale)).getTime(), end: now }
}

export const getShortDescriptionForTimeRange = (timeRange: TimeRange): string =>
  `${format(timeRange.start, "P")} - ${format(timeRange.end, "P")}`
