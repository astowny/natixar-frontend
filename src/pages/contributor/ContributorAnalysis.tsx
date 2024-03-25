// material-ui
import { Box, Fade, Grid, SxProps, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { FactoryCard } from "sections/contributor/analysis/FactoryCard"
import MainCard from "components/MainCard"
import { Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import EmissionsChart from "sections/contributor/analysis/EmissionsChart"
import {
  selectAlignedIndexes,
  selectTimeWindow,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { detectCompany } from "data/domain/transformers/DataDetectors"
import { distinct, filter, map, sum, summarize, tidy } from "@tidyjs/tidy"
import { memo, useCallback, useMemo, useState } from "react"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  EmissionCategory,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import EmissionByKeyStacked from "components/charts/emissions/EmissionByKeyStacked"
import ReactApexChart from "react-apexcharts"
import { ApexOptions } from "apexcharts"
import {
  emissionsGroupByTime,
  formatEmissionAmount,
} from "data/domain/transformers/EmissionTransformers"
import { TimeWindow } from "data/domain/types/time/TimeRelatedTypes"
import { timestampToYear } from "data/domain/transformers/TimeTransformers"

// ==============================|| WIDGET - CHARTS ||============================== //

const productEmission = [
  "Prod 1",
  "Prod 2",
  "Prod 3",
  "Prod 4",
  "Prod 5",
  "Prod 6",
  "Prod 7",
]

const byYearChartOptions: ApexOptions = {
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
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ["transparent"],
  },
}

interface ByCategoryProps {
  category: EmissionCategory
  dataPoints: EmissionDataPoint[]
  timeWindow: TimeWindow
}

const EmissionsByScope = memo(
  ({
    category,
    dataPoints,
    timeWindow,
    ...sxProps
  }: ByCategoryProps & SxProps) => {
    const theme = useTheme()

    const groupedByTime = Object.values(
      emissionsGroupByTime(dataPoints, timeWindow, timestampToYear),
    )[0] // We have only one category anyway

    const labels = Object.keys(groupedByTime)
    const series = [
      {
        name: category.name,
        type: "bar",
        data: Object.values(groupedByTime),
      },
    ]

    return (
      <Stack spacing={3} sx={{ ...sxProps }}>
        <MainCard content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Years of data emissions</Typography>
            </Stack>
          </Box>
          <ReactApexChart
            options={{ ...byYearChartOptions, labels }}
            color={theme.palette.primary.main}
            series={series}
            height={365}
          />
        </MainCard>
        <MainCard content={false}>
          <Box sx={{ p: 3, pb: 0 }}>
            <Stack spacing={2}>
              <Typography variant="h5">Emissions by product</Typography>
            </Stack>
          </Box>
          <EmissionsChart color="#ffa940" xLabels={productEmission} />
        </MainCard>
      </Stack>
    )
  },
)

const ContributorAnalysis = () => {
  const { id: idStr } = useParams()
  const id = parseInt(idStr!, 10)
  const indexes = useSelector(selectAlignedIndexes)
  const allDataPoints = useSelector(selectVisiblePoints)
  const timeWindow = useSelector(selectTimeWindow)
  const [selectedScope, setSelectedScope] = useState(0)
  const company = detectCompany(id, indexes)

  const relevantDataPoints = useMemo(() => {
    if (typeof company === "undefined") {
      return []
    }
    const allSubEntities = expandId([company.id], indexes.entityHierarchy)
    return tidy(
      allDataPoints,
      filter((edp) => allSubEntities.includes(edp.entityId)),
    )
  }, [company, allDataPoints, indexes])
  const totalRelevantEmissions = useMemo(
    () =>
      tidy(
        relevantDataPoints,
        summarize({ total: sum("totalEmissionAmount") }),
      )[0].total,
    [relevantDataPoints],
  )
  const relevantEmissionCategories = useMemo(
    () =>
      tidy(
        relevantDataPoints,
        map((edp) => ({
          category: edp.categoryId,
        })),
        distinct(["category"]),
      ).map((item) => item.category),
    [relevantDataPoints],
  )

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Contributor Analysis
      </Typography>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={4}>
          <FactoryCard
            indexes={indexes}
            company={company}
            totalEmissions={totalRelevantEmissions}
            categories={relevantEmissionCategories}
            onCategoryClick={setSelectedScope}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          {selectedScope > 0 && (
            <EmissionsByScope
              category={indexes.categories[selectedScope]!!}
              dataPoints={relevantDataPoints}
              timeWindow={timeWindow}
            />
          )}
        </Grid>
      </Grid>
    </>
  )
}

export default ContributorAnalysis
