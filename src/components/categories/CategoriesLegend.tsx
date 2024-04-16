import { memo } from "react"
import Stack from "@mui/material/Stack"
import { Box, SxProps, Typography } from "@mui/material"
import { getColorByCategory } from "utils/CategoryColors"
import _ from "lodash"

interface CategoryLabelProps {
  category: string
}

const CategoryBadge = (props: CategoryLabelProps & SxProps) => {
  const { category } = props
  const color = getColorByCategory(category)

  return (
    <Stack direction="row" alignItems="center" spacing="10px">
      <Box
        component="span"
        sx={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          bgcolor: color,
        }}
      />
      <Typography>{category}</Typography>
    </Stack>
  )
}

interface CategoriesLegendProps {
  categories: string[]
}

const CategoriesLegend = (props: CategoriesLegendProps & SxProps) => {
  const { categories, ...sxProps } = props
  const categoryLabels = categories
    .map((category) => _.capitalize(category))
    .map((category) => <CategoryBadge key={category} category={category} />)

  return (
    <Stack
      direction="row"
      alignItems="center"
      spacing="24px"
      sx={{ ...sxProps }}
    >
      {categoryLabels}
    </Stack>
  )
}

export type { CategoriesLegendProps }
export const CategoryLabel = memo(CategoryBadge)
export default memo(CategoriesLegend)
