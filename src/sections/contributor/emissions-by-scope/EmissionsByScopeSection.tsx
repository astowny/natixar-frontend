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
  map,
} from "@tidyjs/tidy"
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid"
import { NavLink } from "react-router-dom"
import { Box, Button, LinearProgress, Link } from "@mui/material"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { LinkOutlined } from "@ant-design/icons"

interface TopContributorsSectionParams {
  categoryId: number
  dataPoints: EmissionDataPoint[]
  indexes: AlignedIndexes
}

const HEADER_CSS_CLASS = "common-super-class-name"
const AWESOME_COLUMN: GridColTypeDef = {
  headerClassName: HEADER_CSS_CLASS,
}

const columnDefinitions: GridColDef[] = [
  {
    ...AWESOME_COLUMN,
    field: "name",
    headerName: "Contributor",
    sortable: false,
    hideable: false,
    flex: 1,
    renderCell: (params) => (
      <Link
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "5px",
          textDecoration: "underline",
          cursor: "pointer",
        }}
        href={`/contributors/analysis/${params.row.companyId}`}
      >
        {params.row.company} - {params.row.country}
        <LinkOutlined />
      </Link>
    ),
  },
  {
    ...AWESOME_COLUMN,
    field: "amount",
    headerName: "Total emissions",
    sortable: false,
    hideable: false,
    flex: 3,
    renderCell: (params) => {
      const percentage = (100.0 * params.value[0]) / params.value[1]
      return (
        <Box
          sx={{
            backgroundColor: "#75D048",
            color: "primary.contrastText",
            textAlign: "center",
            width: `${percentage}%`,
          }}
        >
          <Typography>{formatEmissionAmount(params.value[0])}</Typography>
        </Box>
      )
    },
  },
]

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
        groupBy(
          ["companyId", "countryId"],
          [summarize({ total: sum("totalEmissionAmount") })],
        ),
        arrange([desc("total")]),
        map((groupedByCompany) => {
          const { companyId, countryId, total: groupTotal } = groupedByCompany
          const companyName = indexes.entities[companyId]?.name ?? ""
          const countryName = indexes.areas[countryId]?.name ?? ""
          return {
            id: `${companyId}-${countryId}`,
            companyId,
            company: companyName,
            country: countryName,
            amount: [groupTotal, totalEmission],
          }
        }),
      ),
    [relevantDataPoints],
  )

  return (
    <DataGrid
      sx={{
        width: "100%",
        "& .MuiDataGrid-cell": {
          outline: "none !important",
        },
        "& .MuiDataGrid-columnHeader": {
          outline: "none !important",
        },
        "& .Mui-error": {
          backgroundColor: `blue`,
          color: "#ff4343",
        },
        [`& .${HEADER_CSS_CLASS}`]: {
          backgroundColor: "#FAFAFA",
        },
        ...sxProps,
      }}
      rows={dataToDisplay}
      columns={columnDefinitions}
      disableColumnFilter
      disableColumnMenu
      checkboxSelection={false}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
    />
  )
}

export default memo(TopContributorsSection)
