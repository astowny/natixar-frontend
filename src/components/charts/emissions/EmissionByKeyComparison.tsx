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
        return formatEmissionAmount(Math.abs(val))
      },
    },
  },
  plotOptions: {
    bar: {
      columnWidth: "20%",
      barHeight: "70%",
      // borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  legend: {
    show: false,
  },
  fill: {
    opacity: 1,
  },
  stroke: {
    show: true,
    width: 1,
    colors: ["white"],
  },
  grid: {
    show: true,
    strokeDashArray: 5,
    position: "back",
  },
}

const optionOverrides = (keys: string[]): ApexOptions => ({
  xaxis: {
    categories: [...keys],
  },
})

const produceSeries = (
  dataSet: Record<string, Record<string, number>>,
  categories: string[],
  keys: string[],
) => {
  const byKeyData = Array(categories.length).fill(Array(keys.length).fill(0))

  Object.entries(dataSet).forEach((entry) => {
    const category = entry[0]
    const categoryIndex = categories.indexOf(category)

    Object.entries(entry[1]).forEach((seriesEntry) => {
      const keyIndex = keys.indexOf(seriesEntry[0])
      const data: number[] = byKeyData[categoryIndex]
      const amount = seriesEntry[1]
      data[keyIndex] = amount
    })
  })

  const series = Object.entries(dataSet).map((entry) => {
    const category = entry[0]
    const categoryIndex = categories.indexOf(category)
    return {
      name: category,
      color: getColorByCategory(category),
      data: byKeyData[categoryIndex],
    }
  })
  return series
}

const EmissionByKeyComparison = ({
  dataSetA,
  dataSetB,
  keys,
  ...sxProps
}: {
  dataSetA: Record<string, Record<string, number>>
  dataSetB: Record<string, Record<string, number>>
  keys: string[]
} & SxProps) => {
  const categories = Object.keys(dataSetA)
  const seriesA = produceSeries(dataSetA, categories, keys)
  const seriesB = produceSeries(dataSetB, categories, keys)

  const options = { ...defaultOptions, ...optionOverrides(keys) }
  return (
    <ReactApexChart
      sx={{ sxProps }}
      options={options}
      series={[...seriesA, ...seriesB]}
      height="300px"
      type="bar"
    />
  )
}

export default memo(EmissionByKeyComparison)
