import { Box, Drawer } from "@mui/material"

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
  EmissionCategory,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { selectRequestEmissionProtocol } from "data/store/api/EmissionSelectors"
import { memo, useCallback, useMemo, useState } from "react"
import ReactApexChart from "react-apexcharts"
import { useSelector } from "react-redux"
import { defaultOptions } from "sections/charts/apexchart/ApexDonutChart/constants"
import TopContributorsSection from "sections/contributor/top-contributors/TopContributorsSection"
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

const configurableOptions = (
  totalEmission: number,
  scopes: EmissionCategory[],
  onScopeClick: (scope: number) => void,
): ApexOptions => {
  const formattedEmission = formatEmissionAmount(totalEmission).split(" ")
  const scopeIds = scopes.map((scope) => scope.id)

  return {
    chart: {
      events: {
        dataPointSelection: (event, chartContext, config) => {
          const scopeId = scopeIds[config.seriesIndex]
          onScopeClick(scopeId)
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
  const protocol = useSelector(selectRequestEmissionProtocol)
  const [pieChartData, setPieChartData] = useState<ByCategoryItem[]>([])
  const [openTopContributors, setOpenTopContributors] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(0)

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
            ...configurableOptions(totalEmission, scopes, onScopeClick),
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
              navLink: `/contributors/top/${dataItem.categoryId}`,
            }}
          />
        ))}
      </Box>
      <Drawer
        anchor="right"
        open={openTopContributors}
        onClose={() => setOpenTopContributors(false)}
        PaperProps={{
          sx: {
            width: "40dvw",
            maxWidth: "80dvw",
          },
        }}
      >
        <TopContributorsSection
          categoryId={selectedCategory}
          indexes={alignedIndexes}
          dataPoints={allDataPoints}
        />
      </Drawer>
    </Box>
  )
}

export default memo(EmissionByCategorySection)
