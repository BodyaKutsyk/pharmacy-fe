import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Stack,
  Typography,
} from '@mui/material';

export const ActionCard = ({
  title,
  subtitle,
  icon,
  onClick,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  onClick?: () => void;
}) => (
  <Card elevation={2}>
    <CardActionArea onClick={onClick}>
      <CardContent>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ p: 1.25, borderRadius: 2, bgcolor: 'action.hover' }}>
            {icon}
          </Box>
          <Box>
            <Typography variant="subtitle1" fontWeight={700}>
              {title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Stack>
      </CardContent>
    </CardActionArea>
  </Card>
);
