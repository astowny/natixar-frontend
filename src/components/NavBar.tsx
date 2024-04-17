import { useCallback, useState } from "react"
import { Box, Slider } from "@mui/material"

import "./navbar.css"

const NavigationBar = () => {
  const minSliderValue = 0
  const maxSliderValue = Number.MAX_SAFE_INTEGER
  const rangesToUse = 12

  const [range, setRange] = useState([0, rangesToUse - 1])
  const delta = (maxSliderValue - minSliderValue) / rangesToUse
  const valueText = useCallback(
    (value: number): string => {
      const timeLabel = new Date(minSliderValue + delta * value)
      return `${timeLabel.toLocaleTimeString()}`
    },
    [minSliderValue, delta],
  )

  const handleTimeRangeChange = (event: Event, newValue: number[]) => {
    event.preventDefault()
    setRange(newValue)
  }

  return (
    <header>
      <div className="container">
        <nav className="top-bar">
          <Box className="dimensions-bar">
            <Slider
              variant="solid"
              getAriaLabel={() => "Time range"}
              // @ts-ignore
              onChange={handleTimeRangeChange}
              valueLabelDisplay="auto"
              getAriaValueText={valueText}
              valueLabelFormat={valueText}
              min={0}
              max={rangesToUse - 1}
              value={range}
              step={1}
              marks
            />
          </Box>
        </nav>
      </div>
    </header>
  )
}

export default NavigationBar
