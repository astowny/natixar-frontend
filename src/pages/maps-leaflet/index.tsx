import { Stack, Typography } from "@mui/material"
import { useGetEmissionRangesQuery } from "data/store/features/emissions/ranges/EmissionRangesClient"

import ByCompanySection from "sections/charts/emissions/ByCompanySection"
import ByCountrySection from "sections/charts/emissions/ByCountrySection"
import ClusteredMapSection from "sections/maps-leaflet/clusters-map"

const ContributorDashboardPage = () => {
  useGetEmissionRangesQuery(
    {
      protocol: "ghgprotocol",
      scale: "m",
      timeRanges: [
        {
          start: "2023-01-01T00:00:00Z",
          end: "2023-01-02T00:00:00Z",
          scale: "m",
        },
      ],
    },
    {
      pollingInterval: 5000,
    },
  )

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
