📋 Lista de Requerimientos — App React "Proyección de Turnos Casino"
1. DATOS Y MODELOS
1.1 Empleados (Promotores)
Mantener una lista editable de empleados (16 actualmente) con nombre completo (APELLIDO NOMBRE)
Los empleados se usan como opciones en selectores/dropdowns en toda la app
1.2 Casinos y Convenciones de Turno
4 casinos: DIAMONDS (D), PALACE (P), CAFÉ Y FORTUNA (CF), BARCELONA (B)
6 tipos de turno por casino (24 códigos totales):
Casino	Completo	Mañana	Tarde	Festivo	Mañana Fest.	Tarde Fest.
DIAMONDS	D	MD	TD	DFD	MFD	TFD
PALACE	P	MP	TP	DFP	MFP	TFP
CAFÉ Y FORTUNA	CF	MC	TC	DFC	MFC	TFC
BARCELONA	B	MB	TB	DFB	MFB	TFB
1.3 Horarios por Tipo de Turno (constantes configurables)
Cada código de turno tiene hora de INGRESO y SALIDA (formato decimal de hora):

Código	Ingreso	Salida	Duración (días)
D	7:55	23:15	0.6389
MD	7:55	16:00	0.3368
TD	15:30	23:15	0.3229
P	7:55	22:15	0.5972
MP	7:55	15:30	0.3160
TP	15:00	22:15	0.3021
CF	7:55	23:15	0.6389
MC	7:55	16:00	0.3368
TC	15:30	23:15	0.3229
B	9:30	22:05	0.5243
MB	9:20	16:10	0.2847
TB	15:40	22:00	0.2639
DFD	8:55	21:15	0.5139
DFP	8:55	21:15	0.5139
DFC	8:55	19:15	0.4306
DFB	9:20	19:05	0.4063
TFB	13:40	18:40	0.2083
MFB	9:20	14:20	0.2083
TFD	13:05	21:05	0.3333
MFD	8:45	16:45	0.3333
TFP	12:45	20:45	0.3333
MFP	8:45	16:45	0.3333
TFC	13:30	18:40	0.2153
MFC	8:55	15:55	0.2917
1.4 Constantes Salariales (configurables desde UI)
Salario base diario: $7,959
Umbral recargo nocturno: 0.35 (como fracción del día = 8:24 horas)
Multiplicador horas extras: 1.25
Tasa recargo nocturno por hora: $2,785.65
Tasa horas extras por hora: $9,948.75
Umbral jornada máxima: 7.333 horas (7h 20min) → lo que exceda = horas extras
Tasa festivo trabajo ocasional: $6,367.20
Tasa festivo trabajo habitual: $14,326.20
Umbral festivo habitual: >2 festivos/mes → los que excedan de 2 se pagan como habitual
2. MÓDULO: PROYECCIÓN DE TURNOS (Pantalla principal)
2.1 Grilla de Programación Mensual
Selector de Mes (1-12) y Año
Grilla tipo spreadsheet: filas = empleados, columnas = días del mes (1-31 según mes)
Fila de encabezado muestra: número de día + día de la semana (L, M, MI, J, V, S, D)
Los domingos y días festivos deben tener color diferente en el encabezado
Cada celda es un dropdown/selector con los 24 códigos de turno + vacío (día libre/descanso)
Color coding de celdas según casino: cada casino con un color distinto para identificación visual rápida
La primera columna está fija (frozen) para siempre ver el nombre del empleado
Las primeras 6 filas están fijas como encabezados
2.2 Conteo Automático de Turnos por Empleado
A la derecha de la grilla de días, mostrar automáticamente el conteo de cada uno de los 24 códigos de turno (COUNTIF equivalente)
Ejemplo: para ALARCON → D:1, MD:0, TD:2, P:1, MP:5, TP:2, CF:1, MC:3, TC:2, B:4, MB:1, TB:0, DFD:1, DFP:0, DFC:0, DFB:1, etc.
2.3 Resumen de Turnos por Empleado (cálculos automáticos)
Columnas de resumen calculadas automáticamente:

Columna	Fórmula
MAÑANA	Suma de: MP + MC + MD + MFP + MFC + MFB + MFD
TARDE	Suma de: TD + TP + TC + TFD + TFP + TFC + TFB
DÍA (completo)	Suma de: D + P + CF + B
TOTAL HORAS	Sumatoria ponderada: cada conteo × duración del turno correspondiente
RECARGOS NOCTURNOS (fracción)	Para turnos con salida después de las 21:00: (hora_salida - umbral_nocturno) × conteo. Solo aplica a turnos completos y de tarde con salida nocturna: D, TD, P, TP, CF, TC, B, TB, DFD, DFP, DFC
RECARGOS NOCTURNOS (horas)	MAX(fracción × 24, 0)
RECARGOS NOCTURNOS ($)	horas × tasa_nocturno ($2,785.65)
HORAS EXTRAS (fracción)	TOTAL_HORAS - umbral_jornada_máxima (7.333)
HORAS EXTRAS (horas)	MAX(fracción × 24, 0)
HORAS EXTRAS ($)	horas × tasa_extras ($9,948.75)
N° FESTIVOS	Suma de DFD + DFP + DFC + DFB
HORAS FESTIVO	SUMPRODUCT de conteos festivos × duraciones festivas
HORAS FESTIVO (decimal)	MAX(horas × 24, 0)
FESTIVO OCASIONAL (horas)	Si N°festivos ≤ 2: todas las horas. Si >2: (horas_totales/N°festivos) × 2
FESTIVO OCASIONAL ($)	horas_ocasional × tasa_ocasional ($6,367.20)
FESTIVO HABITUAL (horas)	Si N°festivos > 2: (horas_totales/N°festivos) × (N°festivos - 2). Sino: 0
FESTIVO HABITUAL ($)	horas_habitual × tasa_habitual ($14,326.20)
TOTAL RECARGOS ($)	nocturno$ + extras$ + ocasional$ + habitual$
2.4 Resumen de Cobertura por Casino por Día
Debajo de la grilla de empleados, tabla resumen que muestra por cada día:
DIAMONDS: cuántos empleados tienen turno D ese día
DIAMONDS MAÑANA: cuántos tienen MD
DIAMONDS TARDE: cuántos tienen TD
CAFÉ Y FORTUNA: cuántos tienen CF
CAFÉ Y FORTUNA MAÑANA: cuántos tienen MC
CAFÉ Y FORTUNA TARDE: cuántos tienen TC
PALACE: cuántos tienen P
PALACE MAÑANA: cuántos tienen MP
PALACE TARDE: cuántos tienen TP
BARCELONA: cuántos tienen B (+ MB + TB en filas separadas)
Resaltar visualmente si algún casino tiene 0 personas asignadas en un día laborable
3. MÓDULO: HORARIO DETALLADO
3.1 Vista de Horario con Horas Reales
Grilla expandida: por cada día muestra 3 sub-columnas: INGRESO, SALIDA, CONVENCIÓN
El código de convención se jala de la Proyección
Las horas de ingreso/salida se determinan automáticamente según el código de turno
Clasificar cada turno como "Temprano" o "Tarde" comparando contra los horarios de referencia de cada convención
Fila adicional por empleado que calcula las horas realmente trabajadas por día (Salida - Ingreso)
3.2 Cálculos de Horario
Mismos cálculos de resumen que en Proyección pero usando horas reales registradas
Sección de RECARGO NOCTURNO con: horas, enteros (÷24), valor en $
Sección de HORAS EXTRAS con: horas, enteros, valor en $
Sección de FESTIVOS con: N° de domingos/festivos, horas de recargos, enteros, valor ocasional, valor habitual
TOTAL GENERAL por empleado
4. MÓDULO: CAMBIO DE TURNO
4.1 Formulario de Registro
Campos: Mes, Casino programado, Promotor solicitante, Turno programado (fecha), Fecha de cambio, Casino de cambio, Promotor con quien se cambia
Validación: fechas dentro del mes seleccionado
Los selectores de promotor usan la lista de empleados
Los selectores de casino usan los 4 casinos + sus turnos
4.2 Tabla de Cambios Registrados
Vista tipo tabla con todos los cambios del mes
Posibilidad de editar y eliminar registros
5. MÓDULO: REPORTE DE DESCUADRES
5.1 Formulario de Registro
Campos: Mes de reporte, Promotor (Apellido-Nombre), Casino, Fecha de descuadre, Valor (numérico $), ¿Se canceló? (SI/NO), Fecha de cancelación, Observaciones
Validación: si "Se canceló = NO", fecha de cancelación queda inhabilitada
5.2 Tabla de Descuadres
Vista con filtros por mes, casino, promotor, estado (cancelado/pendiente)
6. MÓDULO: CONFIGURACIÓN
6.1 Gestión de Empleados
CRUD de empleados (agregar, editar, eliminar)
Al agregar/eliminar un empleado se actualiza automáticamente la grilla de proyección
6.2 Gestión de Convenciones
Editar horarios de ingreso/salida por tipo de turno
Agregar/eliminar casinos y sus convenciones
6.3 Parámetros Salariales
Editar todas las constantes: salario base, tasas de recargo, umbrales, multiplicadores
Los cambios se reflejan inmediatamente en los cálculos
6.4 Días Festivos
Marcar qué días del mes son festivos (afecta los códigos DFx y el color del encabezado)
7. REQUISITOS TÉCNICOS
7.1 Stack y Arquitectura
React 18+ con TypeScript
Estado: Zustand o Context API para estado global
Persistencia local: localStorage o IndexedDB para guardar datos (sin backend)
Exportar/Importar: botón para exportar datos como JSON y reimportar
UI Library: Tailwind CSS + componentes tipo tabla/spreadsheet (TanStack Table o similar)
7.2 Performance
La grilla puede tener 16+ empleados × 31 días = 496+ celdas editables. Usar virtualización si es necesario
Los cálculos de resumen deben ser reactivos (recalcularse al cambiar cualquier celda)
Memoización de cálculos pesados con useMemo
7.3 UX
Responsive: debe funcionar en desktop (prioridad) y tablet
Atajos de teclado: navegación por flechas en la grilla, Enter para confirmar, Tab para siguiente celda
Undo/Redo: al menos 1 nivel de deshacer en la grilla
Copiar/Pegar: permitir pegar códigos de turno en múltiples celdas
Impresión: vista optimizada para imprimir la proyección mensual
7.4 Validaciones de Negocio
Un empleado no puede tener más de 6 días consecutivos trabajados sin descanso
Alertar si un empleado tiene 0 días de descanso en la semana
Alertar si un casino tiene menos de 1 persona asignada en día laborable
Validar que no se asigne turno festivo en día no marcado como festivo
8. ESTRUCTURA DE ARCHIVOS SUGERIDA
src/ ├── types/ # TypeScript interfaces (Employee, Shift, Convention, etc.) ├── constants/ # Shift codes, default schedules, salary rates ├── stores/ # Zustand stores (employees, projection, schedule) ├── hooks/ # Custom hooks (useProjectionCalc, useShiftValidation) ├── components/ │ ├── Projection/ # Grilla principal, resumen por empleado, cobertura casino │ ├── Schedule/ # Horario detallado con ING/SLD │ ├── ShiftChange/ # Formulario y tabla de cambios de turno │ ├── Discrepancy/ # Reporte de descuadres │ ├── Settings/ # Configuración de empleados, convenciones, parámetros │ └── shared/ # Componentes reutilizables (CellDropdown, DataTable) ├── utils/ # Cálculos (nocturno, extras, festivos, totales) └── App.tsx