// material-ui
import { memo, useCallback, useEffect, useState } from "react"
import {
  Button,
  CSSObject,
  Checkbox,
  FormControl,
  ListItemText,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  SxProps,
  Typography,
} from "@mui/material"
import BarChartIcon from '@mui/icons-material/BarChart';
import { CategoryLabel } from "components/categories/CategoriesLegend"
import { useSelector } from "react-redux"
import _ from "lodash"
import {
  clearFilter,
  setSelectedCategories as selectedCategoriesAction,
  setSelectedCompanies as selectedCompaniesAction,
  setSelectedCountries as selectedCountriesAction,
} from "data/store/features/coordinates/CoordinateSlice"
import { selectGlobalFilter } from "data/store/features/coordinates/Selectors"
import { useAppDispatch } from "data/store"
import { FactoryIcon } from "assets/images/icons/IconComponents/FactoryIcon"
import { PinIcon } from "assets/images/icons/IconComponents/PinIcon"
import { useTheme } from "@emotion/react"
// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const multiSelectJoiner = (selected: string[]) => selected.sort().join(", ")
const parseSelectedValues = (receivedValues: string | string[]): string[] =>
  receivedValues === "string"
    ? receivedValues.split(",").sort()
    : (receivedValues as string[])

const GlobalFilterMenu = (props: SxProps) => {
  // style
  const StyleInput = (): CSSObject => ({
    background: '#FFFFFF',
    border: '1px solid #053759',
    borderRadius: '24px',
    font: '400 Urbanist',
    'label + &': {
      position: 'relative',
      top: '-3px',
      left: '2px'
    },
  })

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

  let {
    companies: availableCompanies,
    categories: availableCategories,
    countries: availableCountries,
  } = globalFilter.availableValues

  const weHaveAnyData =
    availableCompanies.length &&
    availableCountries.length &&
    availableCategories.length
  if (!weHaveAnyData) {
    // mock data
    availableCompanies = ["ENGIE", "Schneider Electric", "Veolia", "Greenpeace", "WWF"]
    availableCategories = ["Direct emissions", "Emission sources", "Greenhouse gas types",]
    availableCountries = ['France', 'Belgique', 'Luxembourg', 'Suisse', 'Allemagne', 'Royaume-Unis']
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

  const StyleLabel = () => ({
    color: '#053759',
    fontFamily: 'Urbanist',
    fontWeight: 600,
    marginLeft: 2,
    fontSize: '20px',
    lineHeight: '24px',
  })

  const theme = useTheme()

  return (
    <Stack
      direction="row"
      alignItems="flex-end"
      gap={2.5}
      sx={{
        width: "100%",
        ml: { xs: 0, md: 1, lg: -1 },
        p: 1,
        ...sxProps,
      }}
    >
      {/* <Typography sx={StyleLabel}>Filter</Typography> */}
      <FormControl sx={{ width: 240 }}>
        <Typography sx={StyleLabel}>
          <FactoryIcon
            sx={{ position: 'relative', top: 3, marginRight: 1 }}
            customColor={theme.palette.primary.main} />
          Entities
        </Typography>
        <Select
          value={selectedCompanies}
          renderValue={multiSelectJoiner}
          onChange={handleCompaniesChange}
          multiple
          sx={StyleInput}
        >
          {companyNodes}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 190 }}>
        <Typography sx={StyleLabel}>
          <PinIcon
            sx={{ position: 'relative', top: 3, marginRight: 1 }}
            customColor={theme.palette.primary.main} />
          Localisation
        </Typography>
        <Select
          value={selectedCountries}
          renderValue={multiSelectJoiner}
          onChange={handleCountriesChange}
          multiple
          sx={{
            backgroundColor: '#fff',
            "& .MuiList-root": {
              padding: "12px",
            },
            ...StyleInput(),
          }}
        >
          {countryNodes}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 150 }}>
        <Typography sx={StyleLabel}>
          <BarChartIcon
            sx={{ position: 'relative', top: 3, marginRight: 1 }}
            color={theme.palette.primary.main} />
          Scopes
        </Typography>
        <Select
          value={selectedCategories}
          renderValue={multiSelectJoiner}
          onChange={handleCategoriesChange}
          multiple
          sx={StyleInput}
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
