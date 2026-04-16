import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Employee } from '../types';

interface EmployeesState {
  employees: Employee[];
  addEmployee: (employee: Employee) => void;
  updateEmployee: (id: string, employeeData: Partial<Omit<Employee, 'id'>>) => void;
  deleteEmployee: (id: string) => void;
}

export const useEmployeesStore = create<EmployeesState>()(
  persist(
    (set) => ({
      employees: [],
      addEmployee: (employee) =>
        set((state) => ({ employees: [...state.employees, employee] })),
      updateEmployee: (id, employeeData) => set((state) => ({
        employees: state.employees.map(e => e.id === id ? { ...e, ...employeeData } : e)
      })),
      deleteEmployee: (id) =>
        set((state) => ({
          employees: state.employees.filter((emp) => emp.id !== id),
        })),
    }),
    { name: 'casino-employees-storage' }
  )
);
