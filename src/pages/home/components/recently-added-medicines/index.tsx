import { Box, List, ListItem, Typography } from '@mui/material';
import Button from '@mui/material/Button';
import { FaCapsules } from 'react-icons/fa6';
import { useNavigate } from 'react-router-dom';

import useRecentMedicines from '@/features/medicine/hooks/useRecentMedicines.tsx';

export const RecentlyAddedMedicines = () => {
  const { addedMedicines } = useRecentMedicines();
  const navigate = useNavigate();

  if (!addedMedicines.length)
    return (
      <Box
        sx={{
          height: '50vh',
          flex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
          gap: 3,
        }}
      >
        <Box
          sx={(theme) => ({
            padding: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '100%',
            backgroundColor: theme.palette.primary.dark,
          })}
        >
          <FaCapsules size={50} />
        </Box>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexDirection: 'column',
            gap: 1,
          }}
        >
          <Typography variant="h5">No recent medications found</Typography>
          <Button
            variant="outlined"
            onClick={() => navigate('/medicine/register')}
          >
            Add new medicine
          </Button>
        </Box>
      </Box>
    );

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5">Recently added medicines:</Typography>
      <List
        sx={{
          listStyleType: 'disc',
          pl: 4,
          '& .MuiListItem-root': {
            display: 'list-item',
          },
        }}
      >
        {addedMedicines.map(({ name, id }) => (
          <ListItem key={id}>{name}</ListItem>
        ))}
      </List>
    </Box>
  );
};
