import Typography from "@mui/material/Typography"
import { Stack, SxProps } from "@mui/system"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionDataPoint,
} from "data/domain/types/emissions/EmissionTypes"
import { memo, useMemo } from "react"
import {
  tidy,
  filter,
  summarize,
  sum,
  groupBy,
  arrange,
  desc,
  sliceHead,
  map,
} from "@tidyjs/tidy"
import { DataGrid, GridColDef } from "@mui/x-data-grid"
import { NavLink } from "react-router-dom"
import { Button, LinearProgress } from "@mui/material"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"

interface TopContributorsSectionParams {
  categoryId: number
  dataPoints: EmissionDataPoint[]
  indexes: AlignedIndexes
}

const columnDefinitions: GridColDef[] = [
  {
    field: "name",
    headerName: "Contributor",
    sortable: false,
    flex: 2,
  },
  {
    field: "amount",
    headerName: "Emission",
    sortable: false,
    flex: 3,
    renderCell: (params) => (
      <Stack alignItems="start" sx={{ width: "100%" }}>
        <Typography>{formatEmissionAmount(params.value[0])}</Typography>
        <LinearProgress
          sx={{ width: "100%" }}
          variant="determinate"
          value={(100.0 * params.value[0]) / params.value[1]}
        />
      </Stack>
    ),
  },
  {
    field: "id",
    headerName: "",
    sortable: false,
    renderCell: (params) => (
      <NavLink to={`/contributors/analysis/${params.row.id}`}>
        <Button sx={{ color: "primary.contrastText" }} variant="contained">
          Details
        </Button>
      </NavLink>
    ),
  },
]

const maxItemsInTable = 10

const TopContributorsSection = ({
  categoryId,
  dataPoints,
  indexes,
  ...sxProps
}: TopContributorsSectionParams & SxProps) => {
  const allRelevantCategories = useMemo(
    () => expandId([categoryId], indexes.categoryHierarchy),
    [categoryId, indexes.categoryHierarchy],
  )
  const relevantDataPoints = useMemo(
    () =>
      tidy(
        dataPoints,
        filter((edp) => allRelevantCategories.includes(edp.categoryId)),
      ),
    [dataPoints],
  )

  const totalEmission = useMemo(
    () =>
      relevantDataPoints.reduce((acc, cur) => acc + cur.totalEmissionAmount, 0),
    [relevantDataPoints],
  )

  const dataToDisplay = useMemo(
    () =>
      tidy(
        relevantDataPoints,
        groupBy("companyId", [
          summarize({ total: sum("totalEmissionAmount") }),
        ]),
        arrange([desc("total")]),
        map((groupedByCompany) => {
          const { companyId, total: groupTotal } = groupedByCompany
          const companyName = indexes.entities[companyId].name
          return {
            id: companyId,
            name: companyName,
            amount: [groupTotal, totalEmission],
          }
        }),
        sliceHead(maxItemsInTable),
      ),
    [relevantDataPoints],
  )

  return (
    <Stack sx={{ width: "100%", p: "2rem", ...sxProps }}>
      <Typography variant="h3" fontWeight="bold">
        Top contributors
      </Typography>
      <DataGrid
        sx={{
          width: "100%",
          "& .MuiDataGrid-cell": {
            outline: "none !important",
          },
          "& .MuiDataGrid-columnHeader": {
            outline: "none !important",
          },
        }}
        rows={dataToDisplay}
        columns={columnDefinitions}
        disableColumnFilter
        disableColumnMenu
        hideFooterPagination
        checkboxSelection={false}
        disableRowSelectionOnClick
      />
    </Stack>
  )
}

export default memo(TopContributorsSection)
