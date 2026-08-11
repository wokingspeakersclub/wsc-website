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
  meetingEndTime: '9:45 pm',

  // ----- CANCELLED MEETINGS ----------------------------------
  // Add dates here to skip them. Format: 'YYYY-MM-DD'
  // Example: '2026-08-13',  // Summer break
  // To reinstate, delete the line or add // in front of it.
  cancelledDates: [
    // '2026-08-13',   // Summer break
    // '2026-12-24',   // Christmas
  ],

  // ----- VENUE -----------------------------------------------
  venueName:    'Woking United Reformed Church',
  venueAddress: 'White Rose Lane, Woking, Surrey GU22 7HA',
  venueNote:    '5 min walk from Woking station',
  parkingNote:  'Town-centre car parks are a few minutes’ walk away. Limited parking is available at the venue for early birds.',
  venueMapUrl:  'https://maps.google.com/maps?q=Woking+United+Reformed+Church,White+Rose+Lane,Woking,GU22+7HA',

  // ----- MEMBERSHIP PRICES -----------------------------------
  // Fees are plain numbers, in £. This is the ONLY place fees are set:
  // the six-month total, each month's joining cost and the join-page
  // breakdown are all worked out from these two numbers automatically.
  joiningFee:   20,       // £, one-off when you join
  monthlyFee:   15,       // £, per month

  // ----- STRIPE PAYMENT LINKS --------------------------------
  //
  //  !! IMPORTANT — READ IF YOU CHANGE THE FEES ABOVE !!
  //  Each link below charges a FIXED amount that is set inside Stripe,
  //  not by this file. Changing joiningFee or monthlyFee updates what the
  //  website SHOWS, but it does NOT change what Stripe actually charges.
  //  After any price change you must create new payment links in the
  //  Stripe dashboard for the amounts listed below, and paste them here.
  //  Until that is done, members will be charged the old price.
  //
  //  The amount for each month is: joiningFee + (monthlyFee x months)
  //  Example:  6: "https://buy.stripe.com/xxxxxxxx",
  //
  //  STATUS: up to date. Replaced 11 Aug 2026 with the new £15/month live
  //  links. Each charges the £20 joining fee plus that month's membership,
  //  as two fixed line items, and redirects to thankyou.html when paid.
  stripeLinks: {
     1: "https://buy.stripe.com/5kQ8wO5fE8vS9nY65T9R608", // January   — £155 (£20 + 9 months)
     2: "https://buy.stripe.com/6oUbJ06jI8vS8jU1PD9R609", // February  — £140 (£20 + 8 months)
     3: "https://buy.stripe.com/4gM9AS37w9zW9nYbqd9R60a", // March     — £125 (£20 + 7 months)
     4: "https://buy.stripe.com/bJeaEW6jI8vS9nYgKx9R60b", // April     — £200 (£20 + 12 months)
     5: "https://buy.stripe.com/aFaaEWgYm4fC1Vw79X9R60c", // May       — £185 (£20 + 11 months)
     6: "https://buy.stripe.com/dRmbJ0fUi27ufMm3XL9R60d", // June      — £170 (£20 + 10 months)
     7: "https://buy.stripe.com/7sYbJ037w6nKbw60Lz9R60e", // July      — £155 (£20 + 9 months)
     8: "https://buy.stripe.com/bJe5kCeQeaE057I0Lz9R603", // August    — £140 (£20 + 8 months)
     9: "https://buy.stripe.com/9B628q9vUdQccAacuh9R604", // September — £125 (£20 + 7 months)
    10: "https://buy.stripe.com/dRm6oG23s5jG8jU1PD9R605", // October   — £200 (£20 + 12 months)
    11: "https://buy.stripe.com/fZu00igYm8vScAa51P9R606", // November  — £185 (£20 + 11 months)
    12: "https://buy.stripe.com/4gMdR8bE2cM81Vw65T9R607", // December  — £170 (£20 + 10 months)
  },

  // ----- SOCIAL & CONTACT ------------------------------------
  facebookUrl: 'https://www.facebook.com/WokingSpeakers/',
  linkedinUrl: 'https://www.linkedin.com/company/woking-speakers-club/',

  // ----- MEMBERSHIP FEE DATA --------------------------------
  // How many months of membership you get for joining in each month.
  // Toastmasters runs two six-month renewal periods a year, so joining
  // early in a period buys more months. The £ total a new member pays is
  // worked out automatically as: joiningFee + monthlyFee × months.
  feeData: {
     1: { months: 9  },
     2: { months: 8  },
     3: { months: 7  },
     4: { months: 12 },
     5: { months: 11 },
     6: { months: 10 },
     7: { months: 9  },
     8: { months: 8  },
     9: { months: 7  },
    10: { months: 12 },
    11: { months: 11 },
    12: { months: 10 },
  },

  // ----- NEXT MEETING BANNER ---------------------------------
  // Set to false to hide the banner entirely
  showBanner: true,

  // ----- SPECIAL EVENT (open house, contest night, etc.) -----
  // Promotes a one-off event across the site: the top banner switches
  // to it, and a highlighted panel appears near the top of the page.
  //
  // TO ANNOUNCE AN EVENT:  fill in the date and title below.
  // TO TURN IT OFF:        set the date back to '' (empty quotes).
  // You do NOT need to remove it after the event — it disappears by
  // itself the day after, so nothing stale is ever left showing.
  specialEvent: {
    date:    '2026-08-13',                  // 'YYYY-MM-DD' — leave blank for no event
    title:   'Open House',        // shown big on the panel and in the banner
    time:    '',                  // e.g. '7:15 pm' — blank uses the usual meeting time
    blurb:   'An open evening for anyone curious about the club, come and watch, ask questions, and meet members over a drink afterwards. No need to speak, and no charge.',
    ctaText: 'Tell us you’re coming',
    ctaLink: '#contact',          // '#contact' opens the enquiry form
  },

  // ----- CLUB ACTIVITY GALLERY --------------------------------
  // Shown as a scrolling carousel on the homepage ("Club in action").
  // To add a photo:
  //   1. Upload the image file to the "images" folder in GitHub.
  //      Any size is fine — oversized photos are automatically resized
  //      and compressed for the web a minute or so after you upload
  //      (jpg, png and webp all work). Landscape 4:3 photos crop most
  //      predictably in the carousel.
  //   2. Copy one of the lines below, paste it as a new line, and edit
  //      its filename, date (YYYY-MM-DD), and description. The description
  //      shows as the caption on the photo (and is what screen readers
  //      read out), so keep it short — a line or two at most.
  //      The "date" and "desc" are both OPTIONAL: drop either one (or both)
  //      and it simply isn't shown. A photo with neither has no caption at
  //      all — e.g.  { file: 'gallery-7.jpg' },
  //   3. Commit — the carousel updates automatically, no other changes needed
  // To remove a photo, just delete its line. Order below = display order
  // (it isn't re-sorted by date), so put newer photos wherever you like.
  // Any file that doesn't exist yet is simply skipped, so it's fine to
  // add an entry before uploading the matching photo.
  galleryPhotos: [
    { file: 'gallery-1.webp', date: '2026-06-30', desc: 'WSC wins Smedley Award!' },
    { file: 'gallery-2.webp', date: '2026-05-14', desc: 'Celebrating 20 years' },
    { file: 'gallery-3.webp', date: '2026-04-23', desc: 'Speaker Winners at Club Meeting' },
    { file: 'gallery-4.webp', date: '', desc: 'On filler words' },
    { file: 'gallery-5.webp', date: '', desc: 'Club members at a Thursday meeting' },
    { file: 'gallery-6.webp', date: '2026-01-26', desc: 'Club social' },
  ],

};
