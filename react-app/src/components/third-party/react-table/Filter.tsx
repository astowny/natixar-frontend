import { FC } from "react"

// material-ui
import { Stack } from "@mui/material"

// third-party
import {
  Column,
  ColumnDefTemplate,
  HeaderContext,
  RowData,
  Table,
} from "@tanstack/react-table"

// project-import
import { MinusOutlined } from "@ant-design/icons"
import DebouncedInputComponent from "./DebouncedInput"

// assets

type NumberInputProps = {
  columnFilterValue: [number, number]
  getFacetedMinMaxValues: () => [number, number] | undefined
  setFilterValue: (updater: any) => void
}

// ==============================|| FILTER - NUMBER FIELD ||============================== //

const NumberInput: FC<NumberInputProps> = ({
  columnFilterValue,
  getFacetedMinMaxValues,
  setFilterValue,
}) => {
  const minOpt = getFacetedMinMaxValues()?.[0]
  const min = Number(minOpt ?? "")

  const maxOpt = getFacetedMinMaxValues()?.[1]
  const max = Number(maxOpt)

  return (
    <Stack direction="row" spacing={1} alignItems="center">
      <DebouncedInputComponent
        type="number"
        value={columnFilterValue?.[0] ?? ""}
        onFilterChange={(value) =>
          setFilterValue((old: [number, number]) => [value, old?.[1]])
        }
        placeholder={`Min ${minOpt ? `(${min})` : ""}`}
        fullWidth
        inputProps={{ min, max }}
        size="small"
        startAdornment={false}
      />
      <div>
        <MinusOutlined />
      </div>
      <DebouncedInputComponent
        type="number"
        value={columnFilterValue?.[1] ?? ""}
        onFilterChange={(value) =>
          setFilterValue((old: [number, number]) => [old?.[0], value])
        }
        placeholder={`Max ${maxOpt ? `(${max})` : ""}`}
        fullWidth
        inputProps={{ min, max }}
        size="small"
        startAdornment={false}
      />
    </Stack>
  )
}

type TextInputProps = {
  columnId: string
  columnFilterValue: string
  setFilterValue: (updater: any) => void
  header?: ColumnDefTemplate<HeaderContext<any, unknown>>
}

// ==============================|| FILTER - TEXT FIELD ||============================== //

const TextInput: FC<TextInputProps> = ({
  columnId,
  columnFilterValue,
  header,
  setFilterValue,
}) => {
  const dataListId = `${columnId}list`

  return (
    <DebouncedInputComponent
      type="text"
      fullWidth
      value={columnFilterValue ?? ""}
      onFilterChange={(value) => setFilterValue(value)}
      placeholder={`Search ${header}`}
      inputProps={{ list: dataListId }}
      size="small"
      startAdornment={false}
    />
  )
}

type Props<T extends RowData> = {
  column: Column<T, unknown>
  table: Table<T>
}

// ==============================|| FILTER - INPUT ||============================== //

export function Filter<T extends RowData>({ column, table }: Props<T>) {
  const firstValue = table
    .getPreFilteredRowModel()
    .flatRows[0]?.getValue(column.id)

  const columnFilterValue = column.getFilterValue()

  return typeof firstValue === "number" ? (
    <NumberInput
      columnFilterValue={columnFilterValue as [number, number]}
      getFacetedMinMaxValues={column.getFacetedMinMaxValues}
      setFilterValue={column.setFilterValue}
    />
  ) : (
    <TextInput
      columnId={column.id}
      columnFilterValue={columnFilterValue as string}
      setFilterValue={column.setFilterValue}
      header={column.columnDef.header}
    />
  )
}

export default Filter
