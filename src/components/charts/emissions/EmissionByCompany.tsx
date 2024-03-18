import { memo } from "react"

import { getColorByCategory } from "utils/CategoryColors"
import { formatEmissionAmount } from "utils/formatAmounts"
import ReactApexChart from "react-apexcharts"
import _ from "lodash"
import { AlignedIndexes } from "data/store/features/emissions/ranges/EmissionTypes"
import { detectCompany } from "data/store/api/DataDetectors"

interface EmissionByCompanyProps {
  emissionData: Record<string, Record<number, number>>
  indexes: AlignedIndexes
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

const EmissionByCompany = ({
  emissionData,
  indexes,
}: EmissionByCompanyProps) => {
  const companyMappings: Record<number, number> = {}
  Object.values(emissionData)
    .flatMap((dataForCategory) => Object.keys(dataForCategory))
    .map((entityIdStr) => parseInt(entityIdStr, 10))
    .forEach((entityId) => {
      const company = detectCompany(entityId, indexes)
      companyMappings[entityId] = company.id
    })

  const companyIds = Object.values(companyMappings)
  const companyNames = companyIds.map(
    (companyId) => indexes.entities[companyId].name,
  )

  const seriesByCategories: { [id: string]: number[] } = {}

  Object.keys(emissionData).forEach((categoryEra) => {
    const dataForThisCategory = emissionData[categoryEra]

    const series = Array(companyNames.length).fill(0)

    Object.entries(dataForThisCategory).forEach((entry) => {
      const companyId = parseInt(entry[0], 10)
      const companyIndex = companyIds.indexOf(companyId)
      series[companyIndex] += entry[1]
    })

    seriesByCategories[categoryEra] = series
  })

  const series = Object.keys(seriesByCategories).map((categoryEra) => ({
    name: _.capitalize(categoryEra),
    data: seriesByCategories[categoryEra],
    color: getColorByCategory(categoryEra),
  }))

  return (
    <ReactApexChart
      type="bar"
      options={chartOptions(companyNames)}
      series={series}
      height="100%"
    />
  )
}

export default memo(EmissionByCompany)
