import { FunctionComponent, memo } from "react"
import { Stack, Typography } from "@mui/material"
import CategoriesLegend from "components/categories/CategoriesLegend"

interface HeaderProps {
    titleText: string
}

const HeaderWithCategoriesLegend: FunctionComponent<HeaderProps> = ({ titleText }) => {
    return <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
    >
        <Typography variant="h4">{titleText}</Typography>
        <CategoriesLegend />
    </Stack>
}

export default HeaderWithCategoriesLegend