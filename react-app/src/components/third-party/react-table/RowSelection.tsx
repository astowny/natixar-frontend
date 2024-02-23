// material-ui
import { Chip } from "@mui/material"

// ==============================|| ROW SELECTION - PREVIEW ||============================== //

const RowSelection = ({ selected }: { selected: number }) => (
  <div>
    {selected > 0 && (
      <Chip
        size="small"
        label={`${selected} row(s) selected`}
        color="secondary"
        sx={{
          position: "absolute",
          right: -1,
          top: -1,
          borderRadius: "0 4px 0 4px",
        }}
      />
    )}
  </div>
)

export default RowSelection
