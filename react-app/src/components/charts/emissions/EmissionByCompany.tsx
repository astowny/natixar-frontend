import { FunctionComponent, memo } from "react";

import { getColorByCategory } from "utils/CategoryColors";
import { formatAmount, formatEmissionAmount } from "utils/formatAmounts";
import ReactApexChart from "react-apexcharts";
import { ByCompanyDataPoint } from "data/store/features/coordinates/Types";

interface EmissionByCompanyProps {
    emissionData: ByCompanyDataPoint[]
}

const chartOptions = (companies: string[]): ApexCharts.ApexOptions => {
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
                columnWidth: '25%',
                barHeight: '70%',
                borderRadius: 4
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
            categories: [...companies]
        },
        yaxis: {
            title: {
                text: 'Emissions'
            },
            labels: {
                formatter(val) {
                    return formatEmissionAmount(val)
                }
            }
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

const valueFormatter = (value: number) => `${value}mm`;

const EmissionByCompany: FunctionComponent<EmissionByCompanyProps> = ({ emissionData }) => {
    const companiesSet = new Set<string>()
    emissionData.forEach(emissionPoint => {
        companiesSet.add(emissionPoint.company)
    })
    const companies = Array.from(companiesSet)

    const seriesByCategories: { [id: string]: (number)[] } = {
        "Operation": Array(companies.length).fill(0),
        "Upstream": Array(companies.length).fill(0),
        "Downstream": Array(companies.length).fill(0)
    }

    emissionData.forEach(emissionPoint => {
        const company = emissionPoint.company
        seriesByCategories["Operation"][companies.indexOf(company)] += emissionPoint.operation
        seriesByCategories["Upstream"][companies.indexOf(company)] += emissionPoint.upstream
        seriesByCategories["Downstream"][companies.indexOf(company)] += emissionPoint.downstream
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
        options={chartOptions(companies)}
        series={series}
        height="100%"
    />
}

export default memo(EmissionByCompany)