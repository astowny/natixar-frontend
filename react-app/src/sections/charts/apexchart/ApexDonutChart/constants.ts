import { Props as ChartProps } from "react-apexcharts"

export const defaultOptions: ChartProps = {
  width: "100%",
  height: "100%",
  minHeight: "100%",
  minWidth: "100%",
  maxHeight: "100%",
  maxWidth: "100%",
  chart: {
    type: "donut",
    width: "100%",
    height: "100%",
    minHeight: "100%",
    minWidth: "100%",
    maxHeight: "100%",
    maxWidth: "100%",
    parentHeightOffset: 0,
  },
  pie: {
    donut: {
      show: false,
      labels: {
        show: false,
        name: {},
      },
    },
  },
  plotOptions: {
    pie: {
      size: "100%",
      width: "100%",
      height: "100%",
      minHeight: "100%",
      minWidth: "100%",
      maxHeight: "100%",
      maxWidth: "100%",
      donut: {
        size: "50%",
        labels: {
          show: true,
          name: {
            show: true,
            offsetY: 9,
          },
          value: {
            show: true,
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            offsetY: -18,
          },
          total: {
            fontSize: "12px",
            fontFamily: "Helvetica, Arial, sans-serif",
            fontWeight: "bold",
            show: true,
            showAlways: true,
          },
        },
      },
    },
  },
  stroke: {
    width: 0,
  },
  dataLabels: {
    enabled: true,
    dropShadow: {
      enabled: false,
    },
    style: {
      fontSize: "12px",
      fontFamily: "Helvetica, Arial, sans-serif",
      fontWeight: "bold",
    },
  },
  legend: {
    show: false,
  },
}