import { Box } from "@mui/material"

import ApexDonatChart from "../../../sections/charts/apexchart/ApexDonutChart"
import LabelBox from "./LabelBox"
import {
  ChartContainerStyles,
  ContainerStyles,
  LegendsContainerStyles,
} from "./styled"

const data = [
  {
    value: 44,
    color: "#52C41A",
    title: "Scope 1",
    navLink: "1",
  },
  {
    value: 55,
    color: "#EF8100",
    title: "Scope 2",
    navLink: "2",
  },
  {
    value: 13,
    color: "#0084FF",
    title: "Scope 3",
    navLink: "3",
  },
]

const CO2DonutSection = () => (
  <Box sx={ContainerStyles}>
    <Box sx={ChartContainerStyles}>
      <ApexDonatChart data={data} totalLabel="tCO2e" />
    </Box>

    <Box sx={LegendsContainerStyles}>
      {data.map((legendItem, i) => (
        <LabelBox legend={legendItem} key={i} />
      ))}
    </Box>
  </Box>
)

export default CO2DonutSection
