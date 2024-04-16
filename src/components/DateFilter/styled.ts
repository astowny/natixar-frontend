import { styled } from "@mui/material/styles"
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker"
import { Box, Button, Slider } from "@mui/material"

export const StyledDatePicker = styled(StaticDatePicker)(
  ({ involved }: { involved: boolean }) => ({
    width: "fit-content",
    minWidth: "fit-content",
    overflowX: "hidden",
    "& .Mui-selected": {
      backgroundColor: involved ? "#1890FF" : "transparent !important",
      color: involved ? "#FFF" : "#000 !important",
      fontWeight: involved ? 500 : "400 !important",
    },
    "& .MuiPickersLayout-contentWrapper": {
      width: "fit-content",
      height: "fit-content",
    },
    "& .MuiDateCalendar-root": {
      width: "fit-content",
      height: "fit-content",
    },
    "& .MuiPickersCalendarHeader-root": {
      padding: 0,
      margin: 0,
      width: "100%",
      borderBottom: "1px solid transparent",
      justifyContent: "center",
      "& .MuiPickersArrowSwitcher-root": {
        display: "none",
      },
      "& .MuiPickersCalendarHeader-labelContainer": {
        margin: 0,
      },
      "& .MuiPickersCalendarHeader-switchViewButton": {
        display: "none",
      },
    },
    "& .MuiPickersSlideTransition-root": {
      minHeight: 200,
    },
  }),
)

export const AcceptButton = styled(Button)(() => ({
  color: "#FFF",
}))

export const Border = styled(Box)(() => ({
  width: "100%",
  height: 29,
  borderBottom: "1px solid #e6ebf1",
  position: "absolute",
  top: 0,
  left: 0,
}))

export const ScrollComponent = styled(Box)(() => ({
  display: "flex",
  width: "calc(100% - 0px)",
  overflowX: "scroll",
  "-ms-overflow-style": "none",
  "scrollbar-width": "none",
}))

export const PickersWrapper = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  gap: "16px",
  position: "relative",
}))

export const DateInputsWrapper = styled(Box)(() => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  gap: "16px",
}))

export const MainContainer = styled(Box)(() => ({
  display: "flex",
  flexDirection: "column",
  width: "100%",
  gap: "30px",
}))

export const DateSlider = styled(Slider)(() => ({
  height: "40px",
  width: "calc(100% - 40px)",
  margin: "0 20px",
  "& .MuiSlider-rail": {
    width: "calc(100% + 40px)",
    left: -20,
    padding: "0",
    borderRadius: "4px",
    height: "40px",
  },
  "& .MuiSlider-thumb": {
    height: "40px",
    width: "40px",
    borderRadius: "4px",
    background: "transparent",
    border: "2px solid #000 !important",
    "&.Mui-focusVisible": {
      boxShadow: "none",
    },
    "&:hover": {
      boxShadow: "none",
    },
  },
  "& .MuiSlider-track": {
    color: "transparent",
  },
}))

export const Years = styled(Box)(() => ({
  display: "flex",
  justifyContent: "space-between",
  width: "100%",
  height: "100%",
  alignItems: "center",
  gap: "30px",
  position: "absolute",
  padding: "0 20px",
}))

export const SliderWrapper = styled(Box)(() => ({
  display: "flex",
  width: "100%",
  position: "relative",
}))
