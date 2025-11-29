import { useState } from 'react';

import {
  Box,
  Container,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  Typography,
} from '@mui/material';
import {
  DataGrid,
  GridActionsCellItem,
  GridColDef,
  GridRenderEditCellParams,
  useGridApiContext,
} from '@mui/x-data-grid';
import { toast } from 'react-hot-toast';
import { FaTrash } from 'react-icons/fa6';

import BackButton from '@/components/common/BackButton';
import {
  useDeleteMedicine,
  useGetAllMedicines,
  useUpdateMedicine,
} from '@/features/medicine/hooks/useMedicine.ts';
import { Medicine } from '@/features/medicine/services/types.ts';
import { medicineDosageUnit } from '@/pages/register-medicine.tsx';

interface MedicineRow {
  id: number;
  name: string;
  description?: string;
  price: number;
  quantity: number;
  country: string;
  dosageValue: number;
  dosageUnit: string;
  requiresPrescription: boolean;
  expiryDate: Date;
  pharmacistId: string;
  createdAt: string;
}

const EditDosage = ({ id, value, field }: GridRenderEditCellParams) => {
  const apiRef = useGridApiContext();

  const handleValueChange = (e: SelectChangeEvent) => {
    const newValue = e.target.value;
    apiRef.current.setEditCellValue({ id, field, value: newValue });
  };

  return (
    <Select
      value={value}
      defaultValue="unit(s)"
      variant="standard"
      disableUnderline
      sx={{ mr: 1.5 }}
      onChange={handleValueChange}
    >
      {medicineDosageUnit.map((unit) => (
        <MenuItem key={unit} value={unit}>
          {unit}
        </MenuItem>
      ))}
    </Select>
  );
};

const mapApiToGridRow = (apiEntity: Medicine): MedicineRow => {
  const {
    dosageUnit,
    dosageValue,
    requiresPrescription = false,
    ...restOfMedicine
  } = apiEntity;

  return {
    ...(restOfMedicine as Omit<MedicineRow, 'dosage'>),
    expiryDate: new Date(apiEntity.expiryDate || new Date()),
    requiresPrescription,
  };
};

const StockAuditPage = () => {
  const { data: medicinesData, isLoading } = useGetAllMedicines();
  const { mutateAsync } = useUpdateMedicine();
  const { mutateAsync: deleteMedicine } = useDeleteMedicine();

  const [medicines, setMedicines] = useState<Medicine[]>(medicinesData || []);

  const handleDeleteRow = async (id: number) => {
    await deleteMedicine(id);
    setMedicines((prev) => prev.filter((medicine) => medicine.id !== id));
  };

  const handleRowUpdate = async (newRow: MedicineRow) => {
    const oldRow = medicines?.find((m) => m.id === newRow.id);
    if (!oldRow) return Promise.reject();

    const { pharmacistId, quantity, price, expiryDate, createdAt, ...rest } =
      newRow;
    const apiPayload = {
      ...rest,
      quantity: +quantity,
      price: +price,
      expiryDate: new Date(expiryDate || ''),
    };

    const updated = await mutateAsync(apiPayload, {
      onSuccess: () => {
        toast.success('Successfully updated medicine');
      },
      onError: () => {
        toast.error('Error updating medicine');
      },
    });

    return mapApiToGridRow(updated);
  };

  const columns: GridColDef[] = [
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
      editable: true,
    },
    { field: 'price', headerName: 'Price', type: 'number', editable: true },
    {
      field: 'quantity',
      headerName: 'Quantity',
      type: 'number',
      editable: true,
    },
    { field: 'country', headerName: 'Country', width: 150, editable: true },
    {
      field: 'expiryDate',
      headerName: 'Expiration Date',
      width: 120,
      type: 'date',
      editable: true,
      valueGetter: (value: string) => new Date(value),
    },
    {
      field: 'dosageValue',
      headerName: 'Dosage value',
      editable: true,
      type: 'number',
    },
    {
      field: 'dosageUnit',
      headerName: 'Dosage unit',
      editable: true,
      type: 'string',
      renderEditCell: EditDosage,
    },

    {
      field: 'description',
      editable: true,
      headerName: 'Description',
      flex: 1,
    },
    {
      field: 'requiresPrescription',
      headerName: 'Required prescription',
      type: 'boolean',
      editable: true,
    },
    {
      field: 'delete',
      headerName: '',
      type: 'actions',
      getActions: ({ id }) => {
        return [
          <GridActionsCellItem
            icon={<FaTrash color="#f50057" />}
            label="Delete"
            onClick={() => handleDeleteRow(+id)}
            showInMenu={false}
          />,
        ];
      },
    },
  ];

  const rows: MedicineRow[] =
    medicines?.map(
      ({ requiresPrescription = false, dosageValue, dosageUnit, ...rest }) => {
        return {
          ...rest,
          dosageValue: dosageValue || 0,
          dosageUnit: dosageUnit || 'N/A',
          expiryDate: rest.expiryDate || new Date(),
          requiresPrescription,
        };
      },
    ) || [];

  return (
    <Container sx={{ py: 4 }} maxWidth="xl">
      <BackButton />
      <Stack
        direction="column"
        justifyContent=""
        alignItems="flex-start"
        sx={{ mb: 3, gap: 4, height: '80vh' }}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Medicines
          </Typography>
          <Typography variant="body2" color="text.secondary">
            View and manage your current pharmacy inventory. Edit fields like
            Price, Quantity, Dosage, and Expiration Date directly in the grid to
            keep stock records accurate and up-to-date.
          </Typography>
        </Box>
        <DataGrid
          showToolbar
          processRowUpdate={handleRowUpdate}
          onProcessRowUpdateError={(error) => console.error(error)}
          loading={isLoading}
          sx={{ width: '100%' }}
          columns={columns}
          rows={rows}
          getRowId={(row) => row.id}
        />
      </Stack>
    </Container>
  );
};

export default StockAuditPage;
