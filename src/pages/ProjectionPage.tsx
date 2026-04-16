import { useState } from 'react';
import { ProjectionGrid } from '../components/Projection/ProjectionGrid';
import { ProjectionCoverage } from '../components/Projection/ProjectionCoverage';
import { MONTHS } from '../constants';
import { useEmployeesStore } from '../stores/employeesStore';
import { useSettingsStore } from '../stores/settingsStore';
import { useProjectionStore } from '../stores/projectionStore';
import { runAutoScheduler } from '../utils/autoScheduler';
import { Wand2, Printer, FileSpreadsheet } from 'lucide-react';
import * as XLSX from 'xlsx';

export function ProjectionPage() {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [msg, setMsg] = useState('');

  const { employees } = useEmployeesStore();
  const { shiftTemplates } = useSettingsStore();
  const { data, mergeMonthData, isHoliday } = useProjectionStore();

  const handleMagicFill = () => {
    if (employees.length === 0) {
      setMsg('Agrega empleados en Configuración primero.');
      return;
    }
    const result = runAutoScheduler(year, month, employees, shiftTemplates, isHoliday, data);
    mergeMonthData(year, month, result);
    setMsg('¡Mes asignado inteligentemente!');
    setTimeout(() => setMsg(''), 3000);
  };

  const handleExportExcel = () => {
    setMsg('Exportando reporte, un momento...');
    setTimeout(() => {
      const tableElt = document.getElementById('projection-table');
      if (tableElt) {
        const wb = XLSX.utils.table_to_book(tableElt, { sheet: `Mes_${month}` });
        XLSX.writeFile(wb, `Proyeccion_Turnos_${year}_${month}.xlsx`);
        setMsg('¡Exportación a Excel exitosa!');
      } else {
        setMsg('Error: No se encontró la tabla de proyección.');
      }
      setTimeout(() => setMsg(''), 3000);
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col gap-4 h-full relative">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold text-slate-800">Proyección de Turnos</h2>
          <p className="text-sm text-slate-500">Gestione la programación mensual de los empleados.</p>
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

          <button 
            onClick={handleMagicFill}
            className="ml-2 bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow hover:scale-105 transition flex items-center gap-2"
            title="Asignar turnos del mes equitativamente (respeta los turnos que ya hayas asignado manualmente)"
          >
            <Wand2 className="w-4 h-4" />
            Mágica / Asignar
          </button>
          <button 
            onClick={handleExportExcel}
            className="ml-2 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow transition flex items-center gap-2 print:hidden"
            title="Exportar archivo de Excel"
          >
            <FileSpreadsheet className="w-4 h-4" />
            Excel
          </button>
          
          <button 
            onClick={handlePrint}
            className="ml-2 bg-slate-600 hover:bg-slate-700 text-white px-3 py-1.5 rounded-lg text-sm font-bold shadow transition flex items-center gap-2 print:hidden"
            title="Imprimir o Guardar como PDF"
          >
            <Printer className="w-4 h-4" />
            PDF
          </button>
        </div>
      </div>
      
      {msg && <div className="absolute top-16 right-4 z-50 bg-emerald-100 text-emerald-800 px-4 py-2 rounded shadow border border-emerald-200 font-medium">{msg}</div>}

      <div className="flex-1 pb-10">
        <ProjectionGrid year={year} month={month} />
        <ProjectionCoverage year={year} month={month} />
      </div>
    </div>
  );
}
