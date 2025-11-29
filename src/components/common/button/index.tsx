import { CircularProgress } from '@mui/material';
import MUIButton, { ButtonProps as MUIButtonProps } from '@mui/material/Button';
import { styled } from '@mui/material/styles';

const StyledMUIButton = styled(MUIButton)(() => ({
  variant: 'contained',
}));

interface ButtonProps extends MUIButtonProps {
  loading?: boolean;
}

const Button = ({ loading, children, ...props }: ButtonProps) => {
  return (
    <StyledMUIButton {...props} disabled={loading}>
      {loading ? <CircularProgress size={24} color="success" /> : children}
    </StyledMUIButton>
  );
};

export default Button;
