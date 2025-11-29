export default function daysInMonthArray(month: number): number[] {
  const output = [];
  const date = new Date();
  const year = date.getFullYear();
  const daysInMonth = new Date(year, month, 0).getDate();

  for (let i = 1; i <= daysInMonth; i++) {
    output.push(i);
  }

  return output;
}
