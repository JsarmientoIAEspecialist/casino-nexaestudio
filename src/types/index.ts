export interface Employee {
  id: string;
  fullName: string;
  baseSalaryDaily?: number;
}

export type CasinoCode = 'D' | 'P' | 'CF' | 'B';

export interface ShiftTemplate {
  code: string;
  casino: CasinoCode;
  name: string;
  startHour: number; // decimal (e.g., 7.916 for 7:55)
  endHour: number; // decimal
  durationDays: number;
}

export interface SalaryConfig {
  baseSalaryDaily: number;
  nightSurchargeThresholdFraction: number; // e.g., 0.35
  extraHoursMultiplier: number;
  nightSurchargeHourRate: number;
  extraHoursRate: number;
  maxShiftDurationHours: number; // 7.333
  occasionalHolidayRate: number;
  habitualHolidayRate: number;
}

export interface DailySchedule {
  employeeId: string;
  day: number; // 1 to 31
  shiftCode: string; // The shift code or empty string for day off
  // Expanded schedule might track actual hours, but right now projection manages codes only
}

export interface Discrepancy {
  id: string;
  month: number;
  year: number;
  employeeName: string;
  casino: string;
  date: string;
  value: number;
  isCanceled: boolean;
  cancelDate?: string;
  observations: string;
}

export interface ShiftChange {
  id: string;
  month: number;
  year: number;
  scheduledCasino: string;
  requestingEmployeeId: string;
  scheduledDate: string;
  changeDate: string;
  changeCasino: string;
  substituteEmployeeId: string;
}
