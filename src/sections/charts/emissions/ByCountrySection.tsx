import { memo } from "react"
import { SxProps } from "@mui/material"
import HeaderWithCategoriesLegend from "components/charts/HeaderWithCategoriesLegend"
import EmissionByCountry from "components/charts/emissions/EmissionByCountry"

import { useSelector } from "react-redux"
import MainCard from "components/MainCard"
import {
  selectAllVisibleCategories,
  selectCoordinatesByCountry,
} from "data/store/features/coordinates/Selectors"

const ByCountrySection = (props: SxProps) => {
  const { ...sxProps } = props
  const categories = useSelector(selectAllVisibleCategories)
  const visibleFrame = useSelector(selectCoordinatesByCountry)

  return visibleFrame == null || visibleFrame.length <= 0 ? null : (
    <MainCard
      sx={{ ...sxProps }}
      contentSX={{ height: 500 }}
      title={
        <HeaderWithCategoriesLegend
          categories={categories}
          titleText="Performance by Country"
        />
      }
    >
      <EmissionByCountry emissionData={visibleFrame} />
    </MainCard>
  )
}

export default memo(ByCountrySection)
