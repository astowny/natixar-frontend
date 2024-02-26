import { Box, Checkbox, FormControlLabel } from "@mui/material"
import { MinusOutlined, PlusOutlined } from "@ant-design/icons"
import { ReactNode, useState } from "react"
import IconButton from "../../../@extended/IconButton"

type CheckboxItemProps = {
  label: string
  children?: ReactNode
}

export const CheckboxItem = ({ label, children }: CheckboxItemProps) => {
  const [show, setShow] = useState(false)

  return (
    <>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          columnGap: "7px",
          padding: "0 12px",
        }}
      >
        <IconButton
          size="small"
          variant="outlined"
          onClick={() => setShow(!show)}
          sx={{
            width: "24px",
            height: "24px",
            color: "#000",
            borderRadius: "2px",
            borderColor: "#D9D9D9",
          }}
        >
          {show ? <MinusOutlined /> : <PlusOutlined />}
        </IconButton>
        <FormControlLabel label={label} control={<Checkbox />} />
      </Box>
      {show && children}
    </>
  )
}
