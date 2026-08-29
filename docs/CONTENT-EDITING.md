# Editing the website content

For anyone at Mandrex VA Services who needs to change what the website says.
**No technical knowledge is assumed.** You do not need to install anything, and
you cannot break the site by editing text.

Everything in this guide is derived from the site's actual content settings. If
something you want to do is not described here, it is because the site does not
currently support it — not because it was left out.

Developers should read [`architecture.md`](architecture.md) instead.

---

## Contents

- [Signing in](#signing-in)
- [How your changes go live](#how-your-changes-go-live)
- [What you will see](#what-you-will-see)
- [Pages](#pages)
- [Section types](#section-types)
- [Fields that appear everywhere](#fields-that-appear-everywhere)
- [Reusable Sections](#reusable-sections)
- [Services](#services)
- [Testimonials](#testimonials)
- [Industries — and how sector order really works](#industries--and-how-sector-order-really-works)
- [Site Settings](#site-settings)
- [Adding a new page](#adding-a-new-page)
- [Adding a new icon](#adding-a-new-icon)
- [Things that will break something](#things-that-will-break-something)

---

## Signing in

**Go to <https://www.mandrexvaservices.com/keystatic>.**

The editor is called **Keystatic**, and it signs you in through **Keystatic
Cloud** — a hosted service that holds the login, separate from the website
itself. You will be asked to sign in to your Keystatic Cloud account and, the
first time, to authorise access to the project called **`mandrex/mandrex`**.

Notes on signing in:

- **Use the `www` address.** `https://www.mandrexvaservices.com/keystatic` works;
  the version without `www` redirects, and the sign-in step is registered
  against the `www` address specifically.
- **Access is granted per person, in Keystatic Cloud** — not on the website.
  To give a colleague editing rights, add them to the `mandrex/mandrex` project
  in the Keystatic Cloud dashboard. There is no "invite user" screen inside the
  editor.
- **There is no password reset inside the editor.** Account recovery happens at
  Keystatic Cloud.

If the sign-in loop never completes, the most likely cause is that the project's
configured URL in Keystatic Cloud does not exactly match
`https://www.mandrexvaservices.com`. That is a developer fix, not something you
can correct from the editor.

---

## How your changes go live

1. You edit something and press **Save**.
2. The change is written into the site's code repository on GitHub, as a
   permanent, dated record of exactly what changed.
3. That triggers the website to rebuild and republish itself.
4. **Roughly two minutes later, the change is live.**

**There is no separate "publish" button and no draft mode.** Save means publish.
If you are unsure about wording, write it somewhere else first.

**Nothing is ever really lost.** Every save is version-controlled, so any
previous version of any page can be restored by a developer.

**One caution.** If you leave the editor open in a browser tab for a long time,
come back and save, that stale tab can write back an *older* version of the site
and remove things — this has happened once, and it removed four images. **If you
have had a tab open for hours, reload the page before you edit.**

---

## What you will see

The left-hand sidebar has six entries.

| Entry | What it holds |
|---|---|
| **Pages** | The ten pages of the site, each built from a stack of sections |
| **Reusable Sections** | Section blocks that appear on more than one page, edited once |
| **Services** | The four service lines and their detail pages |
| **Testimonials** | Client reviews |
| **Industries** | The fifteen sectors shown on the home page |
| **Site Settings** | Navigation, footer, contact details, socials, form delivery, sector order |

The first five are **collections** — lists you add to and remove from. The last
is a **singleton** — a single settings screen.

---

## Pages

**Pages → pick a page.** Each page has three top-level fields and then its
sections.

| Field | What it does |
|---|---|
| **Page title** | The browser tab title and the headline in Google results. Required. |
| **Meta description** | The grey summary text under the title in Google results. Required. |
| **Slug** | The page's identity. **Do not change this.** See [Things that will break something](#things-that-will-break-something). |
| **Page sections** | The stack of blocks that makes up the page |

### Working with sections

**Page sections** is a list you can **drag to reorder**. Each item shows its type
so you can find what you want without opening every one.

- **Reorder** — drag the handle on the left of an item.
- **Edit** — click an item to expand it.
- **Remove** — use the item's remove control. It deletes the section's content
  along with it, so copy anything you want to keep first.
- **Add** — use the add control at the bottom of the list, then choose a
  **Section Type** from the dropdown.

**Changing the Section Type of an existing section clears its fields.** The types
hold completely different information, so there is nothing to carry across. Add
a new section instead if you want to keep the old one.

---

## Section types

There are 23 types. Most pages use a handful. This is the full list, with what
each one holds — use it to find the section that owns the words you want to
change.

| Type | What it is | Main fields |
|---|---|---|
| **Reusable section** | A pointer to an entry under Reusable Sections | Which section to show |
| **Hero** | The big opening block on the home page | Background image and position, eyebrow, headline, lead paragraph, two buttons, stats list |
| **Inner Hero** | The opening block on inner pages | Background image and position, eyebrow, headline, lead, tagline, breadcrumb, buttons, chips, facts |
| **Stats bar** | A row of figures | Stats list — value, label, accent on/off |
| **Service grid** | The services overview grid | Eyebrow, title, "show all" button |
| **Why choose us** | Reasons-to-choose block | Background image, eyebrow, title, intro, tiles (icon + title + description) |
| **Industries grid** | The sectors grid | Eyebrow, title, description, and the "Not listed?" call-to-action tile |
| **Global reach** | The world map | Map countries, eyebrow, title, description, stats |
| **Testimonial feature** | One quote beside a checklist | Quote, author photo/initials/name/role, right-column heading, checklist, button |
| **CTA band** | A full-width call-to-action strip | Variant (Green or Dark), heading, paragraph, button |
| **About stats** | Figures on the About page | Stats list |
| **Founder** | The founder's note | Photo and position, name, role, eyebrow, title, paragraphs, mission statement |
| **Vision / Mission** | Two accent cards | Cards — icon, title, description, colour (Green or Red) |
| **Team** | The team block | Background image, title, description, team tiles |
| **How we work** | Process block | Title, items (icon + title + description) |
| **Service cards** | The service cards row | Per-service card description overrides |
| **Engagement steps** | Numbered process steps | Title, steps (number + title + description) |
| **Featured testimonial** | A single highlighted review | Quote, author photo/initials/name/role, stats |
| **Testimonials grid** | The grid of all reviews | CTA title, description, button |
| **Closing band** | The image-and-card strip at the foot of a page | Image, card text |
| **Contact section** | Contact details and the enquiry form | Details title, form title, success title and text, form note, call-to-action row |
| **Not found** | The 404 page | Background image and position, eyebrow, title, lead, two buttons, nav links |
| **Service detail** | A full service detail page body | Which service to render |

Three of these pull their real content from elsewhere, so editing the section
itself changes very little:

- **Service grid**, **Service cards** and **Service detail** all read from
  **Services**. To change a service's wording, edit it under **Services**.
- **Testimonials grid** reads from **Testimonials**.
- **Industries grid** reads from **Industries**, in the order set in
  **Site Settings → Sector order**.

### The Global reach map

Under **Map countries** you can edit each country's **Map label**, **Detail**
and **Coverage window**, and you can choose the **Country** from a fixed list of
four: United States, Canada, United Kingdom, Australia.

**You cannot add a fifth country here.** The map's shapes and the arcs between
the pins are drawn into the site's code, not stored in the editor. Adding a
country is a developer job. Removing one leaves an arc pointing at nothing, so
do not remove countries either.

---

## Fields that appear everywhere

**Eyebrow label** — the small line of text above a heading. Where a colour is
offered it is **Yellow**, **Green** or **Red**, plus a **Large eyebrow**
checkbox.

**Buttons** — every button has three fields:

- **Button label** — the visible text
- **Button link** — where it goes. Use `/contact`, `/services`, `/about` and so
  on for pages on this site, a full `https://…` address for anywhere else, and
  **`#book`** to open the "Book a 30-minute call" pop-up.
- **Button style** — Yellow, Dark, Outline Dark, or Outline Light

**Section ID (optional)** — leave this empty. It exists so a link can jump
directly to a specific section, and setting it wrongly does nothing visible but
can break an existing link.

**Images** — click the field, upload, save. **Upload any size.** Photos are
resized and compressed automatically when the site publishes, so a photo
straight off a phone or camera is fine.

**Background position / object position** — these control which part of a photo
stays visible when it is cropped. They are written as two percentages, like
`58% 55%`: the first is left-to-right, the second is top-to-bottom. `50% 50%`
is dead centre. If a photo is cropping someone's head off, lower the second
number.

**Icons** — always a dropdown, never typed. 28 icons are available:

Bar chart · Briefcase · Briefcase (alt) · Calculator · Clock · Construction ·
Crosshair · Desk (executive assistance) · Document list (administrative) ·
Dollar · Envelope · Headset (customer support) · Heart · House · Ledger
(bookkeeping) · Lightbulb · Megaphone · Partnership · Person · Phone · Pulse ·
Rocket · Scales · Shield · Shopping cart · Target · Tooth · Truck

To get a 29th, see [Adding a new icon](#adding-a-new-icon).

**Author initials** on testimonial sections are shown only when no photo is
uploaded. Fill both in, and the photo wins.

---

## Reusable Sections

A section that appears on more than one page — the closing call-to-action, for
example — lives here once, and each page points at it.

**Edit it here and every page using it updates.** That is the point of them.
Before changing one, be aware you may be changing several pages at once.

Each entry has a **Section name** (how you recognise it in the list) and a
**Section**, which offers the same section types as a page, minus "Reusable
section" itself.

To use one on a page: **Pages → the page → add a section → Section Type =
Reusable section → pick it from the dropdown.**

---

## Services

The four service lines. Each entry drives its own detail page, its card on the
home and services pages, and its icon everywhere.

| Field | Notes |
|---|---|
| **Key** | The service's identity. **Do not change it** — the detail pages and every reference point at it. |
| **Name** | The service name |
| **Short description** | Used in compact places |
| **Card title / Card description** | The words on the service card |
| **Icon** | Dropdown |
| **Hero eyebrow, Hero image, Hero image alt, Hero object position** | The top of the detail page. "Alt" is the description read aloud by screen readers. |
| **H1 headline / Lead paragraph** | The main heading and opening paragraph |
| **CTA heading** | The heading on the closing call to action |
| **Accent color** | Green, Yellow, Red or Deep red |
| **Top bar color** | A colour code such as `#306A42`. Leave it unless you have been given a specific value. |
| **Index number** | **This controls the order services appear in.** Lowest first. |
| **Chips** | The short pills of text near the top |
| **Facts** | Label-and-value pairs |
| **Scope items** | The "what's included" list — title and description each |
| **Who it's for** | The audience list |
| **Tools** | The named software list |
| **Pull quote** | The highlighted quote |
| **Home card image** | The photo used on the home page card |

### Ordering services

The Services list is always shown **alphabetically by Key** and **cannot be
dragged**. The **Index number** field is what actually orders them on the site.
It is also printed on the service card, so it is visible to visitors — change it
deliberately.

### A warning about the service pages

The detail pages publish specific commitments: turnaround times such as
"Monthly close: 5 business days", onboarding windows, and the lists of tools
used. **Clients read these as promises.** They were drafted during the build and
have not all been confirmed by the business. Review them, and keep them accurate
as the business changes.

---

## Testimonials

| Field | Notes |
|---|---|
| **Service** | Which service line the review relates to. Required. |
| **Slug** | The entry's identity. Do not change it after creating the entry. |
| **Quote** | The review text. Required. |
| **Role** | The reviewer's role |
| **Detail** | Supporting context |
| **Photo** | Optional. Without one, initials are shown. |

**To add a review:** Testimonials → add → fill in Service, Slug, Quote → Save.
It appears on the testimonials grid automatically.

**Quotes are kept verbatim** by deliberate choice, trimmed only at sentence
boundaries. One reviewer spells the founder's name differently from everyone
else — that is intentional, because it is their review. Please do not "correct"
existing quotes.

---

## Industries — and how sector order really works

**This is the thing most likely to confuse someone.** Sectors live in two
places, on purpose.

### The wording lives in Industries

**Industries → pick a sector.** Each has a **Name**, a **Slug**, a
**Description** and an **Icon**. Name, Slug and Description are all required.

### The order lives in Site Settings

**The Industries list is always shown alphabetically by slug, and you cannot
drag it into a different order.** That is a limitation of how the list is
stored: each sector is a separate file, and files have no inherent order.

**The real display order is set in Site Settings → Sector order.** That is a
drag-and-drop list, and it is the only thing that controls what visitors see on
the home page.

So:

| To do this | Go here |
|---|---|
| Change a sector's name, description or icon | **Industries** |
| Change the order sectors appear in | **Site Settings → Sector order** |

### Adding a sector

1. **Industries → add.** Fill in Name, Slug, Description, Icon. Save.
2. **Site Settings → Sector order → add the new sector**, and drag it to where
   you want it. Save.

**If you skip step 2 the sector still appears** — it is not lost — but it lands
at the end of the grid, after everything in the ordered list, alphabetically
alongside any others you also forgot. Step 2 is how you place it.

### Removing a sector

Remove it from **Site Settings → Sector order** *and* delete it from
**Industries**. Removing it from only the order list leaves it on the site, at
the end.

---

## Site Settings

A single screen holding everything that is not page content.

**Navigation** — **Nav pages** is the drag-orderable main menu, each item a
Label and an Href. **Nav CTA** is the highlighted button at the right of the
menu.

**Footer** — **Brand text** is the paragraph under the logo. **Footer pages** is
the link list. **Copyright** is the line at the bottom — *the year is typed in,
so it does not update itself; check it each January.* **Domain** is the address
shown in the footer.

**Form delivery** — the two keys that route enquiries to your inbox:

- **Web3Forms key — contact form.** Submissions from the contact page are
  emailed to the address this key is registered to at
  [web3forms.com](https://web3forms.com).
- **Web3Forms key — booking modal.** Optional. Use a separate key here to route
  call requests independently; leave it empty and they go through the contact
  key instead.

**If a key is cleared, that form stops emailing** and instead opens the
visitor's own email program with the details filled in, so a message is never
silently lost — but it does rely on the visitor pressing send. Do not clear
these without a replacement key ready.

**These keys are not passwords.** They are public identifiers that only permit
submitting that one form, and they are visible in the website's code by design.
What actually protects the form is the **Restrict to Domain** setting in the
Web3Forms dashboard, which must read `www.mandrexvaservices.com` — with the
`www`. If it is wrong, **every submission is rejected while the visitor still
sees "Message received."** If enquiries stop arriving, check that first.

**Contact** — **Email**, **Phone 1**, and **Phone 1 href**. The href is the
tappable version of the number and must be written as `tel:` followed by the
number with no spaces or brackets, e.g. `tel:+13073640114`. **Change both
together**, or the displayed number and the number that gets dialled will
disagree.

**Social links** — Label and Href pairs, drag to reorder.

**Sector order** — see [above](#industries--and-how-sector-order-really-works).

---

## Adding a new page

**You cannot add a working new page from the editor on your own. This needs a
developer.**

Adding an entry under **Pages** creates the *content* for a page — its title,
description and sections — but it does **not** create a web address for it. Each
of the ten existing pages has a matching file in the site's code that claims its
URL and names the page entry to display. Without that file, the new entry exists
but nothing links to it and nothing can reach it.

**What to do:** create the page entry under **Pages** with the content you want,
then ask a developer to add the matching route. It is a small job — a few lines
copied from an existing page — and giving them a finished page entry means they
can do it in one pass.

**What you can do without a developer** is change any existing page completely:
add, remove and reorder its sections, and rewrite every word on it. That covers
almost everything people actually want a "new page" for.

---

## Adding a new icon

**This needs a developer.** It is a deliberate two-step process, and both steps
are required — the second alone produces an icon that is silently invisible
rather than obviously broken.

1. **Draw it.** Add the icon's shape to the `paths` dictionary in
   `src/components/Icon.astro`. That file is the site's entire icon library —
   the icons are hand-drawn shapes stored in the code, not fetched from an icon
   service.
2. **Offer it.** Add a matching `{ label, value }` entry to the `ICON_OPTIONS`
   list in `keystatic.config.ts`, where the `value` is exactly the name used in
   step 1. The `label` is what you will see in the dropdown.

Only after both does the icon appear as a choice in the editor.

Notes for whoever does it:

- The library also contains interface icons — `arrow`, `chevron`, `menu`,
  `close`, `plus`, `check`, `checkCircle`, `successCheck` — which are
  **deliberately not offered** in the dropdown. Keeping the selectable list a
  curated subset is the reason the two lists are separate rather than generated
  from one another.
- If a name is in `ICON_OPTIONS` but missing from `paths`, the site renders an
  empty, invisible square and logs a warning at build time. Nothing appears
  broken on screen, so this is easy to miss.
- Several icons bake their colours into the shape itself, so they will not
  recolour to match a section's accent.

---

## Things that will break something

**Do not change a Slug or a Key** once an entry exists. It is the entry's
identity and its web address. Changing it breaks every existing link to that
page — including links in emails, on social media, in Google's results, and from
other pages of this site. If a page genuinely needs a new address, a developer
needs to set up a redirect at the same time.

**Do not clear a required field.** Page title, Meta description and Slug on
pages; Name, Slug and Description on sectors; Service, Slug and Quote on
testimonials; Key and Name on services. The editor will stop you saving, but it
is worth knowing why.

**Do not clear the Form delivery keys** without a replacement ready. See
[Site Settings](#site-settings).

**Do not rename or move uploaded image files** outside the editor. The pages
reference them by their exact stored path.

**Do not remove a country from the Global reach map.** It leaves a connecting
line pointing at nothing.

**Reload a tab that has been open for hours before saving.** See
[How your changes go live](#how-your-changes-go-live).

---

## When something looks wrong

- **A change has not appeared.** Give it two full minutes, then hard-refresh
  (Ctrl+Shift+R, or Cmd+Shift+R on a Mac).
- **Enquiries have stopped arriving.** Check the Web3Forms **Restrict to
  Domain** setting reads `www.mandrexvaservices.com`. It fails silently.
- **An icon is missing where you set one.** The icon name is not in the code
  library. See [Adding a new icon](#adding-a-new-icon).
- **A sector is in the wrong place.** It is missing from **Site Settings →
  Sector order**.
- **A service is in the wrong place.** Check its **Index number**.
- **Something was deleted by accident.** Every version is kept. A developer can
  restore it from the project's history.
