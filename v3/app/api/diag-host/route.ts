// TEMPORAL — Fase 0 migración Coolify: lee métricas del HOST desde el contenedor
// (/proc/meminfo no está namespaceado en Docker → muestra la RAM del box entero).
// Se elimina con un revert en cuanto se tome la medida.
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import os from 'node:os';
import { execSync } from 'node:child_process';

export const dynamic = 'force-dynamic';

const TOKEN = 'velia-fase0-2026-07-22';

export async function GET(req: Request) {
  const url = new URL(req.url);
  if (url.searchParams.get('t') !== TOKEN) {
    return NextResponse.json({ error: 'not found' }, { status: 404 });
  }

  const meminfo = fs.readFileSync('/proc/meminfo', 'utf8');
  const mb = (key: string) => {
    const m = meminfo.match(new RegExp(`^${key}:\\s+(\\d+) kB`, 'm'));
    return m ? Math.round(parseInt(m[1], 10) / 1024) : null;
  };

  const total = mb('MemTotal');
  const available = mb('MemAvailable');

  let disk = 'n/a';
  try {
    // /etc/hosts es bind-mount del filesystem raíz del host → df sobre él = disco del host
    disk = execSync('df -h / /etc/hosts', { encoding: 'utf8' });
  } catch (e) {
    disk = `df error: ${String(e)}`;
  }

  return NextResponse.json({
    mem_total_mb: total,
    mem_available_mb: available,
    mem_used_mb: total !== null && available !== null ? total - available : null,
    swap_total_mb: mb('SwapTotal'),
    swap_free_mb: mb('SwapFree'),
    loadavg: fs.readFileSync('/proc/loadavg', 'utf8').trim(),
    cpus: os.cpus().length,
    uptime_days: Math.round((os.uptime() / 86400) * 10) / 10,
    disk,
  });
}
