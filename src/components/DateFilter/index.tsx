import { useEffect, useState } from "react"
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns"
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider"

import MainCard from "components/MainCard"
import { Box, Typography } from "@mui/material"
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker"
import { StaticDateRangePicker } from "@mui/lab"
import {
  AcceptButton,
  Border,
  DateInputsWrapper,
  DateSlider,
  MainContainer,
  PickersWrapper,
  ScrollComponent,
  SliderWrapper,
  StyledDatePicker,
  Years,
} from "./styled"

const getDateForPeriod = (
  startDate: Date | null,
  endDate: Date | null,
  periodDate: Date,
) => {
  if (
    startDate &&
    startDate.getFullYear() === periodDate.getFullYear() &&
    startDate.getMonth() === periodDate.getMonth()
  ) {
    return { value: startDate, involved: true }
  }
  if (
    endDate &&
    endDate.getFullYear() === periodDate.getFullYear() &&
    endDate.getMonth() === periodDate.getMonth()
  ) {
    return { value: endDate, involved: true }
  }
  return { value: periodDate, involved: false }
}

const getDefaultMonth = (
  datePickerNumber: 1 | 2 | 3 | 4,
  period: number,
  startDate: Date | null,
  endDate: Date | null,
) => {
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  const previousYear2 = previousYear - 1
  const monthIndex = Math.abs(period % 12)
  const currentMonth = monthIndex + datePickerNumber
  const yearsLeftFromPreviousYear2 = Math.floor(
    (period + datePickerNumber - 1) / 12,
  )
  let date
  if (currentMonth === 12) {
    date = new Date(
      `${previousYear2 + yearsLeftFromPreviousYear2}-${currentMonth}-01`,
    )
  } else if (currentMonth > 12) {
    date = new Date(
      `${previousYear2 + yearsLeftFromPreviousYear2}-${Math.abs(currentMonth % 12)}-01`,
    )
  } else {
    date = new Date(
      `${previousYear2 + yearsLeftFromPreviousYear2}-${Math.abs(currentMonth % 12)}-01`,
    )
  }
  return getDateForPeriod(startDate, endDate, date)
}

export default function DateFilter() {
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [endDate, setEndDate] = useState<Date | null>(null)
  const [period, setPeriod] = useState<number>(23)
  const [pickersState, setPickersState] = useState({
    picker1: getDefaultMonth(1, period, startDate, endDate),
    picker2: getDefaultMonth(2, period, startDate, endDate),
    picker3: getDefaultMonth(3, period, startDate, endDate),
    picker4: getDefaultMonth(4, period, startDate, endDate),
  })
  const currentYear = new Date().getFullYear()
  const previousYear = currentYear - 1
  const previousYear2 = previousYear - 1

  const handlePeriodChange = (_: Event, newPeriod: number | number[]) => {
    setPeriod(newPeriod as number)
  }

  useEffect(() => {
    setPickersState({
      picker1: getDefaultMonth(1, period, startDate, endDate),
      picker2: getDefaultMonth(2, period, startDate, endDate),
      picker3: getDefaultMonth(3, period, startDate, endDate),
      picker4: getDefaultMonth(4, period, startDate, endDate),
    })
  }, [period, startDate, endDate])

  const handleDatePick = (date: unknown) => {
    if (startDate && endDate) {
      setStartDate(new Date(date as Date | string))
      setEndDate(null)
    }
    if (startDate && !endDate) {
      if (startDate.valueOf() < new Date(date as Date | string).valueOf()) {
        setEndDate(new Date(date as Date | string))
      } else {
        setStartDate(new Date(date as Date | string))
      }
    }
    if (!startDate && !endDate) {
      setStartDate(new Date(date as Date | string))
    }
  }

  const handleFirstDatePick = (date: Date | null) => {
    setStartDate(date)
  }

  const handleSecondDatePick = (date: Date | null) => {
    setEndDate(date)
  }

  return (
    <MainCard codeHighlight>
      <MainContainer>
        <SliderWrapper>
          <Years>
            <Typography>{previousYear2}</Typography>
            <Typography>{previousYear}</Typography>
            <Typography>{currentYear}</Typography>
          </Years>
          <DateSlider
            value={period}
            onChange={handlePeriodChange}
            min={0}
            max={23}
          />
        </SliderWrapper>
        <ScrollComponent>
          <PickersWrapper>
            <Border />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <StaticDateRangePicker
                defaultValue={[new Date("2022-04-17"), new Date("2022-04-21")]}
              />
              <StyledDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                views={["day"]}
                value={pickersState.picker1.value}
                involved={pickersState.picker1.involved}
                onChange={(value) => handleDatePick(value as Date)}
              />
              <StyledDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                views={["day"]}
                value={pickersState.picker2.value}
                involved={pickersState.picker2.involved}
                onChange={(value) => handleDatePick(value)}
              />
              <StyledDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                views={["day"]}
                value={pickersState.picker3.value}
                involved={pickersState.picker3.involved}
                onChange={(value) => handleDatePick(value)}
              />
              <StyledDatePicker
                displayStaticWrapperAs="desktop"
                openTo="day"
                views={["day"]}
                value={pickersState.picker4.value}
                involved={pickersState.picker4.involved}
                onChange={(value) => handleDatePick(value)}
              />
            </LocalizationProvider>
          </PickersWrapper>
        </ScrollComponent>
        <Box>
          <LocalizationProvider dateAdapter={AdapterDateFns}>
            <DateInputsWrapper>
              <DesktopDatePicker
                format="MM/dd/yyyy"
                value={startDate}
                onChange={handleFirstDatePick}
              />
              <Typography>To</Typography>
              <DesktopDatePicker
                format="MM/dd/yyyy"
                value={endDate}
                onChange={handleSecondDatePick}
              />
              <AcceptButton variant="contained">Accept</AcceptButton>
            </DateInputsWrapper>
          </LocalizationProvider>
        </Box>
      </MainContainer>
    </MainCard>
  )
}
