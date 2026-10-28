/** Site-wide facts. Every claim on the site must stay true for the app (docs/DESIGN.md §11). */
export const SITE = {
  name: 'Medifyles',
  url: 'https://www.medifyles.com',
  tagline: 'All your prescriptions, lab reports and pharmacy bills in one safe place.',
  description:
    'Take a photo of any medical paper. Medifyles keeps it safe, in date order, for every person in your family. Free, private and made for older eyes.',
  /** Contact (2026-10-28). `phoneHref` is the dialable form. */
  supportPhone: '+91 93151 25250' as string | null,
  supportPhoneHref: '+919315125250',
  supportEmail: 'info@3innovators.com',
} as const;

export const SHARE_TEXT =
  "I found an app to keep all our medical papers (prescriptions, reports, bills) in one place. It's simple and made for us. Have a look: www.medifyles.com/for-families";

export const whatsappShareUrl = (text = SHARE_TEXT) => `https://wa.me/?text=${encodeURIComponent(text)}`;
