import { SxProps } from "@mui/system"
import { ApexOptions } from "apexcharts"
import { memo } from "react"
import ReactApexChart from "react-apexcharts"

const defaultOptions: ApexOptions = {
  chart: {
    type: "bar",
    stacked: true,
  },
  xaxis: {
    type: "category",
  },
}

const EmissionByKeyStacked = ({
  groupedData,
  keys,
  ...sxProps
}: {
  groupedData: Record<string, Record<string, number>>
  keys: string[]
} & SxProps) => {
  const options = { ...defaultOptions }
  const series = Object.entries(groupedData).map((entry) => {
    const category = entry[0]
    const data = Object.entries(entry[1]).map((seriesEntry) => ({
      x: seriesEntry[0],
      y: seriesEntry[1],
    }))

    return {
      name: category,
      data,
    }
  })

  return (
    <ReactApexChart
      sx={{ sxProps }}
      options={options}
      series={series}
      type="area"
      height="300px"
    />
  )
}

export default memo(EmissionByKeyStacked)
