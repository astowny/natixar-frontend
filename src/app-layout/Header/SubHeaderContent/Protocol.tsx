// material-ui
import {
  Box,
  Button,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
} from "@mui/material"
import { useTheme } from "@mui/material/styles"
import { EmissionProtocol } from "data/domain/types/emissions/EmissionTypes"
import { memo, useState } from "react"

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Protocol = () => {
  const theme = useTheme()
  const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null)
  const allProtocols = Object.values(EmissionProtocol)
  const [selectedProtocol, setSelectedProtocol] = useState(allProtocols[0])
  const open = Boolean(anchorEl)
  const id = open ? "simple-popover" : undefined

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleClose = () => {
    setAnchorEl(null)
  }

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Button
        variant="outlined"
        sx={{ color: `${theme.palette.grey[900]}` }}
        onClick={handleClick}
      >
        {selectedProtocol}
      </Button>
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <List sx={{ width: 220 }}>
          {allProtocols.map((protocol) => (
            <ListItem disablePadding>
              <ListItemButton>
                <ListItemText primary={protocol} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Popover>
    </Box>
  )
}

export default memo(Protocol)
