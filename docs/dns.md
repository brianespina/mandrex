# Domain, DNS and hosting

**The migration is complete.** DNS moved from Namecheap to Cloudflare on
25 August 2026 and the site went live on the Cloudflare Worker. Mail was carried
across unchanged and verified in both directions.

This is a record rather than a plan. The pre-migration sections are kept
deliberately: they are the audit the migration was built on, and the only
surviving description of a zone that can no longer be reached. Everything here
was read from live DNS and the public registry, not from a control panel.

---

## Who controls what

Two roles now, where there were three. This is the thing to keep straight.

| Role | Provider | Controls |
|---|---|---|
| **Registrar** | Squarespace Domains II LLC | Renewal, transfer, WHOIS, and **which nameservers the domain delegates to** |
| **DNS host** | **Cloudflare** — `ganz.ns.cloudflare.com`, `sandra.ns.cloudflare.com` | The actual records |
| **Web host** | **The `mandrex` Cloudflare Worker** | What the domain serves |

Before 25 August 2026 the last two were Namecheap: `dns1`/`dns2.namecheaphosting.com`
for DNS, and shared hosting at `66.29.153.213` for the site. Both are now out of
the path entirely, which was the point — that hosting account is not accessible
to this project and nobody is administering it.

Registered 2023-07-05 · **expires 2027-07-05** · last changed 2026-06-21.
Renewal lives with **Squarespace**.

> ⚠️ **The Squarespace DNS Settings page is not in effect, and its contents are
> wrong.** The domain uses custom nameservers, so Cloudflare serves DNS and
> Squarespace's record table is inert. It also *differs* from what is actually
> live — it lists `alt3`/`alt4` MX records and a simple SPF that are not the
> real ones, and a DKIM record that is not published at all. **Do not copy
> records from it, and do not switch to Squarespace nameservers to "activate"
> them.** Doing so would break email.

The site is live at **<https://www.mandrexvaservices.com>**. The apex `301`s to
`www`, preserving the path. See [Canonical hostname](#canonical-hostname-www) —
anything scoped to a hostname must name `www`, not the apex.

---

## The zone before the migration

Read via DNS-over-HTTPS on 24 August 2026, while Namecheap still served the
zone. This is the baseline every later check was made against. The mail records
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

**Calendar/contacts SRV records** — these name a specific cPanel box,
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
actually flows — is unsigned.** The `default` record was carried across anyway;
it costs nothing and something may still rely on it.

**Not present:** no DMARC, and no CAA.

---

## Why the zone was mirrored rather than rebuilt

The Namecheap account that served DNS is not reachable from this project, and
the hosting on it was visibly unmaintained: its TLS certificate had expired
(3 May 2025) while the WordPress install still `301`d all HTTP traffic to that
broken HTTPS URL, so **the old site was already unreachable for every visitor**,
and the SOA serial was `1710036683` — a Unix timestamp for 10 March 2024.

That set the shape of the migration. Nameserver delegation is a **registrar**
function and the registrar is Squarespace, so the move was never blocked by
lacking Namecheap access; a zone-file export was the only thing that account was
wanted for. Mirroring the zone into Cloudflare exactly, and only then changing
the nameservers, made the delegation change **a no-op for every mail record** —
which is the safety property the whole plan rested on.

> **Auditing lesson worth keeping.** An early dictionary sweep run through a
> public resolver reported that most cPanel subdomains did not exist. That was
> resolver throttling, not absence — every one of them resolves when queried
> directly against the authoritative nameserver. **Query authoritative
> nameservers directly when auditing a zone.** A public resolver silently drops
> queries under a burst, and the empty answers look exactly like missing records.

### The verified zone — 29 records

Cloudflare's scan imported a complete zone, verified record for record against
the authoritative nameserver. All 29 are accounted for, with nothing
unexplained:

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

The zone was exported from Cloudflare's DNS page and committed here as
[`dns-snapshot-namecheap-2026-08-25.zone`](dns-snapshot-namecheap-2026-08-25.zone)
**before anything changed**, while the records were still a faithful mirror of
the Namecheap zone. That turned a rollback which depended on someone else's
hosting account staying alive into a plain text file.

One residual risk survived the cutover: a record at a name that neither the
sweep nor Cloudflare's wordlist would guess — most likely a domain-verification
`TXT`. **If some third-party service quietly stops working, suspect this first.**
Google Workspace Admin → Domains will show its own verification method; anything
else (Search Console, Meta Business, a mailing tool, a booking product) has to
come from whoever connected it.

---

## Proxy status: the cPanel records must stay grey

Cloudflare's importer orange-clouded **every** `A` record and the `www` `CNAME`.
That is wrong for the cPanel service names. It was corrected before the
nameservers moved, and all ten were confirmed answering unproxied afterwards.

The proxy only handles HTTP/HTTPS on a fixed port list. These services do not
qualify, and proxying them breaks them outright:

- **`mail`** — SMTP/IMAP/POP are not HTTP. Proxying kills any client or script
  connecting to `mail.mandrexvaservices.com`.
- **`ftp`** — not HTTP; cannot be proxied at all.
- **`webdisk`** (2077/2078) and **`cpcalendars`/`cpcontacts`** (2079/2080) —
  ports outside Cloudflare's proxiable set.
- **`cpanel`, `whm`, `webmail`** — the ports *are* proxiable (2082/2083,
  2086/2087, 2095/2096), but routing a control-panel login through the proxy
  adds a failure mode for no benefit.
- **`autodiscover`/`autoconfig`** — mail client bootstrap; leave direct.

**All ten cPanel `A` records are set to DNS only (grey cloud).** The apex and
`www` are Worker custom domains and are managed by Cloudflare itself.

### Pruning the cPanel records

They point at a box nobody controls, and now that the site is on the Worker
nothing should legitimately use them. They were kept through the cutover on
purpose: the safety property was that Cloudflare mirrored Namecheap exactly, and
deleting first would have made the flip a delegation change *and* a removal at
the same instant, leaving any failure afterwards ambiguous.

Now that mail is verified on the new delegation, prune in two tiers:

- **Delete freely:** `ftp`, `cpanel`, `whm`, `webdisk` — control-panel and
  file-transfer access to a box nobody controls.
- **Ask the site owner first:** `mail`, `webmail`, `autodiscover`, `autoconfig`,
  `cpcalendars`, `cpcontacts`, the four CalDAV/CardDAV SRVs and their `path=/`
  TXT records. Inbound mail goes exclusively to Google, so a cPanel mailbox
  there receives nothing and is near-certainly dead — but the calendar/contact
  records exist because something configured sync at some point, and deleting
  them breaks any still-syncing device silently.

**Why not just leave them:** `66.29.153.213` is a shared-hosting address. If that
account lapses the IP will be reassigned, leaving ten records aimed at a
stranger's server.

---

## What was done, in order

Staged first, on 25 August 2026: domain added to Cloudflare; zone scanned and
verified at 29/29 records against authoritative DNS with no drift; the ten
cPanel `A` records set to `DNS only`; SSL/TLS mode pinned to **`Full`** (not
Automatic, so Cloudflare could not re-evaluate and downgrade to Flexible against
the expired origin certificate); zone file exported and committed; Squarespace
registrar access confirmed; Web3Forms submissions tested working on
`mandrex.espinabrian.workers.dev`.

Then:

1. **Nameservers changed at Squarespace** to `ganz`/`sandra.ns.cloudflare.com`.
   Delegation was visible at both `1.1.1.1` and `8.8.8.8` within minutes — far
   faster than the 2-day NS TTL allowed for.
2. **Zone verified against Cloudflare's own nameservers**, not a public
   resolver: all six Google MX at the right priorities, SPF byte-identical,
   `default` DKIM present, five SRV records intact, and all ten cPanel `A`
   records answering unproxied. No drift.
3. **Mail verified.** An SMTP probe to `aspmx.l.google.com` — reached via the
   new MX records — accepted `RCPT TO: welcome@mandrexvaservices.com` with
   `250`, confirming inbound routing without sending anything. Then real
   messages both ways, from **Gmail and Protonmail**. The Proton leg is the one
   that carries weight: it validates SPF on receipt and sits outside Google's
   infrastructure, so it proves outbound authentication passes against the
   migrated SPF record. A Gmail-only test would have proved little, since Google
   can deliver internally between its own tenants without consulting public MX
   records.
4. **Worker custom domains added** for the apex and `www`.
5. **Canonical hostname set to `www`** and the site redeployed.
6. **Always Use HTTPS** enabled, so plain HTTP now `301`s instead of serving.

> **Gotcha, if this is ever repeated.** Workers custom domains will **not**
> overwrite an existing DNS record the way Pages does. With the apex `A` and
> `www` `CNAME` still present, the dialog refuses outright: *"Hostname already
> has externally managed DNS records. Delete them first."* Delete exactly those
> two records, then add the custom domains — Cloudflare recreates them itself.
> Everything else in the zone must be left alone, and the ten cPanel `A` records
> share the `66.29.153.213` value, so **filter by name, not by address.**

Adding the custom domains issued a valid edge certificate and ended an outage
that had been running since the origin certificate expired on 3 May 2025.

**Rollback**, should it ever be needed, is the nameservers at Squarespace, back
to `dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`, with
`dns-snapshot-namecheap-2026-08-25.zone` as the record of what that zone held.
Note that this only protects mail: there is no working old site to fall back to.

---

## Canonical hostname: www

**The site is canonically `https://www.mandrexvaservices.com`.** The apex
redirects to it with a path-preserving `301`, so no real request is ever served
from the bare apex.

Astro's `site` in `astro.config.mjs` is set to the `www` origin, which drives the
canonical tags, `og:url` and both sitemap files; `public/robots.txt` advertises
the `www` sitemap.

**Anything scoped to a hostname must name `www`, not the apex.** This has
already caught two settings:

- **Web3Forms → Restrict to Domain.** An apex-only value rejects every
  submission, and it fails *closed* — the visitor still sees "Message received."
- **Keystatic Cloud → Project URL**, which gates the CMS OAuth redirect.

For **Google Search Console**, register a **Domain** property rather than a
URL-prefix one; a URL-prefix property for the apex would only cover a hostname
that redirects.

---

## Outstanding

Verified against live DNS on **29 August 2026**.

**DNS**

- [ ] **Tidy the SPF.** Still byte-identical to the pre-migration record:
      `v=spf1 +a +mx +ip4:66.29.153.176 include:spf.web-hosting.com
      +ip4:66.29.153.213 +include:_spf.google.com ~all`. Now that the apex is on
      the Worker, `+a` authorises Cloudflare addresses, and both `ip4` literals
      and the `spf.web-hosting.com` include are stale. This was deliberately not
      touched during the move — changing SPF and nameservers together would have
      made any mail failure ambiguous. Safe to do now, on its own.
- [ ] **Prune the cPanel records**, per the two tiers above.

**Mail authentication — needs Google Workspace admin**

Google Workspace predates this engagement. Neither item is blocking, but both
affect deliverability for a domain that is now actively sending.

- [ ] **DKIM.** `google._domainkey` still returns nothing, so Google Workspace
      mail is unsigned. The only key published is cPanel's `default` selector,
      which does not cover Google. Generate it in Apps → Google Workspace →
      Gmail → Authenticate email, then publish the TXT record in Cloudflare.
- [ ] **DMARC.** `_dmarc` still returns nothing. Start at
      `v=DMARC1; p=none; rua=mailto:…` to monitor before enforcing. Only
      meaningful once DKIM is in place.

Code and content items are tracked in
[`architecture.md`](architecture.md#open-items).

---

## Do not

- **Do not switch to Squarespace nameservers.** Its DNS table is inert and its
  contents are wrong; activating it would break email.
- **Do not let the domain lapse.** Renewal lives with **Squarespace**, not
  Cloudflare and not Namecheap. Expires **2027-07-05**.
- **Do not scope anything to the bare apex.** It redirects; `www` is canonical.
- **Do not treat the old site as a fallback.** It is out of the DNS path
  entirely, and its certificate expired in May 2025.
- **Do not orange-cloud the cPanel records.** See
  [Proxy status](#proxy-status-the-cpanel-records-must-stay-grey).
- **Do not trust a browser error over the authoritative record.** A local
  resolver cache will happily serve stale answers while `dig` reports the fresh
  record — on the machine this was migrated from, `nsswitch.conf` routed lookups
  through systemd-resolved *before* `/etc/resolv.conf`, which produced two
  convincing false alarms during the cutover, including an "expired
  certificate" warning against a domain whose certificate was valid. Verify with
  `dig @<authoritative-ns>` and `curl --resolve`, and flush the local cache
  (`sudo resolvectl flush-caches`) before believing anything.
