import { useState } from "react"

// material-ui
import {
  Box,
  Stack,
  Typography,
  List,
  ListItemButton,
  ListItemText,
  SxProps,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"

// project import
import MainCard from "components/MainCard"

// types
import { ThemeMode } from "types/config"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectAllVisibleCategories,
} from "data/store/api/EmissionSelectors"
import { frCategoryMessages } from "data/domain/types/emissions/CategoryDescriptions"
import { getColorByCategory } from "utils/CategoryColors"
import { detectScope } from "data/domain/transformers/DataDetectors"

export const CategoryCard = ({
  categoryId,
  ...sxProps
}: {
  categoryId: number
} & SxProps) => {
  const theme = useTheme()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const indexes = useSelector(selectAlignedIndexes)

  const currentCategory = indexes.categories[categoryId]
  const scope = detectScope(currentCategory, indexes)
  const description = frCategoryMessages[categoryId]

  const handleListItemClick = (index: number) => {
    setSelectedIndex(index)
  }

  return (
    <MainCard sx={{ padding: 0, ...sxProps }}>
      <Stack spacing={6}>
        <Box sx={{ width: "100%" }}>
          <Typography
            sx={{ marginBottom: "15px", fontWeight: 400 }}
            variant="body2"
          >
            {scope && (
              <Box
                sx={{
                  bgcolor: getColorByCategory(scope.era),
                  px: "7px",
                  borderRadius: "3px",
                  width: "fit-content",
                }}
              >
                {scope.name}
              </Box>
            )}
          </Typography>
          <Box sx={{ paddingLeft: "5px" }}>
            <Typography
              sx={{ marginBottom: "15px", fontWeight: 400 }}
              variant="h3"
            >
              {currentCategory.name}
            </Typography>
            {description && (
              <Typography color="secondary">
                Description: {description}
              </Typography>
            )}
          </Box>
        </Box>
        <Box
          sx={{
            width: "100%",
            border: "1px solid",
            borderRadius: 1,
            borderColor:
              theme.palette.mode === ThemeMode.DARK
                ? theme.palette.divider
                : theme.palette.grey.A800,
            textAlign: "center",
          }}
        >
          <Typography sx={{ padding: 0.5 }} color="secondary">
            Total Emissions
          </Typography>
          <Typography sx={{ padding: 0.5, fontWeight: 800 }} variant="h5">
            2749 (t) CO2e
          </Typography>
        </Box>
        <Box>
          <Typography
            sx={{ fontWeight: 500, marginBottom: "20px" }}
            variant="h5"
          >
            Subcategories
          </Typography>
          <List
            component="nav"
            sx={{
              p: 0,
              "& .MuiListItemIcon-root": {
                minWidth: 32,
                color: theme.palette.grey[500],
              },
            }}
          >
            <ListItemButton
              selected={selectedIndex === 0}
              onClick={() => handleListItemClick(0)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 1}
              onClick={() => handleListItemClick(1)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 2}
              onClick={() => handleListItemClick(2)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
            <ListItemButton
              selected={selectedIndex === 3}
              onClick={() => handleListItemClick(3)}
            >
              <ListItemText primary="Road transportation" />
            </ListItemButton>
          </List>
        </Box>
      </Stack>
    </MainCard>
  )
}
