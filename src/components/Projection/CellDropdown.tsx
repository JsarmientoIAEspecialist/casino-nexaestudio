import { useState, useRef, useEffect } from 'react';
import { useSettingsStore } from '../../stores/settingsStore';
import { cn } from '../../lib/utils';

interface Props {
  value: string;
  onChange: (val: string) => void;
}

export function CellDropdown({ value, onChange }: Props) {
  const { shiftTemplates, casinos } = useSettingsStore();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const template = shiftTemplates.find(t => t.code === value);
  const casino = template ? casinos.find(c => c.code === template.casino) : null;
  const colorClass = casino ? casino.color : 'bg-transparent text-slate-700';

  return (
    <div className="relative w-full h-full min-w-[50px]" ref={containerRef}>
      <button
        className={cn(
          "w-full h-full min-h-[30px] flex items-center justify-center text-xs font-bold outline-none border focus:ring-2 focus:ring-blue-400 transition-colors",
          value ? colorClass : "hover:bg-slate-50 border-transparent",
        )}
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Backspace' || e.key === 'Delete') {
            onChange('');
            setIsOpen(false);
          }
        }}
        title={template ? `${template.name} (${casino?.name})` : 'Día Libre'}
      >
        {value}
      </button>

      {isOpen && (
        <div className="absolute z-50 top-full left-0 mt-1 w-48 bg-white border shadow-xl rounded-lg max-h-64 overflow-y-auto grid grid-cols-4 gap-1 p-2">
          <div className="col-span-4 pb-1 mb-1 border-b">
            <button 
              className="w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-100 text-slate-500 font-medium"
              onClick={() => { onChange(''); setIsOpen(false); }}
            >
              (Libre/Descanso)
            </button>
          </div>
          
          {shiftTemplates.map((t) => {
            const cInfo = casinos.find(c => c.code === t.casino);
            return (
              <button
                key={t.code}
                onClick={() => { onChange(t.code); setIsOpen(false); }}
                className={cn(
                  "p-1 text-xs font-bold border rounded flex items-center justify-center transition-transform hover:scale-105",
                  cInfo?.color || "bg-slate-100"
                )}
                title={t.name}
              >
                {t.code}
              </button>
            )
          })}
        </div>
      )}
    </div>
  );
}
