import {
  Box,
  Button,
  Stack,
} from "@mui/material"
import { Dispatch, ReactNode, SetStateAction, } from "react"
import { DownloadOutlined } from "@ant-design/icons"
import { NatixarSectionTitle } from "components/natixarComponents/ChartCard/NatixarSectionTitle"
import { CompareIcon } from "assets/images/icons/IconComponents/CompareIcon"

type ChartCardProps = {
  children: ReactNode
  title?: string
  value?: string | number | undefined
  date?: string
  slot: string
  setSlot: Dispatch<SetStateAction<string>>
  compareButton?: boolean
  compare?: boolean
  setCompare?: Dispatch<SetStateAction<boolean>>
}

export const NatixarChartCard = ({
  children,
  compareButton,
  slot,
  setSlot,
  compare,
  setCompare,
}: ChartCardProps) => {
  const isMonth = slot == 'month'
  const isYear = slot == 'year'
  const isQuarter = slot == 'quarter'

  return (
    <Stack direction={'column'}>
      <Stack direction='row' flexWrap='wrap' gap={2} mb={4}>
        <Button
          variant={isMonth ? "contained" : 'outlined'}
          color={isMonth ? "success" : 'primary'}
          sx={{ marginRight: 2, fontSize: '18px', minWidth: 110, color: isMonth ? '#fff' : '' }}
          onClick={() => setSlot('month')}
        >
          Month
        </Button>
        <Button
          variant={isQuarter ? "contained" : 'outlined'}
          color={isQuarter ? "success" : 'primary'}
          sx={{ marginRight: 2, fontSize: '18px', minWidth: 110, color: isQuarter ? '#fff' : '' }}
          onClick={() => setSlot('quarter')}
        >
          Quarter
        </Button>
        <Button
          variant={isYear ? "contained" : 'outlined'}
          color={isYear ? "success" : 'primary'}
          sx={{ marginRight: 2, fontSize: '18px', minWidth: 110, color: isYear ? '#fff' : '' }}
          onClick={() => setSlot('year')}
        >
          Year
        </Button>
        <Box flexGrow={1}></Box>
        {compareButton && setCompare && (
          <Button
            variant="contained"
            color="primary"
            sx={{ fontSize: '18px', fontWeight: 'bold' }}
            onClick={() => setCompare(!compare)}
          >
            <CompareIcon sx={{ marginRight: 1 }} />
            Compare to previous year
          </Button>
        )}
        <Button
          variant="contained"
          color="primary"
          sx={{ fontSize: '18px', fontWeight: 'bold' }}
        >
          <DownloadOutlined style={{ color: "#fff", fontSize: 22, marginRight: '8px' }} />
          Export
        </Button>
      </Stack>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <NatixarSectionTitle>Total Emissions</NatixarSectionTitle>
      </Box>
      {children}
    </Stack >
  )
}
