// material-ui
import {
  ChangeEvent,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react"
import {
  Button,
  ButtonGroup,
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
  selectAlignedIndexes as indexesSelector,
  selectEmissionFilter as filterStateSelector,
} from "data/store/api/EmissionSelectors"
import { useAppDispatch } from "data/store"
import {
  BusinessEntity,
  EmissionFilterState,
  GeographicalArea,
  IdTreeNode,
  IndexOf,
} from "data/store/features/emissions/ranges/EmissionTypes"
import { CheckboxItem } from "components/natixarComponents/AreaCheckbox/CheckboxItem"
import {
  clearFilterSelection as clearFilterAction,
  updateFilterSelection as updateFilterAction,
} from "data/store/features/emissions/ranges/EmissionRangesSlice"

// import { DateRangePicker, SingleInputDateRangeField } from '@mui/x-date-pickers-pro';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const multiSelectJoiner = (selected: string[]) => selected.sort().join(", ")
const parseSelectedValues = (receivedValues: string | string[]): string[] =>
  receivedValues === "string"
    ? receivedValues.split(",").sort()
    : (receivedValues as string[])

function indexToCheckboxes<T>(
  indexedValues: IndexOf<T>,
  selectedItems: number[],
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
    const itemIsSelected = selectedItems.includes(indexId)
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
        isSelected={selectedItems.includes(indexId)}
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
  selectedAreas: number[],
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
  selectedEntities: number[],
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

const AreaControlForm = memo(
  ({
    selectedAreaLabels,
    allAreas,
    selectedAreas,
    areaHierarchy,
    checkCallback,
  }: {
    selectedAreaLabels: string[]
    allAreas: IndexOf<GeographicalArea>
    selectedAreas: number[]
    areaHierarchy: IdTreeNode[] | undefined
    checkCallback: (id: number, selected: boolean) => void
  }) => {
    const areaCheckboxes = areasToCheckboxes(
      allAreas,
      selectedAreas,
      areaHierarchy,
      checkCallback,
    )

    return (
      <FormControl sx={{ width: 160 }}>
        <InputLabel>Geographic Area</InputLabel>
        <Select
          value={selectedAreaLabels}
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
    )
  },
)

const GlobalFilterMenu = ({ ...sxProps }: SxProps) => {
  const dispatch = useAppDispatch()
  const alignedIndexes = useSelector(indexesSelector)
  const globalFilter = useSelector(filterStateSelector)

  const [selectedBusinessEntities, setSelectedBusinessEntities] = useState<
    number[]
  >([])
  const [selectedAreas, setSelectedAreas] = useState<number[]>([])
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])

  useEffect(() => {
    setSelectedBusinessEntities(globalFilter.selectedBusinessEntities)
  }, [setSelectedBusinessEntities, globalFilter.selectedBusinessEntities])

  useEffect(() => {
    setSelectedAreas(globalFilter.selectedGeographicalAreas)
  }, [setSelectedAreas, globalFilter.selectedGeographicalAreas])

  useEffect(() => {
    setSelectedCategories(globalFilter.selectedCategories)
  }, [setSelectedCategories, globalFilter.selectedCategories])

  const entityLabel = useMemo(
    () =>
      selectedBusinessEntities
        .map((id) => alignedIndexes.entities[id].name)
        .toSorted(),
    [selectedBusinessEntities],
  )

  const areaLabel = useMemo(
    () => selectedAreas.map((id) => alignedIndexes.areas[id].name).toSorted(),
    [selectedAreas],
  )

  const onClearClick = useCallback(() => {
    dispatch(clearFilterAction())
  }, [dispatch, clearFilterAction])

  const onApplyClick = useCallback(() => {
    const newFilter: EmissionFilterState = {
      selectedBusinessEntities: [...selectedBusinessEntities],
      selectedGeographicalAreas: [...selectedAreas],
      selectedCategories: [...selectedCategories],
    }
    dispatch(updateFilterAction(newFilter))
  }, [
    dispatch,
    updateFilterAction,
    selectedBusinessEntities,
    selectedAreas,
    selectedCategories,
  ])

  const onAreaSelectionChange = useCallback(
    (id: number, selected: boolean) => {
      let newSelections: number[]
      if (selected) {
        newSelections = [...selectedAreas, id]
      } else {
        newSelections = selectedAreas.filter((areaId) => areaId !== id)
      }
      setSelectedAreas(newSelections)
    },
    [selectedAreas, setSelectedAreas],
  )

  const onEntitySelectionChange = useCallback(
    (id: number, selected: boolean) => {
      let newSelections: number[]
      if (selected) {
        newSelections = [...selectedBusinessEntities, id]
      } else {
        newSelections = selectedBusinessEntities.filter(
          (entityId) => entityId !== id,
        )
      }
      setSelectedBusinessEntities(newSelections)
    },
    [selectedBusinessEntities],
  )

  const onCategoriesSelectionChange = useCallback(
    (event: SelectChangeEvent<typeof selectedCategories>) => {
      const {
        target: { value },
      } = event
      const parsedValues = parseSelectedValues(value)
      setSelectedCategories(parsedValues)
    },
    [setSelectedCategories],
  )

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
        <Select value={entityLabel} renderValue={multiSelectJoiner} multiple>
          {entityCheckboxes}
        </Select>
      </FormControl>

      <AreaControlForm
        selectedAreaLabels={areaLabel}
        allAreas={availableAreas}
        areaHierarchy={alignedIndexes.areaHierarchy}
        selectedAreas={selectedAreas}
        checkCallback={onAreaSelectionChange}
      />

      <FormControl sx={{ width: 100 }}>
        <InputLabel>Scope</InputLabel>
        <Select
          value={selectedCategories}
          renderValue={multiSelectJoiner}
          onChange={onCategoriesSelectionChange}
          multiple
        >
          {categoryNodes}
        </Select>
      </FormControl>
      <ButtonGroup disableElevation variant="contained">
        <Button
          sx={{
            color: "primary.contrastText",
          }}
          onClick={onApplyClick}
        >
          Apply
        </Button>
        <Button onClick={onClearClick} variant="outlined">
          Clear
        </Button>
      </ButtonGroup>
    </Stack>
  )
}

export default memo(GlobalFilterMenu)
