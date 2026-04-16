import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Discrepancy, ShiftChange } from '../types';

interface ReportsState {
  discrepancies: Discrepancy[];
  shiftChanges: ShiftChange[];
  addDiscrepancy: (item: Discrepancy) => void;
  updateDiscrepancy: (id: string, updated: Partial<Discrepancy>) => void;
  deleteDiscrepancy: (id: string) => void;
  addShiftChange: (item: ShiftChange) => void;
  deleteShiftChange: (id: string) => void;
}

export const useReportsStore = create<ReportsState>()(
  persist(
    (set) => ({
      discrepancies: [],
      shiftChanges: [],
      addDiscrepancy: (item) => set((state) => ({ discrepancies: [...state.discrepancies, item] })),
      updateDiscrepancy: (id, updated) => set((state) => ({
          discrepancies: state.discrepancies.map(d => d.id === id ? { ...d, ...updated } : d)
      })),
      deleteDiscrepancy: (id) => set((state) => ({
          discrepancies: state.discrepancies.filter(d => d.id !== id)
      })),
      addShiftChange: (item) => set((state) => ({ shiftChanges: [...state.shiftChanges, item] })),
      deleteShiftChange: (id) => set((state) => ({
          shiftChanges: state.shiftChanges.filter(s => s.id !== id)
      })),
    }),
    { name: 'casino-reports-storage' }
  )
);
