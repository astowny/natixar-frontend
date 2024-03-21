import { Box, Button, Grid, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"

import { useLocation, useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import { EmissionCategory } from "data/domain/types/emissions/EmissionTypes"
import {
  IdTreeNode,
  IndexOf,
} from "data/domain/types/structures/StructuralTypes"
import { findNodeBy } from "data/domain/transformers/StructuralTransformers"
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
  const currentProtocol = "GHG Protocol".toLowerCase()
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
  const eraData = eraNode ? categories[eraNode?.value] : undefined

  console.log("Scope ID is: ", scopeID)
  console.log("Found this era: ", eraData)

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

  const rows: ScopeTableItemProps[] =
    eraNode?.children.map((childrenNode) => {
      const categoryData = categories[childrenNode.value]
      return {
        name: categoryData.name,
        amount: Math.random() * 1000,
        categoryID: childrenNode.value,
      }
    }) ?? []

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
          <Typography variant="h5">Scope Emissions bar</Typography>
        </Grid>
        <Grid item xs={12} md={12} xl={12}>
          <ScopeTable data={rows} />
        </Grid>
      </Grid>
    </MainCard>
  )
}

export default ScopePage
