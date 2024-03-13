// material-ui
import { memo, useCallback, useEffect, useState } from "react"
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import { CategoryLabel } from "components/categories/CategoriesLegend"
import { useSelector } from "react-redux"
import _ from "lodash"
import {
  clearFilter,
  setSelectedCategories as selectedCategoriesAction,
  setSelectedCompanies as selectedCompaniesAction,
  setSelectedCountries as selectedCountriesAction,
} from "data/store/features/coordinates/CoordinateSlice"
import { selectGlobalFilter } from "data/store/api/Selectors"
import { useAppDispatch } from "data/store"

// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const multiSelectJoiner = (selected: string[]) => selected.sort().join(", ")
const parseSelectedValues = (receivedValues: string | string[]): string[] =>
  receivedValues === "string"
    ? receivedValues.split(",").sort()
    : (receivedValues as string[])

const GlobalFilterMenu = (props: SxProps) => {
  const { ...sxProps } = props
  const dispatch = useAppDispatch()
  const globalFilter = useSelector(selectGlobalFilter)
  const [selectedCompanies, setSelectedCompanies] = useState<string[]>([])
  const [selectedCountries, setSelectedCountries] = useState<string[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  useEffect(() => {
    if (globalFilter.selectedValues.companies.length === 0) {
      setSelectedCompanies([])
    }
    if (globalFilter.selectedValues.countries.length === 0) {
      setSelectedCountries([])
    }
    if (globalFilter.selectedValues.categories.length === 0) {
      setSelectedCategories([])
    }
  }, [globalFilter])
  const onClearClick = useCallback(() => {
    dispatch(clearFilter())
  }, [dispatch, clearFilter])

  const handleCompaniesChange = useCallback(
    (event: SelectChangeEvent<typeof selectedCompanies>) => {
      const {
        target: { value },
      } = event
      const parsedValues = parseSelectedValues(value)
      dispatch(selectedCompaniesAction(parsedValues))
      setSelectedCompanies(parsedValues)
    },
    [
      parseSelectedValues,
      dispatch,
      selectedCompaniesAction,
      setSelectedCompanies,
    ],
  )

  const handleCountriesChange = useCallback(
    (event: SelectChangeEvent<typeof selectedCountries>) => {
      const {
        target: { value },
      } = event
      const parsedValues = parseSelectedValues(value)
      dispatch(selectedCountriesAction(parsedValues))
      setSelectedCountries(parsedValues)
    },
    [
      parseSelectedValues,
      dispatch,
      selectedCountriesAction,
      setSelectedCountries,
    ],
  )

  const handleCategoriesChange = (
    event: SelectChangeEvent<typeof selectedCategories>,
  ) => {
    const {
      target: { value },
    } = event
    const parsedValues = parseSelectedValues(value)
    dispatch(selectedCategoriesAction(parsedValues))
    setSelectedCategories(parsedValues)
  }

  const {
    companies: availableCompanies,
    categories: availableCategories,
    countries: availableCountries,
  } = globalFilter.availableValues

  const weHaveAnyData =
    availableCompanies.length &&
    availableCountries.length &&
    availableCategories.length
  if (!weHaveAnyData) {
    return null
  }

  const companyNodes = availableCompanies.map((company) => (
    <MenuItem key={company} value={company}>
      <Checkbox checked={selectedCompanies.indexOf(company) > -1} />
      <ListItemText primary={company} />
    </MenuItem>
  ))
  const countryNodes = availableCountries.map((country) => (
    <MenuItem key={country} value={country}>
      {country}
    </MenuItem>
  ))
  const categoryNodes = availableCategories
    .map((category) => _.capitalize(category))
    .map((category) => (
      <MenuItem key={category} value={category}>
        <CategoryLabel category={category} />
      </MenuItem>
    ))

  return (
    <Stack
      direction="row"
      alignItems="center"
      gap={2.5}
      sx={{
        width: "100%",
        ml: { xs: 0, md: 1, lg: -1 },
        p: 1,
        ...sxProps,
      }}
    >
      <Typography>Filter</Typography>
      <FormControl sx={{ width: 220 }}>
        <InputLabel>Business Entity / Facility</InputLabel>
        <Select
          value={selectedCompanies}
          renderValue={multiSelectJoiner}
          onChange={handleCompaniesChange}
          multiple
        >
          {companyNodes}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Geographic Area</InputLabel>
        <Select
          value={selectedCountries}
          renderValue={multiSelectJoiner}
          onChange={handleCountriesChange}
          multiple
          sx={{
            "& .MuiList-root": {
              padding: "12px",
            },
          }}
        >
          {countryNodes}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 100 }}>
        <InputLabel>Scope</InputLabel>
        <Select
          value={selectedCategories}
          renderValue={multiSelectJoiner}
          onChange={handleCategoriesChange}
          multiple
        >
          {categoryNodes}
        </Select>
      </FormControl>
      <Button onClick={onClearClick} variant="outlined">
        Clear
      </Button>
    </Stack>
  )
}

export default memo(GlobalFilterMenu)
