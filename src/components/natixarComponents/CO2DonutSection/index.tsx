import { Box, Typography } from "@mui/material"

import { memo } from "react"
import { getColorByCategory } from "utils/CategoryColors"
import { ApexPieChartProps } from "sections/charts/apexchart/ApexDonutChart/interface"
import { DataPoint } from "data/store/features/coordinates/Types"
import { AlignedIndexes } from "data/store/features/emissions/ranges/EmissionTypes"
import ReactApexChart from "react-apexcharts"
import { defaultOptions } from "sections/charts/apexchart/ApexDonutChart/constants"
import { color } from "framer-motion"
import {
  ChartContainerStyles,
  ContainerStyles,
  LegendsContainerStyles,
} from "./styled"
import LabelBox from "./LabelBox"

interface ByCategoryItem {
  categoryId: number
  count: number
  categoryName: string
  categoryColor: string
}

export interface EmissionByCategorySectionProps {
  allDataPoints: DataPoint[]
  alignedIndexes: AlignedIndexes
}

const EmissionByCategorySection = (props: EmissionByCategorySectionProps) => {
  const { allDataPoints, alignedIndexes } = props
  // const [pieChartData, setPieChartData] = useState<ApexPieChartProps>({
  // data: [],
  // totalLabel: "",
  // })

  // useEffect(() => {
  // let acceptResult = true
  // const fetchData = async () => {
  console.log("All data points are:", allDataPoints)
  const categoryAggregators: Record<string, ByCategoryItem> = {}
  allDataPoints.forEach((dataPoint) => {
    const { categoryId } = dataPoint
    const category = alignedIndexes.categories[categoryId]
    let { era } = category
    if (!era) {
      era = "Other"
    }
    if (!categoryAggregators[era]) {
      categoryAggregators[era] = {
        categoryId,
        count: 0,
        categoryName: era,
        categoryColor: getColorByCategory(era ?? ""),
      }
    }
    categoryAggregators[era].count += dataPoint.emission_amount
  })

  // if (acceptResult) {
  // setByCategoryItems(Object.values(categoryAggregators))
  const byCategoryItems = Object.values(categoryAggregators)

  const pieChartData: ApexPieChartProps = {
    data: byCategoryItems.map((item) => ({
      value: item.count,
      color: item.categoryColor,
      title: item.categoryName,
    })),
    totalLabel: "",
  }
  // }
  // }

  // fetchData()
  // return () => {
  // acceptResult = false
  // }
  // }, [])

  const series = pieChartData.data.map((a) => a.value)
  const labels = pieChartData.data.map((a) => a.title)
  const colors = pieChartData.data.map((a) => a.color)

  return (
    <Box sx={ContainerStyles}>
      <Box sx={ChartContainerStyles}>
        <ReactApexChart
          options={{ ...defaultOptions, labels, colors }}
          series={series}
          type="donut"
          width={400}
        />
      </Box>
    </Box>
  )
  /*
        <Box sx={LegendsContainerStyles}>
        {data.map((legendItem, i) => (
          <LabelBox legend={legendItem} key={i} />
        ))}
      </Box>
 */
}

export default memo(EmissionByCategorySection)
