import { PropsWithChildren } from 'react';

import { Box } from '@mui/material';
import styled from 'styled-components';

const StyledIconWrapper = styled(Box)(() => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  color: '#dcedc8',
  backgroundColor: '#43a047',
  padding: '12px',
  // border: '1px solid ',
  borderRadius: '4px',
  // height: '50px',
  // width: '50px',
}));

const IconWrapper = ({ children }: PropsWithChildren) => {
  return <StyledIconWrapper>{children}</StyledIconWrapper>;
};

export default IconWrapper;
