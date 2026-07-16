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
  parkingNote:  'Town-centre car parks are a few minutes’ walk away',
  venueMapUrl:  'https://maps.google.com/maps?q=Woking+United+Reformed+Church,White+Rose+Lane,Woking,GU22+7HA',

  // ----- MEMBERSHIP PRICES -----------------------------------
  // Fees are plain numbers, in £. This is the ONLY place fees are set:
  // the six-month total, each month's joining cost and the join-page
  // breakdown are all worked out from these two numbers automatically.
  joiningFee:   20,       // £, one-off when you join
  monthlyFee:   13,       // £, per month

  // ----- STRIPE PAYMENT LINKS --------------------------------
  // Replace null with your Stripe URL (in quotes) when ready.
  // Example:  6: "https://buy.stripe.com/xxxxxxxx",
  stripeLinks: {
     1: "https://buy.stripe.com/5kQaEX6vP8vW2173RE0Ny02", // January   — £137
     2: "https://buy.stripe.com/4gMaEXf2l4fG35b87U0Ny05", // February  — £124
     3: "https://buy.stripe.com/aFaeVdaM54fG49f4VI0Ny06", // March     — £111
     4: "https://buy.stripe.com/4gMfZh8DX9A02170Fs0Ny07", // April     — £176
     5: "https://buy.stripe.com/00w14n6vPdQg5dj1Jw0Ny08", // May       — £163
     6: "https://buy.stripe.com/14A4gz9I17rS7lr0Fs0Ny09", // June   — £150
     7: "https://buy.stripe.com/aFacN55rL27ybBHcoa0Ny01", // July   — £137
     8: "https://buy.stripe.com/28E28r5rL5jK217gEq0Ny0a", // August — £124
     9: "https://buy.stripe.com/6oUcN54nHeUk9tz73Q0Ny0b", // September — £111
    10: "https://buy.stripe.com/6oUfZh4nHh2seNTbk60Ny0c", // October   — £176
    11: "https://buy.stripe.com/14A5kD4nHbI82173RE0Ny0d", // November  — £163
    12: "https://buy.stripe.com/bJe8wPf2lfYo217gEq0Ny0e", // December  — £150
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

  // ----- CLUB ACTIVITY GALLERY --------------------------------
  // Shown as a scrolling carousel on the homepage ("Club in action").
  // To add a photo:
  //   1. Upload the image file to the "images" folder in GitHub
  //      Ideal photo size: about 800x600px, in a 4:3 aspect ratio
  //      (landscape). Other sizes/ratios still work — the photo is
  //      auto-cropped to fit — but 4:3 keeps the crop predictable.
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
    { file: 'gallery-1.jpg', date: '2026-06-30', desc: 'WSC wins Smedley Award!' },
    { file: 'gallery-2.jpg', date: '2026-05-14', desc: 'Celebrating 20 years' },
    { file: 'gallery-3.jpg', date: '2026-04-23', desc: 'Speaker Winners at Club Meeting' },
    { file: 'gallery-4.jpg', date: '', desc: 'On filler words' },
    { file: 'gallery-5.jpg', date: '', desc: 'Club members at a Thursday meeting' },
    { file: 'gallery-6.jpg', date: '2026-01-26', desc: 'Club social' },
  ],

};
