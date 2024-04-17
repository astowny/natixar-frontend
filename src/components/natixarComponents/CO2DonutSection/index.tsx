import { useState } from "react"
import { Box, Stack, useMediaQuery, useTheme } from "@mui/material"

import ApexDonatChart from "../../../sections/charts/apexchart/ApexDonutChart"
import { ChartContainerStyles, ContainerStyles, } from "./styled"
import { NatixarExpandableRow } from "../ScopeTable/NatixarExpandableRow"

export const scopeColor = [
  "#8ECBF5", // 1
  "#053759", // 2
  "#1DB447", // 3
]
export const scopeTextColor = [
  "#053759", // 1
  "#fff", // 2
  "#fff", // 3
]

const data = [
  {
    value: 44,
    color: scopeColor[0],
    textColor: scopeTextColor[0],
    bgcolor: scopeColor[0],
    title: "Direct Emission",
    navLink: "1",
    active: true,
    rows: [
      { title: 'Subtitle', value: 77, emissionID: '1', },
      { title: 'Scope title 2 ', value: 77, emissionID: '2', },
      { title: 'Scope title 3 ', value: 77, emissionID: '3', },
      { title: 'Scope title 4 ', value: 77, emissionID: '4', },
    ]
  },
  {
    value: 55,
    color: scopeColor[1],
    textColor: scopeTextColor[1],
    bgcolor: scopeColor[1],
    title: "Indirect Emission",
    navLink: "2",
    active: false,
    rows: [
      { title: 'Scope title 1 ', value: 77, emissionID: '1', },
      { title: 'Scope title 2 ', value: 77, emissionID: '2', },
      { title: 'Scope title 3 ', value: 77, emissionID: '3', },
      { title: 'Scope title 4 ', value: 77, emissionID: '4', },
    ]
  },
  {
    value: 13,
    color: scopeColor[2],
    textColor: scopeTextColor[2],
    bgcolor: scopeColor[2],
    title: "Other indirect emissions",
    navLink: "3",
    active: false,
    rows: [
      { title: 'Scope title 1 ', value: 77, emissionID: '1', },
      { title: 'Scope title 2 ', value: 72, emissionID: '2', },
      { title: 'Scope title 3 ', value: 77, emissionID: '3', },
      { title: 'Scope title 4 ', value: 70, emissionID: '4', },
    ]
  },
]

const generateRows = (data) => {
  const generatedRows = data.map((item, index: number) => {
    item.active = index == 0
    return item
  })
  return generatedRows;
}

const CO2DonutSection = () => {
  const [generatedData, setData] = useState(generateRows(data))

  const handleRowClicked = (index: number) => {
    const isOpenItem = generatedData[index].active
    if (isOpenItem) return

    const updatedArray = [...generatedData].map(item => ({ ...item, active: false }));
    updatedArray[index].active = !updatedArray[index].active;
    setData(updatedArray);
  }
  const theme = useTheme()

  const downMD = useMediaQuery(theme.breakpoints.down("md"))

  return (
    <Stack direction={downMD ? 'column' : 'row'}>
      <Box sx={ChartContainerStyles}>
        <ApexDonatChart data={data} totalLabel="tCO2e" />
      </Box>

      <Stack width={'100%'} flexDirection="column" spacing={1}>
        {generatedData && generatedData.map((item, index) => (
          <NatixarExpandableRow
            key={index}
            data={item.rows}
            onRowClicked={handleRowClicked}
            index={index}
            active={item.active}
            textColor={item.textColor}
            bgcolor={item.bgcolor}
            title={item.title}
            value={item.value}
          />
        ))}
      </Stack>
    </Stack>
  )
}

export default CO2DonutSection
