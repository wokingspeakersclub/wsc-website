// =============================================================
//  WSC SITE — homepage behaviour (index.html)
//  Loaded at the end of index.html, AFTER wsc-config.js and
//  wsc-dates.js. You should not need to edit this file for routine
//  content changes — those live in wsc-config.js and index.html.
// =============================================================

  // ═══════════════════════════════════════════════════════════════
  // 1. CONFIG & SHARED DATE HELPERS
  //    Everything below reads from wsc-config.js (loaded at the top of
  //    this file) and provides date/time utilities used by the sections
  //    further down — the banner, the upcoming meetings list, the guest
  //    date picker, and the calendar (.ics / Google Calendar) links.
  // ═══════════════════════════════════════════════════════════════
  const CFG = window.WSC_CONFIG;

  // Fees are plain numbers in the config; the six-month total is derived
  // here so it can never drift out of step with the monthly fee.
  CFG.sixMonthFee = CFG.monthlyFee * 6;

  // Populate any element marked <span data-cfg="key"> with the matching
  // value from wsc-config.js, so prices, venue and times only ever need
  // editing in one place. Fee values are numbers, so prefix them with £.
  // The HTML keeps a sensible fallback for no-JS.
  const CURRENCY_KEYS = new Set(['joiningFee', 'monthlyFee', 'sixMonthFee']);
  document.querySelectorAll('[data-cfg]').forEach(el => {
    const key = el.getAttribute('data-cfg');
    let val = CFG[key];
    if (val == null || val === '') return;
    if (CURRENCY_KEYS.has(key)) val = '£' + val;
    el.textContent = val;
  });

  // Same idea, but for link destinations: <a data-cfg-href="key" href="...">
  // The href in the HTML is the no-JS fallback; config overrides it when
  // present, so the Maps/Facebook/LinkedIn URLs only need editing in one place.
  document.querySelectorAll('[data-cfg-href]').forEach(el => {
    const val = CFG[el.getAttribute('data-cfg-href')];
    if (val) el.href = val;
  });

  // Footer copyright year, so it rolls over on its own each January. The
  // HTML keeps a hard-coded year as the no-JS fallback.
  const currentYear = String(new Date().getFullYear());
  document.querySelectorAll('.js-year').forEach(el => { el.textContent = currentYear; });

  const DAYS_LONG    = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  const MONTHS_SHORT = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
  const MONTHS_LONG  = ['January','February','March','April','May','June','July','August','September','October','November','December'];

  // ── Shared date & calendar helpers (wsc-dates.js) ─────────────
  // The meeting-schedule maths, UK BST handling and .ics / Google Calendar
  // builders live in wsc-dates.js, shared with the thank-you page. These thin
  // wrappers bake in the homepage's guest-facing calendar description so the
  // call sites below can stay tidy.
  const D = window.WSC_DATES;
  const MEETING_CAL_DESC = 'Free for guests - no booking needed. Come along and see what we are about.';
  const getMeetingDates  = (count) => D.getMeetingDates(count);
  const makeICSString    = (date)  => D.makeICSString(date, MEETING_CAL_DESC);
  const makeGoogleCalUrl = (date)  => D.makeGoogleCalUrl(date, MEETING_CAL_DESC);

  // Formats a meeting date as "Thursday 9 Jul 2026", plus a relative label
  // ("Today" / "Next week" / "In N days") when it's coming up soon.
  function formatDate(d) {
    const today = new Date();
    today.setHours(0,0,0,0);
    const target = new Date(d); target.setHours(0,0,0,0);
    const diff = Math.round((target - today) / 86400000);
    const label = diff === 0 ? 'Today' : diff === 7 ? 'Next week' : diff <= 14 ? 'In ' + diff + ' days' : null;
    const str = DAYS_LONG[d.getDay()] + ' ' + d.getDate() + ' ' + MONTHS_SHORT[d.getMonth()] + ' ' + d.getFullYear();
    return { str, label, diff };
  }

  function formatGalleryDate(iso) {
    if (!iso) return '';                       // date is optional — no date, no label
    const [y, m] = iso.split('-').map(Number);
    if (!y || !m) return '';                   // ignore a malformed date rather than showing "undefined"
    return `${MONTHS_SHORT[m - 1]} ${y}`;
  }

  function calIconSVG() {
    return '<svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>';
  }

  const meetings = getMeetingDates(6);

  // ═══════════════════════════════════════════════════════════════
  // 1b. SPECIAL EVENT (open house, contest night, …)
  //    Driven entirely by CFG.specialEvent in wsc-config.js. When a
  //    date is set and hasn't passed, a highlighted panel appears near
  //    the top of the page and the banner switches to promote it.
  //    Once the day is over it hides itself, so nothing goes stale.
  // ═══════════════════════════════════════════════════════════════
  const eventInfo = (() => {
    const ev = CFG.specialEvent;
    if (!ev || !ev.date) return null;

    // Parse as a local date (not UTC) so the day never shifts by a timezone.
    const [y, m, d] = String(ev.date).split('-').map(Number);
    if (!y || !m || !d) return null;
    const when = new Date(y, m - 1, d);
    if (isNaN(when.getTime())) return null;

    // Still show it all day on the day itself; hide from the next day on.
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (when < today) return null;

    const { str, diff } = formatDate(when);
    return {
      date: when,
      dateStr: str,
      countdown: diff === 0 ? 'Today!' : diff === 1 ? 'Tomorrow' : 'In ' + diff + ' days',
      title: (ev.title || 'Special event').trim(),
      time: (ev.time || CFG.meetingTime || '7:15 pm').trim(),
      blurb: (ev.blurb || '').trim(),
      ctaText: (ev.ctaText || 'Find out more').trim(),
      ctaLink: (ev.ctaLink || '#contact').trim()
    };
  })();

  if (eventInfo) {
    // The meetings aside says we meet on Thursdays, but a special event may
    // fall on another day, so acknowledge that rather than leaving the two
    // looking like they contradict each other.
    const asideNote = document.getElementById('asideEventNote');
    if (asideNote) asideNote.textContent = ', plus the occasional special event';

    const panel = document.getElementById('event');
    if (panel) {
      document.getElementById('eventTitle').textContent = eventInfo.title;
      document.getElementById('eventWhen').textContent =
        `${eventInfo.dateStr} · ${eventInfo.time} · ${CFG.venueName || ''}`.replace(/ · $/, '');
      const blurbEl = document.getElementById('eventBlurb');
      blurbEl.textContent = eventInfo.blurb;
      blurbEl.hidden = !eventInfo.blurb;

      const cta = document.getElementById('eventCta');
      cta.textContent = eventInfo.ctaText;
      cta.href = eventInfo.ctaLink;

      // Add-to-calendar links, labelled with the event's own title.
      const calWrap = document.getElementById('eventCal');
      if (calWrap) {
        const desc = eventInfo.blurb || eventInfo.title;
        const gUrl = D.makeGoogleCalUrl(eventInfo.date, desc, eventInfo.title);
        const iUrl = D.makeICSDataUri(eventInfo.date, desc, eventInfo.title);
        calWrap.innerHTML =
          `<div class="cal-wrap">
             <button type="button" class="cal-btn" onclick="this.nextElementSibling.classList.toggle('open')">${calIconSVG()} Add to calendar</button>
             <div class="cal-dropdown">
               <a href="${gUrl}" target="_blank" rel="noopener">${calIconSVG()} Google Calendar</a>
               <a href="${iUrl}" target="_blank" rel="noopener">${calIconSVG()} Apple / Outlook (.ics)</a>
             </div>
           </div>`;
      }
      panel.hidden = false;
    }
  }

  // ═══════════════════════════════════════════════════════════════
  // 2. NEXT-MEETING BANNER
  //    Content (date/countdown) and the show/hide/dismiss behaviour
  //    that repositions the nav bar and hero underneath it.
  // ═══════════════════════════════════════════════════════════════
  if (!CFG.showBanner) {
    document.getElementById('nextBanner').style.display = 'none';
  }

  const { str: nextStr, diff } = formatDate(meetings[0]);
  document.getElementById('nextMeetingDate').textContent = nextStr;

  // Same date, repeated in the at-a-glance strip under the hero.
  const factsNextEl = document.getElementById('factsNextDate');
  if (factsNextEl) factsNextEl.textContent = nextStr;
  const meetingTimeEl = document.getElementById('meetingTime');
  if (meetingTimeEl) meetingTimeEl.textContent = CFG.meetingTime || '7:15 pm';
  const countdown = diff === 0 ? 'Tonight!' : diff === 1 ? 'Tomorrow' : 'In ' + diff + ' days';
  document.getElementById('bannerCountdown').textContent = countdown;

  // A special event takes over the banner while it's upcoming — it's the
  // more newsworthy of the two, and the usual meeting dates are still
  // listed further down the page.
  if (eventInfo) {
    document.getElementById('bannerMeeting').hidden = true;
    document.getElementById('bannerEventTitle').textContent = eventInfo.title;
    document.getElementById('bannerEventDate').textContent = eventInfo.dateStr;
    document.getElementById('bannerEventCountdown').textContent = eventInfo.countdown;
    const bannerCta = document.getElementById('bannerEventCta');
    bannerCta.textContent = eventInfo.ctaText + ' →';
    document.getElementById('bannerEvent').hidden = false;
  }

  const banner = document.getElementById('nextBanner');
  const bannerDismissBtn = document.getElementById('bannerDismiss');
  const siteNav = document.querySelector('nav');
  const hero = document.getElementById('home');
  const NAV_H = 64;

  function getBannerHeight() {
    return banner.classList.contains('dismissed') ? 0 : banner.offsetHeight;
  }

  function applyLayout(animate) {
    const bh = getBannerHeight();
    if (!animate) siteNav.style.transition = 'none';
    siteNav.style.top = bh + 'px';
    hero.style.paddingTop = (bh + NAV_H + 40) + 'px';
    // Update CSS var so mobile nav dropdown sits in the right place
    document.documentElement.style.setProperty('--nav-bottom', (bh + NAV_H) + 'px');
    if (!animate) requestAnimationFrame(() => { siteNav.style.transition = ''; });
  }

  function dismissBanner() {
    banner.classList.add('dismissed');
    applyLayout(true);
    sessionStorage.setItem('bannerDismissed', '1');
  }

  // On load: restore dismissed state, then measure & position (no animation)
  if (sessionStorage.getItem('bannerDismissed') === '1') {
    banner.classList.add('dismissed');
  }
  applyLayout(false);
  window.addEventListener('resize', () => applyLayout(false)); // banner may reflow on mobile
  bannerDismissBtn.addEventListener('click', dismissBanner);

  // ═══════════════════════════════════════════════════════════════
  // 3. UPCOMING MEETINGS LIST (in the Meetings section aside)
  // ═══════════════════════════════════════════════════════════════
  const upcomingContainer = document.getElementById('upcomingMeetings');

  // What a visitor plans from: the next few meetings, plus any special event,
  // in date order. An event falling on a normal meeting night labels that
  // entry rather than adding a duplicate row. The event is always included
  // even if it's further out than the meetings shown.
  const sameCalendarDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  let upcomingList;
  const eventClashes = eventInfo && meetings.some(d => sameCalendarDay(d, eventInfo.date));

  if (eventInfo && !eventClashes) {
    // Leave room so the panel still shows five rows in total.
    upcomingList = meetings.slice(0, 4).map(d => ({ date: d, event: null }));
    upcomingList.push({ date: eventInfo.date, event: eventInfo });
    upcomingList.sort((a, b) => a.date - b.date);
  } else {
    upcomingList = meetings.slice(0, 5).map(d => ({
      date: d,
      event: (eventInfo && sameCalendarDay(d, eventInfo.date)) ? eventInfo : null
    }));
  }

  upcomingList.forEach(({ date: d, event }, i) => {
    const isNext = i === 0;
    const { str, label } = formatDate(d);
    const calUrl = event
      ? D.makeICSDataUri(d, event.blurb || event.title, event.title)
      : 'data:text/calendar;charset=utf8,' + encodeURIComponent(makeICSString(d));
    const googleUrl = event
      ? D.makeGoogleCalUrl(d, event.blurb || event.title, event.title)
      : makeGoogleCalUrl(d);
    // A special event gets a solid gold badge so it stands out from the
    // regular schedule; the usual "In N days" badge is the subtler one.
    const eventBadge = event
      ? `<span style="font-size:0.7rem; font-weight:700; background:var(--gold); color:var(--navy); border-radius:4px; padding:2px 7px; white-space:nowrap;">${event.title}</span>`
      : '';
    const labelHtml = eventBadge + (label
      ? `<span style="font-size:0.7rem; font-weight:600; background:rgba(200,145,58,0.25); color:#f0d49a; border-radius:4px; padding:2px 7px; white-space:nowrap;">${label}</span>`
      : '');

    const el = document.createElement('div');
    el.style.cssText = `display:flex; align-items:center; justify-content:space-between; gap:10px; padding:0.6rem 0.85rem; background:rgba(255,255,255,0.06); border-radius:8px; border:1px solid rgba(255,255,255,${isNext ? '0.2' : '0.08'});`;
    el.innerHTML = `
      <span style="font-size:0.875rem; color:${isNext ? '#fff' : 'rgba(255,255,255,0.7)'}; font-weight:${isNext ? '600' : '400'};">${str}</span>
      <span style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
        ${labelHtml}
        <div class="cal-wrap">
          <button type="button" class="cal-btn" title="Add to calendar" onclick="this.nextElementSibling.classList.toggle('open')">${calIconSVG()} +Cal</button>
          <div class="cal-dropdown">
            <a href="${googleUrl}" target="_blank" rel="noopener">${calIconSVG()} Google Calendar</a>
            <a href="${calUrl}" target="_blank" rel="noopener">${calIconSVG()} Apple / Outlook (.ics)</a>
          </div>
        </div>
      </span>`;
    upcomingContainer.appendChild(el);
  });

  document.addEventListener('click', e => {
    if (!e.target.closest('.cal-wrap')) {
      document.querySelectorAll('.cal-dropdown.open').forEach(dd => dd.classList.remove('open'));
    }
  });

  // ═══════════════════════════════════════════════════════════════
  // 4. GUEST DATE PICKER (contact form)
  //    Shown only when "Attend a meeting as a guest" is selected.
  // ═══════════════════════════════════════════════════════════════
  const subjectEl    = document.getElementById('subject');
  const dateGroupEl  = document.getElementById('meeting-date-group');
  const dateSelectEl = document.getElementById('preferred-date');

  function syncGuestDatePicker() {
    const isGuest = subjectEl.value === 'Attend a meeting as a guest';
    dateGroupEl.style.display = isGuest ? '' : 'none';
    dateSelectEl.disabled = !isGuest;
  }
  subjectEl.addEventListener('change', syncGuestDatePicker);

  // Arriving at the contact form via a "visit" CTA pre-selects the guest
  // option so the meeting-date picker is already showing when they land.
  document.querySelectorAll('[data-visit-cta]').forEach(cta => {
    cta.addEventListener('click', () => {
      subjectEl.value = 'Attend a meeting as a guest';
      syncGuestDatePicker();
    });
  });

  // The dates a guest can choose from: the next few meetings, plus any
  // special event (open house etc.), listed in date order and named so the
  // committee can see which one they're coming to. If the event falls on a
  // normal meeting night, that date is labelled rather than listed twice.
  const sameDay = (a, b) =>
    a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();

  const guestDates = getMeetingDates(3).map(d => ({ date: d, label: null }));

  if (eventInfo) {
    const clash = guestDates.find(g => sameDay(g.date, eventInfo.date));
    if (clash) {
      clash.label = eventInfo.title;
    } else {
      guestDates.push({ date: eventInfo.date, label: eventInfo.title });
      guestDates.sort((a, b) => a.date - b.date);
    }
  }

  guestDates.forEach(({ date: d, label }) => {
    const text = `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]} ${d.getFullYear()}`;
    const opt = document.createElement('option');
    opt.value = label ? `${text} (${label})` : text;
    opt.textContent = opt.value;
    dateSelectEl.appendChild(opt);
  });

  // ═══════════════════════════════════════════════════════════════
  // 5. "CLUB IN ACTION" PHOTO CAROUSEL
  //    Photo content (filenames/dates/descriptions) lives in
  //    wsc-config.js as CFG.galleryPhotos — see that file to add,
  //    update, or remove a photo. This section just renders it.
  // ═══════════════════════════════════════════════════════════════
  const galleryTrack = document.getElementById('galleryTrack');
  if (galleryTrack) {
    const galleryPrevBtn = document.getElementById('galleryPrev');
    const galleryNextBtn = document.getElementById('galleryNext');

    // Hide an arrow once scrolling that direction would do nothing —
    // called on load, on scroll, and on resize (which can change whether
    // the photos overflow the track at all).
    function updateGalleryNav() {
      const EPSILON = 10; // allows for the track's own padding/margin, not a real scroll position
      const maxScroll = galleryTrack.scrollWidth - galleryTrack.clientWidth;
      const atStart = galleryTrack.scrollLeft <= EPSILON;
      const atEnd = galleryTrack.scrollLeft >= maxScroll - EPSILON;
      if (galleryPrevBtn) galleryPrevBtn.classList.toggle('is-hidden', atStart);
      if (galleryNextBtn) galleryNextBtn.classList.toggle('is-hidden', atEnd);
    }

    // Referenced from the onerror= attribute below — hides a slide whose
    // image file is missing, then re-checks whether the arrows are still needed.
    function galleryImageError(img) {
      img.parentElement.style.display = 'none';
      updateGalleryNav();
    }

    // ── Lightbox: click (or keyboard-activate) a photo to enlarge it ──
    // One overlay is created and reused for every photo.
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.setAttribute('aria-label', 'Enlarged photo');
    lightbox.innerHTML =
      '<button class="lightbox-close" type="button" aria-label="Close">' +
        '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>' +
      '</button>' +
      '<figure class="lightbox-figure">' +
        '<img class="lightbox-img" alt="">' +
        '<figcaption class="lightbox-caption"></figcaption>' +
      '</figure>';
    document.body.appendChild(lightbox);
    const lbImg     = lightbox.querySelector('.lightbox-img');
    const lbCaption = lightbox.querySelector('.lightbox-caption');
    const lbClose   = lightbox.querySelector('.lightbox-close');
    let lbLastFocus = null;

    function openLightbox(src, descText, dateText) {
      lbImg.src = src;
      lbImg.alt = descText || 'Woking Speakers Club';
      lbCaption.textContent = '';                 // rebuild caption from scratch
      if (descText) {
        const d = document.createElement('span');
        d.className = 'lightbox-caption-text';
        d.textContent = descText;                 // textContent keeps < and " safe
        lbCaption.appendChild(d);
      }
      if (dateText) {
        const dt = document.createElement('span');
        dt.className = 'lightbox-caption-date';
        dt.textContent = dateText;
        lbCaption.appendChild(dt);
      }
      lbCaption.style.display = (descText || dateText) ? '' : 'none';
      lbLastFocus = document.activeElement;
      lightbox.classList.add('open');
      document.body.style.overflow = 'hidden';    // stop the page scrolling behind
      // Defer focus to after the click fully resolves — otherwise the browser
      // re-focuses the just-clicked image and steals it back.
      setTimeout(() => lbClose.focus(), 0);
    }

    function closeLightbox() {
      lightbox.classList.remove('open');
      document.body.style.overflow = '';
      lbImg.removeAttribute('src');               // release the large image
      if (lbLastFocus && lbLastFocus.focus) lbLastFocus.focus();
    }

    lbClose.addEventListener('click', closeLightbox);
    lightbox.addEventListener('click', e => { if (e.target === lightbox) closeLightbox(); });
    document.addEventListener('keydown', e => {
      if (!lightbox.classList.contains('open')) return;
      if (e.key === 'Escape') closeLightbox();
      else if (e.key === 'Tab') { e.preventDefault(); lbClose.focus(); } // trap focus in the dialog
    });

    (CFG.galleryPhotos || []).forEach(photo => {
      const item = document.createElement('div');
      item.className = 'gallery-item';

      // If the image file doesn't exist yet, hide this slide rather than
      // showing a broken image — lets you add list entries ahead of the upload.
      const img = document.createElement('img');
      img.loading = 'lazy';
      img.onerror = () => galleryImageError(img);
      img.src = `images/${photo.file}`;

      // Caption strip along the bottom of the photo — the description and date
      // are BOTH optional. Leave "desc" and/or "date" out of the config entry
      // (or blank) and that line is skipped; leave out both and no caption strip
      // is added at all, so the photo shows clean with no gradient overlay.
      const descText = (photo.desc || '').trim();
      const dateText = formatGalleryDate(photo.date);

      // With no caption to describe it, give the image a sensible alt rather
      // than leaving it unlabelled for screen readers.
      img.alt = descText ? '' : 'Woking Speakers Club';

      if (descText || dateText) {
        const caption = document.createElement('div');
        caption.className = 'gallery-caption';
        if (descText) {
          const desc = document.createElement('span');
          desc.className = 'gallery-caption-text';
          desc.textContent = descText;   // textContent keeps < and " safe
          caption.appendChild(desc);
        }
        if (dateText) {
          const date = document.createElement('span');
          date.className = 'gallery-caption-date';
          date.textContent = dateText;
          caption.appendChild(date);
        }
        item.append(img, caption);
      } else {
        item.append(img);              // clean photo, no overlay
      }

      // Make the photo open the lightbox (mouse + keyboard).
      img.setAttribute('role', 'button');
      img.setAttribute('tabindex', '0');
      img.setAttribute('aria-label', (descText ? descText + ': ' : '') + 'view larger');
      const openThis = () => openLightbox(img.currentSrc || img.src, descText, dateText);
      img.addEventListener('click', openThis);
      img.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openThis(); }
      });

      galleryTrack.appendChild(item);
    });

    function scrollGallery(direction) {
      const firstItem = galleryTrack.querySelector('.gallery-item');
      const step = firstItem ? firstItem.getBoundingClientRect().width + 16 : 276;
      galleryTrack.scrollBy({ left: direction * step, behavior: 'smooth' });
    }
    galleryPrevBtn.addEventListener('click', () => scrollGallery(-1));
    galleryNextBtn.addEventListener('click', () => scrollGallery(1));
    galleryTrack.addEventListener('scroll', updateGalleryNav);
    window.addEventListener('resize', updateGalleryNav);
    updateGalleryNav();
  }

  // ═══════════════════════════════════════════════════════════════
  // 5b. JOIN-COST BY MONTH (price-box month picker)
  //    Shows the up-front cost for any joining month, using exactly the
  //    same numbers as the join page — all derived from wsc-config.js.
  // ═══════════════════════════════════════════════════════════════
  const joinMonthSelect = document.getElementById('joinMonthSelect');
  if (joinMonthSelect) {
    const joinMonthResult = document.getElementById('joinMonthResult');
    const nowMonth = new Date().getMonth(); // 0–11

    // 12 options, ordered from the current month so the most likely choice
    // is first and selected by default.
    for (let i = 0; i < 12; i++) {
      const m = (nowMonth + i) % 12;         // 0–11
      const opt = document.createElement('option');
      opt.value = String(m + 1);             // 1–12 to match feeData keys
      opt.textContent = MONTHS_LONG[m];
      joinMonthSelect.appendChild(opt);
    }

    function updateJoinCost() {
      const m = parseInt(joinMonthSelect.value, 10);   // 1–12
      const info = (CFG.feeData || {})[m];
      if (!info) { joinMonthResult.textContent = ''; return; }
      const months     = info.months;
      const membership = CFG.monthlyFee * months;
      const total      = CFG.joiningFee + membership;
      joinMonthResult.innerHTML =
        `<strong>£${total}</strong> to join in ${MONTHS_LONG[m - 1]}: ` +
        `£${CFG.joiningFee} joining fee + ${months} months' membership (£${membership}).`;
    }
    joinMonthSelect.addEventListener('change', updateJoinCost);
    updateJoinCost();
  }

  // ═══════════════════════════════════════════════════════════════
  // 6. MOBILE NAV TOGGLE
  // ═══════════════════════════════════════════════════════════════
  const navToggleBtn = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  navToggleBtn.addEventListener('click', () => navLinks.classList.toggle('open'));
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => navLinks.classList.remove('open'));
  });

  // ═══════════════════════════════════════════════════════════════
  // 6b. BACK-TO-TOP BUTTON
  //    Fades in once the visitor has scrolled roughly a screen down;
  //    scrolls smoothly back to the top (respecting reduced-motion).
  // ═══════════════════════════════════════════════════════════════
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    const toggleBackToTop = () => {
      backToTop.classList.toggle('visible', window.scrollY > 600);
    };
    toggleBackToTop();
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    backToTop.addEventListener('click', () => {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    });
  }

  // ═══════════════════════════════════════════════════════════════
  // 7. SCROLL-IN ANIMATIONS (.fade-up elements)
  // ═══════════════════════════════════════════════════════════════
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.fade-up').forEach(el => fadeObserver.observe(el));

  // ═══════════════════════════════════════════════════════════════
  // 8. CONTACT FORM (Netlify Forms submission + validation)
  // ═══════════════════════════════════════════════════════════════
  const contactForm = document.getElementById('contactForm');
  const formSuccessEl = document.getElementById('formSuccess');
  const formSubmitBtn = contactForm.querySelector('.btn-submit');

  // What's wrong with a field, as a sentence we can show the visitor — or ''
  // when it's fine. Empty beats malformed: there's no point complaining about
  // the shape of an email address that hasn't been typed yet.
  const fieldError = field => {
    if (!field.value.trim()) return 'This field is required.';
    if (field.validity.typeMismatch && field.type === 'email') {
      return 'Please enter a valid email address, like jane@example.com.';
    }
    return field.checkValidity() ? '' : 'Please check this field.';
  };

  // Shows (or clears) an inline message under the field and keeps the red
  // border and the screen-reader announcement in step with it.
  const setFieldError = (field, message) => {
    const group = field.closest('.form-group');
    let errorEl = group.querySelector('.form-field-error');
    if (!message) {
      field.removeAttribute('aria-invalid');
      field.removeAttribute('aria-describedby');
      if (errorEl) errorEl.remove();
      return;
    }
    if (!errorEl) {
      errorEl = document.createElement('p');
      errorEl.className = 'form-field-error';
      errorEl.id = field.id + '-error';
      errorEl.setAttribute('role', 'alert');
      group.appendChild(errorEl);
    }
    errorEl.textContent = message;
    field.setAttribute('aria-invalid', 'true');
    field.setAttribute('aria-describedby', errorEl.id);
  };

  contactForm.addEventListener('submit', async e => {
    e.preventDefault();
    const requiredFields = contactForm.querySelectorAll('[required]');
    let valid = true;
    requiredFields.forEach(field => {
      const message = fieldError(field);
      setFieldError(field, message);
      if (message) valid = false;
    });
    if (!valid) {
      // Send focus to the first problem so keyboard and screen-reader users
      // land on it rather than having to hunt back up the form.
      contactForm.querySelector('[aria-invalid="true"]').focus();
      return;
    }

    formSubmitBtn.disabled = true;
    formSubmitBtn.textContent = 'Sending…';

    try {
      const res = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(new FormData(contactForm)).toString()
      });
      if (res.ok) {
        contactForm.style.display = 'none';
        formSuccessEl.style.display = 'block';
      } else {
        throw new Error('Network response was not ok');
      }
    } catch {
      formSubmitBtn.disabled = false;
      formSubmitBtn.textContent = 'Send →';
      // Clear any error from a previous failed attempt so they don't stack up.
      contactForm.querySelectorAll('.form-send-error').forEach(el => el.remove());
      formSubmitBtn.insertAdjacentHTML('afterend', '<p class="form-send-error" role="alert">Something went wrong, please try again or email <a href="mailto:info@wokingspeakers.org.uk?subject=WSC%20Website%20Query">info@wokingspeakers.org.uk</a> directly.</p>');
    }
  });

  contactForm.querySelectorAll('[required]').forEach(field => {
    // Clear as soon as they've fixed it, but never introduce a new complaint
    // mid-keystroke — "jane@" is on its way to being valid.
    field.addEventListener('input', () => {
      if (!fieldError(field)) setFieldError(field, '');
    });
    // Once they've moved on from the field, a malformed value is worth flagging.
    field.addEventListener('blur', () => {
      if (field.value.trim()) setFieldError(field, fieldError(field));
    });
  });

  // ═══════════════════════════════════════════════════════════════
  // 9. STRUCTURED DATA FOR UPCOMING MEETINGS
  //    Publishes the next few meeting dates in the format Google reads,
  //    so they can appear as events in search results. Generated from
  //    the same schedule as the rest of the page, which means they can
  //    never go out of date — no one has to remember to update them.
  //    (The club's name/address/social links are in index.html itself.)
  // ═══════════════════════════════════════════════════════════════
  (function publishEventData() {
    const SITE  = 'https://www.wokingspeakers.org.uk';
    const venue = {
      '@type': 'Place',
      name: CFG.venueName || 'Woking United Reformed Church',
      address: {
        '@type': 'PostalAddress',
        streetAddress: 'White Rose Lane',
        addressLocality: 'Woking',
        addressRegion: 'Surrey',
        postalCode: 'GU22 7HA',
        addressCountry: 'GB'
      }
    };

    // Schema.org wants a full timestamp including the UK's summer/winter offset.
    function isoWithOffset(date, timeStr, fallbackH, fallbackMin) {
      const t = D.parseMeetingTime(timeStr, fallbackH, fallbackMin);
      const d = new Date(date); d.setHours(t.h, t.min, 0, 0);
      const p = n => String(n).padStart(2, '0');
      const offset = D.isUKBST(d) ? '+01:00' : '+00:00';
      return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}` +
             `T${p(d.getHours())}:${p(d.getMinutes())}:00${offset}`;
    }

    function meetingEvent(date, name, description) {
      return {
        '@context': 'https://schema.org',
        '@type': 'Event',
        name: name,
        description: description,
        startDate: isoWithOffset(date, CFG.meetingTime, 19, 15),
        endDate:   isoWithOffset(date, CFG.meetingEndTime, 21, 45),
        eventStatus: 'https://schema.org/EventScheduled',
        eventAttendanceMode: 'https://schema.org/OfflineEventAttendanceMode',
        location: venue,
        image: SITE + '/images/og-image.png',
        organizer: { '@id': SITE + '/#organization' },
        // Guests attend free — worth stating explicitly, it's our main draw.
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'GBP',
          availability: 'https://schema.org/InStock',
          url: SITE + '/#contact',
          validFrom: new Date().toISOString().slice(0, 10)
        }
      };
    }

    const events = meetings.slice(0, 4).map(d => meetingEvent(
      d,
      'Woking Speakers Club Meeting',
      'A friendly Toastmasters meeting with prepared speeches, impromptu speaking, and supportive feedback. Guests are welcome to visit free of charge, no need to speak.'
    ));

    // A special event (open house etc.) is newsworthy, so list it first.
    if (typeof eventInfo !== 'undefined' && eventInfo) {
      events.unshift(meetingEvent(eventInfo.date, eventInfo.title,
        eventInfo.blurb || eventInfo.title));
    }

    const tag = document.createElement('script');
    tag.type = 'application/ld+json';
    tag.textContent = JSON.stringify(events);
    document.head.appendChild(tag);
  })();
