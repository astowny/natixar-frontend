// material-ui
import { ChangeEvent, memo, useCallback, useEffect, useState } from "react"
import {
  Button,
  FormControl,
  InputLabel,
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
  // setSelectedCompanies as selectedCompaniesAction,
  // setSelectedCountries as selectedCountriesAction,
} from "data/store/features/coordinates/CoordinateSlice"
import {
  selectAlignedIndexes,
  selectEmissionFilter,
} from "data/store/api/EmissionSelectors"
import { useAppDispatch } from "data/store"
import {
  BusinessEntity,
  GeographicalArea,
  IdTreeNode,
  IndexOf,
} from "data/store/features/emissions/ranges/EmissionTypes"
import { CheckboxItem } from "components/natixarComponents/AreaCheckbox/CheckboxItem"

// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const multiSelectJoiner = (selected: string[]) => selected.sort().join(", ")
const parseSelectedValues = (receivedValues: string | string[]): string[] =>
  receivedValues === "string"
    ? receivedValues.split(",").sort()
    : (receivedValues as string[])

function indexToCheckboxes<T>(
  indexedValues: IndexOf<T>,
  selectedItems: Set<number>,
  nameFunc: (t: T) => string,
  checkCallback: (id: number, selected: boolean) => void,
  indexHierarchy: IdTreeNode[] | undefined,
): JSX.Element[] | null {
  if (!indexHierarchy) {
    return null
  }
  const checkboxes = indexHierarchy.map((treeItem) => {
    const indexId = treeItem.value
    const indexLabel = nameFunc(indexedValues[indexId])
    const onSelectionChange = (event: ChangeEvent<HTMLInputElement>) => {
      checkCallback(indexId, event.target.checked)
    }
    const itemIsSelected = selectedItems.has(indexId)
    const childBoxItems = itemIsSelected
      ? []
      : indexToCheckboxes(
          indexedValues,
          selectedItems,
          nameFunc,
          checkCallback,
          treeItem.children,
        )

    return (
      <CheckboxItem
        key={indexLabel}
        onCheckedListener={onSelectionChange}
        label={indexLabel}
        isSelected={selectedItems.has(indexId)}
      >
        <Stack direction="column" sx={{ pl: "1rem" }}>
          {childBoxItems}
        </Stack>
      </CheckboxItem>
    )
  })
  return checkboxes
}

const areasToCheckboxes = (
  areas: IndexOf<GeographicalArea>,
  selectedAreas: Set<number>,
  treeItems: IdTreeNode[] | undefined,
  checkCallback: (id: number, selected: boolean) => void,
): JSX.Element[] | null =>
  indexToCheckboxes(
    areas,
    selectedAreas,
    (area) => area.name,
    checkCallback,
    treeItems,
  )

const entitiesToCheckboxes = (
  entities: IndexOf<BusinessEntity>,
  selectedEntities: Set<number>,
  treeItems: IdTreeNode[] | undefined,
  checkCallback: (id: number, selected: boolean) => void,
): JSX.Element[] | null =>
  indexToCheckboxes(
    entities,
    selectedEntities,
    (entity) => entity.name,
    checkCallback,
    treeItems,
  )

const GlobalFilterMenu = (props: SxProps) => {
  const { ...sxProps } = props
  const dispatch = useAppDispatch()
  const globalFilter = useSelector(selectEmissionFilter)
  const alignedIndexes = useSelector(selectAlignedIndexes)

  const [selectedBusinessEntities, setSelectedBusinessEntities] = useState<
    Set<number>
  >(new Set())
  const [selectedEntitiesLabel, setSelectedEntitiesLabel] = useState<string[]>(
    [],
  )

  const [selectedAreas, setSelectedAreas] = useState<Set<number>>(new Set())
  const [selectedAreasLabel, setSelectedAreasLabel] = useState<string[]>([])

  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    if (globalFilter.selectedBusinessEntities.length === 0) {
      setSelectedBusinessEntities(new Set())
    }
    if (globalFilter.selectedGeographicalAreas.length === 0) {
      setSelectedAreas(new Set())
    }
    if (globalFilter.selectedCategories.length === 0) {
      setSelectedCategories([])
    }
  }, [globalFilter])
  useEffect(() => {
    const entitiesLabel = Array.from(selectedBusinessEntities)
      .map((id) => alignedIndexes.entities[id].name)
      .toSorted()
    const areasLabel = Array.from(selectedAreas)
      .map((id) => alignedIndexes.areas[id].name)
      .toSorted()
    setSelectedEntitiesLabel(entitiesLabel)
    setSelectedAreasLabel(areasLabel)
  }, [selectedBusinessEntities, selectedAreas])
  const onClearClick = useCallback(() => {
    dispatch(clearFilter())
  }, [dispatch, clearFilter])

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
    entities: availableEntities,
    categories: availableCategories,
    areas: availableAreas,
  } = alignedIndexes

  const weHaveAnyData =
    Object.keys(availableEntities).length &&
    Object.keys(availableAreas).length &&
    Object.keys(availableCategories).length
  if (!weHaveAnyData) {
    return null
  }

  const onEntitySelectionChange = (id: number, selected: boolean) => {
    const newSelections = new Set([...selectedBusinessEntities])
    if (selected) {
      newSelections.add(id)
    } else {
      newSelections.delete(id)
    }
    setSelectedBusinessEntities(newSelections)
  }

  const onAreaSelectionChange = (id: number, selected: boolean) => {
    const newSelections = new Set([...selectedAreas])
    if (selected) {
      newSelections.add(id)
    } else {
      newSelections.delete(id)
    }
    setSelectedAreas(newSelections)
  }

  const areaCheckboxes = areasToCheckboxes(
    alignedIndexes.areas,
    selectedAreas,
    alignedIndexes.areaHierarchy,
    onAreaSelectionChange,
  )
  const entityCheckboxes = entitiesToCheckboxes(
    alignedIndexes.entities,
    selectedBusinessEntities,
    alignedIndexes.entityHierarchy,
    onEntitySelectionChange,
  )
  const categoryNodes = Object.keys(availableCategories)
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
          value={selectedEntitiesLabel}
          renderValue={multiSelectJoiner}
          multiple
        >
          {entityCheckboxes}
        </Select>
      </FormControl>
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Geographic Area</InputLabel>
        <Select
          value={selectedAreasLabel}
          renderValue={multiSelectJoiner}
          multiple
          sx={{
            "& .MuiList-root": {
              padding: "12px",
            },
          }}
        >
          {areaCheckboxes}
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
