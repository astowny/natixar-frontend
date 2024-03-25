// material-ui
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Link,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material"
import { LinkOutlined } from "@ant-design/icons"
import { useLocation, useNavigate } from "react-router-dom"
import useConfig from "hooks/useConfig"
import { formatEmissionAmount } from "data/domain/transformers/EmissionTransformers"
import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //
export type ScopeTableItemProps = {
  category: EmissionCategory
  description: string
  categoryColor: string
  amount: number
}

export type ScopeTableProps = {
  data: ScopeTableItemProps[]
}

export const ScopeTable = ({ data }: ScopeTableProps) => {
  const { setIsShowExtraHeader } = useConfig()
  /*
  const handleOnCategoryClick = (id: string) => {
    setIsShowExtraHeader(true)
    navigate(`/contributor/category-analysis/${id}?scopeID=${scopeID}`)
  }
  */

  const totalAmount = data.reduce((acc, cur) => acc + cur.amount, 0.0)
  const thereAreDataPoints = data.find((row) => row.amount > 0)

  return (
    <TableContainer
      sx={{ border: "1px solid", borderColor: "#e6ebf1", borderRadius: "4px" }}
    >
      <Table>
        <TableHead
          sx={{
            border: "none",
            borderBottom: "1px solid",
            borderColor: "#e6ebf1",
          }}
        >
          <TableRow sx={{ height: "70px" }}>
            <TableCell sx={{ width: "500px" }}>
              <Typography variant="subtitle2">Category</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Description</Typography>
            </TableCell>
            {thereAreDataPoints && (
              <TableCell>
                <Typography variant="subtitle2">Value</Typography>
              </TableCell>
            )}
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow hover key={row.category.id} sx={{ height: "70px" }}>
              <TableCell>
                <Typography align="left">{row.category.name}</Typography>
              </TableCell>
              <TableCell>
                <Typography align="left">{row.description}</Typography>
              </TableCell>
              {thereAreDataPoints && (
                <TableCell>
                  {row.amount <= 0 ? null : (
                    <Stack direction="row">
                      <LinearProgress
                        sx={{ width: "100%", color: row.categoryColor }}
                        variant="determinate"
                        value={(100.0 * row.amount) / totalAmount}
                      />
                      <Typography>
                        {formatEmissionAmount(row.amount)}
                      </Typography>
                    </Stack>
                  )}
                </TableCell>
              )}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
