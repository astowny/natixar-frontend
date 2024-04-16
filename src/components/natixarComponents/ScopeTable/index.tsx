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

// ===========================|| DATA WIDGET - PROJECT TABLE CARD ||=========================== //
export type ScopeTableItemProps = {
  title: string
  value: number
  emissionID: string
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
            <TableCell sx={{ width: "70px" }} align="left">
              <Typography variant="subtitle2">#</Typography>
            </TableCell>
            <TableCell sx={{ width: "500px" }}>
              <Typography variant="subtitle2">Title</Typography>
            </TableCell>
            <TableCell>
              <Typography variant="subtitle2">Value</Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {data.map((row, index) => (
            <TableRow hover key={index} sx={{ height: "70px" }}>
              <TableCell align="left">{index + 1}</TableCell>
              <TableCell>
                <Grid container alignItems="center">
                  <Grid item>
                    <Typography align="left">
                      <Link
                        onClick={() => handleOnCategoryClick(row.emissionID)}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          columnGap: "5px",
                          textDecoration: "underline",
                          cursor: "pointer",
                        }}
                      >
                        {row.title}
                        <LinkOutlined />
                      </Link>
                    </Typography>
                  </Grid>
                </Grid>
              </TableCell>
              <TableCell
                sx={{
                  display: "flex",
                  alignItems: "center",
                  columnGap: "30px",
                  height: "70px",
                }}
              >
                <Box
                  sx={{
                    width: "100%",
                    display: "flex",
                    alignItems: "center",
                    columnGap: "10px",
                  }}
                >
                  <LinearProgress
                    sx={{ width: "100%", backgroundColor: "#F5F5F5" }}
                    variant="determinate"
                    value={row.value / 1000}
                    color="primary"
                  />
                  <Typography>{row.value / 1000}K</Typography>
                </Box>
                <Button
                  onClick={() =>
                    navigate(
                      `/contributor/scope-details/${row.emissionID}?scopeID=${scopeID}`,
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
