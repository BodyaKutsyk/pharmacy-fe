import { Box, BoxProps } from '@mui/material';
import { styled } from '@mui/material/styles';

const TextFieldWrapper = styled(Box)<BoxProps>(() => ({
  display: 'flex',
  flexDirection: 'column',
  gap: 1,
  width: '50%',
}));

export default TextFieldWrapper;
