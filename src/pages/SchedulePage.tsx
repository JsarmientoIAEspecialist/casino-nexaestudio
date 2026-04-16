import { useState } from 'react';
import { useEmployeesStore } from '../stores/employeesStore';
import { useProjectionStore } from '../stores/projectionStore';
import { useSettingsStore } from '../stores/settingsStore';
import { getDaysInMonth, getDay } from 'date-fns';
import { MONTHS } from '../constants';
import { cn } from '../lib/utils';

const WEEKDAYS = ['D', 'L', 'M', 'X', 'J', 'V', 'S'];

function formatDecimalTime(decimalTime: number): string {
  const h = Math.floor(decimalTime);
  const m = Math.round((decimalTime - h) * 60);
  return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
}

export function SchedulePage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);

  const { employees } = useEmployeesStore();
  const { data } = useProjectionStore();
  const { shiftTemplates } = useSettingsStore();

  const daysCount = getDaysInMonth(new Date(year, month - 1, 1));
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  return (
    <div className="flex flex-col gap-4 h-full relative">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Horario Detallado</h2>
          <p className="text-sm text-slate-500">Visualización de horas de ingreso y salida por empleado (Solo Lectura).</p>
        </div>
        
        <div className="flex items-center gap-3 bg-slate-50 p-2 rounded-lg border">
          <select 
            value={month} 
            onChange={(e) => setMonth(Number(e.target.value))}
            className="bg-white border rounded px-3 py-1.5 text-sm font-medium outline-none focus:ring-2 focus:ring-blue-500"
          >
            {MONTHS.map(m => (
              <option key={m.value} value={m.value}>{m.name}</option>
            ))}
          </select>
          
          <input 
            type="number" 
            value={year}
            onChange={(e) => setYear(Number(e.target.value))}
            className="bg-white border rounded px-3 py-1.5 text-sm font-medium w-24 outline-none focus:ring-2 focus:ring-blue-500"
            min={2020} max={2100}
          />
        </div>
      </div>

      <div className="flex-1 pb-10">
         <div className="w-full overflow-x-auto shadow-sm border border-slate-200 rounded-lg bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr>
                  <th className="frozen-column bg-slate-100 border p-2 text-left min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    Promotor
                  </th>
                  {daysArray.map(day => {
                    const dayIndex = getDay(new Date(year, month - 1, day));
                    const isSunday = dayIndex === 0;
                    return (
                      <th key={day} className={cn("border min-w-[80px] p-1 text-center font-bold text-xs bg-slate-50", isSunday && "text-red-600")}>
                        {day} <span className="opacity-50">({WEEKDAYS[dayIndex]})</span>
                      </th>
                    );
                  })}
                </tr>
              </thead>
              <tbody>
                {employees.map(emp => {
                  const employeeData = data[year]?.[month]?.[emp.id] || {};
                  return (
                    <tr key={emp.id} className="hover:bg-slate-50 transition-colors">
                      <td className="frozen-column bg-white border p-2 font-medium text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                        {emp.fullName}
                      </td>
                      {daysArray.map(day => {
                        const shiftCode = employeeData[day];
                        const template = shiftTemplates.find(t => t.code === shiftCode);
                        return (
                          <td key={day} className="border p-2 text-center text-xs font-mono">
                            {template ? (
                               <div className="flex flex-col">
                                 <span className="font-bold text-slate-800">{template.code}</span>
                                 <span className="text-slate-500">{formatDecimalTime(template.startHour)}-{formatDecimalTime(template.endHour)}</span>
                               </div>
                            ) : (
                               <span className="text-slate-300">-</span>
                            )}
                          </td>
                        );
                      })}
                    </tr>
                  );
                })}
                {employees.length === 0 && (
                   <tr><td colSpan={daysCount + 1} className="p-8 text-center text-slate-400">Sin registros de empleados</td></tr>
                )}
              </tbody>
            </table>
         </div>
      </div>
    </div>
  );
}
