// =============================================================
//  WSC CONFIG — edit anything in this file
//  This is shared by index.html, join.html and thankyou.html.
//  One change here updates all pages automatically.
// =============================================================
//
//  HOW TO EDIT ON GITHUB
//  1. Open wsc-config.js in your GitHub repository
//  2. Click the pencil (edit) icon
//  3. Find the section you want using Ctrl+F / Cmd+F
//  4. Make your change
//  5. Click "Commit changes"
//  Netlify will republish the site automatically within ~30 seconds.
//
// =============================================================

window.WSC_CONFIG = {

  // ----- MEETING SCHEDULE ------------------------------------
  // Day of week: 0=Sun, 1=Mon, 2=Tue, 3=Wed, 4=Thu, 5=Fri, 6=Sat
  meetingDay:   4,        // Thursday
  meetingWeeks: [2, 4],   // 2nd and 4th week of each month
  meetingTime:  '7:15 pm',

  // ----- CANCELLED MEETINGS ----------------------------------
  // Add dates here to skip them. Format: 'YYYY-MM-DD'
  // Example: '2025-08-14',  // Summer break
  // To reinstate, delete the line or add // in front of it.
  cancelledDates: [
    // '2026-07-09',   // Summer break
    // '2025-12-25',   // Christmas
  ],

  // ----- VENUE -----------------------------------------------
  venueName:    'Woking United Reformed Church',
  venueAddress: 'White Rose Lane, Woking, Surrey GU22 7HA',
  venueNote:    '5 min walk from Woking station',
  venueMapUrl:  'https://maps.google.com/maps?q=Woking+United+Reformed+Church,White+Rose+Lane,Woking,GU22+7HA',

  // ----- MEMBERSHIP PRICES -----------------------------------
  joiningFee:   '£20',
  monthlyFee:   '£13',
  sixMonthFee:  '£78',
  guestPolicy:  'Free, unlimited visits — no booking needed',

  // ----- STRIPE PAYMENT LINKS --------------------------------
  // Replace null with your Stripe URL (in quotes) when ready.
  // Example:  6: "https://buy.stripe.com/xxxxxxxx",
  stripeLinks: {
     1: null, // January   — £137
     2: null, // February  — £124
     3: null, // March     — £111
     4: null, // April     — £176
     5: null, // May       — £163
     6: "https://buy.stripe.com/aFacN55rL27ybBHcoa0Ny01", // June   — £150
     7: "https://buy.stripe.com/aFacN55rL27ybBHcoa0Ny01", // July   — £137
     8: "https://buy.stripe.com/aFacN55rL27ybBHcoa0Ny01", // August — £124
     9: null, // September — £111
    10: null, // October   — £176
    11: null, // November  — £163
    12: null, // December  — £150
  },

  // ----- SOCIAL & CONTACT ------------------------------------
  facebookUrl:     'https://www.facebook.com/WokingSpeakers/',
  youtubeUrl:      'https://www.youtube.com/channel/UCBvb0g6JxrGvTahFcjjiP0g',
  toastmastersUrl: 'https://www.toastmasters.org/',

  // ----- MEMBERSHIP FEE DATA --------------------------------
  // Total cost by joining month. No need to edit unless pricing changes.
  feeData: {
     1: { total: 137, months: 9  },
     2: { total: 124, months: 8  },
     3: { total: 111, months: 7  },
     4: { total: 176, months: 12 },
     5: { total: 163, months: 11 },
     6: { total: 150, months: 10 },
     7: { total: 137, months: 9  },
     8: { total: 124, months: 8  },
     9: { total: 111, months: 7  },
    10: { total: 176, months: 12 },
    11: { total: 163, months: 11 },
    12: { total: 150, months: 10 },
  },

  // ----- NEXT MEETING BANNER ---------------------------------
  // Set to false to hide the banner entirely
  showBanner: true,

};
