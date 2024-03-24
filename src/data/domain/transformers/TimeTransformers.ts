import {
  TimeRange,
  TimeSection,
  TimeWindow,
} from "data/domain/types/time/TimeRelatedTypes"
import { format, isSameYear, subMonths } from "date-fns"

export const timestampToHour = (timestamp: number): string =>
  format(timestamp, "	p")

export const timestampToDay = (timestamp: number): string =>
  format(timestamp, "PP")

export const timestampToMonth = (timestamp: number): string =>
  format(timestamp, "MMM")

export const timestampToQuarter = (timestamp: number): string =>
  format(timestamp, "QQQ")

export const timestampToYear = (timestamp: number): string =>
  format(timestamp, "yyyy")

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

export const getShortDescriptionForTimeRange = (
  timeRange: TimeRange,
): string => {
  const sameYear = isSameYear(timeRange.start, timeRange.end)
  return `${format(timeRange.start, sameYear ? "MMM d" : "MMM d y")} - ${format(timeRange.end, "MMM d y")}`
}
