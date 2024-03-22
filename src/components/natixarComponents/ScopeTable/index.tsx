// material-ui
import {
  Box,
  Button,
  Grid,
  LinearProgress,
  Link,
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

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //
export type ScopeTableItemProps = {
  name: string
  amount: number
  categoryID: number
}

export type ScopeTableProps = {
  data: ScopeTableItemProps[]
}

export const ScopeTable = ({ data }: ScopeTableProps) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { setIsShowExtraHeader } = useConfig()
  const params = new URLSearchParams(location.search)
  const scopeID = params.get("scopeID")

  const handleOnCategoryClick = (id: string) => {
    setIsShowExtraHeader(true)
    navigate(`/contributor/category-analysis/${id}?scopeID=${scopeID}`)
  }

  const totalAmount = data.reduce((acc, cur) => acc + cur.amount, 0.0)

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
              <Typography variant="subtitle2">Title</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Value</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Amount</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Actions</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <TableRow hover key={row.categoryID} sx={{ height: "70px" }}>
              <TableCell>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography align="left">
                      <Link
                        onClick={() => handleOnCategoryClick(row.categoryID)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: "5px",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {row.name}
                        <LinkOutlined />
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell>
                <LinearProgress
                  sx={{ width: "100%", backgroundColor: "#F5F5F5" }}
                  variant="determinate"
                  value={(100.0 * row.amount) / totalAmount}
                  color="primary"
                />
              </TableCell>
              <TableCell>
                <Typography>{formatEmissionAmount(row.amount)}</Typography>
              </TableCell>
              <TableCell>
                <Button
                  onClick={() =>
                    navigate(
                      `/contributor/scope-details/${row.categoryID}?scopeID=${scopeID}`,
                    )
                  }
                  variant="contained"
                  size="small"
                  sx={{
                    maxWidth: "25px",
                    height: "25px",
                    color: "#FFF",
                    backgroundColor: "#1890FF",
                    padding: "0px 0px 0px 0px",
                    marginRight: "40px",
                    fontSize: "12px",
                    boxSizing: "border-box",
                  }}
                >
                  Detail
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}
