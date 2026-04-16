// Utilidad simple para parsear texto de CSV en cliente
export function parseCSV(text: string): string[][] {
  const lines = text.split(/\r?\n/).filter(line => line.trim() !== '');
  return lines.map(line => line.split(',').map(cell => cell.trim()));
}
