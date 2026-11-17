/* =========================================================
   CV – Christian German Celiz
   Menú móvil, sección activa y copiado de correo
   ========================================================= */
(() => {
  'use strict';

  const MOBILE_QUERY = window.matchMedia('(max-width: 960px)');

  const toggleBtn = document.querySelector('.menu-toggle');
  const sidebar   = document.getElementById('sidebar');
  const scrim     = document.querySelector('.scrim');
  const navLinks  = document.querySelectorAll('.nav__link');
  const toast     = document.querySelector('.toast');
  const copyBtn   = document.getElementById('copy-email');

  /* ---------- 1. Menú responsivo ---------- */
  function setMenu(open) {
    sidebar.classList.toggle('is-open', open);
    toggleBtn.setAttribute('aria-expanded', String(open));
    toggleBtn.querySelector('.menu-toggle__label').textContent = open ? 'Cerrar' : 'Menú';
    scrim.hidden = !open;
    // Evita que la página se desplace detrás del menú abierto
    document.body.style.overflow = open ? 'hidden' : '';
  }

  toggleBtn.addEventListener('click', () => {
    setMenu(toggleBtn.getAttribute('aria-expanded') !== 'true');
  });

  // Cerrar al tocar el fondo, al elegir una sección o con Escape
  scrim.addEventListener('click', () => setMenu(false));
  navLinks.forEach(link => link.addEventListener('click', () => {
    if (MOBILE_QUERY.matches) setMenu(false);
  }));
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('is-open')) {
      setMenu(false);
      toggleBtn.focus();
    }
  });

  // Si se pasa a pantalla grande con el menú abierto, se restablece
  MOBILE_QUERY.addEventListener('change', (e) => { if (!e.matches) setMenu(false); });

  /* ---------- 2. Resaltar la sección visible en el menú ---------- */
  const sections = [...document.querySelectorAll('main section[id]')];

  if ('IntersectionObserver' in window && sections.length) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach(link => {
          const active = link.getAttribute('href') === '#' + entry.target.id;
          link.classList.toggle('is-active', active);
          if (active) link.setAttribute('aria-current', 'true');
          else link.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-35% 0px -55% 0px' }); // la sección que cruza el centro superior

    sections.forEach(section => observer.observe(section));
  }

  /* ---------- 3. Copiar correo al portapapeles ---------- */
  let toastTimer;
  function showToast(message) {
    toast.textContent = message;
    toast.classList.add('is-visible');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2200);
  }

  copyBtn.addEventListener('click', async () => {
    const email = copyBtn.dataset.email;
    try {
      await navigator.clipboard.writeText(email);
      showToast('Correo copiado');
    } catch {
      // Alternativa para navegadores sin permiso de portapapeles
      const field = document.createElement('textarea');
      field.value = email;
      field.setAttribute('readonly', '');
      field.style.position = 'fixed';
      field.style.opacity = '0';
      document.body.appendChild(field);
      field.select();
      const copied = document.execCommand('copy');
      field.remove();
      showToast(copied ? 'Correo copiado' : 'No se pudo copiar. Copiá: ' + email);
    }
  });
})();
