import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { INITIAL_SALARY_CONFIG, SHIFT_TEMPLATES, CASINOS } from '../constants';
import type { SalaryConfig, ShiftTemplate } from '../types';

interface SettingsState {
  salaryConfig: SalaryConfig;
  shiftTemplates: ShiftTemplate[];
  casinos: { code: string, name: string, color: string }[];
  updateSalaryConfig: (config: Partial<SalaryConfig>) => void;
  updateShiftTemplates: (templates: ShiftTemplate[]) => void;
  updateCasinos: (casinos: { code: string, name: string, color: string }[]) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      salaryConfig: INITIAL_SALARY_CONFIG,
      shiftTemplates: SHIFT_TEMPLATES,
      casinos: CASINOS,
      updateSalaryConfig: (configFragment) =>
        set((state) => ({
          salaryConfig: { ...state.salaryConfig, ...configFragment },
        })),
      updateShiftTemplates: (templates) => set({ shiftTemplates: templates }),
      updateCasinos: (casinos) => set({ casinos }),
    }),
    { name: 'casino-settings-storage' }
  )
);
