import type { SalaryConfig, ShiftTemplate } from '../types';

export interface EmployeeSummary {
  mananaStr: number;
  tardeStr: number;
  completoStr: number;
  totalHours: number;
  nightSurchargeFraction: number;
  nightSurchargeHours: number;
  nightSurchargeMoney: number;
  extraHours: number;
  extraHoursMoney: number;
  holidaysCount: number;
  holidayHours: number;
  holidayHoursDec: number;
  holidayOccasionalHours: number;
  holidayOccasionalMoney: number;
  holidayHabitualHours: number;
  holidayHabitualMoney: number;
  totalSurchargeMoney: number;
}

export function calculateEmployeeSummary(
  shiftCounts: Record<string, number>,
  config: SalaryConfig,
  templates: ShiftTemplate[],
  employeeBaseSalary?: number
): EmployeeSummary {
  
  const effectiveBaseSalary = employeeBaseSalary || config.baseSalaryDaily;
  // Factor de proporción para recalcular las tarifas 
  const salaryRatio = effectiveBaseSalary / config.baseSalaryDaily;

  let mananaStr = 0;
  let tardeStr = 0;
  let completoStr = 0;

  let totalHoursDec = 0;
  let nightSurchargeFraction = 0;
  let sumExtraFractions = 0;
  let holidayHours = 0;

  const validNightModifiers = ['D', 'TD', 'P', 'TP', 'CF', 'TC', 'B', 'TB', 'DFD', 'DFP', 'DFC'];
  const holidayCodes = ['DFD', 'DFP', 'DFC', 'DFB'];
  let holidaysCount = 0;

  for (const [code, count] of Object.entries(shiftCounts)) {
    if (count <= 0) continue;
    const template = templates.find((t) => t.code === code);
    if (!template) continue;

    // Agrupación Genérica
    const durationHours = template.durationDays * 24;
    
    // Heurística de agrupación
    if (durationHours > 9.0) {
      completoStr += count;
    } else {
      if (template.startHour <= 11.5) {
         mananaStr += count;
      } else {
         tardeStr += count;
      }
    }

    // Acumuladores
    totalHoursDec += count * durationHours;

    if (validNightModifiers.includes(code) && template.endHour > 21.0) {
       const endEighthFraction = template.endHour / 24.0;
       nightSurchargeFraction += (endEighthFraction - config.nightSurchargeThresholdFraction) * count;
    }

    if (durationHours > config.maxShiftDurationHours) {
        sumExtraFractions += ((durationHours - config.maxShiftDurationHours) / 24) * count;
    }

    if (holidayCodes.includes(code)) {
       holidaysCount += count;
       holidayHours += count * durationHours;
    }
  }

  const holidayHoursDec = Math.max(holidayHours, 0);
  let holidayOccasionalHours = 0;
  let holidayHabitualHours = 0;

  if (holidaysCount <= 2) {
    holidayOccasionalHours = holidayHoursDec;
  } else {
    holidayOccasionalHours = (holidayHoursDec / holidaysCount) * 2;
    holidayHabitualHours = (holidayHoursDec / holidaysCount) * (holidaysCount - 2);
  }

  const extraHours = Math.max(sumExtraFractions * 24, 0);
  const nightSurchargeHours = Math.max(nightSurchargeFraction * 24, 0);

  // Cálculos monetarios parametrizados y proporcionales
  const nightSurchargeMoney = nightSurchargeHours * (config.nightSurchargeHourRate * salaryRatio);
  const extraHoursMoney = extraHours * (config.extraHoursRate * salaryRatio);
  const holidayOccasionalMoney = holidayOccasionalHours * (config.occasionalHolidayRate * salaryRatio);
  const holidayHabitualMoney = holidayHabitualHours * (config.habitualHolidayRate * salaryRatio);

  // TOTAL
  const totalSurchargeMoney = nightSurchargeMoney + extraHoursMoney + holidayOccasionalMoney + holidayHabitualMoney;

  return {
    mananaStr,
    tardeStr,
    completoStr,
    totalHours: totalHoursDec,
    nightSurchargeFraction,
    nightSurchargeHours,
    nightSurchargeMoney,
    extraHours,
    extraHoursMoney,
    holidaysCount,
    holidayHours,
    holidayHoursDec,
    holidayOccasionalHours,
    holidayOccasionalMoney,
    holidayHabitualHours,
    holidayHabitualMoney,
    totalSurchargeMoney,
  };
}
