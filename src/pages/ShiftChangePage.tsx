import { useState } from 'react';
import { useReportsStore } from '../stores/reportsStore';
import { useEmployeesStore } from '../stores/employeesStore';
import { useSettingsStore } from '../stores/settingsStore';
import { ArrowRightLeft, Trash2 } from 'lucide-react';

export function ShiftChangePage() {
  const { shiftChanges, addShiftChange, deleteShiftChange } = useReportsStore();
  const { employees } = useEmployeesStore();
  const { casinos } = useSettingsStore();

  const [dateOrig, setDateOrig] = useState(new Date().toISOString().split('T')[0]);
  const [dateCambio, setDateCambio] = useState(new Date().toISOString().split('T')[0]);
  
  const [empReq, setEmpReq] = useState('');
  const [empSub, setEmpSub] = useState('');
  
  const [casinoOrig, setCasinoOrig] = useState('');
  const [casinoCambio, setCasinoCambio] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empReq || !empSub || !casinoOrig || !casinoCambio || !dateOrig || !dateCambio) return;

    if (empReq === empSub) {
      alert("El empleado que pide el cambio no puede ser el mismo que lo cubre");
      return;
    }

    const dYear = parseInt(dateOrig.substring(0,4));
    const dMonth = parseInt(dateOrig.substring(5,7));

    addShiftChange({
      id: Date.now().toString(),
      month: dMonth,
      year: dYear,
      requestingEmployeeId: empReq, // We store full name or ID (we will store name for simplicity in this MVP view)
      substituteEmployeeId: empSub,
      scheduledDate: dateOrig,
      changeDate: dateCambio,
      scheduledCasino: casinoOrig,
      changeCasino: casinoCambio
    });

    setEmpReq(''); setEmpSub(''); setCasinoOrig(''); setCasinoCambio('');
  };

  return (
    <div className="flex flex-col gap-4 h-full relative overflow-y-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Bitácora de Permutas</h2>
        <p className="text-sm text-slate-500">Documente históricamente los cambios de turno y reemplazos entre empleados.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col md:flex-row gap-6 items-center">
             
             {/* Box Empleado Original */}
             <div className="flex-1 bg-red-50 p-4 rounded-lg border border-red-100 max-w-sm w-full">
                <h4 className="font-bold text-red-800 mb-2 text-sm">Turno Original (Faltante)</h4>
                <div className="flex flex-col gap-2 text-sm">
                   <select className="border rounded p-1 w-full" value={empReq} onChange={e => setEmpReq(e.target.value)} required>
                     <option value="">¿Quién pide cambio?</option>
                     {employees.map(e => <option key={e.id} value={e.fullName}>{e.fullName}</option>)}
                   </select>
                   <input type="date" className="border rounded p-1 w-full" value={dateOrig} onChange={e => setDateOrig(e.target.value)} required />
                   <select className="border rounded p-1 w-full" value={casinoOrig} onChange={e => setCasinoOrig(e.target.value)} required>
                     <option value="">Casino Asignado</option>
                     {casinos.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
             </div>

             <ArrowRightLeft className="text-slate-300 w-8 h-8 hidden md:block" />

             {/* Box Empleado Nuevo */}
             <div className="flex-1 bg-emerald-50 p-4 rounded-lg border border-emerald-100 max-w-sm w-full">
                <h4 className="font-bold text-emerald-800 mb-2 text-sm">Turno Pagado (Sustituto)</h4>
                <div className="flex flex-col gap-2 text-sm">
                   <select className="border rounded p-1 w-full" value={empSub} onChange={e => setEmpSub(e.target.value)} required>
                     <option value="">¿Quién lo cubre/paga?</option>
                     {employees.map(e => <option key={e.id} value={e.fullName}>{e.fullName}</option>)}
                   </select>
                   <input type="date" className="border rounded p-1 w-full" value={dateCambio} onChange={e => setDateCambio(e.target.value)} required />
                   <select className="border rounded p-1 w-full" value={casinoCambio} onChange={e => setCasinoCambio(e.target.value)} required>
                     <option value="">Casino Cubierto</option>
                     {casinos.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
                   </select>
                </div>
             </div>
          </div>
          
          <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white font-bold py-2 px-6 rounded-lg transition self-start">
             Guardar Registro
          </button>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 p-4 pb-10">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b">
              <th className="p-2">Fecha Original</th>
              <th className="p-2">Promotor Faltante</th>
              <th className="p-2">Día Reposición</th>
              <th className="p-2">Promotor Sustituto</th>
              <th className="p-2">Casinos</th>
              <th className="p-2">Limpiar</th>
            </tr>
          </thead>
          <tbody>
            {shiftChanges.length === 0 && (
              <tr><td colSpan={6} className="p-4 text-center text-slate-400">No hay permutas registradas</td></tr>
            )}
            {shiftChanges.sort((a,b) => b.id.localeCompare(a.id)).map(s => (
              <tr key={s.id} className="border-b hover:bg-slate-50">
                <td className="p-2 font-mono text-red-600">{s.scheduledDate}</td>
                <td className="p-2 font-medium">{s.requestingEmployeeId}</td>
                <td className="p-2 font-mono text-emerald-600">{s.changeDate}</td>
                <td className="p-2 font-medium">{s.substituteEmployeeId}</td>
                <td className="p-2 text-xs text-slate-500">
                   {s.scheduledCasino} <br/> ⮑ {s.changeCasino}
                </td>
                <td className="p-2">
                   <button onClick={() => deleteShiftChange(s.id)} className="text-slate-400 hover:text-rose-500 transition">
                     <Trash2 className="w-4 h-4" />
                   </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
