import { SxProps } from "@mui/system"
import { ApexOptions } from "apexcharts"
import { memo } from "react"
import ReactApexChart from "react-apexcharts"
import { getColorByCategory } from "utils/CategoryColors"
import { formatEmissionAmount } from "utils/formatAmounts"

const defaultOptions: ApexOptions = {
  chart: {
    type: "bar",
    stacked: true,
  },
  yaxis: {
    title: {
      text: "Emissions",
    },
    labels: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "25%",
      barHeight: "70%",
      // borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  fill: {
    opacity: 1,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ["transparent"],
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    // position: "back",
  },
}

const optionOverrides = (keys: string[]): ApexOptions => ({
  xaxis: {
    categories: [...keys],
  },
})

const EmissionByKeyStacked = ({
  groupedData,
  keys,
  ...sxProps
}: {
  groupedData: Record<string, Record<string, number>>
  keys: string[]
} & SxProps) => {
  const categories = Object.keys(groupedData)
  const byKeyData = Array(categories.length).fill(Array(keys.length).fill(0))

  Object.entries(groupedData).forEach((entry) => {
    const category = entry[0]
    const categoryIndex = categories.indexOf(category)

    Object.entries(entry[1]).forEach((seriesEntry) => {
      const keyIndex = keys.indexOf(seriesEntry[0])
      const data: number[] = byKeyData[categoryIndex]
      const amount = seriesEntry[1]
      data[keyIndex] = amount
    })
  })

  const series: ApexAxisChartSeries = Object.entries(groupedData).map(
    (entry) => {
      const category = entry[0]
      const categoryIndex = categories.indexOf(category)
      return {
        name: category,
        color: getColorByCategory(category),
        data: byKeyData[categoryIndex],
      }
    },
  )

  const options = { ...defaultOptions, ...optionOverrides(keys) }
  return (
    <ReactApexChart
      sx={{ sxProps }}
      options={options}
      series={series}
      height="300px"
      type="bar"
    />
  )
}

export default memo(EmissionByKeyStacked)