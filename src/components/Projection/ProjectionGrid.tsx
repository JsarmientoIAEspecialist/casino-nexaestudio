import { useMemo } from 'react';
import { useEmployeesStore } from '../../stores/employeesStore';
import { useProjectionStore } from '../../stores/projectionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { calculateEmployeeSummary } from '../../utils/calculations';
import { CellDropdown } from './CellDropdown';
import { cn } from '../../lib/utils';
import { getDaysInMonth, getDay } from 'date-fns';

interface Props {
  year: number;
  month: number; // 1-12
}

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

export function ProjectionGrid({ year, month }: Props) {
  const { employees } = useEmployeesStore();
  const { data, setShift, isHoliday, toggleHoliday } = useProjectionStore();
  const { salaryConfig, shiftTemplates } = useSettingsStore();

  const daysCount = useMemo(() => {
    return getDaysInMonth(new Date(year, month - 1, 1));
  }, [year, month]);

  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // Funciones de formato moneda
  const formatCurrency = (val: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);

  return (
    <div className="w-full overflow-x-auto shadow-sm border border-slate-200 rounded-lg bg-white">
      <table id="projection-table" className="w-full border-collapse text-sm">
        <thead>
          {/* Header 1: Días de la semana */}
          <tr>
            <th className="frozen-column bg-slate-100 border p-2 text-left min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">Mes: {month}/{year}</th>
            {daysArray.map(day => {
              const date = new Date(year, month - 1, day);
              const dayIndex = getDay(date);
              const isSunday = dayIndex === 0;
              const isFestivo = isHoliday(year, month, day);
              
              return (
                <th 
                  key={day} 
                  className={cn(
                    "border min-w-[50px] p-1 text-center font-bold text-xs select-none cursor-pointer transition-colors",
                    (isSunday || isFestivo) ? "bg-red-100 text-red-800" : "bg-slate-50 text-slate-600",
                    "hover:bg-blue-100" // Hover to toggle holiday
                  )}
                  onClick={() => toggleHoliday(year, month, day)}
                  title="Click para marcar/desmarcar como festivo"
                >
                  {WEEKDAYS[dayIndex]}
                </th>
              );
            })}
            
            {/* Headers del resumen */}
            <th className="border p-2 bg-slate-800 text-white min-w-[80px]">MAÑANA</th>
            <th className="border p-2 bg-slate-800 text-white min-w-[80px]">TARDE</th>
            <th className="border p-2 bg-slate-800 text-white min-w-[80px]">COMPLETO</th>
            <th className="border p-2 bg-blue-900 text-white min-w-[100px]">TOTAL HORAS</th>
            <th className="border p-2 bg-indigo-900 text-white min-w-[120px]">RECARGOS (Hrs)</th>
            <th className="border p-2 bg-indigo-900 text-white min-w-[120px]">RECARGOS ($)</th>
            <th className="border p-2 bg-purple-900 text-white min-w-[120px]">EXTRAS (Hrs)</th>
            <th className="border p-2 bg-purple-900 text-white min-w-[120px]">EXTRAS ($)</th>
            <th className="border p-2 bg-red-900 text-white min-w-[80px]">FESTIVOS</th>
            <th className="border p-2 bg-rose-900 text-white min-w-[120px]">F. OCASIONAL ($)</th>
            <th className="border p-2 bg-rose-900 text-white min-w-[120px]">F. HABITUAL ($)</th>
            <th className="border p-2 bg-emerald-700 text-white min-w-[140px] shadow-inner">TOTAL RECARGOS</th>
          </tr>
          {/* Header 2: Números del día */}
          <tr>
            <th className="frozen-column bg-slate-100 border p-2 text-left shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)] border-b-2 border-b-slate-300">
              Nombre Empleado (Promotor)
            </th>
            {daysArray.map(day => (
              <th key={day} className="border p-1 bg-slate-100 text-slate-700 font-bold border-b-2 border-b-slate-300">
                {day}
              </th>
            ))}
            <th className="border bg-slate-200 border-b-2 border-b-slate-300" colSpan={12}></th>
          </tr>
        </thead>
        
        <tbody>
          {employees.map(emp => {
            const employeeData = data[year]?.[month]?.[emp.id] || {};
            
            // Collect counts
            const shiftCounts: Record<string, number> = {};
            for (let d = 1; d <= daysCount; d++) {
              const code = employeeData[d];
              if (code) {
                shiftCounts[code] = (shiftCounts[code] || 0) + 1;
              }
            }
            
            // Generate summary dynamically
            const summary = calculateEmployeeSummary(shiftCounts, salaryConfig, shiftTemplates, emp.baseSalaryDaily);

            return (
              <tr key={emp.id} className="hover:bg-slate-50 transition-colors group">
                <td className="frozen-column bg-white group-hover:bg-slate-50 border p-2 font-medium text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                  {emp.fullName}
                </td>
                
                {daysArray.map(day => {
                  const shiftCode = employeeData[day] || '';
                  return (
                    <td key={day} className="border p-0 text-center">
                      <CellDropdown 
                        value={shiftCode}
                        onChange={(val) => setShift(year, month, emp.id, day, val)}
                      />
                    </td>
                  );
                })}
                
                {/* Celdas de Resumen */}
                <td className="border p-2 text-center font-bold">{summary.mananaStr}</td>
                <td className="border p-2 text-center font-bold">{summary.tardeStr}</td>
                <td className="border p-2 text-center font-bold">{summary.completoStr}</td>
                <td className="border p-2 text-center font-bold text-blue-700 bg-blue-50">{summary.totalHours.toFixed(2)}</td>
                <td className="border p-2 text-center bg-indigo-50">{summary.nightSurchargeHours.toFixed(2)}</td>
                <td className="border p-2 text-right bg-indigo-50 font-medium">{formatCurrency(summary.nightSurchargeMoney)}</td>
                <td className="border p-2 text-center bg-purple-50">{summary.extraHours.toFixed(2)}</td>
                <td className="border p-2 text-right bg-purple-50 font-medium">{formatCurrency(summary.extraHoursMoney)}</td>
                <td className="border p-2 text-center bg-red-50">{summary.holidaysCount}</td>
                <td className="border p-2 text-right bg-rose-50 font-medium">{formatCurrency(summary.holidayOccasionalMoney)}</td>
                <td className="border p-2 text-right bg-rose-50 font-medium">{formatCurrency(summary.holidayHabitualMoney)}</td>
                <td className="border p-2 text-right bg-emerald-50 text-emerald-800 font-bold tracking-tight">
                  {formatCurrency(summary.totalSurchargeMoney)}
                </td>
              </tr>
            );
          })}
          
          {employees.length === 0 && (
            <tr>
              <td colSpan={daysCount + 13} className="p-8 text-center text-slate-400 border">
                No hay empleados. Importe o agregue empleados en Configuración.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
