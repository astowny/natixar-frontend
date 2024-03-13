import { Stack, Typography } from "@mui/material"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"

import ByCompanySection from "sections/charts/emissions/ByCompanySection"
import ByCountrySection from "sections/charts/emissions/ByCountrySection"
import ClusteredMapSection from "sections/maps-leaflet/clusters-map"

const ContributorDashboardPage = () => {
  useGetEmissionRangesQuery(undefined, {
    pollingInterval: 5000,
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
