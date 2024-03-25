import { Box, Button, Grid, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"

import { NavLink, useParams } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectRequestEmissionProtocol,
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
import { useMemo } from "react"
import {
  frCategoryMessages,
  generalCategoryText,
} from "data/domain/types/emissions/CategoryDescriptions"
import {
  ScopeTable,
  ScopeTableItemProps,
} from "../../../components/natixarComponents/ScopeTable"
import Breadcrumb from "../../../components/@extended/Breadcrumbs"
import { AreaCheckbox } from "../../../components/natixarComponents/AreaCheckbox"

const ScopePage = () => {
  const { id: idStr } = useParams()
  const scopeId = parseInt(idStr!, 10)

  const { categories, categoryHierarchy } = useSelector(selectAlignedIndexes)
  const allPoints = useSelector(selectVisiblePoints)

  const currentProtocol = useSelector(selectRequestEmissionProtocol)
  const scopeNode = useMemo(() => {
    // We first select subtree of hierarchy for the protocol we use.
    // Just so we don't have to look over whole category tree
    const protocolNode = findNodeBy(
      (category: EmissionCategory) =>
        category.name.toLowerCase() === currentProtocol,
      categories,
      categoryHierarchy,
    )

    return findNodeBy(
      (category) => scopeId === category.id,
      categories,
      protocolNode?.children ?? [],
    )
  }, [scopeId, currentProtocol, categories, categoryHierarchy])
  const scope = categories[scopeId]

  const links = [
    {
      title: "Home",
      to: "/",
    },
    {
      title: `${scope?.name ?? "Total "} emissions`,
      to: "",
    },
  ]

  // Walk over subcategories.
  const idsToFilterWith: Record<number, number[]> = Object.fromEntries(
    // Collect all their included ids
    (scopeNode?.children ?? []).map((subcategoryNode) => [
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
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-between"
            width="100%"
            padding="10px 0px"
          >
            <NavLink to="/">
              <Button
                sx={{ color: "primary.contrastText" }}
                variant="contained"
                startIcon={<ArrowLeftOutlined color="primary.contrastText" />}
              >
                Details
              </Button>
            </NavLink>
            {/*             
            <Breadcrumb
              custom
              title={false}
              links={links}
              separator={RightOutlined}
              sx={{
                mb: "0px !important",
              }}
            /> */}
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <Stack gap=".5rem">
            <Typography variant="h3">Protocol {currentProtocol}</Typography>
            <Typography variant="h4">
              {`${scope.name} - ${frCategoryMessages[scopeId] ?? ""}`}
            </Typography>
            <Typography variant="h6">{generalCategoryText}</Typography>
          </Stack>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <ScopeTable data={rows} />
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default ScopePage
