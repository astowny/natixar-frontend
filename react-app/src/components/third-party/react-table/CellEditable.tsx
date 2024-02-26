import { useEffect, useState } from "react"

// material-ui
import {
  Chip,
  MenuItem,
  Select,
  Slider,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material"

// third-party
import * as yup from "yup"
import { Formik, Form } from "formik"
import { Row, RowData, Table } from "@tanstack/react-table"

// project-imports
import IconButton from "components/@extended/IconButton"
import LinearWithLabel from "components/@extended/progress/LinearWithLabel"

// assets
import { CheckOutlined } from "@ant-design/icons"

type CellEditProps<T extends RowData> = {
  getValue: () => any
  row: Row<T>
  column: any
  table: Table<T>
}

// ==============================|| EDITABLE CELL ||============================== //

const CellEditable = <T extends RowData>({
  getValue: initialValue,
  row: { index },
  column: { id, columnDef },
  table,
}: CellEditProps<T>) => {
  const [value, setValue] = useState(initialValue)
  const [showSelect, setShowSelect] = useState(false)

  const onChange = (e: any) => {
    setValue(e.target?.value)
  }

  const onBlur = () => {
    table.options.meta?.updateData(index, id, value)
  }

  useEffect(() => {
    setValue(initialValue)
  }, [initialValue])

  let element
  let userInfoSchema
  switch (id) {
    case "email":
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .string()
          .email("Enter valid email ")
          .required("Email is a required field"),
      })
      break
    case "age":
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .number()
          .typeError("Age must be number")
          .required("Age is required")
          .min(18, "You must be at least 18 years")
          .max(65, "You must be at most 65 years"),
      })
      break
    case "visits":
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .number()
          .typeError("Visits must be number")
          .required("Required"),
      })
      break
    default:
      userInfoSchema = yup.object().shape({
        userInfo: yup
          .string()
          .min(2, "Too Short!")
          .max(50, "Too Long!")
          .required("Name is Required"),
      })
      break
  }

  switch (columnDef.dataType) {
    case "text":
      element = (
        <Formik
          initialValues={{
            userInfo: value,
          }}
          enableReinitialize
          validationSchema={userInfoSchema}
          onSubmit={() => {}}
        >
          {({ values, handleChange, handleBlur, errors, touched }) => (
            <Form>
              <TextField
                fullWidth
                value={values.userInfo}
                id={`${index}-${id}`}
                name="userInfo"
                onChange={(e) => {
                  handleChange(e)
                  onChange(e)
                }}
                onBlur={handleBlur}
                error={touched.userInfo && Boolean(errors.userInfo)}
                helperText={
                  touched.userInfo &&
                  errors.userInfo &&
                  (errors.userInfo as string)
                }
                sx={{
                  "& .MuiOutlinedInput-input": {
                    py: 0.75,
                    px: 1,
                    minWidth: { xs: 100 },
                  },
                  "& .MuiOutlinedInput-notchedOutline": { border: "none" },
                }}
              />
            </Form>
          )}
        </Formik>
      )
      break
    case "select":
      element = (
        <Select
          labelId="editable-select-status-label"
          sx={{
            boxShadow: "none",
            ".MuiOutlinedInput-notchedOutline": { border: 0 },
            svg: { display: "none" },
          }}
          id="editable-select-status"
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        >
          <MenuItem value="Complicated">
            <Chip color="error" label="Complicated" size="small" />
          </MenuItem>
          <MenuItem value="Relationship">
            <Chip color="success" label="Relationship" size="small" />
          </MenuItem>
          <MenuItem value="Single">
            <Chip color="info" label="Single" size="small" />
          </MenuItem>
        </Select>
      )
      break
    case "progress":
      element = (
        <div>
          {!showSelect ? (
            // eslint-disable-next-line jsx-a11y/click-events-have-key-events,jsx-a11y/no-static-element-interactions
            <div onClick={() => setShowSelect(true)}>
              <LinearWithLabel value={value} sx={{ minWidth: 75 }} />
            </div>
          ) : (
            <Stack
              direction="row"
              alignItems="center"
              spacing={1}
              sx={{ pl: 1, minWidth: 120 }}
            >
              <Slider
                value={value}
                min={0}
                max={100}
                step={1}
                onBlur={onBlur}
                onChange={(event: Event, newValue: number | number[]) => {
                  setValue(newValue)
                }}
                valueLabelDisplay="auto"
                aria-labelledby="non-linear-slider"
              />
              <Tooltip title="Submit">
                <IconButton onClick={() => setShowSelect(false)}>
                  <CheckOutlined />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </div>
      )
      break
    default:
      element = <span />
      break
  }

  return element
}

export default CellEditable