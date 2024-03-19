import { memo } from "react"
import ReactApexChart from "react-apexcharts"

import { getColorByCategory } from "utils/CategoryColors"
import { formatEmissionAmount } from "utils/formatAmounts"
import _ from "lodash"
import { detectCountry } from "data/store/api/DataDetectors"
import { AlignedIndexes } from "data/store/features/emissions/ranges/EmissionTypes"

interface EmissionByCountryProps {
  emissionData: Record<string, Record<number, number>>
  indexes: AlignedIndexes
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

const EmissionByCountry = ({
  emissionData,
  indexes,
}: EmissionByCountryProps) => {
  // Area ID -> Country ID
  const countryMappings: Record<number, number> = {}
  Object.values(emissionData)
    .flatMap((dataForCategory) => Object.keys(dataForCategory))
    .map((geoAreaIdStr) => parseInt(geoAreaIdStr, 10))
    .forEach((geoAreaId) => {
      const country = detectCountry(geoAreaId, indexes)
      countryMappings[geoAreaId] = country.id
    })

  const countryIds = Object.values(countryMappings)
  const countryNames = countryIds.map(
    (countryId) => indexes.areas[countryId].name,
  )

  const seriesByCategories: { [id: string]: number[] } = {}

  Object.keys(emissionData).forEach((categoryEra) => {
    const dataForThisCategory = emissionData[categoryEra]

    const series = Array(countryNames.length).fill(0)

    Object.entries(dataForThisCategory).forEach((entry) => {
      const countryId = parseInt(entry[0], 10)
      const countryIndex = countryIds.indexOf(countryId)
      series[countryIndex] += entry[1]
    })

    seriesByCategories[categoryEra] = series
  })

  const series = Object.keys(seriesByCategories).map((category) => ({
    name: category,
    data: seriesByCategories[category],
    color: getColorByCategory(category),
  }))

  return (
    <ReactApexChart
      type="bar"
      options={chartOptions(countryNames)}
      series={series}
      height="100%"
    />
  )
}

export default memo(EmissionByCountry)
