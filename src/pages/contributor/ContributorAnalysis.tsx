// material-ui
import { Box, Grid, Typography } from "@mui/material"
import { useParams } from "react-router-dom"
import { FactoryCard } from "sections/contributor/analysis/FactoryCard"
import MainCard from "components/MainCard"
import { Stack } from "@mui/material"
import { useTheme } from "@mui/material/styles"
import EmissionsChart from "sections/contributor/analysis/EmissionsChart"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { detectCompany } from "data/domain/transformers/DataDetectors"
import { filter, sum, summarize, tidy } from "@tidyjs/tidy"
import { useMemo } from "react"
import { expandId } from "data/domain/transformers/StructuralTransformers"

// ==============================|| WIDGET - CHARTS ||============================== //

const yearEmission = [
  "01.2020",
  "01.2021",
  "01.2022",
  "01.2023",
  "01.2024",
  "01.2025",
  "01.2026",
]
const productEmission = [
  "Prod 1",
  "Prod 2",
  "Prod 3",
  "Prod 4",
  "Prod 5",
  "Prod 6",
  "Prod 7",
]

const ContributorAnalysis = () => {
  const theme = useTheme()
  const { id: idStr } = useParams()
  const id = parseInt(idStr!, 10)
  const indexes = useSelector(selectAlignedIndexes)
  const allDataPoints = useSelector(selectVisiblePoints)
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

  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Contributor Analysis
      </Typography>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={4}>
          <FactoryCard
            company={company}
            totalEmissions={totalRelevantEmissions}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Stack spacing={3}>
            <MainCard content={false}>
              <Box sx={{ p: 3, pb: 0 }}>
                <Stack spacing={2}>
                  <Typography variant="h5">Years of data emissions</Typography>
                </Stack>
              </Box>
              <EmissionsChart
                color={theme.palette.primary.main}
                xLabels={yearEmission}
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
        </Grid>
      </Grid>
    </>
  )
}

export default ContributorAnalysis
