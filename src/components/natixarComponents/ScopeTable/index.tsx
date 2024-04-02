// material-ui
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Link,
  Stack,
  SxProps,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { LinkOutlined } from "@ant-design/icons"
import { NavLink, useLocation, useNavigate } from "react-router-dom"
import useConfig from "hooks/useConfig"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"
import { DataGrid, GridColDef, GridColTypeDef } from "@mui/x-data-grid"

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //
export type ScopeTableItemProps = {
  id: number
  category: EmissionCategory
  description: string
  categoryColor: string
  value: [number, number]
}

export type ScopeTableProps = {
  data: ScopeTableItemProps[]
}

const HEADER_CSS_CLASS = "common-super-class-name"
const AWESOME_COLUMN: GridColTypeDef = {
  headerClassName: HEADER_CSS_CLASS,
}

const columnDefinitions: GridColDef[] = [
  {
    ...AWESOME_COLUMN,
    field: "name",
    headerName: "Title",
    sortable: false,
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
        href={`/contributors/top/scope/${params.row.category.id}`}
      >
        {params.row.name}
        <LinkOutlined />
      </Link>
    ),
  },
  {
    ...AWESOME_COLUMN,
    field: "amount",
    headerName: "Value",
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
    ...AWESOME_COLUMN,
    field: "id",
    headerName: "",
    sortable: false,
    renderCell: (params) => (
      <NavLink to={`/contributors/analysis/${params.row.id}`}>
        <Button sx={{ color: "primary.contrastText" }} variant="contained">
          Detail
        </Button>
      </NavLink>
    ),
  },
]

export const ScopeTable = ({ data, ...sxProps }: ScopeTableProps & SxProps) => {
  const { setIsShowExtraHeader } = useConfig()
  /*
  const handleOnCategoryClick = (id: string) => {
    setIsShowExtraHeader(true)
    navigate(`/contributor/category-analysis/${id}?scopeID=${scopeID}`)
  }
  */

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
      rows={data}
      columns={columnDefinitions}
      disableColumnFilter
      disableColumnMenu
      checkboxSelection={false}
      disableRowSelectionOnClick
      pageSizeOptions={[5, 10, 20]}
    />
  )
}
