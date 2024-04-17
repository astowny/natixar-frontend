import { useState } from "react"

// material-ui
import { Grid, Typography, Box, Stack, OutlinedInput, useTheme, CSSObject } from "@mui/material"

// project import
import MainCard from "components/MainCard"

import CO2DonutSection from "../../components/natixarComponents/CO2DonutSection"

// assets
import { NatixarChartCard } from "components/natixarComponents/ChartCard/NatixarChartCard"
import AcquisitionChart from "../../sections/dashboard/analytics/AcquisitionChart"
import DateFilter from "../../components/DateFilter"
import { NatixarSectionTitle } from "components/natixarComponents/ChartCard/NatixarSectionTitle"
import { CaretDownOutlined } from "@ant-design/icons"
import { FactoryIcon } from "assets/images/icons/IconComponents/FactoryIcon"
import { PinIcon } from "assets/images/icons/IconComponents/PinIcon"

// ==============================|| WIDGET - CHARTS ||============================== //

enum View {
  SCOPES = 'scopes-emissions',
  EMISSIONS = 'total-emissions'
}

const NatixarChart = () => {
  const [acquisitionSlot, setAcquisitionSlot] = useState("month")
  const [compare, setCompare] = useState(false)

  const [view, setView] = useState('scopes-emissions')

  const title = 'Trend stacked bars CO2'
  const value = "12,900 CO2 (t)"
  const date = "01 Dec - 08 Jan 2022"

  const handleClickView = () => {
    if (view == View.SCOPES) {
      setView(View.EMISSIONS)
    } else {
      setView(View.SCOPES)
    }
  }

  return (
    <Grid container rowSpacing={4.5} columnSpacing={3}>
      {view == View.EMISSIONS && <Grid item xs={12} md={12} xl={12}>
        <DateFilter />
      </Grid>}
      {view == View.SCOPES && (
        <Grid item xs={12} md={12} xl={12}>
          <MainCard sx={{ border: 'none' }}>
            <NatixarSectionTitle>Scope Emissions</NatixarSectionTitle>
            <CO2DonutSection />
          </MainCard>
        </Grid>
      )}
      {view == View.EMISSIONS && (<Grid item xs={12} md={12} lg={12}>
        <NatixarChartCard
          slot={acquisitionSlot}
          setSlot={setAcquisitionSlot}
          compareButton
          compare={compare}
          setCompare={setCompare}
        >
          <MainCard sx={{ boxShadow: '0px 1px 4px rgba(0, 0, 0, 0.25)' }}>
            <Stack direction='row' justifyContent={'space-between'} alignItems={'center'}>
              <Box
                sx={{
                  display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: 'Urbanist', color: 'primary.main'
                }}
              >
                {!compare ? (
                  <Box>
                    <Typography variant="h5">{value}</Typography>
                    <Typography variant="subtitle2" >
                      {date}
                    </Typography>
                  </Box>
                ) : (
                  <Box>
                    <Box
                      sx={{
                        color: "red",
                        display: "flex",
                        columnGap: "5px",
                        alignItems: "center",
                      }}
                    >
                      <CaretDownOutlined />
                      <Typography variant="h5">{value}</Typography>
                      <Typography>(45,67%)</Typography>
                    </Box>
                    <Typography variant="subtitle2" >
                      Compare: {date} to {date}
                    </Typography>
                  </Box>
                )}
              </Box>
              <Typography variant="h3"
                sx={{
                  fontFamily: 'Urbanist',
                  fontStyle: 'normal',
                  fontHeight: 700,
                  fontSize: '24px',
                  lineHeight: '29px',
                  color: '#053759',
                  fontWeight: 'bold',
                }}
              >{title}</Typography>
            </Stack>
            <AcquisitionChart slot={acquisitionSlot} compare={compare} />
          </MainCard>
        </NatixarChartCard>
      </Grid>)}
      <Typography sx={{ marginTop: 6, textDecoration: 'underline', cursor: 'pointer' }}
        onClick={handleClickView}>{
          view == View.SCOPES ? 'See Total Emissions' : "See Scopes"
        }</Typography>
    </Grid>
  )
}

export default NatixarChart
