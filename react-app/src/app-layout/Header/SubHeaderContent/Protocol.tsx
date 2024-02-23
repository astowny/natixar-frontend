// material-ui
import { Box, Button } from '@mui/material';
import { useTheme } from '@mui/material/styles';

// ==============================|| HEADER CONTENT - SEARCH ||============================== //

const Protocol = () => {
  const theme = useTheme();

  return (
    <Box sx={{ flexShrink: 0, ml: 0.75 }}>
      <Button sx={{ color: `${theme.palette.grey[900]}` }}>GHG Protocol</Button>
    </Box>
  );
};

export default Protocol;
