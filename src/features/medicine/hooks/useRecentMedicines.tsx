import { useEffect, useState } from 'react';

interface RecentlyAddedMedicines {
  name: string;
  id: string;
}

export default function useRecentMedicines() {
  const [addedMedicines, setAddedMedicines] = useState<
    RecentlyAddedMedicines[]
  >([]);

  useEffect(() => {
    const rawMedicines = localStorage.getItem('recentMedicines') || '';
    if (rawMedicines) {
      const parsed = JSON.parse(rawMedicines);
      setAddedMedicines(parsed);
    }
  }, []);

  const handleAddedMedicine = (medicine: RecentlyAddedMedicines) => {
    const newMedicines = addedMedicines.slice(-1);

    localStorage.setItem(
      'recentMedicines',
      JSON.stringify([medicine, ...newMedicines]),
    );
  };

  return { addedMedicines, handleAddedMedicine };
}
