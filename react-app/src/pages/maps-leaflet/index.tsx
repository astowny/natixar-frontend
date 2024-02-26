import { Stack, Typography } from "@mui/material"
import { useGetRandomCoordinatesQuery } from "data/store/features/coordinates/CoordinateClient"

import ByCompanySection from "sections/charts/emissions/ByCompanySection"
import ByCountrySection from "sections/charts/emissions/ByCountrySection"
import ClusteredMapSection from "sections/maps-leaflet/clusters-map"

const ContributorDashboardPage = () => {
  useGetRandomCoordinatesQuery(undefined, {
    pollingInterval: 5000
  })

  return (
    <Stack spacing="22px">
      <Typography variant="h4" gutterBottom>
        Map
      </Typography>
      <ClusteredMapSection />
      <ByCompanySection />
      <ByCountrySection />
    </Stack>
  )
}

export default ContributorDashboardPage
