import { memo } from "react"

import { getColorByCategory } from "utils/CategoryColors"
import { formatEmissionAmount } from "utils/formatAmounts"
import ReactApexChart from "react-apexcharts"
import { ByCompanyDataPoint } from "data/store/features/coordinates/Types"
import _ from "lodash"

interface EmissionByCompanyProps {
  emissionData: ByCompanyDataPoint[]
}

const chartOptions = (companies: string[]): ApexCharts.ApexOptions => ({
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
    zoom: {
      enabled: false,
    },
    parentHeightOffset: 0,
  },
  plotOptions: {
    bar: {
      columnWidth: "25%",
      barHeight: "70%",
      borderRadius: 4,
    },
  },
  dataLabels: {
    enabled: false,
  },
  stroke: {
    show: true,
    width: 8,
    colors: ["transparent"],
  },
  xaxis: {
    categories: [...companies],
  },
  yaxis: {
    title: {
      text: "Emissions",
    },
    labels: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    show: false,
  },
  tooltip: {
    followCursor: true,
    y: {
      formatter(val) {
        return formatEmissionAmount(val)
      },
    },
  },
  responsive: [
    {
      breakpoint: 600,
      options: {
        yaxis: {
          show: false,
        },
      },
    },
  ],
})

const EmissionByCompany = (props: EmissionByCompanyProps) => {
  const { emissionData } = props
  const companiesSet = new Set<string>()
  emissionData.forEach((emissionPoint) => {
    companiesSet.add(emissionPoint.company)
  })
  const companies = Array.from(companiesSet)

  const seriesByCategories: { [id: string]: number[] } = {}

  emissionData.forEach((emissionPoint) => {
    const { company } = emissionPoint
    const categorizedEmissions = emissionPoint.emissionsByCategory
    Object.keys(categorizedEmissions)
      .map((category) => category.toLowerCase())
      .forEach((categoryOfEmission) => {
        let seriesForThatCategory = seriesByCategories[categoryOfEmission]
        if (!seriesForThatCategory) {
          seriesByCategories[categoryOfEmission] = Array(companies.length).fill(
            0,
          )
          seriesForThatCategory = seriesByCategories[categoryOfEmission]
        }
        seriesForThatCategory[companies.indexOf(company)] +=
          categorizedEmissions[categoryOfEmission]
      })
  })

  const series = Object.keys(seriesByCategories).map((category) => ({
    name: _.capitalize(category),
    data: seriesByCategories[category],
    color: getColorByCategory(category),
  }))

  return (
    <ReactApexChart
      type="bar"
      options={chartOptions(companies)}
      series={series}
      height="100%"
    />
  )
}

export default memo(EmissionByCompany)
