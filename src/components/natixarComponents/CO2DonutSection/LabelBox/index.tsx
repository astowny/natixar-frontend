import { Box, IconButton, Typography } from "@mui/material"
import { ArrowRightOutlined } from "@ant-design/icons"

import { LabelBoxProps } from "./interface"
import {
  ButtonContainerStyles,
  ContainerStyles,
  DotStyles,
  LabelValueStyles,
} from "./styled"

const LabelBox = ({ legend }: LabelBoxProps) => (
  <Box sx={ContainerStyles(legend.color)}>
    <Box sx={LabelValueStyles}>
      <Box sx={DotStyles(legend.color)} />
      <Typography variant="h6">{legend.title}</Typography>
    </Box>
    <Box sx={LabelValueStyles}>
      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
        32425
      </Typography>
      <Typography variant="h6">tCO2e</Typography>
    </Box>
    <Box sx={ButtonContainerStyles}>
      <IconButton sx={{ borderRadius: "100%", background: "#E6F7FF" }}>
        <ArrowRightOutlined />
      </IconButton>
    </Box>
  </Box>
)

export default LabelBox
