import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Record<Year, Record<Month, Record<EmployeeId, Record<Day (1-31), string>>>>
type ProjectionsData = Record<number, Record<number, Record<string, Record<number, string>>>>;

// Festivos marcados por mes. Record<Year, Record<Month, number[]>>
type HolidaysData = Record<number, Record<number, number[]>>;

interface ProjectionState {
  data: ProjectionsData;
  holidays: HolidaysData;
  setShift: (year: number, month: number, employeeId: string, day: number, shiftCode: string) => void;
  mergeMonthData: (year: number, month: number, newData: Record<string, Record<number, string>>) => void;
  toggleHoliday: (year: number, month: number, day: number) => void;
  isHoliday: (year: number, month: number, day: number) => boolean;
}

export const useProjectionStore = create<ProjectionState>()(
  persist(
    (set, get) => ({
      data: {},
      holidays: {},
      mergeMonthData: (year, month, newData) => set((state) => {
        const yData = state.data[year] || {};
        return {
          data: {
            ...state.data,
            [year]: {
              ...yData,
              [month]: newData
            }
          }
        };
      }),
      setShift: (year, month, employeeId, day, shiftCode) =>
        set((state) => {
          const newData = { ...state.data };
          if (!newData[year]) newData[year] = {};
          if (!newData[year][month]) newData[year][month] = {};
          if (!newData[year][month][employeeId]) newData[year][month][employeeId] = {};
          
          newData[year][month][employeeId][day] = shiftCode;
          
          return { data: newData };
        }),
      toggleHoliday: (year, month, day) =>
        set((state) => {
          const newHolidays = { ...state.holidays };
          if (!newHolidays[year]) newHolidays[year] = {};
          if (!newHolidays[year][month]) newHolidays[year][month] = [];
          
          const daysArray = newHolidays[year][month];
          if (daysArray.includes(day)) {
            newHolidays[year][month] = daysArray.filter(d => d !== day);
          } else {
            newHolidays[year][month] = [...daysArray, day].sort((a,b) => a-b);
          }
          return { holidays: newHolidays };
        }),
      isHoliday: (year, month, day) => {
         const hol = get().holidays;
         if (!hol[year] || !hol[year][month]) return false;
         return hol[year][month].includes(day);
      }
    }),
    { name: 'casino-projection-storage' }
  )
);
