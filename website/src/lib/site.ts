/** Site-wide facts. Every claim on the site must stay true for the app (docs/DESIGN.md §11, docs/CLAIMS.md). */
export const SITE = {
  name: 'Medifyles',
  url: 'https://www.medifyles.com',
  tagline: 'All your prescriptions, lab reports and pharmacy bills in one place.',
  description:
    'Take a photo of any medical paper. Medifyles keeps it on your phone, in date order, for every person in your family. Free, and made for older eyes. Coming soon to Android and iPhone.',
  /**
   * Who runs the service, for the privacy page and footer.
   * TODO before launch: replace with the registered legal name (and address) of the company.
   */
  company: '3innovators',
  /** Contact (2026-10-28). `phoneHref` is the dialable form. */
  supportPhone: '+91 93151 25250' as string | null,
  supportPhoneHref: '+919315125250',
  supportEmail: 'info@3innovators.com',
  /** Privacy and grievance requests (deletion, access, complaints). TODO: name the grievance officer. */
  privacyEmail: 'info@3innovators.com',
  /** The early-list promise: one launch message, then the number is deleted. */
  earlyList: {
    deleteAfterLaunchDays: 30,
    /** If the app hasn't launched by then, the list is deleted anyway. */
    deleteBy: '31 December 2027',
  },
} as const;

export const SHARE_TEXT =
  "I found an app to keep all our medical papers (prescriptions, reports, bills) in one place. It's simple and made for us. It's coming soon, have a look: www.medifyles.com/for-families";

export const whatsappShareUrl = (text = SHARE_TEXT) => `https://wa.me/?text=${encodeURIComponent(text)}`;
