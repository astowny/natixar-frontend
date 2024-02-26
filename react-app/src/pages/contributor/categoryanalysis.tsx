// material-ui
import { Grid, Typography } from "@mui/material"
import { FactoryCard } from "sections/contributor/category-analysis/FactoryCard"
import { CategoryCalcTable } from "components/natixarComponents/CategoryCalcTable"
import MainCard from "components/MainCard"

// table data
const createData = (year: number, methodology: string, amount: number) => ({
  year,
  methodology,
  amount,
})

const rows = [
  createData(2024, "Emission Factors", 63.5),
  createData(2023, "Emission Factors", 32),
  createData(2022, "Emission Factors", 10),
  createData(2021, "Emission Factors", 34),
  createData(2020, "Emission Factors", 76),
  createData(2019, "Emission Factors", 8.4),
]

const CategoryAnalysis = () => {
  return (
    <>
      <Typography variant="h5" sx={{ marginBottom: "30px" }}>
        Category Analysis
      </Typography>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={4}>
          <FactoryCard />
        </Grid>
        <Grid item xs={12} md={8}>
          <MainCard contentSX={{ p: "0 !important" }}>
            <Grid item xs={12} md={12} xl={12}>
              <Typography sx={{ p: "1.7rem" }} variant="h5">
                Calculation Method
              </Typography>
            </Grid>
            <Grid item xs={12} md={12} xl={12}>
              <CategoryCalcTable data={rows} />
            </Grid>
          </MainCard>
        </Grid>
      </Grid>
    </>
  )
}

export default CategoryAnalysis
