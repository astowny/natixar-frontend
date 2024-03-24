import Typography from "@mui/material/Typography"
import { Stack, SxProps } from "@mui/system"
import { expandId } from "data/domain/transformers/StructuralTransformers"
import {
  AlignedIndexes,
  EmissionDataPoint,
  EmissionProtocol,
} from "data/domain/types/emissions/EmissionTypes"
import { memo } from "react"

interface TopContributorsSectionParams {
  categoryId: number
  dataPoints: EmissionDataPoint[]
  indexes: AlignedIndexes
}

const TopContributorsSection = ({
  categoryId,
  dataPoints,
  indexes,
  ...sxProps
}: TopContributorsSectionParams & SxProps) => {
  const allRelevantCategories = expandId(
    [categoryId],
    indexes.categoryHierarchy,
  )
  const relevantDataPoints = dataPoints.filter((dataPoint) =>
    allRelevantCategories.includes(dataPoint.categoryId),
  )

  return (
    <Stack sx={{ ...sxProps }}>
      <Typography variant="h3" fontWeight="bold">
        Top contributors
      </Typography>
      {categoryId}
    </Stack>
  )
}

export default memo(TopContributorsSection)
