// material-ui
import { Checkbox, CheckboxProps } from "@mui/material"

// ==============================|| ROW SELECTION - CHECKBOX ||============================== //

const IndeterminateCheckbox = ({
  indeterminate,
  ...rest
}: { indeterminate?: boolean } & CheckboxProps) => (
  <Checkbox
    {...rest}
    indeterminate={
      typeof indeterminate === "boolean" && !rest.checked && indeterminate
    }
  />
)

export default IndeterminateCheckbox
