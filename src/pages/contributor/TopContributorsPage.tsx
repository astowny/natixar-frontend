import { useSelector } from "react-redux"
import { NavLink, useParams } from "react-router-dom"
import { ArrowLeftOutlined, RightOutlined } from "@ant-design/icons"
import { Button, Stack, Typography } from "@mui/material"
import MainCard from "components/MainCard"
import {
  selectAlignedIndexes,
  selectVisiblePoints,
} from "data/store/api/EmissionSelectors"
import TopContributorsSection from "sections/contributor/emissions-by-scope/EmissionsByScopeSection"
import Breadcrumb from "../../components/@extended/Breadcrumbs"

const TopContributorsPage = () => {
  const { scopeId: idStr } = useParams()
  const scopeId = parseInt(idStr!, 10)

  const alignedIndexes = useSelector(selectAlignedIndexes)
  const dataPointsForThisCompany = useSelector(selectVisiblePoints)
  console.log("We are here123")

  if (!Number.isFinite(scopeId)) {
    console.log(`Unable to parse category id ${idStr}`)
    return null
  }

  const categoryName = alignedIndexes.categories[scopeId]?.name

  const links = [
    {
      title: "Dashboard",
      to: "/",
    },
    {
      title: `${categoryName ?? "Total "} top contributors`,
      to: "",
    },
  ]

  return (
    <MainCard>
      <Stack gap={4}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
          position="relative"
        >
          <NavLink to="/">
            <Button
              sx={{ color: "primary.contrastText" }}
              variant="contained"
              startIcon={<ArrowLeftOutlined color="primary.contrastText" />}
            >
              Back
            </Button>
          </NavLink>
          <Breadcrumb
            custom
            title={false}
            links={links}
            separator={RightOutlined}
            sx={{
              mb: "0px !important",
              position: "absolute",
              left: "50%",
              transform: "translateX(-50%)",
            }}
          />
        </Stack>
        <Typography variant="h3" fontWeight="bold">
          Top contributors of {categoryName}
        </Typography>
        <TopContributorsSection
          categoryId={scopeId}
          indexes={alignedIndexes}
          dataPoints={dataPointsForThisCompany}
        />
      </Stack>
    </MainCard>
  )
}

export default TopContributorsPage
