import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');
const CONVERSIONS_FILE = path.join(DATA_DIR, 'conversions.json');

async function ensureDataDir() {
  try {
    await fs.mkdir(DATA_DIR, { recursive: true });
  } catch (e) {}
}

export async function saveConversion(original, converted, metadata) {
  await ensureDataDir();
  let data;
  try {
    const file = await fs.readFile(CONVERSIONS_FILE, 'utf-8');
    data = JSON.parse(file);
  } catch (e) {
    data = { conversions: [], stats: { total: 0, byType: {} } };
  }
  
  const conversion = {
    id: Date.now().toString(),
    original: original.substring(0, 1000), // Store truncated
    converted,
    metadata,
    createdAt: new Date().toISOString(),
  };
  
  data.conversions.unshift(conversion);
  data.conversions = data.conversions.slice(0, 100);
  data.stats.total++;
  data.stats.byType[metadata.type] = (data.stats.byType[metadata.type] || 0) + 1;
  
  await fs.writeFile(CONVERSIONS_FILE, JSON.stringify(data, null, 2));
  return conversion;
}

export async function getConversions() {
  await ensureDataDir();
  try {
    const file = await fs.readFile(CONVERSIONS_FILE, 'utf-8');
    return JSON.parse(file);
  } catch (e) {
    return { conversions: [], stats: { total: 0, byType: {} } };
  }
}
