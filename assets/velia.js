// VELIA Legal — Comportamiento compartido
// Nav scroll, menú mobile, reveal on scroll. Vanilla, sin dependencias.
(function(){
  const nav = document.getElementById('nav');
  if (nav) {
    const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 24);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }

  const toggle = document.getElementById('navToggle');
  const mobile = document.getElementById('navMobile');
  if (toggle && mobile) {
    toggle.addEventListener('click', () => mobile.classList.toggle('open'));
    mobile.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mobile.classList.remove('open')));
  }

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  } else {
    document.querySelectorAll('.reveal').forEach(el => el.classList.add('in'));
  }

  // FAQ accordion — interceptamos el click del <summary> para evitar el
  // snap nativo de <details> y dejar que CSS anime grid-template-rows.
  // Tambien gestiona el mutex: al abrir uno, los demas del mismo .faq-list
  // se cierran.
  document.querySelectorAll('.faq-list').forEach(list => {
    list.querySelectorAll('details.faq-item > summary').forEach(summary => {
      summary.addEventListener('click', e => {
        e.preventDefault();
        const item = summary.parentElement;
        const willOpen = !item.hasAttribute('open');
        if (willOpen) {
          list.querySelectorAll('details.faq-item[open]').forEach(other => {
            if (other !== item) other.removeAttribute('open');
          });
          item.setAttribute('open', '');
        } else {
          item.removeAttribute('open');
        }
      });
    });
  });

  // Dual-logo nav: alterna entre logo claro (sobre fondos void/deep) y oscuro
  // (sobre fondos cream/white) detectando que seccion cruza la franja superior
  // del viewport, justo donde vive el nav fijo. Cualquier <section> o <header>
  // con clase .surface-cream activa el modo light; el resto deja el modo oscuro.
  if (nav && 'IntersectionObserver' in window) {
    const navHeight = 80; // ~nav fixed offset
    const sections = document.querySelectorAll('section, header.hero, header.page-hero, header.contact-shell, main.contact-shell');
    const isLight = el => el.classList.contains('surface-cream');
    const activeLight = new Set();
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting && isLight(e.target)) activeLight.add(e.target);
        else activeLight.delete(e.target);
      });
      nav.classList.toggle('on-light', activeLight.size > 0);
    }, { rootMargin: `-${navHeight}px 0px -${Math.max(window.innerHeight - navHeight - 2, 0)}px 0px`, threshold: 0 });
    sections.forEach(s => obs.observe(s));
  }
})();
