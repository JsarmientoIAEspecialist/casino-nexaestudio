import type { SalaryConfig, ShiftTemplate } from '../types';

export const INITIAL_SALARY_CONFIG: SalaryConfig = {
  baseSalaryDaily: 7959,
  nightSurchargeThresholdFraction: 0.35, // Equivalent to 8:24 am in their formula or part of day? Requirement: "Umbral recargo nocturno: 0.35 (como fracción del día = 8:24 horas)"
  extraHoursMultiplier: 1.25,
  nightSurchargeHourRate: 2785.65,
  extraHoursRate: 9948.75,
  maxShiftDurationHours: 7.333,
  occasionalHolidayRate: 6367.20,
  habitualHolidayRate: 14326.20,
};

// Start and End hours are represented as decimal hours (e.g., 7 + 55/60 = 7.9167)
export const SHIFT_TEMPLATES: ShiftTemplate[] = [
  { code: 'D', casino: 'D', name: 'Completo', startHour: 7.9167, endHour: 23.25, durationDays: 0.6389 },
  { code: 'MD', casino: 'D', name: 'Mañana', startHour: 7.9167, endHour: 16.0, durationDays: 0.3368 },
  { code: 'TD', casino: 'D', name: 'Tarde', startHour: 15.5, endHour: 23.25, durationDays: 0.3229 },
  { code: 'P', casino: 'P', name: 'Completo', startHour: 7.9167, endHour: 22.25, durationDays: 0.5972 },
  { code: 'MP', casino: 'P', name: 'Mañana', startHour: 7.9167, endHour: 15.5, durationDays: 0.3160 },
  { code: 'TP', casino: 'P', name: 'Tarde', startHour: 15.0, endHour: 22.25, durationDays: 0.3021 },
  { code: 'CF', casino: 'CF', name: 'Completo', startHour: 7.9167, endHour: 23.25, durationDays: 0.6389 },
  { code: 'MC', casino: 'CF', name: 'Mañana', startHour: 7.9167, endHour: 16.0, durationDays: 0.3368 },
  { code: 'TC', casino: 'CF', name: 'Tarde', startHour: 15.5, endHour: 23.25, durationDays: 0.3229 },
  { code: 'B', casino: 'B', name: 'Completo', startHour: 9.5, endHour: 22.0833, durationDays: 0.5243 },
  { code: 'MB', casino: 'B', name: 'Mañana', startHour: 9.3333, endHour: 16.1667, durationDays: 0.2847 },
  { code: 'TB', casino: 'B', name: 'Tarde', startHour: 15.6667, endHour: 22.0, durationDays: 0.2639 },
  
  // Festivos
  { code: 'DFD', casino: 'D', name: 'Festivo', startHour: 8.9167, endHour: 21.25, durationDays: 0.5139 },
  { code: 'DFP', casino: 'P', name: 'Festivo', startHour: 8.9167, endHour: 21.25, durationDays: 0.5139 },
  { code: 'DFC', casino: 'CF', name: 'Festivo', startHour: 8.9167, endHour: 19.25, durationDays: 0.4306 },
  { code: 'DFB', casino: 'B', name: 'Festivo', startHour: 9.3333, endHour: 19.0833, durationDays: 0.4063 },
  
  // Festivos Medios
  { code: 'MFD', casino: 'D', name: 'Mañana Fest.', startHour: 8.75, endHour: 16.75, durationDays: 0.3333 },
  { code: 'TFD', casino: 'D', name: 'Tarde Fest.', startHour: 13.0833, endHour: 21.0833, durationDays: 0.3333 },
  { code: 'MFP', casino: 'P', name: 'Mañana Fest.', startHour: 8.75, endHour: 16.75, durationDays: 0.3333 },
  { code: 'TFP', casino: 'P', name: 'Tarde Fest.', startHour: 12.75, endHour: 20.75, durationDays: 0.3333 },
  { code: 'MFC', casino: 'CF', name: 'Mañana Fest.', startHour: 8.9167, endHour: 15.9167, durationDays: 0.2917 },
  { code: 'TFC', casino: 'CF', name: 'Tarde Fest.', startHour: 13.5, endHour: 18.6667, durationDays: 0.2153 },
  { code: 'MFB', casino: 'B', name: 'Mañana Fest.', startHour: 9.3333, endHour: 14.3333, durationDays: 0.2083 },
  { code: 'TFB', casino: 'B', name: 'Tarde Fest.', startHour: 13.6667, endHour: 18.6667, durationDays: 0.2083 },
];

export const CASINOS = [
  { code: 'D', name: 'DIAMONDS', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { code: 'P', name: 'PALACE', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { code: 'CF', name: 'CAFÉ Y FORTUNA', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { code: 'B', name: 'BARCELONA', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' }
];

export const MONTHS = [
  { value: 1, name: 'Enero' },
  { value: 2, name: 'Febrero' },
  { value: 3, name: 'Marzo' },
  { value: 4, name: 'Abril' },
  { value: 5, name: 'Mayo' },
  { value: 6, name: 'Junio' },
  { value: 7, name: 'Julio' },
  { value: 8, name: 'Agosto' },
  { value: 9, name: 'Septiembre' },
  { value: 10, name: 'Octubre' },
  { value: 11, name: 'Noviembre' },
  { value: 12, name: 'Diciembre' },
];
