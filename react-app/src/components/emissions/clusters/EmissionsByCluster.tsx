import { FunctionComponent, memo, useCallback, useMemo } from "react"
import { Box, Button, Paper, Stack, Typography } from "@mui/material"
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import EmissionsByClusterTable from "./EmissionsTable"

import { EmissionsByClusterProps } from "./types"
import { formatEmissionAmount } from "utils/formatAmounts"

const EmissionsByClusterSection: FunctionComponent<EmissionsByClusterProps> = ({ cluster, onClose }) => {
    const totalEmission = useMemo(() => {
        const totalAmount = cluster.dataPoints.reduce((accumulator, currentValue) => accumulator + currentValue.emission_amount, 0)
        return formatEmissionAmount(totalAmount)
    }, [cluster])

    return (
        <Paper sx={{
            width: "100%",
            height: "100%"  
        }}>
            <Stack direction="column" sx={{
                width: "100%",
                height: "100%",
                px: "24px",
                py: "26px",
                gap: "20px"
            }}>
                <Stack direction="row" justifyContent="space-between">
                    <Button sx={{
                        height: "40px",
                        px: "16px",
                        py: "9px",
                        color: "white"
                    }}
                        onClick={() => onClose && onClose()}
                        variant="contained"
                    ><ArrowBackIcon /> <Typography ml="8px" noWrap>Back to map</Typography></Button>
                    <Typography variant="h3" noWrap gutterBottom>TOTAL: {totalEmission}</Typography>
                </Stack>
                <Box sx={{ width: '100%', flex: 1 }}>
                    <EmissionsByClusterTable cluster={cluster} />
                </Box>
            </Stack>
        </Paper>
    )
}

export default memo(EmissionsByClusterSection)
