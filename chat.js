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

  const SECTOR_REPLIES = [
    { id: 'v-legal',  label: 'Legal · activo',          url: 'productos/velia-legal.html' },
    { id: 'v-ecomm',  label: 'E-commerce · early',      url: 'productos/e-comm.html' },
    { id: 'v-clinic', label: 'Clínicas · early',        url: 'productos/clinic.html' },
    { id: 'v-agency', label: 'Agencias · early',        url: 'productos/agency.html' },
    { id: 'v-estate', label: 'Inmobiliarias · early',   url: 'productos/estate.html' }
  ];

  const RESPONSES = {
    'que-es': {
      reply: 'VELIA construye sistemas operativos a medida por sector. Hoy tenemos uno activo —VELIA Legal, para despachos de abogados— y cuatro en early access (E-commerce, Clínicas, Agencias e Inmobiliarias).\n\nLo que nos diferencia: integramos captación, gestión y atención en una sola capa, en lugar de cinco herramientas sueltas que no hablan entre sí.',
      replies: [{ id: 'sector', label: 'Ver verticales' }, { id: 'precios', label: 'Precios' }, { id: 'agendar', label: 'Agendar llamada' }]
    },
    'precios': {
      reply: 'Pricing de VELIA Legal (mensual, sin IVA, sin permanencia):\n\n• Starter — 600 €/mes\n• Pro — 1.200 €/mes\n• Élite — 2.500 €/mes\n\nLa implementación se construye a medida y se cierra por escrito tras una auditoría gratuita de 30 minutos. Los verticales en early access tienen condiciones reducidas de por vida para los Design Partners.',
      replies: [{ id: 'que-incluye', label: '¿Qué incluye cada tier?' }, { id: 'agendar', label: 'Agendar auditoría' }]
    },
    'que-incluye': {
      reply: 'Resumen rápido:\n\n• Starter — 1 abogado, panel completo, booking, SEO local, GMB y 4 piezas de contenido/mes.\n• Pro — hasta 5 abogados, todo Starter + Ads, 8 piezas, automatizaciones y reunión mensual.\n• Élite — abogados ilimitados, todo Pro + integración Lexnet + Verifactu + soporte prioritario.',
      replies: [{ id: 'agendar', label: 'Agendar auditoría' }, { id: 'casos', label: 'Ver casos' }]
    },
    'como': {
      reply: 'Tres pasos:\n\n1. Auditoría gratuita de 30 minutos — evaluamos encaje y proponemos alcance.\n2. Implementación a medida — entre 2 y 6 semanas según el alcance.\n3. Sistema activo — mensualidad fija + evolución continua con el equipo VELIA.',
      replies: [{ id: 'agendar', label: 'Reservar auditoría' }, { id: 'casos', label: 'Ver casos' }]
    },
    'casos': {
      reply: 'Cónsul Jurídico (Iván Cónsul, despacho legal) es nuestro cliente activo desde marzo 2026.\n\nResultado del primer mes: +260% de consultas captadas y 12 horas/semana recuperadas en gestión interna.\n\nPuedes ver su web en consuljuridico.com.',
      replies: [{ id: 'agendar', label: 'Agendar llamada' }, { id: 'sector', label: 'Ver verticales' }]
    },
    'sector': {
      reply: 'Tenemos sistema para cinco sectores. ¿Cuál es el tuyo? (Al pulsar te llevo a la página del producto.)',
      replies: SECTOR_REPLIES
    },
    'agendar': {
      reply: 'Perfecto. La auditoría es de 30 minutos y sin compromiso. Te llevo a la página de contacto para que reserves directamente en el calendario.',
      replies: [{ id: 'go-contacto', label: 'Ir a contacto →', url: 'contacto.html?from=chat' }]
    },
    'go-contacto': { reply: '', replies: [] }
  };

  const FALLBACK = {
    reply: 'Para responder a esto con el detalle que mereces, lo mejor es una llamada corta con alguien del equipo. ¿Te agendo una auditoría gratuita de 30 minutos?',
    replies: [{ id: 'agendar', label: 'Sí, agendar' }, { id: 'que-es', label: 'Cuéntame antes qué es VELIA' }]
  };

  /* ───────── Persistence ───────── */
  function persist() {
    sessionStorage.setItem(SKEY + '_messages', JSON.stringify(messages.slice(-40)));
    sessionStorage.setItem(SKEY + '_welcomed', welcomed ? '1' : '0');
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
  #vc-toggle{position:fixed;bottom:32px;right:32px;z-index:9000;width:60px;height:60px;border-radius:50%;background:#0A0A0F;color:#EDE9E1;border:1px solid rgba(201,169,110,.28);box-shadow:0 8px 28px rgba(0,0,0,.32);display:flex;align-items:center;justify-content:center;cursor:pointer;transition:transform .25s cubic-bezier(.16,1,.3,1),box-shadow .25s,border-color .25s,opacity .2s;font-family:'Montserrat',sans-serif;font-weight:800;font-size:24px;letter-spacing:-.02em;padding:0;line-height:1}
  #vc-toggle:hover{transform:translateY(-3px) scale(1.04);box-shadow:0 14px 38px rgba(0,0,0,.42);border-color:rgba(201,169,110,.52)}
  #vc-toggle .vc-pulse{position:absolute;inset:-2px;border-radius:50%;border:1px solid rgba(201,169,110,.4);animation:vcPulse 2.6s ease-out infinite;pointer-events:none}
  @keyframes vcPulse{0%{transform:scale(1);opacity:.7}80%,100%{transform:scale(1.35);opacity:0}}
  #vc-toggle.is-open{opacity:0;pointer-events:none;transform:scale(.85)}
  @media(max-width:600px){#vc-toggle{bottom:20px;right:20px;width:56px;height:56px;font-size:22px}}

  #vc-panel{position:fixed;bottom:32px;right:32px;z-index:9001;width:380px;height:580px;max-height:calc(100vh - 64px);background:#F4F1EB;color:#0A0A0F;border-radius:22px;box-shadow:0 22px 60px rgba(0,0,0,.28),0 4px 16px rgba(0,0,0,.12);display:flex;flex-direction:column;overflow:hidden;opacity:0;pointer-events:none;transform:translateY(16px) scale(.96);transform-origin:bottom right;transition:opacity .28s cubic-bezier(.16,1,.3,1),transform .32s cubic-bezier(.16,1,.3,1)}
  #vc-panel.is-open{opacity:1;pointer-events:auto;transform:none}
  @media(max-width:600px){#vc-panel{inset:0;width:100%;height:100%;max-height:100%;border-radius:0;bottom:0;right:0}}

  #vc-header{display:flex;align-items:center;gap:12px;padding:14px 16px;background:#0A0A0F;color:#EDE9E1;flex-shrink:0}
  #vc-avatar{width:38px;height:38px;border-radius:50%;background:#1C1C28;border:1px solid rgba(201,169,110,.32);display:flex;align-items:center;justify-content:center;font-weight:800;font-size:16px;letter-spacing:-.02em;color:#EDE9E1;line-height:1}
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
  root.innerHTML = `
    <button id="vc-toggle" type="button" aria-label="Abrir chat con VELIA">V<span class="vc-pulse"></span></button>
    <div id="vc-panel" role="dialog" aria-modal="false" aria-label="Chat con VELIA">
      <header id="vc-header">
        <div id="vc-avatar">V</div>
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
    scrollBottom();
  }

  function setQuickReplies(list) {
    $qr.innerHTML = '';
    list.forEach(r => {
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
    } else if (messages.length === 0) {
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
