# Site guide

For whoever runs the Mandrex VA Services website day to day. No technical
knowledge assumed. Developers should read [`architecture.md`](architecture.md)
and [`dns.md`](dns.md) instead.

---

## What the site is

An eleven-page marketing website that you can edit yourself, without needing a
developer for day-to-day changes.

| Page | What's on it |
|---|---|
| Home | Hero, services, why choose us, sectors, global reach map, testimonial, call to action |
| Services | Overview of all four service lines and how an engagement starts |
| Bookkeeping · Administrative Support · Customer Support · Executive Assistance | A detail page each |
| About | Founder's note, vision and mission, team |
| Testimonials | Client reviews from Google and Upwork |
| Contact | Contact details and enquiry form |
| Privacy Policy | Required because the site collects enquiries |

It works on phones, tablets and desktops, and is set up so search engines can
find and index it.

**The site's address is <https://www.mandrexvaservices.com>.** The version
without `www` redirects to it automatically. Whenever a form or service asks you
for the website address, give it the `www` version — some of them reject
traffic if the address does not match exactly.

---

## Editing your content

Everything you'd normally want to change — text, photos, testimonials, contact
details — you can change yourself.

**Where:** <https://www.mandrexvaservices.com/keystatic>
Sign in with the account connected at setup.

**When you hit Save, the site updates itself.** Changes go live in roughly two
minutes. There is no separate "publish" step.

### Common tasks

| To do this | Go here |
|---|---|
| Change wording anywhere on a page | **Pages** → pick the page → find the section |
| Swap a photo | **Pages** → the section → click the image field |
| Add or edit a testimonial | **Testimonials** → *Add*, or pick an entry |
| Add a client's photo to their testimonial | **Testimonials** → the entry → **Photo** |
| Reorder the sectors on the home page | **Site Settings** → **Sector order** → drag |
| Change a service's details or turnaround times | **Services** → pick the service |
| Reorder the services | **Services** → the service → **Index number** (lowest first) |
| Update your email, phone or social links | **Site Settings** → Contact |
| Change footer or navigation links | **Site Settings** → Navigation / Footer |

### Worth knowing

**Photos can be any size.** Upload straight from your phone or camera — the site
resizes and compresses them automatically when it publishes, so large photos
won't slow it down.

**Icons are picked from a list**, not typed. You'll see a dropdown wherever an
icon can be set.

**Sectors are in two places, by design.** The wording of each sector lives under
**Industries**; the *order* they appear in lives under **Site Settings → Sector
order**. If you add a new sector and forget to add it to the order list, it
still appears on the site — just at the end.

**Don't change a "slug" unless you mean to.** That is the part that forms a
page's web address. Changing it breaks any existing link to that page.

**The service pages publish specific commitments** — turnaround times such as
"Monthly close: 5 business days", onboarding windows, and the lists of tools
used. Clients will read these as promises, so keep them accurate as the
business changes.

---

## Where enquiries go

Both forms email **welcome@mandrexvaservices.com**.

- **Contact form** on the contact page — general enquiries.
- **Book a 30-minute call** button — a booking request form that also captures
  the person's preferred day, time and time zone.

You can tell them apart at a glance: subject lines read *"Website enquiry —
[name]"* or *"Call request — [name]"*.

**Just hit Reply.** Replies go straight to the person who filled in the form.

**The call booking form sends a *request*, it does not reserve a slot in your
calendar.** You confirm the time by email. The form says so on screen, so nobody
expects an automatic booking.

---

## What runs automatically

Nothing here needs your attention; it is listed so you know it is covered.

- **Publishing.** Saving in the CMS updates the live site.
- **Photo optimisation.** Uploads are resized and compressed automatically.
- **Search engines.** A sitemap is generated and updated as pages change.
- **Security and speed.** The site is served through Cloudflare's global network.
- **Backups.** Every change is version-controlled — any previous version of any
  page can be restored.
- **Analytics.** Google Analytics 4 (`G-R8P4NZCHZZ`) tracks visitor traffic on
  every page. Sign in to [analytics.google.com](https://analytics.google.com)
  with the account that owns this property to see the data.

---

## Accounts the site depends on

The site stops working, or stops being yours, if any of these lapse. Confirm
each one is registered to an address you control, and that you can sign in.

| Service | What it does | Why it matters |
|---|---|---|
| **Squarespace Domains** | Registrar for `mandrexvaservices.com` | Renewal and ownership of the domain. **Expires 5 July 2027.** |
| **Cloudflare** | DNS and hosting | Serves the website and holds every DNS record, including the ones that deliver your email |
| **Keystatic Cloud** | The content editor login | How you edit the site |
| **GitHub** | Stores the site's code and content | The backup of everything, and where a developer would work |
| **Google Workspace** | Your email | Predates the website; unchanged by it |
| **Web3Forms** | Delivers form submissions to your inbox | Enquiries stop arriving if this lapses |

Two settings on that list are easy to get wrong and fail silently — the
Web3Forms domain restriction and the Keystatic Cloud project URL both need the
`www` address. See [`dns.md`](dns.md#canonical-hostname-www).

---

## Not included

- **Calendar booking.** The site takes call *requests*; it does not connect to a
  calendar or reserve slots. Real scheduling (Calendly, Cal.com or similar)
  could be added later.
- **Ongoing content updates.** The site is yours to edit.

---

## Getting help

The site was built by Brian Espina — [brianespina.com](https://www.brianespina.com/).
Any developer familiar with Astro can pick it up from
[`architecture.md`](architecture.md).
