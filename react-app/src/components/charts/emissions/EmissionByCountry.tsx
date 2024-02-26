import { FunctionComponent, memo } from "react";
import ReactApexChart from "react-apexcharts"

import { getColorByCategory } from "utils/CategoryColors";
import { formatAmount, formatEmissionAmount } from "utils/formatAmounts";
import { ByCountryDataPoint } from "data/store/features/coordinates/Types";
import { capitalize } from "@mui/material";

interface EmissionByCountryProps {
    emissionData: Array<ByCountryDataPoint>
}

const chartOptions = (countries: string[]): ApexCharts.ApexOptions => {
    return {
        chart: {
            type: 'bar',
            toolbar: {
                show: false
            },
            zoom: {
                enabled: false
            },
            parentHeightOffset: 0,
        },
        plotOptions: {
            bar: {
                columnWidth: '30%',
                barHeight: '70%',
                borderRadius: 4,
                horizontal: true
            }
        },
        dataLabels: {
            enabled: false
        },
        stroke: {
            show: true,
            width: 8,
            colors: ['transparent']
        },
        xaxis: {
            categories: [...countries.map(country => capitalize(country))],
            labels: {
                formatter(val) {
                    return formatEmissionAmount(parseFloat(val))
                }
            },
            title: {
                text: 'Emissions'
            }
        },
        yaxis: {
        },
        fill: {
            opacity: 1
        },
        legend: {
            show: false
        },
        tooltip: {
            followCursor: true,
            y: {
                formatter(val) {
                    return formatEmissionAmount(val);
                }
            }
        },
        responsive: [
            {
                breakpoint: 600,
                options: {
                    yaxis: {
                        show: false
                    }
                }
            }
        ]
    }
}

const EmissionByCountry: FunctionComponent<EmissionByCountryProps> = ({ emissionData }) => {
    const countriesSet = new Set<string>()
    emissionData.forEach(emissionPoint => {
        countriesSet.add(emissionPoint.country)
    })
    const countries = Array.from(countriesSet).sort()
    const seriesByCategories: { [id: string]: number[] } = {
        "Operation": Array(countries.length).fill(0),
        "Upstream": Array(countries.length).fill(0),
        "Downstream": Array(countries.length).fill(0)
    }
    emissionData.forEach(emissionPoint => {
        const country = emissionPoint.country
        seriesByCategories["Operation"][countries.indexOf(country)] += emissionPoint.operation
        seriesByCategories["Upstream"][countries.indexOf(country)] += emissionPoint.upstream
        seriesByCategories["Downstream"][countries.indexOf(country)] += emissionPoint.downstream
    })

    const series = Object.keys(seriesByCategories)
        .map(category => {
            return {
                name: category,
                data: seriesByCategories[category],
                color: getColorByCategory(category)
            }
        })

    return <ReactApexChart
        type="bar"
        options={chartOptions(Array.from(countries))}
        series={series}
        height="100%"
    />
}

export default memo(EmissionByCountry)