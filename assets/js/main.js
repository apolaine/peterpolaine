/* ============================================
   PETER POLAINE — SITE JS
   ============================================ */
(function () {
  'use strict';

  /* ---- MOBILE NAV ---- */
  const sidebar = document.getElementById('sidebar');
  const toggle  = document.getElementById('nav-toggle');
  const scrim   = document.getElementById('sidebar-scrim');

  function openNav() {
    sidebar.classList.add('is-open');
    scrim && scrim.classList.add('is-visible');
    toggle.classList.add('is-active');
    toggle.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function closeNav() {
    sidebar.classList.remove('is-open');
    scrim && scrim.classList.remove('is-visible');
    toggle.classList.remove('is-active');
    toggle.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  if (toggle && sidebar) {
    toggle.addEventListener('click', () =>
      sidebar.classList.contains('is-open') ? closeNav() : openNav()
    );
    scrim && scrim.addEventListener('click', closeNav);
    document.addEventListener('keydown', e => e.key === 'Escape' && closeNav());
  }

  /* ---- QUICKVIEW ---- */
  const dialog = document.getElementById('quickview');
  if (!dialog) return;

  const qv = {
    image:         dialog.querySelector('.quickview__image'),
    title:         dialog.querySelector('.quickview__title'),
    section:       dialog.querySelector('.quickview__section-link'),
    medium:        dialog.querySelector('[data-qv="medium"]'),
    mediumRows:    dialog.querySelectorAll('.qv-medium-row'),
    dimensions:    dialog.querySelector('[data-qv="dimensions"]'),
    dimensionRows: dialog.querySelectorAll('.qv-dimensions-row'),
    year:          dialog.querySelector('[data-qv="year"]'),
    yearRows:      dialog.querySelectorAll('.qv-year-row'),
    edition:       dialog.querySelector('[data-qv="edition"]'),
    editionRows:   dialog.querySelectorAll('.qv-edition-row'),
    price:         dialog.querySelector('.quickview__price'),
    link:          dialog.querySelector('.quickview__full-link'),
    close:         dialog.querySelector('.quickview__close'),
  };

  function openQuickview(card) {
    const d = card.dataset;
    if (qv.image)      { qv.image.src = d.imageSrc || ''; qv.image.alt = d.title || ''; }
    if (qv.title)        qv.title.textContent      = d.title      || '';
    if (qv.section)    { qv.section.textContent    = d.section    || ''; qv.section.href = d.sectionUrl || '#'; }
    if (qv.medium) {
      qv.medium.textContent = d.medium || '';
      qv.mediumRows.forEach(el => el.style.display = d.medium ? '' : 'none');
    }
    if (qv.dimensions) {
      qv.dimensions.textContent = d.dimensions || '';
      qv.dimensionRows.forEach(el => el.style.display = d.dimensions ? '' : 'none');
    }
    if (qv.year) {
      qv.year.textContent = d.year || '';
      qv.yearRows.forEach(el => el.style.display = d.year ? '' : 'none');
    }

    // Edition: show Artist's Proof note, numbered edition, or hide row entirely
    if (qv.edition) {
      if (d.editionNote) {
        qv.edition.textContent = d.editionNote;
        qv.editionRows.forEach(el => el.style.display = '');
      } else if (d.edition) {
        qv.edition.textContent = `Edition of ${d.edition}${d.remaining ? `, ${d.remaining} remaining` : ''}`;
        qv.editionRows.forEach(el => el.style.display = '');
      } else {
        // Not a print — hide the edition row entirely
        qv.editionRows.forEach(el => el.style.display = 'none');
      }
    }

    if (qv.price) {
      if (d.status === 'sold') {
        qv.price.textContent = d.section === 'Prints' ? 'Sold out' : 'Sold';
      } else if (d.status === 'private collection') {
        qv.price.textContent = 'In private collection';
      } else if (d.price) {
        qv.price.textContent = `£${Number(d.price).toLocaleString('en-GB')}`;
      } else {
        qv.price.textContent = 'Contact for price';
      }
    }
    if (qv.link) qv.link.href = d.href || '#';
    dialog.showModal();
  }

  // Quickview button
  document.querySelectorAll('.artwork-card__quickview-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      openQuickview(btn.closest('.artwork-card'));
    });
  });

  // Click/tap image wrap opens quickview
  // touchend with scroll-detection ensures reliable iOS tap without blocking scroll
  document.querySelectorAll('.artwork-card__image-wrap').forEach(wrap => {
    let touchStartY = 0;
    wrap.addEventListener('touchstart', e => {
      touchStartY = e.touches[0].clientY;
    }, { passive: true });
    wrap.addEventListener('touchend', e => {
      const dy = Math.abs(e.changedTouches[0].clientY - touchStartY);
      if (dy < 8) { // tap, not scroll
        e.preventDefault();
        openQuickview(wrap.closest('.artwork-card'));
      }
    }, { passive: false });
    wrap.addEventListener('click', () =>
      openQuickview(wrap.closest('.artwork-card'))
    );
  });

  qv.close && qv.close.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => { if (qv.image) qv.image.src = ''; });
  // Close on backdrop click (mouse) — e.target === dialog when clicking outside inner content
  dialog.addEventListener('click', e => { if (e.target === dialog) dialog.close(); });
  // iOS Safari doesn't fire click on ::backdrop tap; use touchend on the dialog element instead
  let dialogTouchStartX = 0, dialogTouchStartY = 0;
  dialog.addEventListener('touchstart', e => {
    dialogTouchStartX = e.touches[0].clientX;
    dialogTouchStartY = e.touches[0].clientY;
  }, { passive: true });
  dialog.addEventListener('touchend', e => {
    const dx = Math.abs(e.changedTouches[0].clientX - dialogTouchStartX);
    const dy = Math.abs(e.changedTouches[0].clientY - dialogTouchStartY);
    if (dx < 8 && dy < 8 && e.target === dialog) dialog.close();
  }, { passive: true });

  /* ---- ENQUIRY FORM ---- */
  const enquireForm = document.getElementById('enquire-form');
  if (enquireForm) {
    // Pre-populate from ?artwork= URL param
    const artworkParam = new URLSearchParams(window.location.search).get('artwork');
    if (artworkParam) {
      const decoded = decodeURIComponent(artworkParam).replace(/-/g, ' ');
      const artworkHidden = document.getElementById('enquiry-artwork');
      const artworkTitle  = document.getElementById('artwork-title');
      const artworkDisplay = document.getElementById('enquiry-artwork-display');
      const artworkName    = document.getElementById('enquiry-artwork-name');
      if (artworkHidden)  artworkHidden.value = decoded;
      if (artworkTitle)   artworkTitle.value  = decoded;
      if (artworkName)    artworkName.textContent = decoded;
      if (artworkDisplay) artworkDisplay.style.display = 'block';
    }

    // AJAX submission
    const submitBtn = document.getElementById('enquire-submit');
    const status    = document.getElementById('form-status');

    enquireForm.addEventListener('submit', async function (e) {
      e.preventDefault();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending…';
      status.textContent = '';
      status.className = 'form-status';

      try {
        const response = await fetch(enquireForm.action, {
          method: 'POST',
          body: new FormData(enquireForm),
          headers: { 'Accept': 'application/json' }
        });

        if (response.ok) {
          status.textContent = 'Thank you — your enquiry has been sent. We\'ll be in touch shortly.';
          status.classList.add('form-status--success');
          enquireForm.reset();
        } else {
          const data = await response.json();
          status.textContent = data.errors
            ? data.errors.map(err => err.message).join(', ')
            : 'There was a problem sending your enquiry. Please try again.';
          status.classList.add('form-status--error');
        }
      } catch (_) {
        status.textContent = 'There was a problem sending your enquiry. Please try again.';
        status.classList.add('form-status--error');
      }

      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Enquiry';
    });
  }

})();
