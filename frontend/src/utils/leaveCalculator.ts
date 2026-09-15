export function calculateAccruedLeave(totalAnnual: number, currentMonthIndex: number): number {
  return Math.round((totalAnnual / 12) * (currentMonthIndex + 1) * 10) / 10;
}

export function calculateWorkingDays(startDate: Date, endDate: Date): number {
  let count = 0;
  const cur = new Date(startDate.getTime());
  while (cur <= endDate) {
    const dayOfWeek = cur.getDay();
    if (dayOfWeek !== 0 && dayOfWeek !== 6) count++;
    cur.setDate(cur.getDate() + 1);
  }
  return count;
}
