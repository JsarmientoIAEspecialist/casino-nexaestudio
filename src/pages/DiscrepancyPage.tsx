import { useState } from 'react';
import { useReportsStore } from '../stores/reportsStore';
import { useEmployeesStore } from '../stores/employeesStore';
import { useSettingsStore } from '../stores/settingsStore';
import { Trash2 } from 'lucide-react';
import { cn } from '../lib/utils';

export function DiscrepancyPage() {
  const { discrepancies, addDiscrepancy, updateDiscrepancy, deleteDiscrepancy } = useReportsStore();
  const { employees } = useEmployeesStore();
  const { casinos } = useSettingsStore();

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [empName, setEmpName] = useState('');
  const [casino, setCasino] = useState('');
  const [val, setVal] = useState('');
  const [obs, setObs] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!empName || !casino || !val || !date) return;

    // Para no lidiar con timezone off-by-one errors sumamos al timezone, pero podemos tomar directo
    const dYear = parseInt(date.substring(0,4));
    const dMonth = parseInt(date.substring(5,7));

    addDiscrepancy({
      id: Date.now().toString(),
      month: dMonth,
      year: dYear,
      date,
      employeeName: empName,
      casino,
      value: Number(val),
      isCanceled: false,
      observations: obs
    });

    setVal(''); setObs(''); setEmpName(''); setCasino('');
  };

  const formatCurrency = (amount: number) => 
    new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="flex flex-col gap-4 h-full relative overflow-y-auto">
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-bold text-slate-800">Descuadres de Caja</h2>
        <p className="text-sm text-slate-500">Registre y lleve trazabilidad de los descuadres económicos de los promotores.</p>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200">
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end">
          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-slate-600">Fecha del Descuadre</label>
             <input type="date" className="border rounded p-2" value={date} onChange={e => setDate(e.target.value)} required />
          </div>
          <div className="flex flex-col gap-1 md:col-span-1">
             <label className="text-xs font-bold text-slate-600">Empleado</label>
             <select className="border rounded p-2 bg-white" value={empName} onChange={e => setEmpName(e.target.value)} required>
               <option value="">Seleccionar...</option>
               {employees.map(e => <option key={e.id} value={e.fullName}>{e.fullName}</option>)}
             </select>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-slate-600">Casino</label>
             <select className="border rounded p-2 bg-white" value={casino} onChange={e => setCasino(e.target.value)} required>
               <option value="">Seleccionar...</option>
               {casinos.map(c => <option key={c.code} value={c.name}>{c.name}</option>)}
             </select>
          </div>
          <div className="flex flex-col gap-1">
             <label className="text-xs font-bold text-slate-600">Monto ($)</label>
             <input type="number" className="border rounded p-2" min="1" value={val} onChange={e => setVal(e.target.value)} required placeholder="Ej: 50000" />
          </div>
          <div className="flex flex-col gap-1 md:col-span-1">
             <label className="text-xs font-bold text-slate-600">Observaciones</label>
             <input type="text" className="border rounded p-2" value={obs} onChange={e => setObs(e.target.value)} placeholder="Opcional" />
          </div>
          <div className="flex flex-col gap-1">
             <button type="submit" className="bg-rose-600 hover:bg-rose-700 text-white font-bold p-2 rounded transition">
               Registrar
             </button>
          </div>
        </form>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 flex-1 p-4 pb-10">
        <table className="w-full text-sm text-left border-collapse">
          <thead>
            <tr className="bg-slate-100 border-b">
              <th className="p-2">Fecha</th>
              <th className="p-2">Empleado</th>
              <th className="p-2">Casino</th>
              <th className="p-2">Monto ($)</th>
              <th className="p-2">Estado</th>
              <th className="p-2">Observaciones</th>
              <th className="p-2">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {discrepancies.length === 0 && (
              <tr><td colSpan={7} className="p-4 text-center text-slate-400">No hay descuadres reportados</td></tr>
            )}
            {discrepancies.sort((a,b) => b.id.localeCompare(a.id)).map(d => (
              <tr key={d.id} className="border-b hover:bg-slate-50">
                <td className="p-2 font-mono">{d.date}</td>
                <td className="p-2 font-medium">{d.employeeName}</td>
                <td className="p-2">{d.casino}</td>
                <td className="p-2 font-bold text-rose-600">{formatCurrency(d.value)}</td>
                <td className="p-2">
                   <button 
                     onClick={() => updateDiscrepancy(d.id, { isCanceled: !d.isCanceled })}
                     className={cn("px-2 py-1 text-xs rounded-full font-bold", d.isCanceled ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700")}
                   >
                     {d.isCanceled ? 'Cancelado (Pagado)' : 'Pendiente'}
                   </button>
                </td>
                <td className="p-2 text-slate-500">{d.observations}</td>
                <td className="p-2">
                   <button onClick={() => deleteDiscrepancy(d.id)} className="text-slate-400 hover:text-rose-500 transition" title="Eliminar registro">
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
