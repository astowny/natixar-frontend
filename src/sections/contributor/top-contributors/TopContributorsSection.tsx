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
import { Button } from "@mui/material"

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
    flex: 3,
  },
  {
    field: "amount",
    headerName: "Emission",
    sortable: false,
    flex: 2,
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

  const dataToDisplay = useMemo(
    () =>
      tidy(
        relevantDataPoints,
        groupBy("companyId", [
          summarize({ total: sum("totalEmissionAmount") }),
        ]),
        map((groupedByCompany) => {
          const companyName = indexes.entities[groupedByCompany.companyId].name
          return {
            id: groupedByCompany.companyId,
            name: companyName,
            amount: groupedByCompany.total,
          }
        }),
        arrange([desc("amount"), "name"]),
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
