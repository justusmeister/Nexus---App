export const calculateHolidayAPIDates = () => {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  const previousYear = currentYear - 1;
  const targetYear = currentDate.getMonth() > 5 ? currentYear : previousYear;
  const startDate = `${targetYear}-01-01`;
  const targetDate = `${targetYear + 2}-01-01`;

  return { startDate, targetDate };
};
