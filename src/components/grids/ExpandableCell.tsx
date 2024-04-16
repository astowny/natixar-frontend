import { ReactNode, memo, useEffect, useRef, useState } from "react"
import { Box, Paper, Popper, Typography } from "@mui/material"
import { GridRenderCellParams } from '@mui/x-data-grid'

interface GridCellExpandProps {
    value: any;
    width: number;
    children?: ReactNode;
}

function isOverflown(element: Element): boolean {
    return (
        element.scrollHeight > element.clientHeight ||
        element.scrollWidth > element.clientWidth
    )
}

const GridCellExpand = memo(function GridCellExpand(
    props: GridCellExpandProps
) {
    const { width, value, children } = props;
    const wrapper = useRef<HTMLDivElement | null>(null);
    const cellDiv = useRef(null);
    const cellValue = useRef(null);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const [showFullCell, setShowFullCell] = useState(false);
    const [showPopper, setShowPopper] = useState(false);

    const handleMouseEnter = () => {
        const isCurrentlyOverflown = isOverflown(cellValue.current!);
        setShowPopper(isCurrentlyOverflown);
        setAnchorEl(cellDiv.current);
        setShowFullCell(true);
    };

    const handleMouseLeave = () => {
        setShowFullCell(false);
    };

    useEffect(() => {
        if (!showFullCell) {
            return undefined;
        }

        function handleKeyDown(nativeEvent: KeyboardEvent) {
            // IE11, Edge (prior to using Bink?) use 'Esc'
            if (nativeEvent.key === 'Escape' || nativeEvent.key === 'Esc') {
                setShowFullCell(false);
            }
        }

        document.addEventListener('keydown', handleKeyDown);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [setShowFullCell, showFullCell]);

    return (
        <Box
            ref={wrapper}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            sx={{
                alignItems: 'center',
                lineHeight: '24px',
                width: '100%',
                height: '100%',
                position: 'relative',
                display: 'flex',
            }}
        >
            <Box
                ref={cellDiv}
                sx={{
                    height: '100%',
                    width,
                    display: 'block',
                    position: 'absolute',
                    top: 0,
                }}
            />
            <Box
                ref={cellValue}
                sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
            >
                {value}
            </Box>
            {showPopper && (
                <Popper
                    open={showFullCell && anchorEl !== null}
                    anchorEl={anchorEl}
                    style={{ width, marginLeft: -17 }}
                >
                    <Paper
                        elevation={1}
                        style={{ minHeight: wrapper.current!.offsetHeight - 3 }}
                    >
                        {children ? children :
                            <Typography variant="body2" style={{ padding: 8 }}>
                                {value}
                            </Typography>
                        }
                    </Paper>
                </Popper>
            )}
        </Box>
    );
});

export default function renderCellExpand(params: GridRenderCellParams<any, string>, children?: ReactNode) {
    return (
        <GridCellExpand value={params.value || 'Nothing'} width={params.colDef.computedWidth}>
            {children}
        </GridCellExpand>
    );
}
