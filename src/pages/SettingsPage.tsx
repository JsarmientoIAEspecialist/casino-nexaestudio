import { useState } from 'react';
import { useEmployeesStore } from '../stores/employeesStore';
import { useSettingsStore } from '../stores/settingsStore';
import { parseCSV } from '../utils/csvParser';
import { Upload, Download } from 'lucide-react';

export function SettingsPage() {
  const { employees, addEmployee, deleteEmployee, updateEmployee } = useEmployeesStore();
  const { shiftTemplates, updateShiftTemplates, casinos, salaryConfig, updateSalaryConfig } = useSettingsStore();
  const [msg, setMsg] = useState('');
  const [msgConv, setMsgConv] = useState('');

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = parseCSV(text);
      let count = 0;
      
      // Asumimos que los empleados pueden venir en 1 columna (Nombre Completo)
      // O ignoramos cabeceras si la primera fila dice "Empleado" o "Nombre"
      for (const row of rows) {
        const name = row[0];
        if (name && name.toLowerCase() !== 'empleado' && name.toLowerCase() !== 'nombre' && name.trim() !== '') {
          addEmployee({ id: Date.now().toString() + Math.random(), fullName: name.toUpperCase() });
          count++;
        }
      }
      setMsg(`¡Se importaron ${count} empleados correctamente!`);
      e.target.value = ''; // Reset input
    };
    reader.readAsText(file, 'ISO-8859-1'); // Soporte para Ñ y Tildes de Excel
  };

  const handleConvencionesUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (evt) => {
      const text = evt.target?.result as string;
      const rows = parseCSV(text);
      
      let currentCasino = '';
      const newTemplates = [...shiftTemplates];
      let importedCount = 0;

      for (let i = 0; i < rows.length; i++) {
        const row = rows[i];
        if (row.length < 3) continue;
        
        let casinoStr = row[0]?.trim();
        const turnoStr = row[1]?.trim();
        const codeStr = row[2]?.trim();

        if (casinoStr) {
          if (casinoStr.toUpperCase() !== 'CASINO' && casinoStr.toUpperCase() !== 'CONVENCIONES') {
            currentCasino = casinoStr;
          }
        } else {
          casinoStr = currentCasino;
        }

        if (casinoStr && turnoStr && codeStr && codeStr !== 'CONVENCION') {
           // Chequear si existe para no borrar las horas de los existentes
           const existingIndex = newTemplates.findIndex(t => t.code === codeStr);
           
           // Encontrar el código del casino correspondiente al string actual o crearlo
           let matchingCasino = casinos.find(c => c.name.toUpperCase() === casinoStr.toUpperCase());
           let casinoCode: any = matchingCasino ? matchingCasino.code : casinoStr.substring(0,2).toUpperCase();

           if (existingIndex >= 0) {
             newTemplates[existingIndex] = { ...newTemplates[existingIndex], name: turnoStr, casino: casinoCode };
           } else {
             newTemplates.push({
               code: codeStr,
               casino: casinoCode,
               name: turnoStr,
               startHour: 8.0, // Default for new ones
               endHour: 16.0,
               durationDays: 0.33
             });
           }
           importedCount++;
        }
      }
      
      updateShiftTemplates(newTemplates);
      setMsgConv(`¡Se actualizaron/importaron ${importedCount} convenciones! (Revisa las horas default si creaste nuevas)`);
      e.target.value = '';
    };
    reader.readAsText(file, 'ISO-8859-1'); // Soporte para Ñ y Tildes de Excel
  };

  const downloadEmployeeTemplate = () => {
    // UTF-8 BOM helps Excel detect UTF-8 correctly
    const csvContent = "Nombre Completo\nALBERTO GOMEZ\nJUAN PEREZ";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "plantilla_empleados.csv";
    link.click();
  };

  const downloadConventionsTemplate = () => {
    const csvContent = "CASINO,TURNO,CONVENCION\nDIAMONDS,Turno completo,D\n,Turno mañana,MD\n,Turno tarde,TD\nPALACE,Turno completo,P\n";
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "plantilla_convenciones.csv";
    link.click();
  };

  const updateEmpSalary = (id: string, val: string) => {
    const num = Number(val);
    updateEmployee(id, { baseSalaryDaily: isNaN(num) || num <= 0 ? undefined : num });
  };

  const handleAddDemo = () => {
    addEmployee({ id: Date.now().toString(), fullName: "NUEVO EMPLEADO DEMO" });
  };

  return (
    <div className="flex flex-col gap-4 h-full">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Configuración</h2>
        <p className="text-sm text-slate-500">Administre empleados, convenciones y parámetros salariales. Puede importar sus listados mediante CSV.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Panel Empleados */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Gestión de Empleados</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <button onClick={handleAddDemo} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition">
              + Empleado Demo
            </button>
            <label className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm border hover:bg-slate-200 transition cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importar
              <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload} />
            </label>
            <button onClick={downloadEmployeeTemplate} className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm border hover:bg-slate-50 transition flex items-center gap-2" title="Descargar plantilla de ejemplo">
              <Download className="w-4 h-4" />
              Plantilla
            </button>
          </div>
          
          {msg && <p className="text-emerald-600 text-sm mb-4 font-medium">{msg}</p>}

          <ul className="space-y-2 max-h-96 overflow-y-auto">
            {employees.map(emp => (
              <li key={emp.id} className="flex flex-col gap-2 p-3 border rounded-lg bg-slate-50">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-slate-700">{emp.fullName}</span>
                  <button 
                    onClick={() => deleteEmployee(emp.id)}
                    className="text-red-500 hover:text-red-700 text-sm font-semibold transition"
                  >
                    Eliminar
                  </button>
                </div>
                <div className="text-sm flex items-center gap-2">
                   <span className="text-slate-500">Salario Diario: $</span>
                   <input 
                     type="number"
                     className="border rounded px-2 py-1 w-28 text-slate-800"
                     placeholder={salaryConfig.baseSalaryDaily.toString()}
                     defaultValue={emp.baseSalaryDaily}
                     onBlur={(e) => updateEmpSalary(emp.id, e.target.value)}
                   />
                </div>
              </li>
            ))}
            {employees.length === 0 && (
              <p className="text-slate-400 text-sm text-center py-4">No hay empleados registrados. Importe un CSV o cree uno demo.</p>
            )}
          </ul>
        </div>

        {/* Panel Parámetros Globales */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Parámetros Económicos Globales</h3>
          <p className="text-sm text-slate-500 mb-4">Ajuste las tarifas globales que rigen los cálculos. Estas escalas subirán proporcionalmente para aquellos empleados con sueldos mayores.</p>
          
          <div className="space-y-3">
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Salario Mínimo Base (Diario default)</span>
                <input type="number" 
                   value={salaryConfig.baseSalaryDaily}
                   onChange={e => updateSalaryConfig({ baseSalaryDaily: Number(e.target.value) })}
                   className="border rounded px-2 py-1 w-24 text-right outline-blue-500" />
             </div>
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Tarifa Horas Extras ($)</span>
                <input type="number" 
                   value={salaryConfig.extraHoursRate}
                   onChange={e => updateSalaryConfig({ extraHoursRate: Number(e.target.value) })}
                   className="border rounded px-2 py-1 w-24 text-right outline-blue-500" />
             </div>
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Recargo Nocturno ($/hr)</span>
                <input type="number" 
                   value={salaryConfig.nightSurchargeHourRate}
                   onChange={e => updateSalaryConfig({ nightSurchargeHourRate: Number(e.target.value) })}
                   className="border rounded px-2 py-1 w-24 text-right outline-blue-500" />
             </div>
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Día Festivo Ocasional ($)</span>
                <input type="number" 
                   value={salaryConfig.occasionalHolidayRate}
                   onChange={e => updateSalaryConfig({ occasionalHolidayRate: Number(e.target.value) })}
                   className="border rounded px-2 py-1 w-24 text-right outline-blue-500" />
             </div>
             <div className="flex justify-between items-center border-b pb-2">
                <span className="text-sm font-medium">Día Festivo Habitual ($)</span>
                <input type="number" 
                   value={salaryConfig.habitualHolidayRate}
                   onChange={e => updateSalaryConfig({ habitualHolidayRate: Number(e.target.value) })}
                   className="border rounded px-2 py-1 w-24 text-right outline-blue-500" />
             </div>
          </div>
        </div>

        {/* Panel Convenciones */}
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
          <h3 className="font-semibold text-lg mb-4">Gestión de Convenciones</h3>
          
          <div className="flex flex-wrap gap-2 mb-4">
            <label className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg text-sm border hover:bg-slate-200 transition cursor-pointer flex items-center gap-2">
              <Upload className="w-4 h-4" />
              Importar
              <input type="file" accept=".csv" className="hidden" onChange={handleConvencionesUpload} />
            </label>
            <button onClick={downloadConventionsTemplate} className="bg-white text-slate-700 px-4 py-2 rounded-lg text-sm border hover:bg-slate-50 transition flex items-center gap-2" title="Descargar plantilla de ejemplo">
              <Download className="w-4 h-4" />
              Plantilla
            </button>
          </div>
          
          {msgConv && <p className="text-emerald-600 text-sm mb-4 font-medium">{msgConv}</p>}

          <div className="space-y-4 max-h-96 overflow-y-auto">
            {casinos.map(casino => {
              const casinoTemplates = shiftTemplates.filter(t => t.casino === casino.code);
              return (
                <div key={casino.code} className="border rounded-lg p-3 bg-slate-50">
                  <h4 className="font-bold text-slate-800 border-b pb-2 mb-2">{casino.name}</h4>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-2">
                    {casinoTemplates.map(t => (
                      <div key={t.code} className="bg-white p-2 border rounded shadow-sm text-sm flex justify-between">
                         <span className="text-slate-600 truncate mr-2" title={t.name}>{t.name}</span>
                         <span className="font-mono font-bold text-blue-600 shrink-0">{t.code}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
