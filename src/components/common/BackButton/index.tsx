import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import Button, { ButtonProps } from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';

const BackButton = (props: ButtonProps) => {
  const navigate = useNavigate();

  return (
    <Button
      sx={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}
      onClick={() => navigate(-1)}
      {...props}
    >
      <ArrowBackIosIcon color="primary" />
      Go back
    </Button>
  );
};

export default BackButton;
