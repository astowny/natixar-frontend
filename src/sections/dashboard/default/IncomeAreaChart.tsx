import { useState, useEffect } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"

// third-party
import ReactApexChart, { Props as ChartProps } from "react-apexcharts"

// project import
import useConfig from "hooks/useConfig"

// chart options
const areaChartOptions = {
  chart: {
    height: 450,
    type: "area",
    toolbar: {
      show: false,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    curve: "straight",
    width: 0,
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    position: "back",
  },
}

// ==============================|| INCOME AREA CHART ||============================== //

interface Props {
  slot: string
}

const IncomeAreaChart = ({ slot }: Props) => {
  const theme = useTheme()
  const { mode } = useConfig()

  const { primary, secondary } = theme.palette.text
  const line = theme.palette.divider

  const [options, setOptions] = useState<ChartProps>(areaChartOptions)

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: ["#80D977", "#FFA06A", "#8474E9"],
      fill: {
        type: "solid",
      },
      xaxis: {
        categories:
          slot === "month"
            ? [
                "Jan",
                "Feb",
                "Mar",
                "Apr",
                "May",
                "Jun",
                "Jul",
                "Aug",
                "Sep",
                "Oct",
                "Nov",
                "Dec",
              ]
            : ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        labels: {
          style: {
            colors: [
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
              secondary,
            ],
          },
        },
        axisBorder: {
          show: true,
          color: line,
        },
        tickAmount: slot === "month" ? 11 : 7,
      },
      yaxis: {
        labels: {
          style: {
            colors: [secondary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
    }))
  }, [mode, primary, secondary, line, theme, slot])

  const [series, setSeries] = useState([
    {
      name: "Scope-1",
      data: [0, 86, 28, 115, 48, 210, 136],
    },
    {
      name: "Scope-2",
      data: [0, 43, 14, 56, 24, 105, 68],
    },
    {
      name: "Scope-3",
      data: [0, 23, 69, 20, 11, 143, 80],
    },
  ])

  useEffect(() => {
    setSeries([
      {
        name: "Scope 1",
        data:
          slot === "month"
            ? [76, 85, 101, 98, 87, 105, 91, 114, 94, 86, 115, 35]
            : [31, 40, 28, 51, 42, 109, 100],
      },
      {
        name: "Scope 2",
        data:
          slot === "month"
            ? [110, 60, 150, 35, 60, 36, 26, 45, 65, 52, 53, 41]
            : [11, 32, 45, 32, 34, 52, 41],
      },
      {
        name: "Scope 3",
        data:
          slot === "month"
            ? [23, 20, 201, 24, 57, 21, 45, 22, 75, 45, 49, 42]
            : [8, 40, 38, 46, 32, 49, 56],
      },
    ])
  }, [slot])

  return (
    <ReactApexChart
      options={options}
      series={series}
      type="area"
      height={450}
    />
  )
}

export default IncomeAreaChart
