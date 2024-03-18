import { Box } from "@mui/material"

import { memo, useEffect, useState } from "react"
import { getColorByCategory } from "utils/CategoryColors"
import { ApexPieChartProps } from "sections/charts/apexchart/ApexDonutChart/interface"
import {
  AlignedIndexes,
  EmissionDataPoint,
} from "data/store/features/emissions/ranges/EmissionTypes"
import ReactApexChart from "react-apexcharts"
import { defaultOptions } from "sections/charts/apexchart/ApexDonutChart/constants"
import { formatEmissionAmount } from "utils/formatAmounts"
import {
  ChartContainerStyles,
  ContainerStyles,
  LegendsContainerStyles,
} from "./styled"
import LabelBox from "./LabelBox"

interface ByCategoryItem {
  categoryId: string
  count: number
  categoryName: string
  categoryColor: string
}

export interface EmissionByCategorySectionProps {
  allDataPoints: EmissionDataPoint[]
  alignedIndexes: AlignedIndexes
}

const EmissionByCategorySection = (props: EmissionByCategorySectionProps) => {
  const { allDataPoints, alignedIndexes } = props
  const [pieChartData, setPieChartData] = useState<ApexPieChartProps>({
    data: [],
    totalLabel: "",
  })

  useEffect(() => {
    let acceptResult = true
    const aggregateData = async () => {
      const categoryAggregators: Record<string, ByCategoryItem> = {}
      Object.entries(alignedIndexes.categories).forEach((entry) => {
        const [categoryId, category] = entry
        const { era } = category
        if (!era) {
          return
        }
        if (!categoryAggregators[era]) {
          categoryAggregators[era] = {
            categoryId,
            count: 0,
            categoryName: era,
            categoryColor: getColorByCategory(era ?? ""),
          }
        }
      })

      allDataPoints.forEach((dataPoint) => {
        let era = dataPoint.categoryEraName
        if (era === "") {
          era = "Other"
        }
        categoryAggregators[era].count += dataPoint.totalEmissionAmount
      })

      if (acceptResult) {
        const byCategoryItems = Object.values(categoryAggregators)

        const newData: ApexPieChartProps = {
          data: byCategoryItems.map((item) => ({
            value: item.count,
            color: item.categoryColor,
            title: item.categoryName,
          })),
          totalLabel: "",
        }
        setPieChartData(newData)
      }
    }

    aggregateData()
    return () => {
      acceptResult = false
    }
  }, [allDataPoints, alignedIndexes, setPieChartData])

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

      <Box sx={LegendsContainerStyles}>
        {pieChartData.data.map((dataItem) => (
          <LabelBox
            legend={{
              title: dataItem.title,
              color: dataItem.color,
              value: formatEmissionAmount(dataItem.value),
              navLink: dataItem.title.toLowerCase(),
            }}
            key={dataItem.title}
          />
        ))}
      </Box>
    </Box>
  )
}

export default memo(EmissionByCategorySection)
