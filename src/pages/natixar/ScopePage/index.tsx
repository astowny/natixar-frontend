import { Box, Button, Grid, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"

import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import {
  EmissionCategory,
  EmissionDataPoint,
  EmissionProtocol,
} from "data/domain/types/emissions/EmissionTypes"
import {
  IdTreeNode,
  IndexOf,
} from "data/domain/types/structures/StructuralTypes"
import {
  expandId,
  findNodeBy,
} from "data/domain/transformers/StructuralTransformers"
import { getColorByCategory } from "utils/CategoryColors"
import {
  ScopeTable,
  ScopeTableItemProps,
} from "../../../components/natixarComponents/ScopeTable"
import Breadcrumb from "../../../components/@extended/Breadcrumbs"
import { AreaCheckbox } from "../../../components/natixarComponents/AreaCheckbox"

const ScopePage = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const params = new URLSearchParams(location.search)
  const scopeID = params.get("scopeID")?.toLowerCase() ?? ""

  const { categories, categoryHierarchy } = useSelector(selectAlignedIndexes)
  const allPoints = useSelector(selectVisiblePoints)
  const currentProtocol = EmissionProtocol.BEGES.toLowerCase()
  const protocolNode = findNodeBy(
    (category: EmissionCategory) =>
      category.name.toLowerCase() === currentProtocol,
    categories,
    categoryHierarchy,
  )
  const eraNode = findNodeBy(
    (category) => scopeID === category.era.toLowerCase(),
    categories,
    protocolNode?.children ?? [],
  )

  const links = [
    {
      title: "Scopes",
      to: "/contributor/dashboard",
    },
    {
      title: `Scope ${scopeID} emissions`,
      to: "",
    },
  ]

  // Walk over subcategories.
  const idsToFilterWith: Record<number, number[]> = Object.fromEntries(
    // Collect all their included ids
    (eraNode?.children ?? []).map((subcategoryNode) => [
      subcategoryNode.value,
      expandId([subcategoryNode.value], categoryHierarchy),
    ]),
  )
  const categoryIds: number[] = Object.keys(idsToFilterWith).map((id) =>
    parseInt(id, 10),
  )

  // Then just aggregate data points to different subcategories
  const dataPointsByCategory: Record<number, EmissionDataPoint[]> = {}
  categoryIds.forEach((categoryId) => {
    dataPointsByCategory[categoryId] = []
  })

  allPoints.forEach((emissionPoint) => {
    const matchingCategoryId = categoryIds.find((categoryId) =>
      idsToFilterWith[categoryId].includes(emissionPoint.categoryId),
    )
    if (typeof matchingCategoryId !== "undefined") {
      const pointsForThisCategory = dataPointsByCategory[matchingCategoryId]
      pointsForThisCategory.push(emissionPoint)
    }
  })
  // Then just sum them and send to the scope table

  const rows: ScopeTableItemProps[] = Object.entries(dataPointsByCategory)
    .map((entry) => [
      parseInt(entry[0], 10),
      entry[1].reduce((acc, cur) => acc + cur.totalEmissionAmount, 0),
    ])
    .map((idToEmissionPair) => {
      const [categoryId, emissionAmount] = idToEmissionPair
      const categoryData = categories[categoryId]
      return {
        name: categoryData.name,
        amount: emissionAmount,
        categoryID: categoryId,
      }
    })

  return (
    <MainCard>
      <Grid container rowSpacing={4.5} columnSpacing={3}>
        <Grid item xs={12} md={12} xl={12}>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="center"
            position="relative"
            width="100%"
            padding="10px 0px"
          >
            <Button
              variant="contained"
              sx={{ color: "#FFF", position: "absolute", left: 0, top: 0 }}
              startIcon={<ArrowLeftOutlined color="#FFF" />}
              onClick={() => navigate("/contributor/dashboard")}
            >
              Back to scopes
            </Button>
            <Breadcrumb
              custom
              title={false}
              links={links}
              separator={RightOutlined}
              sx={{
                mb: "0px !important",
              }}
            />
          </Box>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <Typography variant="h5">Detail by Category</Typography>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <ScopeTable data={rows} />
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default ScopePage
