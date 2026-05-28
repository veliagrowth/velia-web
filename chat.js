/* VELIA chat widget — Fase A (UI + flujos hardcoded).
   Fase B reemplazará handleUserMessage() por fetch a /api/velia-chat. */
(function () {
  if (window.__veliaChatLoaded) return;
  window.__veliaChatLoaded = true;

  /* ───────── State ───────── */
  const SKEY = 'velia_chat_v1';
  const sessionId = (function () {
    let s = sessionStorage.getItem(SKEY + '_session');
    if (!s) { s = 'vc-' + Date.now().toString(36) + '-' + Math.random().toString(36).slice(2, 8); sessionStorage.setItem(SKEY + '_session', s); }
    return s;
  })();
  let messages = JSON.parse(sessionStorage.getItem(SKEY + '_messages') || '[]');
  let welcomed = sessionStorage.getItem(SKEY + '_welcomed') === '1';
  let lastReplies = JSON.parse(sessionStorage.getItem(SKEY + '_replies') || 'null');
  let open = false;
  let typing = false;

  /* ───────── Hardcoded flows (Fase A) ───────── */
  const WELCOME = 'Hola, soy VELIA. Te puedo contar qué hacemos, recomendarte qué encaja con tu negocio o agendar una llamada de 30 minutos sin compromiso. ¿Por dónde empezamos?';

  const INITIAL_REPLIES = [
    { id: 'que-es',   label: '¿Qué es VELIA?' },
    { id: 'precios',  label: 'Precios' },
    { id: 'como',     label: 'Cómo funciona' },
    { id: 'casos',    label: 'Casos' },
    { id: 'sector',   label: 'Mi sector' },
    { id: 'agendar',  label: 'Agendar llamada' }
  ];

  const MENU_CHIP = { id: 'menu', label: '↺ Otras opciones' };
  const AGENDAR_CHIP = { id: 'agendar', label: 'Agendar auditoría →' };

  const RESPONSES = {
    // ── Nivel 1 ────────────────────────────────────────────────────────────
    'que-es': {
      reply: 'VELIA construye sistemas operativos a medida por sector. Hoy tenemos uno activo —VELIA Legal, para despachos de abogados— y cuatro en early access (E-commerce, Clínicas, Agencias e Inmobiliarias).\n\nLo que nos diferencia: integramos captación, gestión y atención en una sola capa, en lugar de cinco herramientas sueltas que no hablan entre sí.',
      replies: [
        { id: 'sector', label: '¿Para mi sector?' },
        { id: 'que-incluye', label: '¿Qué incluye el sistema?' },
        { id: 'diferencia', label: '¿Diferencia con un CRM?' },
        { id: 'precios', label: 'Precios' },
        AGENDAR_CHIP
      ]
    },
    'diferencia': {
      reply: 'Un CRM (Clio, MyCase, Aranzadi…) solo te da el panel de gestión. Tú sigues necesitando pagar aparte SEO, contenido, ads, web, Google Business, atención WhatsApp.\n\nVELIA lo monta TODO conectado en una sola capa. Lead que entra por Instagram → CRM en 5 minutos → respuesta automática → cita agendada → expediente abierto. Esto es lo que la competencia no tiene.',
      replies: [
        { id: 'precios', label: 'Precios' },
        { id: 'casos', label: 'Caso real' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },
    'que-incluye': {
      reply: 'Tres bloques siempre presentes:\n\n• Gestión — clientes, expedientes, plazos, facturación, audit RGPD.\n• Captación — SEO local, Google Business, contenido orgánico, Meta Ads + web a medida.\n• Atención — WhatsApp + email + booking público integrado.\n\nTodo conectado bajo tu branding.',
      replies: [
        { id: 'precios', label: 'Precios' },
        { id: 'recomendar', label: 'Recomiéndame tier' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },

    // ── Pricing branch ─────────────────────────────────────────────────────
    'precios': {
      reply: 'Pricing de VELIA Legal (mensual, sin IVA, sin permanencia):\n\n• Starter — 600 €/mes\n• Pro — 1.200 €/mes\n• Élite — 2.500 €/mes\n\nLa implementación se cierra por escrito tras una auditoría gratuita de 30 minutos. Los verticales en early access tienen condiciones reducidas de por vida para los Design Partners.',
      replies: [
        { id: 'detalle-tiers', label: '¿Qué incluye cada tier?' },
        { id: 'recomendar', label: 'Recomiéndame tier' },
        { id: 'permanencia', label: '¿Hay permanencia?' },
        AGENDAR_CHIP
      ]
    },
    'detalle-tiers': {
      reply: '• Starter (600€/mes) — 1 abogado, panel completo, booking, SEO local, GMB y 4 piezas/mes.\n• Pro (1.200€/mes) — hasta 5 abogados, todo Starter + Ads (Meta o Google), 8 piezas, automatizaciones y reunión mensual de estrategia.\n• Élite (2.500€/mes) — abogados ilimitados, todo Pro + Lexnet + Verifactu + portal cliente premium + soporte prioritario.',
      replies: [
        { id: 'recomendar', label: '¿Cuál me toca?' },
        { id: 'permanencia', label: '¿Permanencia?' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },
    'recomendar': {
      reply: 'Para recomendarte tier necesito una cosa: ¿cuántos abogados sois en el despacho?',
      replies: [
        { id: 'tam-1',  label: 'Yo solo' },
        { id: 'tam-2',  label: '2-5 abogados' },
        { id: 'tam-3',  label: 'Más de 5' }
      ]
    },
    'tam-1': {
      reply: 'Para 1 abogado: Starter (600 €/mes) cubre el 100% de lo que necesitas — panel, captación local y atención. Si en 6 meses creces, subes a Pro sin permanencia.',
      replies: [AGENDAR_CHIP, { id: 'detalle-tiers', label: 'Ver detalle' }, MENU_CHIP]
    },
    'tam-2': {
      reply: 'Para 2-5 abogados: Pro (1.200 €/mes) es la elección. Añade Ads, automatizaciones y reunión mensual de estrategia. Es el tier en el que está la mayoría de despachos pequeños y medianos.',
      replies: [AGENDAR_CHIP, { id: 'detalle-tiers', label: 'Ver detalle' }, MENU_CHIP]
    },
    'tam-3': {
      reply: 'Para más de 5 abogados: Élite (2.500 €/mes). Cubre abogados ilimitados, integraciones críticas (Lexnet, Verifactu), portal cliente premium y soporte prioritario. Pensado para despachos con varios departamentos.',
      replies: [AGENDAR_CHIP, { id: 'detalle-tiers', label: 'Ver detalle' }, MENU_CHIP]
    },
    'permanencia': {
      reply: 'No hay permanencia. Mensualidad mes a mes. Si cancelas, tus expedientes siguen en TU Google Drive (modelo BYO-Drive) — conservas el acceso completo a todos los documentos.',
      replies: [
        { id: 'cancelar', label: '¿Y si cancelo?' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },
    'cancelar': {
      reply: 'Si cancelas: dejas de pagar el mes siguiente, conservas el acceso a tus expedientes en Drive, y los assets generados (web, contenido, branding) son tuyos. Sin sorpresas ni cláusulas de salida.',
      replies: [AGENDAR_CHIP, MENU_CHIP]
    },

    // ── Cómo funciona ──────────────────────────────────────────────────────
    'como': {
      reply: 'Tres pasos:\n\n1. Auditoría gratuita de 30 minutos — evaluamos encaje y proponemos alcance.\n2. Implementación a medida — entre 2 y 6 semanas según el alcance.\n3. Sistema activo — mensualidad fija + evolución continua con el equipo VELIA.',
      replies: [
        { id: 'audit-detalle', label: '¿Qué se evalúa en la auditoría?' },
        { id: 'tiempo', label: '¿Tan rápido se implanta?' },
        AGENDAR_CHIP
      ]
    },
    'audit-detalle': {
      reply: 'En los 30 minutos de auditoría revisamos: tu operativa actual (qué herramientas usas), tu fuente de captación (boca a boca, referidos, web), tu volumen y tipología de caso, y dónde se te va el tiempo.\n\nSalimos de la llamada con un diagnóstico claro y un alcance propuesto por escrito en 48 horas.',
      replies: [AGENDAR_CHIP, MENU_CHIP]
    },
    'tiempo': {
      reply: 'Starter se monta en 2-3 semanas. Pro en 3-4. Élite en 4-6 semanas (por las integraciones Lexnet/Verifactu). Durante ese tiempo seguimos disponibles 1:1 — no te dejamos en cola de soporte.',
      replies: [AGENDAR_CHIP, MENU_CHIP]
    },

    // ── Casos ──────────────────────────────────────────────────────────────
    'casos': {
      reply: 'Cónsul Jurídico (Iván Cónsul, despacho legal) es nuestro cliente activo desde marzo 2026.\n\nResultado del primer mes: +260% de consultas captadas y 12 horas/semana recuperadas en gestión interna.\n\nPuedes ver su web en consuljuridico.com.',
      replies: [
        { id: 'ver-cj', label: 'Abrir consuljuridico.com', url: 'https://consuljuridico.com' },
        { id: 'que-le-cambio', label: '¿Qué le cambió a Iván?' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },
    'que-le-cambio': {
      reply: 'Antes: era el único que cogía el teléfono y respondía consultas a medianoche. Sin previsibilidad de leads, sin tiempo para captar.\n\nAhora: el sistema responde por él en menos de 5 minutos, agenda consulta automática, abre expediente. Iván dedica su tiempo a llevar el caso, no a captarlo.',
      replies: [AGENDAR_CHIP, { id: 'ver-cj', label: 'Ver consuljuridico.com', url: 'https://consuljuridico.com' }, MENU_CHIP]
    },

    // ── Mi sector ──────────────────────────────────────────────────────────
    'sector': {
      reply: '¿Cuál es tu sector?',
      replies: [
        { id: 's-legal',  label: 'Despacho legal' },
        { id: 's-ecomm',  label: 'Tienda online / D2C' },
        { id: 's-clinic', label: 'Clínica / consulta' },
        { id: 's-agency', label: 'Agencia de servicios' },
        { id: 's-estate', label: 'Inmobiliaria' },
        { id: 's-otro',   label: 'Otro' }
      ]
    },
    's-legal': {
      reply: 'VELIA Legal está operativo. Es lo que usa Cónsul Jurídico. Si quieres ver la página del producto con todos los detalles, el botón te lleva. Y si prefieres saltarte el material y verlo en persona, agendamos directamente.',
      replies: [
        { id: 'open-legal', label: 'Ver VELIA Legal →', url: 'productos/velia-legal.html' },
        { id: 'precios', label: 'Precios Legal' },
        AGENDAR_CHIP, MENU_CHIP
      ]
    },
    's-ecomm': {
      reply: 'VELIA E-comm está en early access. Buscamos 5 design partners (tiendas online / D2C) con precio reducido de por vida + voz directa en el roadmap. ¿Te interesa entrar como uno de los 5?',
      replies: [
        { id: 'agendar', label: 'Sí, agendar diagnóstico' },
        { id: 'open-ecomm', label: 'Ver página E-comm →', url: 'productos/e-comm.html' },
        MENU_CHIP
      ]
    },
    's-clinic': {
      reply: 'VELIA Clinic está en early access. Buscamos 5 clínicas como design partners con precio reducido de por vida. Si gestionas pacientes, agenda y captación local, es para ti.',
      replies: [
        { id: 'agendar', label: 'Sí, agendar diagnóstico' },
        { id: 'open-clinic', label: 'Ver página Clinic →', url: 'productos/clinic.html' },
        MENU_CHIP
      ]
    },
    's-agency': {
      reply: 'VELIA Agency está en early access. Buscamos 5 agencias de servicios como design partners. Si te quedaste sin capacidad y no quieres contratar a nadie más, esto es para ti.',
      replies: [
        { id: 'agendar', label: 'Sí, agendar diagnóstico' },
        { id: 'open-agency', label: 'Ver página Agency →', url: 'productos/agency.html' },
        MENU_CHIP
      ]
    },
    's-estate': {
      reply: 'VELIA Estate está en early access. Buscamos 5 inmobiliarias o promotoras como design partners. Si generas leads de sobra pero pierdes oportunidades por seguimientos lentos, te encaja.',
      replies: [
        { id: 'agendar', label: 'Sí, agendar diagnóstico' },
        { id: 'open-estate', label: 'Ver página Estate →', url: 'productos/estate.html' },
        MENU_CHIP
      ]
    },
    's-otro': {
      reply: 'No tenemos un vertical paquetizado para tu sector todavía, pero si la operativa se parece a la de cualquiera de los 5 (captación + gestión + atención) podemos hablarlo en la auditoría y ver si encaja un sistema a medida.',
      replies: [AGENDAR_CHIP, MENU_CHIP]
    },

    // ── Agendar (final funnel) ─────────────────────────────────────────────
    'agendar': {
      reply: 'Perfecto. La auditoría es de 30 minutos y sin compromiso. Te llevo a la página de contacto para que reserves directamente en el calendario.',
      replies: [{ id: 'go-contacto', label: 'Ir a contacto →', url: 'contacto.html?from=chat' }]
    },
    'go-contacto': { reply: '', replies: [] },

    // ── Menu helper ────────────────────────────────────────────────────────
    'menu': {
      reply: '¿Qué te enseño?',
      replies: INITIAL_REPLIES
    }
  };

  const FALLBACK = {
    reply: 'Esa pregunta merece una respuesta detallada y específica para tu caso. El asistente conversacional completo lo lanzamos en breve — de momento, lo mejor es una llamada corta de 30 minutos con alguien del equipo. Sin compromiso.',
    replies: [AGENDAR_CHIP, { id: 'que-es', label: '¿Qué es VELIA?' }, { id: 'precios', label: 'Precios' }, MENU_CHIP]
  };

  /* ───────── Persistence ───────── */
  function persist() {
    sessionStorage.setItem(SKEY + '_messages', JSON.stringify(messages.slice(-40)));
    sessionStorage.setItem(SKEY + '_welcomed', welcomed ? '1' : '0');
    sessionStorage.setItem(SKEY + '_replies', JSON.stringify(lastReplies));
  }

  /* ───────── Path helpers ───────── */
  // Páginas en /productos/* necesitan ../ delante de URLs absolutas-de-sitio.
  const inSub = location.pathname.split('/').filter(Boolean).length > 1 && /\/productos\//.test(location.pathname);
  function resolveUrl(u) {
    if (!u) return null;
    if (/^https?:/.test(u) || u.startsWith('/')) return u;
    return (inSub ? '../' : '') + u;
  }

  /* ───────── CSS ───────── */
  const css = `
  #velia-chat,#velia-chat *{box-sizing:border-box;font-family:'Montserrat',system-ui,sans-serif}
  #vc-toggle{position:fixed;bottom:32px;right:32px;z-index:9000;width:60px;height:60px;border-radius:50%;background:#0A0A0F;border:1px solid rgba(201,169,110,.28);box-shadow:0 8px 28px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,border-color .25s,opacity .2s;padding:0}
  #vc-toggle svg{width:30px;height:30px;display:block;overflow:visible}
  #vc-toggle .vc-v-line{fill:none;stroke:#F5F3EE;stroke-width:18;stroke-linecap:round;stroke-opacity:.92}
  #vc-toggle .vc-v-dot{fill:#C9A96E}
  #vc-toggle:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 38px rgba(0,0,0,.42);border-color:rgba(201,169,110,.52)}
  #vc-toggle .vc-pulse{position:absolute;inset:-2px;border-radius:50%;border:1px solid rgba(201,169,110,.4);animation:vcPulse 2.6s ease-out infinite;pointer-events:none}
  @keyframes vcPulse{0%{transform:scale(1);opacity:.7}80%,100%{transform:scale(1.35);opacity:0}}
  #vc-toggle.is-open{opacity:0;pointer-events:none;transform:scale(.85)}
  @media(max-width:600px){#vc-toggle{bottom:20px;right:20px;width:56px;height:56px}#vc-toggle svg{width:28px;height:28px}}

  #vc-panel{position:fixed;bottom:32px;right:32px;z-index:9001;width:380px;height:580px;max-height:calc(100vh - 64px);background:#F4F1EB;color:#0A0A0F;border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28),0 4px 16px rgba(0,0,0,.12);display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;transform:translateY(16px) scale(.96);transform-origin:bottom right;transition:opacity .28s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1)}
  #vc-panel.is-open{opacity:1;pointer-events:auto;transform:none}
  @media(max-width:600px){#vc-panel{inset:0;width:100%;height:100%;max-height:100%;border-radius:0;bottom:0;right:0}}

  #vc-header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#0A0A0F;color:#EDE9E1;flex-shrink:0}
  #vc-avatar{width:38px;height:38px;border-radius:50%;background:#1C1C28;border:1px solid rgba(201,169,110,.32);display:flex;align-items:center;justify-content:center;flex-shrink:0}
  #vc-avatar svg{width:20px;height:20px;display:block;overflow:visible}
  #vc-avatar .vc-v-line{fill:none;stroke:#F5F3EE;stroke-width:22;stroke-linecap:round;stroke-opacity:.92}
  #vc-avatar .vc-v-dot{fill:#C9A96E}
  #vc-name{font-size:14px;font-weight:700;letter-spacing:-.005em;line-height:1.1}
  #vc-status{font-size:9px;font-weight:600;letter-spacing:.18em;text-transform:uppercase;color:rgba(237,233,225,.55);margin-top:3px;display:flex;align-items:center;gap:6px}
  #vc-status .vc-dot{width:6px;height:6px;border-radius:50%;background:#34D399;box-shadow:0 0 6px rgba(52,211,153,.6)}
  #vc-header-meta{flex:1;min-width:0}
  #vc-close{margin-left:auto;width:30px;height:30px;border-radius:50%;background:rgba(237,233,225,.08);border:0;color:rgba(237,233,225,.65);cursor:pointer;font-size:18px;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .2s,color .2s,transform .2s}
  #vc-close:hover{background:rgba(237,233,225,.16);color:#EDE9E1;transform:rotate(90deg)}

  #vc-msgs{flex:1;overflow-y:auto;padding:18px 16px 8px;display:flex;flex-direction:column;gap:10px;scroll-behavior:smooth}
  #vc-msgs::-webkit-scrollbar{width:6px}
  #vc-msgs::-webkit-scrollbar-thumb{background:rgba(10,10,15,.15);border-radius:6px}
  .vc-bubble{max-width:82%;padding:10px 14px;border-radius:16px;font-size:13.5px;line-height:1.55;letter-spacing:-.005em;white-space:pre-wrap;word-wrap:break-word}
  .vc-bubble.bot{align-self:flex-start;background:#EDE9E1;color:#0A0A0F;border:1px solid rgba(10,10,15,.06);border-bottom-left-radius:4px}
  .vc-bubble.user{align-self:flex-end;background:#0A0A0F;color:#EDE9E1;border-bottom-right-radius:4px}
  .vc-bubble a{color:#9A7840;font-weight:600;text-decoration:underline;text-underline-offset:2px}
  .vc-typing{align-self:flex-start;background:#EDE9E1;border:1px solid rgba(10,10,15,.06);padding:14px 18px;border-radius:16px;border-bottom-left-radius:4px;display:flex;gap:5px}
  .vc-typing span{width:6px;height:6px;background:rgba(10,10,15,.4);border-radius:50%;animation:vcType 1.2s infinite ease-in-out}
  .vc-typing span:nth-child(2){animation-delay:.15s}
  .vc-typing span:nth-child(3){animation-delay:.3s}
  @keyframes vcType{0%,60%,100%{transform:translateY(0);opacity:.45}30%{transform:translateY(-4px);opacity:1}}

  #vc-quickreply{padding:0 16px 10px;display:flex;flex-wrap:wrap;gap:6px;flex-shrink:0}
  .vc-chip{background:transparent;border:1px solid rgba(10,10,15,.14);color:rgba(10,10,15,.72);padding:7px 12px;border-radius:100px;font-family:'Montserrat',sans-serif;font-size:11.5px;font-weight:500;cursor:pointer;transition:border-color .2s,background .2s,color .2s;letter-spacing:-.005em;white-space:nowrap}
  .vc-chip:hover{border-color:rgba(201,169,110,.5);background:rgba(201,169,110,.06);color:#0A0A0F}

  #vc-form{display:flex;align-items:center;gap:10px;padding:12px 14px;border-top:1px solid rgba(10,10,15,.07);background:#F4F1EB;flex-shrink:0}
  #vc-input{flex:1;border:0;background:transparent;font-family:'Montserrat',sans-serif;font-size:13.5px;color:#0A0A0F;outline:none;padding:8px 4px}
  #vc-input::placeholder{color:rgba(10,10,15,.4)}
  #vc-send{width:36px;height:36px;border-radius:50%;border:0;background:#C9A96E;color:#0A0A0F;cursor:pointer;font-weight:700;font-size:15px;line-height:1;display:flex;align-items:center;justify-content:center;transition:background .2s,transform .15s;flex-shrink:0}
  #vc-send:hover{background:#E8D5B0;transform:scale(1.06)}
  #vc-send:disabled{opacity:.4;cursor:not-allowed;transform:none}

  #vc-disclaimer{font-size:9.5px;color:rgba(10,10,15,.4);text-align:center;padding:0 16px 10px;letter-spacing:0;font-weight:400;line-height:1.4;flex-shrink:0}

  @media(prefers-reduced-motion:reduce){#vc-toggle,#vc-panel,.vc-typing span,#vc-toggle .vc-pulse{transition:none!important;animation:none!important}}
  `;

  const style = document.createElement('style');
  style.textContent = css;
  document.head.appendChild(style);

  /* ───────── DOM ───────── */
  const root = document.createElement('div');
  root.id = 'velia-chat';
  const V_SVG = '<svg viewBox="0 0 400 400" xmlns="http://www.w3.org/2000/svg" aria-hidden="true"><line class="vc-v-line" x1="110" y1="110" x2="200" y2="290"/><line class="vc-v-line" x1="200" y1="290" x2="290" y2="110"/><circle class="vc-v-dot" cx="200" cy="290" r="18"/></svg>';

  root.innerHTML = `
    <button id="vc-toggle" type="button" aria-label="Abrir chat con VELIA">${V_SVG}<span class="vc-pulse"></span></button>
    <div id="vc-panel" role="dialog" aria-modal="false" aria-label="Chat con VELIA">
      <header id="vc-header">
        <div id="vc-avatar">${V_SVG}</div>
        <div id="vc-header-meta">
          <div id="vc-name">VELIA</div>
          <div id="vc-status"><span class="vc-dot"></span>Asistente IA · en línea</div>
        </div>
        <button id="vc-close" type="button" aria-label="Cerrar chat">&times;</button>
      </header>
      <div id="vc-msgs" aria-live="polite"></div>
      <div id="vc-quickreply"></div>
      <form id="vc-form" autocomplete="off">
        <input id="vc-input" type="text" placeholder="Escribe tu pregunta..." aria-label="Escribe tu mensaje"/>
        <button id="vc-send" type="submit" aria-label="Enviar">→</button>
      </form>
      <div id="vc-disclaimer">Hablas con el asistente IA de VELIA</div>
    </div>
  `;
  document.body.appendChild(root);

  const $toggle = root.querySelector('#vc-toggle');
  const $panel  = root.querySelector('#vc-panel');
  const $close  = root.querySelector('#vc-close');
  const $msgs   = root.querySelector('#vc-msgs');
  const $qr     = root.querySelector('#vc-quickreply');
  const $form   = root.querySelector('#vc-form');
  const $input  = root.querySelector('#vc-input');
  const $send   = root.querySelector('#vc-send');

  /* ───────── Render ───────── */
  function scrollBottom() { requestAnimationFrame(() => { $msgs.scrollTop = $msgs.scrollHeight; }); }

  function renderMessage(m) {
    const div = document.createElement('div');
    div.className = 'vc-bubble ' + m.role;
    // links autodetect
    const safe = m.text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
    div.innerHTML = safe.replace(/(https?:\/\/[^\s<]+)|((?:^|\s)([a-z0-9-]+\.[a-z]{2,}(?:\/[^\s<]*)?))/gi, function(_, full, _wsg, bare){
      if (full) return `<a href="${full}" target="_blank" rel="noopener">${full}</a>`;
      return `<a href="https://${bare}" target="_blank" rel="noopener">${bare}</a>`;
    });
    $msgs.appendChild(div);
  }

  function renderAll() {
    $msgs.innerHTML = '';
    messages.forEach(renderMessage);
    // Safety net: si hay conversación previa pero ningún chip persistido, vuelve al menú.
    if (welcomed && messages.length > 0 && (!lastReplies || lastReplies.length === 0)) {
      lastReplies = INITIAL_REPLIES;
      persist();
    }
    if (lastReplies && lastReplies.length) {
      // Re-renderiza chips persistidos sin volver a invocar persist (evita loop).
      $qr.innerHTML = '';
      lastReplies.forEach(r => {
        const b = document.createElement('button');
        b.type = 'button';
        b.className = 'vc-chip';
        b.textContent = r.label;
        b.dataset.id = r.id;
        if (r.url) b.dataset.url = r.url;
        b.addEventListener('click', () => handleQuickReply(r));
        $qr.appendChild(b);
      });
    }
    scrollBottom();
  }

  function setQuickReplies(list) {
    lastReplies = list && list.length ? list : null;
    persist();
    $qr.innerHTML = '';
    if (!lastReplies) return;
    lastReplies.forEach(r => {
      const b = document.createElement('button');
      b.type = 'button';
      b.className = 'vc-chip';
      b.textContent = r.label;
      b.dataset.id = r.id;
      if (r.url) b.dataset.url = r.url;
      b.addEventListener('click', () => handleQuickReply(r));
      $qr.appendChild(b);
    });
  }

  function showTyping() {
    typing = true;
    const t = document.createElement('div');
    t.className = 'vc-typing';
    t.id = 'vc-typing-indicator';
    t.innerHTML = '<span></span><span></span><span></span>';
    $msgs.appendChild(t);
    scrollBottom();
  }
  function hideTyping() {
    typing = false;
    const t = document.getElementById('vc-typing-indicator');
    if (t) t.remove();
  }

  /* ───────── Flow ───────── */
  function addMessage(role, text) {
    messages.push({ role, text, ts: Date.now() });
    persist();
    renderMessage(messages[messages.length - 1]);
    scrollBottom();
  }

  function botRespond(reply, replies, delayMs) {
    setQuickReplies([]);
    showTyping();
    setTimeout(() => {
      hideTyping();
      if (reply) addMessage('bot', reply);
      if (replies && replies.length) setQuickReplies(replies);
    }, delayMs || 750);
  }

  function handleQuickReply(r) {
    addMessage('user', r.label);
    // url-only chips navigate
    if (r.url) {
      const url = resolveUrl(r.url);
      setTimeout(() => { window.open(url, r.id && r.id.startsWith('v-') ? '_blank' : '_self'); }, 250);
      return;
    }
    const res = RESPONSES[r.id] || FALLBACK;
    botRespond(res.reply, res.replies, 700 + Math.random() * 300);
  }

  function handleUserMessage(text) {
    if (!text) return;
    addMessage('user', text);
    $input.value = '';
    // Fase A: respuesta fallback consistente. Fase B: fetch /api/velia-chat.
    botRespond(FALLBACK.reply, FALLBACK.replies, 900 + Math.random() * 400);
  }

  /* ───────── Toggle ───────── */
  function openPanel() {
    open = true;
    $panel.classList.add('is-open');
    $toggle.classList.add('is-open');
    if (!welcomed) {
      welcomed = true;
      persist();
      setTimeout(() => {
        addMessage('bot', WELCOME);
        setQuickReplies(INITIAL_REPLIES);
      }, 280);
    } else if (!lastReplies || lastReplies.length === 0) {
      setQuickReplies(INITIAL_REPLIES);
    }
    setTimeout(() => $input.focus({ preventScroll: true }), 320);
  }
  function closePanel() {
    open = false;
    $panel.classList.remove('is-open');
    $toggle.classList.remove('is-open');
  }

  $toggle.addEventListener('click', () => open ? closePanel() : openPanel());
  $close.addEventListener('click', closePanel);
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && open) closePanel(); });

  $form.addEventListener('submit', e => {
    e.preventDefault();
    const v = $input.value.trim();
    if (!v || typing) return;
    handleUserMessage(v);
  });

  /* ───────── Initial render ───────── */
  renderAll();
  // No quick-replies hasta abrir el panel.
})();
