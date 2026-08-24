# Domain & DNS — current state and migration plan

Captured 24 August 2026, before any DNS change. Everything below was read from
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

**Not present:** no DKIM (`google._domainkey` returns nothing) and no DMARC.
Google Workspace mail is currently unsigned — worth fixing during the move.

---

## Why the zone file still matters

The list above was found by *guessing* likely record names. DNS cannot be
enumerated from outside — there is no way to ask for every record in a zone. If
the previous developer created anything non-standard, none of the queries above
would reveal it.

**Get the zone file from Namecheap** (cPanel → Zone Editor, or the Namecheap
dashboard → Advanced DNS) and work from that. The list here is a cross-check,
not a substitute.

Open question: `webmail` and `mail` resolve to the Namecheap host and the SPF
includes `spf.web-hosting.com`, so something may still send mail from there —
possibly the old site's contact form. Worth asking whether anyone still uses a
Namecheap webmail login on this domain before assuming Google is the only path.

---

## Migration plan

The principle: **move DNS and move hosting as two separate steps.** Combining
them means debugging DNS and hosting at once, with live email in the blast
radius.

1. **Get Namecheap access** and export the zone file.
2. **Add the domain to Cloudflare.** Its scanner imports what it can find;
   reconcile the result against the export and add anything missing — MX, SPF,
   and every cPanel subdomain.
3. **Point the apex at the current Namecheap IP** (`66.29.153.213`) inside
   Cloudflare. At this point Cloudflare mirrors what is already live.
4. **Change the nameservers at Squarespace** to Cloudflare's. Because the
   records match, nothing changes for visitors or for email — that is the point
   of doing it this way.
5. **Verify**: the old site still loads, and email still delivers both ways.
6. **Only then** add the Worker custom domain and cut traffic to the new site.

If step 6 misbehaves, one record rolls it back.

While in Cloudflare, add the two mail records that are missing today:

- **DKIM** — generate in Google Workspace Admin (Apps → Google Workspace → Gmail
  → Authenticate email) and publish the TXT record it gives you.
- **DMARC** — start at `v=DMARC1; p=none; rua=mailto:…` to monitor before
  enforcing.

---

## Do not

- Do not switch to Squarespace nameservers to "activate" the records shown
  there — they are wrong, and doing so would break email.
- Do not change nameservers before the full record set exists in Cloudflare.
- Do not let the domain lapse: renewal lives with **Squarespace**, not
  Namecheap.
