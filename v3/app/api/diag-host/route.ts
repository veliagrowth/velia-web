// TEMPORAL — medición de recursos del host tras la Fase 2 (se revierte tras la medida).
// Sirve además para verificar el CD por push de la app velia-web-v3-prod.
import { NextResponse } from 'next/server';
import fs from 'node:fs';
import os from 'node:os';
import { execSync } from 'node:child_process';

export const dynamic = 'force-dynamic';

const TOKEN = 'velia-fase2-cierre-2026-07-22';

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
    disk = execSync('df -h /etc/hosts', { encoding: 'utf8' });
  } catch (e) {
    disk = `df error: ${String(e)}`;
  }

  return NextResponse.json({
    marker: 'cd-por-push-verificado',
    mem_total_mb: total,
    mem_available_mb: available,
    mem_used_mb: total !== null && available !== null ? total - available : null,
    loadavg: fs.readFileSync('/proc/loadavg', 'utf8').trim(),
    cpus: os.cpus().length,
    disk,
  });
}
