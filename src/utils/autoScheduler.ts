import type { Employee, ShiftTemplate } from '../types';
import { getDaysInMonth, getDay } from 'date-fns';

export function runAutoScheduler(
  year: number,
  month: number,
  employees: Employee[],
  shiftTemplates: ShiftTemplate[],
  isHolidayFn: (y: number, m: number, d: number) => boolean,
  existingData: Record<number, Record<number, Record<string, Record<number, string>>>> = {}
): Record<string, Record<number, string>> {
  
  const daysCount = getDaysInMonth(new Date(year, month - 1, 1));
  const newMonthData: Record<string, Record<number, string>> = {};

  // Initialize data structures
  employees.forEach(emp => {
    newMonthData[emp.id] = { ...existingData[year]?.[month]?.[emp.id] };
  });

  // Track state
  const empConsecutiveWork: Record<string, number> = {};
  const empTotalHours: Record<string, number> = {};
  employees.forEach(e => {
    empConsecutiveWork[e.id] = 0;
    empTotalHours[e.id] = 0;
  });

  // Segregate shifts
  const normalShifts = shiftTemplates.filter(t => !t.code.startsWith('DF') && !t.code.startsWith('MF') && !t.code.startsWith('TF'));
  const holidayShifts = shiftTemplates.filter(t => t.code.startsWith('DF') || t.code.startsWith('MF') || t.code.startsWith('TF'));

  if (normalShifts.length === 0) return newMonthData;

  for (let day = 1; day <= daysCount; day++) {
    const isFestivo = isHolidayFn(year, month, day);
    const dayIndex = getDay(new Date(year, month - 1, day));
    const isSunday = dayIndex === 0;

    // Use holiday shifts on sundays/festivos if available, else normal
    let poolToUse = (isFestivo || isSunday) && holidayShifts.length > 0 ? holidayShifts : normalShifts;
    
    // Sort employees to prioritize those with LESS total hours (Equity)
    const sortedEmployees = [...employees].sort((a, b) => {
      // Prioritize resting if they reach 6 days to avoid bottlenecks
      if (empConsecutiveWork[a.id] >= 6 && empConsecutiveWork[b.id] < 6) return -1;
      if (empConsecutiveWork[b.id] >= 6 && empConsecutiveWork[a.id] < 6) return 1;
      
      // Secondary: equity in hours
      return empTotalHours[a.id] - empTotalHours[b.id];
    });

    let shiftCycleIndex = 0;

    for (const emp of sortedEmployees) {
      // If user manually set a shift, respect it and update counters
      if (newMonthData[emp.id][day]) {
         const code = newMonthData[emp.id][day];
         const template = shiftTemplates.find(t => t.code === code);
         if (template) {
            empTotalHours[emp.id] += (template.durationDays * 24);
            empConsecutiveWork[emp.id]++;
         }
         continue;
      }

      // Check Business Rule: Max 6 consecutive days
      if (empConsecutiveWork[emp.id] >= 6) {
        empConsecutiveWork[emp.id] = 0; // REST DAY
        continue;
      }

      // We assign a shift
      const assignedShift = poolToUse[shiftCycleIndex % poolToUse.length];
      newMonthData[emp.id][day] = assignedShift.code;
      
      empTotalHours[emp.id] += (assignedShift.durationDays * 24);
      empConsecutiveWork[emp.id]++;
      shiftCycleIndex++;
    }
  }

  return newMonthData;
}
