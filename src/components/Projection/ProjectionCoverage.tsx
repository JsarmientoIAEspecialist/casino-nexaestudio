import { useMemo } from 'react';
import { useEmployeesStore } from '../../stores/employeesStore';
import { useProjectionStore } from '../../stores/projectionStore';
import { useSettingsStore } from '../../stores/settingsStore';
import { getDaysInMonth } from 'date-fns';
import { cn } from '../../lib/utils';

interface Props {
  year: number;
  month: number;
}

export function ProjectionCoverage({ year, month }: Props) {
  const { employees } = useEmployeesStore();
  const { data } = useProjectionStore();
  const { casinos, shiftTemplates } = useSettingsStore();

  const daysCount = useMemo(() => getDaysInMonth(new Date(year, month - 1, 1)), [year, month]);
  const daysArray = Array.from({ length: daysCount }, (_, i) => i + 1);

  // precalcular counts por día { [day]: { [casinoId]: { [tipo]: count } } }
  // O simplemente calcular al vuelo
  
  // Categorias comunes de resúmen por casino según spec:
  // DIAMONDS, DIAMONDS MAÑANA, DIAMONDS TARDE, etc.
  
  return (
    <div className="w-full mt-8 mb-8 overflow-x-auto shadow-sm border border-slate-200 rounded-lg bg-white">
      <div className="p-3 bg-slate-800 border-b border-slate-700">
        <h3 className="text-white font-semibold text-sm">Resumen Cobertura por Casino</h3>
      </div>
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr>
             <th className="frozen-column bg-slate-100 border p-2 text-left min-w-[200px] shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
               Casino / Turno
             </th>
             {daysArray.map(day => (
               <th key={day} className="border p-1 bg-slate-50 text-slate-600 font-medium min-w-[40px]">
                 {day}
               </th>
             ))}
          </tr>
        </thead>
        <tbody>
          {casinos.map((casino) => {
             const casinoTemplates = shiftTemplates.filter(t => t.casino === casino.code);
             
             // Por simplicidad, unificaremos en Completo, Mañana y Tarde.
             // Identificado por nombre.
             const groups = [
               { label: `${casino.name} COMPLETO`, filterNames: ['Completo', 'Festivo'] },
               { label: `${casino.name} MAÑANA`, filterNames: ['Mañana', 'Mañana Fest.'] },
               { label: `${casino.name} TARDE`, filterNames: ['Tarde', 'Tarde Fest.'] }
             ];

             return groups.map((g) => (
                <tr key={`${casino.code}-${g.label}`} className="hover:bg-slate-50">
                  <td className="frozen-column bg-white border p-2 font-medium text-xs text-slate-700 shadow-[2px_0_5px_-2px_rgba(0,0,0,0.1)]">
                    <span className={cn("px-2 py-0.5 rounded", casino.color)}>{g.label}</span>
                  </td>
                  {daysArray.map(day => {
                    // Contar empleados con estos turnos hoy
                    let count = 0;
                    for (const emp of employees) {
                      const empCode = data[year]?.[month]?.[emp.id]?.[day];
                      if (empCode) {
                        const template = casinoTemplates.find(t => t.code === empCode);
                        if (template && g.filterNames.includes(template.name)) {
                          count++;
                        }
                      }
                    }
                    // Validar si aplica según spec

                    return (
                      <td key={day} className={cn("border p-1 text-center text-xs font-bold",
                         count > 0 ? "text-slate-800" : "text-slate-300",
                         // isZeroInWorkday ? "bg-red-50 text-red-400" : "" // Validar si aplica según spec
                      )}>
                        {count}
                      </td>
                    )
                  })}
                </tr>
             ));
          })}
        </tbody>
      </table>
    </div>
  );
}
