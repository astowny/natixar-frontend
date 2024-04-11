import { Box } from "@mui/material"

import { filter, sum, summarize, tidy } from "@tidyjs/tidy"
import { ApexOptions } from "apexcharts"
import {
  extractNameOfEra,
  formatEmissionAmount,
  getScopesOfProtocol,
} from "data/domain/transformers/EmissionTransformers"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { selectRequestEmissionProtocol } from "data/store/api/EmissionSelectors"
import { memo, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useSelector } from "react-redux"
import { getColorByCategory } from "utils/CategoryColors"
import useAsyncWork from "hooks/useAsyncWork"
import LabelBox from "./LabelBox"
import {
  ChartContainerStyles,
  ContainerStyles,
  LegendsContainerStyles,
} from "./styled"

interface ByCategoryItem {
  categoryId: number
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

const configurableOptions = (totalEmission: number): ApexOptions => {
  const formattedEmission = formatEmissionAmount(totalEmission).split(" ")

  return {
    legend: {
      show: false,
    },
    plotOptions: {
      pie: {
        donut: {
          size: "50%",
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
              formatter() {
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
  const protocol = useSelector(selectRequestEmissionProtocol)
  const [pieChartData, setPieChartData] = useState<ByCategoryItem[]>([])

  const scopes = useMemo(
    () => getScopesOfProtocol(protocol, alignedIndexes.categories),
    [protocol, alignedIndexes.categories],
  )

  useAsyncWork(
    () => {
      const categoryAggregators: Record<string, ByCategoryItem> = {}

      scopes.forEach((scope) => {
        const allIdsOfInterest = expandId(
          [scope.id],
          alignedIndexes.categoryHierarchy,
        )
        const total = tidy(
          allDataPoints,
          filter((edp) => allIdsOfInterest.includes(edp.categoryId)),
          summarize({ totalEmission: sum("totalEmissionAmount") }),
        )[0].totalEmission

        const era = extractNameOfEra(scope.era)
        categoryAggregators[era] = {
          categoryId: scope.id,
          count: total,
          categoryName: scope.name,
          categoryColor: getColorByCategory(era),
        }
      })
      return Object.values(categoryAggregators)
    },
    setPieChartData,
    [allDataPoints, alignedIndexes, setPieChartData],
  )

  const series = pieChartData.map((a) => a.count)
  const labels = pieChartData.map((a) => a.categoryName)
  const colors = pieChartData.map((a) => a.categoryColor)

  const totalEmission = series.reduce((a, b) => a + b, 0)

  return (
    <Box sx={ContainerStyles}>
      <Box sx={ChartContainerStyles}>
        <ReactApexChart
          options={{
            ...optionsOverrides,
            ...configurableOptions(totalEmission),
            labels,
            colors,
          }}
          series={series}
          type="donut"
          width={400}
        />
      </Box>

      <Box sx={LegendsContainerStyles}>
        {pieChartData.map((dataItem) => (
          <LabelBox
            key={dataItem.categoryId}
            legend={{
              title: dataItem.categoryName,
              color: dataItem.categoryColor,
              value: formatEmissionAmount(dataItem.count),
              navLink: `/contributors/scope/${dataItem.categoryId}`,
            }}
          />
        ))}
      </Box>
    </Box>
  )
}

export default memo(EmissionByCategorySection)