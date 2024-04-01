import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import { useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import TopContributorsSection from "sections/contributor/top-contributors/TopContributorsSection"

export const TopContributorsPage = () => {
  const alignedIndexes = useSelector(selectAlignedIndexes)
  const dataPointsForThisCompany = useSelector(selectVisiblePoints)
  const { scopeId: idStr } = useParams()
  const scopeId = parseInt(idStr!, 10)
  return (
    <TopContributorsSection
      categoryId={scopeId}
      indexes={alignedIndexes}
      dataPoints={dataPointsForThisCompany}
    />
  )
}

export default TopContributorsPage
