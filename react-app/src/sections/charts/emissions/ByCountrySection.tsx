import { FunctionComponent } from "react";
import Paper from "@mui/material/Paper";
import EmissionByCountry from "components/charts/emissions/EmissionByCountry";

import { ByCompanyDataPoint, ByCountryDataPoint } from "data/store/features/coordinates/Types";
import { useSelector } from "react-redux";
import { RootState } from "data/store";
import MainCard from "components/MainCard";
import HeaderWithCategoriesLegend from "components/charts/HeaderWithCategoriesLegend";

const selectByCompany = (state: RootState) => state.coordinates.visibleFrame.byCountry

const ByCountrySection: FunctionComponent = () => {
    const visibleFrame: ByCountryDataPoint[] = useSelector(selectByCompany)

    return (
        (visibleFrame == null || visibleFrame.length <= 0) ? null :
            <MainCard contentSX={{ height: 500 }} title={<HeaderWithCategoriesLegend titleText="Performance by Country" />}>
                <EmissionByCountry emissionData={visibleFrame} />
            </MainCard>
    )
}

export default ByCountrySection