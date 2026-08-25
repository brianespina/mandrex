# Domain & DNS — current state and migration plan

Captured 24 August 2026 and revised 25 August 2026, before any DNS change. Everything below was read from
live DNS and the public registry, not from a control panel.

---

## Who controls what

Three roles, three different providers. This is the thing to keep straight.

| Role | Provider | Controls |
|---|---|---|
| **Registrar** | Squarespace Domains II LLC | Renewal, transfer, WHOIS, and **which nameservers the domain delegates to** |
| **DNS host** | Namecheap — `dns1.namecheaphosting.com`, `dns2.namecheaphosting.com` | The actual records |
| **Web host** | Namecheap shared hosting — `66.29.153.213` | Whatever the domain serves today |

Registered 2023-07-05 · expires **2027-07-05** · last changed 2026-06-21.

> ⚠️ **The Squarespace DNS Settings page is not in effect.** The domain uses
> custom nameservers, so Namecheap serves DNS and Squarespace's record table is
> inert. Its contents also *differ* from what is actually live — it lists
> `alt3`/`alt4` MX records and a simple SPF that are not the real ones, and a
> DKIM record that is not published at all. **Do not copy records from it.**

The new site currently lives on `mandrex.espinabrian.workers.dev`. The custom
domain does not point at it yet, and `https://mandrexvaservices.com` does not
respond.

---

## What is live right now

Read via DNS-over-HTTPS on 24 August 2026.

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

### Export the zone from Cloudflare now

Cloudflare's DNS page has an **Export** button, which produces the BIND zone
file that Namecheap access was wanted for in the first place. Export it and
commit it to this repo **before changing anything**, while the records are still
a faithful mirror of the Namecheap zone. That converts a rollback that currently
depends on someone else's hosting account staying alive into a plain text file
that cannot be taken away.

The residual risk is unchanged but now small — a record at a name neither the
sweep nor Cloudflare's wordlist would guess, most likely a domain-verification
`TXT`. Still worth asking Nikka which outside services were ever connected to
the domain (Search Console, Meta Business, a mailing tool, a booking product);
Google Workspace Admin → Domains will also show its verification method.

---

## Before activating: fix the proxy status

Cloudflare's importer orange-clouded **every** `A` record and the `www` `CNAME`.
That is wrong for the cPanel service names and must be corrected before the
nameservers move.

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

## Migration plan

The principle still holds — **do not put email in the blast radius** — but the
web half no longer needs staging. The old site is already broken, so pointing it
at the Worker cannot make it worse. Mail is the only thing to preserve exactly.

**Done as of 25 August 2026:** domain added to Cloudflare; zone scanned and
verified at 29/29 records against authoritative DNS with no drift; the ten cPanel
`A` records set to `DNS only` with the apex and `www` left proxied; SSL/TLS mode
pinned to `Full` (not Automatic, so Cloudflare cannot re-evaluate and downgrade
to Flexible against the expired origin certificate); zone file exported;
Squarespace registrar access confirmed; Web3Forms submissions tested working on
`mandrex.espinabrian.workers.dev`.

**Resume here:**

1. **Change the nameservers at Squarespace** to Cloudflare's assigned pair —
   Domains → `mandrexvaservices.com` → DNS → Nameservers → custom. Mail is
   unaffected: the six MX records are imported, correct, and `DNS only`.
2. **Verify mail both ways immediately** — send to *and* from a
   `@mandrexvaservices.com` address. This is the step that matters.
3. **Check the Web3Forms "Restrict to Domain" setting** if enabled. It
   whitelists the domain allowed to submit the form, so a value scoped to
   `mandrex.espinabrian.workers.dev` will start rejecting real submissions the
   moment the custom domain goes live — silently, from the visitor's side. Add
   `mandrexvaservices.com` before cutover, not after.

   Form notifications themselves are unaffected by this migration: Web3Forms
   sends from `notify@web3forms.com`, so SPF is evaluated against *their* domain,
   not ours.
4. **Add the Worker custom domain** for the apex and `www`. This can only happen
   once the zone is active on Cloudflare, which is why it comes last rather than
   before the nameserver change. Cloudflare replaces the two `66.29.153.213`
   records itself and issues a valid edge certificate — resolving the
   expired-certificate outage as a side effect.

Expect `.com`'s 2-day NS delegation TTL to leave some resolvers on Namecheap for
a while afterwards. Harmless: both zones serve identical records, which is the
entire reason for mirroring before flipping.

Rollback at any point is the nameservers at Squarespace, back to
`dns1.namecheaphosting.com` / `dns2.namecheaphosting.com`.

### Afterwards, in a separate pass

- **DKIM** — generate in Google Workspace Admin (Apps → Google Workspace → Gmail
  → Authenticate email) and publish the TXT record. Google's mail is unsigned
  today; the `default` cPanel selector does not cover it.
- **DMARC** — start at `v=DMARC1; p=none; rua=mailto:…` to monitor before
  enforcing.
- **Tidy the SPF.** Once the apex points at the Worker, `+a` authorises
  Cloudflare addresses and `+ip4:66.29.153.213` is stale. Do not touch it during
  the move — changing SPF and nameservers together makes a mail failure
  ambiguous.
- **Prune the cPanel records** once nothing is found to depend on them.

---

## Salvage before it disappears

The old WordPress site sits on an account that could vanish without notice.
While it still answers, anything wanted from it should be pulled now — it serves
fine over HTTPS if certificate verification is skipped (`curl -k`), and the
WordPress REST API at `/wp-json/wp/v2/` is open. Worth checking for any
contact-form submissions never forwarded anywhere.

---

## Do not

- Do not switch to Squarespace nameservers to "activate" the records shown
  there — they are wrong, and doing so would break email.
- Do not change nameservers before the full record set exists in Cloudflare.
- Do not let the domain lapse: renewal lives with **Squarespace**, not
  Namecheap.
- Do not wait on Namecheap support to recover the account. It is registered to
  the previous developer's email, and the domain is not registered there either,
  so there is no ownership lever to pull. One ask to the developer, a deadline,
  then proceed without him.
- Do not treat the old site as a fallback. Its certificate has already expired.
