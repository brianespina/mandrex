# Domain & DNS — migration record

**Status: completed 25 August 2026.** DNS moved from Namecheap to Cloudflare and
the site went live on the Worker. Mail was carried across unchanged and verified
in both directions.

Originally captured 24 August 2026 as a forward-looking plan and rewritten on the
25th, after the cutover, as a record of it. Everything below was read from live
DNS and the public registry, not from a control panel. The pre-migration sections
are kept deliberately — they are the audit the migration was built on, and the
only description of a zone that can no longer be reached.

---

## Who controls what

Two roles now, where there were three. This is still the thing to keep straight.

| Role | Provider | Controls |
|---|---|---|
| **Registrar** | Squarespace Domains II LLC — *unchanged* | Renewal, transfer, WHOIS, and **which nameservers the domain delegates to** |
| **DNS host** | **Cloudflare** — `ganz.ns.cloudflare.com`, `sandra.ns.cloudflare.com` | The actual records |
| **Web host** | **The `mandrex` Cloudflare Worker** | What the domain serves |

Before 25 August 2026 the last two were Namecheap: `dns1`/`dns2.namecheaphosting.com`
for DNS, and shared hosting at `66.29.153.213` for the site. Both are now out of
the path entirely, which was the point — that account belongs to a developer
nobody can reach.

Registered 2023-07-05 · expires **2027-07-05** · last changed 2026-06-21.

> ⚠️ **The Squarespace DNS Settings page is not in effect.** The domain uses
> custom nameservers, so Namecheap serves DNS and Squarespace's record table is
> inert. Its contents also *differ* from what is actually live — it lists
> `alt3`/`alt4` MX records and a simple SPF that are not the real ones, and a
> DKIM record that is not published at all. **Do not copy records from it.**

The site is live at **`https://www.mandrexvaservices.com`**. The apex 301s to
`www`, preserving the path, and `www` is the canonical hostname — see
[Canonical hostname](#canonical-hostname-www) below, because anything scoped to a
hostname must name `www`, not the apex.

---

## What was live before the migration

Read via DNS-over-HTTPS on 24 August 2026, while Namecheap still served the
zone. Kept as the baseline every later check was made against. The mail records
here are still live and unchanged; the `66.29.153.213` web records are not.

**Apex and www**

```
mandrexvaservices.com.        A       66.29.153.213
www.mandrexvaservices.com.    CNAME   mandrexvaservices.com.
```

**Mail — Google Workspace. This is the part that must not break.**

```
MX  1   smtp.google.com.
MX  1   aspmx.l.google.com.
MX  5   alt1.aspmx.l.google.com.
MX  5   alt2.aspmx.l.google.com.
MX  10  aspmx2.googlemail.com.
MX  10  aspmx3.googlemail.com.
```

**SPF** — authorises both Google *and* Namecheap's mail servers:

```
TXT  @  "v=spf1 +a +mx +ip4:66.29.153.176 include:spf.web-hosting.com +ip4:66.29.153.213 +include:_spf.google.com ~all"
```

**cPanel subdomains** — all pointing at `66.29.153.213`:

```
cpanel  webmail  mail  ftp  autodiscover  autoconfig  webdisk
_autodiscover._tcp   SRV   0 0 443 cpanelemaildiscovery.cpanel.net
```

**Calendar/contacts SRV records** — these name the specific cPanel box,
`server347.web-hosting.com`:

```
_caldav._tcp    SRV  0 0 2079 server347.web-hosting.com.
_caldavs._tcp   SRV  0 0 2080 server347.web-hosting.com.
_carddav._tcp   SRV  0 0 2079 server347.web-hosting.com.
_carddavs._tcp  SRV  0 0 2080 server347.web-hosting.com.
```

**DKIM** — a cPanel-generated key *is* published, at the `default` selector:

```
default._domainkey  TXT  "v=DKIM1; k=rsa; p=MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAl+dSFShA1aFF…"
```

That selector signs mail sent *through Namecheap*, not through Google.
`google._domainkey` returns nothing, so **Google Workspace mail — the mail that
actually flows — is unsigned.** Carry the `default` record across anyway; it
costs nothing and something may still rely on it.

**Not present:** no DMARC, and no CAA.

---

## Update, 25 August 2026 — there is no Namecheap access

The client does not have the Namecheap login. **The previous developer created
the account and is no longer active.** Nikka has messaged him; assume no reply.

Two things follow, and they point in opposite directions from what you would
expect.

### The migration is not blocked

Nameserver delegation is a **registrar** function, and the registrar is
Squarespace. Namecheap access was only ever wanted for step 1 — exporting the
zone file as a safety net. Every other step happens at Squarespace and
Cloudflare, both of which are reachable.

> **Verify first:** does the client actually have the **Squarespace** login?
> That one is not optional — without it the nameservers cannot be changed, and
> recovery means a registrant-based claim through Squarespace support. Ask now,
> in the same breath as everything else.

### The migration is now urgent

The domain's DNS is served by nameservers belonging to a hosting account that
**nobody controls and nobody is watching.** If that plan lapses or is suspended,
the zone stops resolving and Google Workspace email dies with the website, with
no way to fix it except an emergency nameserver change.

That account is already showing signs of neglect:

- **The TLS certificate expired.** `https://mandrexvaservices.com` fails
  verification (`certificate has expired`), and the WordPress install 301s all
  HTTP traffic straight to that broken HTTPS URL. **The live site is already
  down for every visitor.** cPanel AutoSSL renews these automatically when an
  account is healthy — it has not.
- **The zone has not been edited since March 2024.** The SOA serial is
  `1710036683`, a Unix timestamp for 2024-03-10.

Moving to Cloudflare removes the dependency permanently. There is no working old
site left to protect by going slowly.

---

## Replacing the zone-file export — resolved

DNS cannot be enumerated from outside, so the export could not be reproduced
directly. In the event it did not need to be: **Cloudflare's scan on 25 August
2026 imported a complete zone**, verified record for record against the
authoritative nameserver.

> **Correction.** An earlier dictionary sweep run through a public resolver
> reported that most cPanel subdomains did not exist. That was resolver
> throttling, not absence — every one of them resolves when queried directly
> against `dns1.namecheaphosting.com`. Query authoritative nameservers directly
> when auditing a zone; a public resolver will silently drop queries under a
> burst and the empty answers look exactly like a missing record.

### The verified zone — 29 records

Cloudflare reports 29 records in the zone, and all 29 are accounted for below —
confirmed present in both authoritative DNS and the Cloudflare import, with
nothing unexplained:

| Type | Names | Content |
|---|---|---|
| `A` | apex, `autoconfig`, `autodiscover`, `cpanel`, `cpcalendars`, `cpcontacts`, `ftp`, `mail`, `webdisk`, `webmail`, `whm` | `66.29.153.213` |
| `CNAME` | `www` | apex |
| `MX` | apex ×6 | Google Workspace, priorities 1/1/5/5/10/10 |
| `SRV` | `_autodiscover._tcp`, `_caldav._tcp`, `_caldavs._tcp`, `_carddav._tcp`, `_carddavs._tcp` | cPanel + `server347.web-hosting.com` |
| `TXT` | `_caldav._tcp`, `_caldavs._tcp`, `_carddav._tcp`, `_carddavs._tcp` | `"path=/"` |
| `TXT` | `default._domainkey` | cPanel DKIM key |
| `TXT` | apex | SPF |

That is 11 + 1 + 6 + 5 + 6 = 29. Still absent, as before: no DMARC, no CAA, no
`google._domainkey`.

### Export the zone from Cloudflare — done

Cloudflare's DNS page has an **Export** button, which produces the BIND zone
file that Namecheap access was wanted for in the first place. This was exported
and committed to this repo as `dns-snapshot-namecheap-2026-08-25.zone` **before
anything changed**, while the records were still a faithful mirror of the
Namecheap zone. That converted a rollback which depended on someone else's
hosting account staying alive into a plain text file that cannot be taken away.

The residual risk is small but did not go away with the cutover — a record at a
name neither the sweep nor Cloudflare's wordlist would guess, most likely a
domain-verification `TXT`. If some third-party service quietly stops working,
this is the first thing to suspect. Still worth asking Nikka which outside
services were ever connected to the domain (Search Console, Meta Business, a
mailing tool, a booking product); Google Workspace Admin → Domains will also
show its verification method.

---

## Before activating: fix the proxy status — done

Cloudflare's importer orange-clouded **every** `A` record and the `www` `CNAME`.
That is wrong for the cPanel service names, and was corrected before the
nameservers moved; all ten were confirmed answering unproxied afterwards.

The proxy only handles HTTP/HTTPS on a fixed port list. These services do not
qualify, and proxying them breaks them outright:

- **`mail`** — SMTP/IMAP/POP are not HTTP. Proxying kills any client or script
  connecting to `mail.mandrexvaservices.com`. The old site's contact form is a
  plausible user, given the SPF includes `spf.web-hosting.com`.
- **`ftp`** — not HTTP; cannot be proxied at all.
- **`webdisk`** (2077/2078) and **`cpcalendars`/`cpcontacts`** (2079/2080) —
  ports outside Cloudflare's proxiable set.
- **`cpanel``whm``webmail`** — the ports *are* proxiable (2082/2083, 2086/2087,
  2095/2096), but routing a control-panel login through the proxy adds a failure
  mode for no benefit.
- **`autodiscover`/`autoconfig`** — mail client bootstrap; leave direct.

**Set all ten cPanel `A` records to DNS only (grey cloud).** Leave the apex and
`www` alone — the Worker custom domain will replace those records anyway.

### Keep the cPanel records for now

They point at a box nobody controls, and once the site is on the Worker nothing
should legitimately use them. Delete them anyway *later*. The safety property of
this migration is that Cloudflare mirrors Namecheap exactly, so the nameserver
change is a no-op; deleting first turns the flip into a delegation change *and* a
removal at the same instant, and a failure afterwards becomes ambiguous.

Prune once mail is verified on the new delegation. Two tiers:

- **Delete freely:** `ftp`, `cpanel`, `whm`, `webdisk` — control-panel and
  file-transfer access to a box nobody controls.
- **Ask Nikka first:** `mail`, `webmail`, `autodiscover`, `autoconfig`,
  `cpcalendars`, `cpcontacts`, the four CalDAV/CardDAV SRVs and their `path=/`
  TXT records. Inbound mail goes exclusively to Google, so a cPanel mailbox
  there receives nothing and is near-certainly dead — but the calendar/contact
  records exist because something configured sync at some point, and deleting
  them breaks any still-syncing device silently.

The reason to delete eventually rather than leave them: if the hosting account
lapses, `66.29.153.213` is a shared-hosting IP that will be reassigned, leaving
ten records aimed at a stranger's server.

---

## What was done

The principle held throughout — **do not put email in the blast radius.** The web
half needed no staging: the old site was already broken, so pointing the domain
at the Worker could not make it worse. Mail was the only thing to preserve
exactly, and it was preserved by mirroring the zone first so that the nameserver
change was a no-op for every mail record.

**Staged first, 25 August 2026:** domain added to Cloudflare; zone scanned and
verified at 29/29 records against authoritative DNS with no drift; the ten cPanel
`A` records set to `DNS only`; SSL/TLS mode pinned to `Full` (not Automatic, so
Cloudflare could not re-evaluate and downgrade to Flexible against the expired
origin certificate); zone file exported and committed as
`dns-snapshot-namecheap-2026-08-25.zone`; Squarespace registrar access confirmed;
Web3Forms submissions tested working on `mandrex.espinabrian.workers.dev`.

**Then, in order:**

1. **Nameservers changed at Squarespace** to `ganz`/`sandra.ns.cloudflare.com`.
   Delegation was visible at both `1.1.1.1` and `8.8.8.8` within minutes — far
   faster than the 2-day NS TTL allowed for.
2. **Zone verified against Cloudflare's own nameservers**, not a public resolver:
   all six Google MX at the right priorities, SPF byte-identical, `default`
   DKIM present, five SRV records intact, and all ten cPanel `A` records
   answering unproxied. No drift.
3. **Mail verified.** An SMTP probe to `aspmx.l.google.com` — reached via the new
   MX records — accepted `RCPT TO: welcome@mandrexvaservices.com` with `250`,
   confirming inbound routing without sending anything. Then real messages both
   ways, from **Gmail and Protonmail**. The Proton leg is the one that carries
   weight: it validates SPF on receipt and sits outside Google's infrastructure,
   so it proves outbound authentication passes against the migrated SPF record.
   A Gmail-only test would have proved little, since Google can deliver
   internally between its own tenants without consulting public MX records.
4. **Worker custom domains added** for the apex and `www`.
5. **Canonical hostname set to `www`** and the site redeployed — see below.
6. **Always Use HTTPS** enabled, so plain HTTP now `301`s instead of serving.

> **Gotcha, if this is ever repeated.** Workers custom domains will **not**
> overwrite an existing DNS record the way Pages does. With the apex `A` and
> `www` `CNAME` still present, the dialog refuses outright: *"Hostname already
> has externally managed DNS records. Delete them first."* Delete exactly those
> two records, then add the custom domains — Cloudflare recreates them itself.
> Everything else in the zone must be left alone, and the ten cPanel `A` records
> share the `66.29.153.213` value, so filter by **name**, not by address.

**Side effect worth noting:** adding the custom domains issued a valid edge
certificate and ended an outage that had been running since the origin's Sectigo
certificate expired on 3 May 2025 — over a year of the site being unreachable.

**Rollback**, should it ever be needed, is still the nameservers at Squarespace,
back to `dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`, with
`dns-snapshot-namecheap-2026-08-25.zone` as the record of what that zone held.
Note that this only protects mail: there is no working old site to fall back to.

---

## Canonical hostname: www

**The site is canonically `https://www.mandrexvaservices.com`.** The apex
redirects to it with a path-preserving `301`, so no real request is ever served
from the bare apex.

Astro's `site` in `astro.config.mjs` is set to the `www` origin, which drives the
canonical tags, `og:url`, and both sitemap files; `public/robots.txt` advertises
the `www` sitemap.

**Anything scoped to a hostname must therefore name `www`, not the apex.** This
has already caught: the Web3Forms *Restrict to Domain* setting (an apex-only
value rejects every submission, and it fails *closed* — the visitor still sees
"Message received"), and the Keystatic Cloud Project URL, which gates the CMS
OAuth redirect. For Google Search Console, register a **Domain** property rather
than a URL-prefix one, or a property for the apex will only cover a hostname
that redirects.

---

## Outstanding

**Ours:**

- **Tidy the SPF.** Now that the apex is on the Worker, `+a` authorises
  Cloudflare addresses and `+ip4:66.29.153.213` is stale. Deliberately not
  touched during the move — changing SPF and nameservers together would have
  made any mail failure ambiguous. Safe to do now, on its own.
- **Prune the cPanel records** once nothing is found to depend on them, per the
  two tiers above. The reason not to leave them indefinitely: `66.29.153.213` is
  a shared-hosting address that will be reassigned if that account lapses,
  leaving ten records aimed at a stranger's server.
- **Submit the sitemap** in Google Search Console, as a *Domain* property.
- **Analytics** — nothing is installed, so launch-week traffic is not
  recoverable after the fact.

**Theirs — Google Workspace is the client's, and predates this engagement:**

- **DKIM.** Google Workspace mail is unsigned. The only key published is
  cPanel's `default` selector, which does not cover Google. Generating it needs
  Workspace admin (Apps → Google Workspace → Gmail → Authenticate email), then
  the TXT record published in Cloudflare.
- **DMARC.** None exists. Would start at `v=DMARC1; p=none; rua=mailto:…` to
  monitor before enforcing, and is only meaningful once DKIM is in place.

Both are noted because they affect deliverability for a domain that is now
actively sending, and because publishing the records is a Cloudflare job once
the client decides. Neither is blocking, and neither is being chased.

---

## Salvage before it disappears

The old WordPress site sits on an account that could vanish without notice.
While it still answers, anything wanted from it should be pulled now — the
WordPress REST API at `/wp-json/wp/v2/` is open, and it serves fine over HTTPS if
certificate verification is skipped.

The domain no longer resolves there, so reach it by address and supply the
hostname yourself:

```bash
curl -k --resolve mandrexvaservices.com:443:66.29.153.213 \
  https://mandrexvaservices.com/wp-json/wp/v2/pages
```

Worth checking for any contact-form submissions never forwarded anywhere.

---

## Do not

- Do not switch to Squarespace nameservers to "activate" the records shown
  there — they are wrong, and doing so would break email. The domain now
  delegates to Cloudflare; Squarespace's DNS table remains inert and remains
  incorrect.
- Do not let the domain lapse: renewal lives with **Squarespace**, not
  Cloudflare and not Namecheap. Expires **2027-07-05**.
- Do not scope anything to the bare apex. It redirects; `www` is canonical.
- Do not treat the old site as a fallback. It is out of the DNS path entirely,
  and its certificate expired in May 2025.
- Do not trust a browser error over the authoritative record. This machine's
  `nsswitch.conf` routes lookups through systemd-resolved *before*
  `/etc/resolv.conf`, so `dig` reports fresh records while curl and the browser
  serve a stale cache — which produced two convincing false alarms during this
  migration, including an "expired certificate" warning against a domain whose
  certificate was valid. Verify with `dig @<authoritative-ns>` and
  `curl --resolve`, and flush with `sudo resolvectl flush-caches`.
- Do not chase the Namecheap account. It is registered to the previous
  developer's email, the domain was never registered there, and there is no
  ownership lever to pull. It is now out of the path and no longer matters.
