export const dayOfTime = () => {
  const date = new Date();
  const hours = date.getHours();

  if (hours >= 5 && hours < 10) return 'early morning';
  else if (hours >= 10 && hours < 12) return 'late morning';
  else if (hours >= 12 && hours < 16) return 'early afternoon';
  else if (hours >= 16 && hours < 18) return 'late afternoon';
  else if (hours >= 18 && hours < 22) return 'evening';
  else return 'night';
};
