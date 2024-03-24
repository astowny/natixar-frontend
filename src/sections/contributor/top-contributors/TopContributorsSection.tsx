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
} from "@tidyjs/tidy"
import { DataGrid, GridColDef } from "@mui/x-data-grid"

interface TopContributorsSectionParams {
  categoryId: number
  dataPoints: EmissionDataPoint[]
  indexes: AlignedIndexes
}

const columnDefinitions: GridColDef[] = [
  {
    field: "companyName",
    headerName: "Contributor",
    width: 90,
    sortable: false,
  },
  {
    field: "total",
    headerName: "Emission",
    width: 150,
    sortable: false,
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
        groupBy("companyName", [
          summarize({ total: sum("totalEmissionAmount") }),
        ]),
        arrange([desc("total"), "companyName"]),
        sliceHead(maxItemsInTable),
      ),
    [relevantDataPoints],
  )

  return (
    <Stack sx={{ height: "100%", p: "1rem", ...sxProps }}>
      <Typography variant="h3" fontWeight="bold">
        Top contributors
      </Typography>
      <DataGrid
        sx={{
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
