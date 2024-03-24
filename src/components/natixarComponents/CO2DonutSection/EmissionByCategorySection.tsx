import { Box, Drawer } from "@mui/material"

import { memo, useCallback, useEffect, useState } from "react"
import { getColorByCategory } from "utils/CategoryColors"
import { ApexPieChartProps } from "sections/charts/apexchart/ApexDonutChart/interface"
import ReactApexChart from "react-apexcharts"
import { defaultOptions } from "sections/charts/apexchart/ApexDonutChart/constants"
import { ApexOptions } from "apexcharts"
import {
  AlignedIndexes,
  EmissionDataPoint,
  EmissionProtocol,
} from "data/domain/types/emissions/EmissionTypes"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import TopContributorsSection from "sections/contributor/top-contributors/TopContributorsSection"
import { selectEmissionRangeRequestParameters } from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
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

const optionsOverrides: ApexOptions = {
  yaxis: {
    labels: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  tooltip: {
    followCursor: true,
    y: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
}

const totalTextOptions = {
  show: true,
  fontSize: "16px",
  color: "#0B0B0B",
  fontWeight: "bold",
}

const configurableOptions = (
  totalEmission: number,
  onScopeClick: (scope: number) => void,
): ApexOptions => {
  const formattedEmission = formatEmissionAmount(totalEmission).split(" ")

  return {
    chart: {
      events: {
        click(event, chartContext, config) {
          console.log("We clicked on: ", event)
          console.log("Context is: ", chartContext)
          console.log("Config is: ", config)
          onScopeClick(1234)
        },
      },
    },
    plotOptions: {
      pie: {
        donut: {
          labels: {
            show: true,
            name: {
              ...totalTextOptions,
            },
            value: {
              ...totalTextOptions,
            },
            total: {
              showAlways: true,
              label: formattedEmission[0],
              ...totalTextOptions,
              // eslint-disable-next-line no-unused-vars
              formatter(w) {
                return formattedEmission[1]
              },
            },
          },
        },
      },
    },
  }
}

const EmissionByCategorySection = ({
  allDataPoints,
  alignedIndexes,
}: EmissionByCategorySectionProps) => {
  const [pieChartData, setPieChartData] = useState<ApexPieChartProps>({
    data: [],
    totalLabel: "",
  })
  const [openTopContributors, setOpenTopContributors] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)

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

  const totalEmission = series.reduce((a, b) => a + b, 0)

  const onScopeClick = useCallback(
    (category: number) => {
      setSelectedCategory(category)
      setOpenTopContributors(true)
    },
    [setSelectedCategory, setOpenTopContributors],
  )

  return (
    <Box sx={ContainerStyles}>
      <Box sx={ChartContainerStyles}>
        <ReactApexChart
          options={{
            ...defaultOptions,
            ...optionsOverrides,
            ...configurableOptions(totalEmission, onScopeClick),
            labels,
            colors,
          }}
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
      <Drawer
        anchor="right"
        open={openTopContributors}
        onClose={() => setOpenTopContributors(false)}
      >
        <Box
          sx={{
            width: "40%",
            maxWidth: "80%",
          }}
        />
        <TopContributorsSection
          sx={{ width: "100%" }}
          categoryId={selectedCategory}
          indexes={alignedIndexes}
          dataPoints={allDataPoints}
        />
      </Drawer>
    </Box>
  )
}

export default memo(EmissionByCategorySection)
