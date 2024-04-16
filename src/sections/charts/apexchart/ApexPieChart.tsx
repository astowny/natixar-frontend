import { useEffect, useState } from "react"

// material-ui
import { useTheme } from "@mui/material/styles"
import { Box, IconButton, Typography } from "@mui/material"

// third-party
import ReactApexChart, { Props as ChartProps } from "react-apexcharts"

// project import
import useConfig from "hooks/useConfig"

// types
import { ThemeMode } from "types/config"
import { ArrowRightOutlined } from "@ant-design/icons"

// chart options
const pieChartOptions = {
  chart: {
    type: "donut",
    width: 600,
    height: 600,
  },
  labels: ["Scope 1", "Scope 2", "Scope 3"],
  legend: {
    show: false,
    fontFamily: `'Roboto', sans-serif`,
    offsetX: 10,
    offsetY: 10,
    labels: {
      useSeriesColors: false,
    },
    markers: {
      width: 12,
      height: 12,
      radius: 5,
    },
    itemMargin: {
      horizontal: 25,
      vertical: 4,
    },
  },
  responsive: [
    {
      breakpoint: 450,
      chart: {
        width: 280,
        height: 280,
      },
      options: {
        legend: {
          show: false,
          position: "bottom",
        },
      },
    },
  ],
}

// ==============================|| APEXCHART - PIE ||============================== //

const ApexPieChart = () => {
  const theme = useTheme()
  const { mode } = useConfig()

  const { primary } = theme.palette.text
  const line = theme.palette.divider
  const grey200 = theme.palette.grey[200]
  const backColor = theme.palette.background.paper

  const [series] = useState([44, 55, 13])
  const [options, setOptions] = useState<ChartProps>(pieChartOptions)

  const secondary = theme.palette.primary[700]
  const primaryMain = theme.palette.primary.main
  const successDark = theme.palette.success.main
  const error = theme.palette.error.main
  const orangeDark = theme.palette.warning.main

  const natixarGreen = "#52C41A"
  const natixarOrange = "#EF8100"
  const natixarBlue = "#0000FF"

  const legend = [
    {
      title: "Scope 1",
      color: "#52C41A",
      bg: "#cbefb7",
    },
    {
      title: "Scope 2",
      color: "#EF8100",
      bg: "#efd2b2",
    },
    {
      title: "Scope 3",
      color: "#0084FF",
      bg: "#8fcaff",
    },
  ]

  useEffect(() => {
    setOptions((prevState) => ({
      ...prevState,
      colors: [natixarGreen, natixarOrange, natixarBlue],
      xaxis: {
        labels: {
          style: {
            colors: [
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
              primary,
            ],
          },
        },
      },
      yaxis: {
        labels: {
          style: {
            colors: [primary],
          },
        },
      },
      grid: {
        borderColor: line,
      },
      legend: {
        labels: {
          colors: "grey.500",
        },
      },
      stroke: {
        colors: [backColor],
      },
      theme: {
        mode: mode === ThemeMode.DARK ? "dark" : "light",
      },
    }))
  }, [
    mode,
    primary,
    line,
    grey200,
    backColor,
    secondary,
    primaryMain,
    successDark,
    error,
    orangeDark,
    natixarGreen,
  ])

  return (
    <Box id="chart" sx={{ bgcolor: "transparent", display: "flex" }}>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ReactApexChart options={options} series={series} type="donut" />
      </Box>

      <Box sx={{ width: "35%" }}>
        {legend.map((legendItem) => (
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              columnGap: "5px",
              alignItems: "flex-start",
              height: "33%",
              backgroundColor: `${legendItem.bg}`,
              borderLeft: `1px solid ${legendItem.color}`,
              padding: "20px",
              gap: "20px",
              justifyContent: "flex-start",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <Box
                sx={{
                  width: "10px",
                  height: "10px",
                  backgroundColor: `${legendItem.color}`,
                  borderRadius: "50%",
                }}
              />
              <Typography variant="h6">{legendItem.title}</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                columnGap: "5px",
                alignItems: "center",
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                32425
              </Typography>
              <Typography variant="h6">tCO2e</Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-end",
                alignItems: "end",
                marginTop: "20px",
                width: "100%",
              }}
            >
              <IconButton sx={{ borderRadius: "100%", background: "#E6F7FF" }}>
                <ArrowRightOutlined />
              </IconButton>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  )
}

export default ApexPieChart
