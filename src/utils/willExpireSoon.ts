export default function willExpireSoon(dateStr?: string) {
  if (!dateStr) return true;

  const currentDate = new Date();
  const date = new Date(dateStr);
  const currentYear = currentDate.getFullYear();
  const dateYear = date.getFullYear();

  return (
    (dateYear - currentYear) * 12 - currentDate.getMonth() + date.getMonth() <=
    1
  );
}
