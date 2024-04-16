import { memo } from "react"
import MainCard from "components/MainCard"
import HeaderWithCategoriesLegend from "components/charts/HeaderWithCategoriesLegend"
import EmissionByCompany from "components/charts/emissions/EmissionByCompany"

import { SxProps } from "@mui/material"

import { useSelector } from "react-redux"
import {
  selectAllVisibleCategories,
  selectCoordinatesByCompany,
} from "data/store/features/coordinates/Selectors"

const ByCompanySection = (props: SxProps) => {
  const { ...sxProps } = props
  const visibleFrame = useSelector(selectCoordinatesByCompany)
  const categories = useSelector(selectAllVisibleCategories)

  return visibleFrame.length <= 0 ? null : (
    <MainCard
      sx={{ ...sxProps }}
      contentSX={{ height: 500 }}
      title={
        <HeaderWithCategoriesLegend
          titleText="Emissions by contributor"
          categories={categories}
        />
      }
    >
      <EmissionByCompany emissionData={visibleFrame} />
    </MainCard>
  )
}

export default memo(ByCompanySection)
