import { memo } from "react"
import ReactApexChart from "react-apexcharts"

import { getColorByCategory } from "utils/CategoryColors"
import { formatEmissionAmount } from "utils/formatAmounts"
import { ByCountryDataPoint } from "data/store/features/coordinates/Types"
import _ from "lodash"

interface EmissionByCountryProps {
  emissionData: Array<ByCountryDataPoint>
}

const chartOptions = (countries: string[]): ApexCharts.ApexOptions => ({
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
      columnWidth: "30%",
      barHeight: "70%",
      borderRadius: 4,
      horizontal: true,
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
    categories: [...countries.map((country) => _.capitalize(country))],
    labels: {
      formatter(val) {
        return formatEmissionAmount(parseFloat(val))
      },
    },
    title: {
      text: "Emissions",
    },
  },
  yaxis: {},
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

const EmissionByCountry = (props: EmissionByCountryProps) => {
  const { emissionData } = props
  const countriesSet = new Set<string>()
  emissionData.forEach((emissionPoint) => {
    countriesSet.add(emissionPoint.country)
  })
  const countries = Array.from(countriesSet).sort()
  const seriesByCategories: { [id: string]: number[] } = {}
  emissionData.forEach((emissionPoint) => {
    const { country } = emissionPoint
    const categorizedEmissions = emissionPoint.emissionsByCategory
    Object.keys(categorizedEmissions)
      .map((category) => category.toLowerCase())
      .forEach((categoryOfEmission) => {
        let seriesForThatCategory = seriesByCategories[categoryOfEmission]
        if (!seriesForThatCategory) {
          seriesByCategories[categoryOfEmission] = Array(countries.length).fill(
            0,
          )
          seriesForThatCategory = seriesByCategories[categoryOfEmission]
        }
        seriesForThatCategory[countries.indexOf(country)] +=
          categorizedEmissions[categoryOfEmission]
      })
  })

  const series = Object.keys(seriesByCategories).map((category) => ({
    name: category,
    data: seriesByCategories[category],
    color: getColorByCategory(category),
  }))

  return (
    <ReactApexChart
      type="bar"
      options={chartOptions(Array.from(countries))}
      series={series}
      height="100%"
    />
  )
}

export default memo(EmissionByCountry)
