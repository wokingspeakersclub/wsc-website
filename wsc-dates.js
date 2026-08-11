// =============================================================
//  WSC DATES — shared meeting-date & calendar helpers
//  ---------------------------------------------------------------
//  Loaded by index.html and thankyou.html, AFTER wsc-config.js.
//  Keeps the meeting-schedule maths, UK BST handling, and the
//  .ics / Google Calendar builders in ONE place so the homepage
//  and the thank-you page can never drift apart.
//
//  You should NOT need to edit this file for routine changes —
//  meeting times, venue and cancelled dates all come from
//  wsc-config.js. This is the machinery that reads them.
// =============================================================

window.WSC_DATES = (function () {
  const CFG = window.WSC_CONFIG || {};

  // ── Meeting schedule ─────────────────────────────────────────
  function isCancelled(date) {
    const yyyy = date.getFullYear();
    const mm   = String(date.getMonth() + 1).padStart(2, '0');
    const dd   = String(date.getDate()).padStart(2, '0');
    return (CFG.cancelledDates || []).includes(`${yyyy}-${mm}-${dd}`);
  }

  // The next `count` upcoming meeting dates (today onwards), skipping any
  // cancelled ones. The month look-ahead is capped so a broken config can
  // never spin forever.
  function getMeetingDates(count) {
    const dates = [];
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const meetDay   = CFG.meetingDay   ?? 4;       // default Thursday
    const meetWeeks = CFG.meetingWeeks ?? [2, 4];  // default 2nd & 4th
    const d = new Date(now.getFullYear(), now.getMonth(), 1);
    for (let guard = 0; dates.length < count && guard < 60; guard++) {
      const year  = d.getFullYear();
      const month = d.getMonth();
      const first = new Date(year, month, 1);
      const offset = (meetDay - first.getDay() + 7) % 7;
      const firstOccurrence = 1 + offset; // date of 1st occurrence of meetDay
      meetWeeks.forEach(week => {
        const td = new Date(year, month, firstOccurrence + (week - 1) * 7);
        if (td >= now && dates.length < count && !isCancelled(td)) dates.push(td);
      });
      d.setMonth(d.getMonth() + 1);
    }
    return dates;
  }

  function getNextMeeting() {
    return getMeetingDates(1)[0] || null;
  }

  // ── Meeting time parsing ─────────────────────────────────────
  // Parses "7:15 pm" → { h: 19, min: 15 }. Falls back to the given default
  // hour/minute (or 7:15 pm) if the string is missing or unparseable.
  function parseMeetingTime(timeStr, fallbackH, fallbackMin) {
    const m = (timeStr || '').match(/(\d+):(\d+)\s*(am|pm)/i);
    if (!m) return { h: fallbackH ?? 19, min: fallbackMin ?? 15 };
    let h = parseInt(m[1], 10);
    const min = parseInt(m[2], 10);
    if (m[3].toLowerCase() === 'pm' && h !== 12) h += 12;
    if (m[3].toLowerCase() === 'am' && h === 12) h = 0;
    return { h, min };
  }

  // ── UK daylight saving (BST) ─────────────────────────────────
  function isUKBST(date) {
    const y = date.getFullYear();
    const bstStart = new Date(y, 2, 31); bstStart.setDate(31 - bstStart.getDay());
    const bstEnd   = new Date(y, 9, 31); bstEnd.setDate(31 - bstEnd.getDay());
    return date >= bstStart && date < bstEnd;
  }

  // ── Calendar event details ───────────────────────────────────
  // Title and location are the same event on every page, so they come from
  // the config here. The description differs by page (guest vs new member),
  // so it's passed in — with a neutral default for anything that omits it.
  const EVENT_TITLE = 'Woking Speakers Club Meeting';
  const EVENT_LOCATION =
    [CFG.venueName, CFG.venueAddress].filter(Boolean).join(', ') ||
    'Woking United Reformed Church, White Rose Lane, Woking, Surrey GU22 7HA';
  const DEFAULT_DESCRIPTION =
    'Woking Speakers Club, Toastmasters International. 2nd and 4th Thursday of the month.';

  const pad = n => String(n).padStart(2, '0');
  const fmtLocal = d =>
    d.getFullYear() + pad(d.getMonth() + 1) + pad(d.getDate()) +
    'T' + pad(d.getHours()) + pad(d.getMinutes()) + '00';

  // Start/end Date objects for the meeting on `date`, from the config times.
  function eventTimes(date) {
    const s = parseMeetingTime(CFG.meetingTime, 19, 15);
    const e = parseMeetingTime(CFG.meetingEndTime, 21, 45);
    const startLocal = new Date(date); startLocal.setHours(s.h, s.min, 0, 0);
    const endLocal   = new Date(date); endLocal.setHours(e.h, e.min, 0, 0);
    return { startLocal, endLocal };
  }

  // Escape a TEXT value for an .ics file (RFC 5545: backslash, comma, semicolon).
  function icsEscape(s) { return String(s).replace(/([\\,;])/g, '\\$1'); }

  const VTIMEZONE_LONDON = [
    'BEGIN:VTIMEZONE', 'TZID:Europe/London',
    'BEGIN:DAYLIGHT', 'TZOFFSETFROM:+0000', 'TZOFFSETTO:+0100', 'TZNAME:BST',
    'DTSTART:19700329T010000', 'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=3', 'END:DAYLIGHT',
    'BEGIN:STANDARD', 'TZOFFSETFROM:+0100', 'TZOFFSETTO:+0000', 'TZNAME:GMT',
    'DTSTART:19701025T020000', 'RRULE:FREQ=YEARLY;BYDAY=-1SU;BYMONTH=10', 'END:STANDARD',
    'END:VTIMEZONE'
  ].join('\r\n');

  // Raw .ics text for the meeting on `date`. `description` and `title` are
  // optional — pass a title to label a one-off event (e.g. an open house)
  // rather than the usual club meeting.
  function makeICSString(date, description, title) {
    const { startLocal, endLocal } = eventTimes(date);
    const uid = 'wsc-' + fmtLocal(startLocal) + '@wokingspeakers.org.uk';
    return [
      'BEGIN:VCALENDAR', 'VERSION:2.0', 'PRODID:-//Woking Speakers Club//EN',
      VTIMEZONE_LONDON,
      'BEGIN:VEVENT',
      'UID:' + uid,
      'DTSTART;TZID=Europe/London:' + fmtLocal(startLocal),
      'DTEND;TZID=Europe/London:'   + fmtLocal(endLocal),
      'SUMMARY:'     + icsEscape(title || EVENT_TITLE),
      'LOCATION:'    + icsEscape(EVENT_LOCATION),
      'DESCRIPTION:' + icsEscape(description || DEFAULT_DESCRIPTION),
      'END:VEVENT', 'END:VCALENDAR'
    ].join('\r\n');
  }

  // A ready-to-use data: URI that downloads the .ics (for Apple / Outlook).
  function makeICSDataUri(date, description, title) {
    return 'data:text/calendar;charset=utf8,' + encodeURIComponent(makeICSString(date, description, title));
  }

  // A Google Calendar "add event" URL for the meeting on `date`.
  function makeGoogleCalUrl(date, description, title) {
    const { startLocal, endLocal } = eventTimes(date);
    const offset = isUKBST(startLocal) ? 1 : 0;      // Google wants UTC times
    const fmtUTC = d => {
      const u = new Date(d.getTime() - offset * 3600000);
      return u.getFullYear() + pad(u.getMonth() + 1) + pad(u.getDate()) +
             'T' + pad(u.getHours()) + pad(u.getMinutes()) + '00Z';
    };
    return 'https://calendar.google.com/calendar/render?action=TEMPLATE'
      + '&text='     + encodeURIComponent(title || EVENT_TITLE)
      + '&dates='    + fmtUTC(startLocal) + '/' + fmtUTC(endLocal)
      + '&location=' + encodeURIComponent(EVENT_LOCATION)
      + '&details='  + encodeURIComponent(description || DEFAULT_DESCRIPTION);
  }

  return {
    isCancelled, getMeetingDates, getNextMeeting,
    parseMeetingTime, isUKBST,
    makeICSString, makeICSDataUri, makeGoogleCalUrl
  };
})();
