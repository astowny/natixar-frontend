import {
  MONTH_LAYOUT,
  TimeSection,
  TimeWindow,
} from "data/domain/types/time/TimeRelatedTypes"

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

export const getTimeOffsetForSlot = (
  slotNumber: number,
  timeWindow: TimeWindow,
): number => {
  const n = timeWindow.timeStepInSecondsPattern.length
  if (n === 0) {
    return 0
  }
  return timeWindow.timeStepInSecondsPattern[slotNumber % n]
}
