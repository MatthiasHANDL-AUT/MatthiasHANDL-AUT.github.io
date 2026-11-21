# Threat model – MatthiasHANDL-AUT.github.io

Status: 2026-11-21, owner answers folded in. Facts marked *(user)* come from the owner; everything else is inferred from the repository.

## System overview
Static marketing/booking-inquiry website for Gasthaus "Zum GAMSerl", Ferienwohnung "Zur GAMSerlALM" and Ferienhaus "BOCKleit'n" (Turnau, Schwabenberg), family Feichtenhofer. *(user)* Served by GitHub Pages at the github.io address (no custom domain). No infrastructure repository exists.

There is no backend, database, API, build step or login. Everything is plain HTML/CSS/JS plus images.

## Components
| Name | Code | Notes |
|---|---|---|
| Pages | `index.html`, `*/index.html` | Static content, imprint/privacy text in `kontakt/index.html` |
| Client script | `assets/js/main.js` | Nav, scroll reveal, gallery lightbox, form → `mailto:` |
| Forms | `anfrage/index.html` (`#inquiry-form`), `kontakt/index.html` (`#contact-form`) | Handled only in the browser by `main.js` |
| Third-party resources | Google Fonts links in every page | Loaded without SRI; reveals visitor IPs to Google |
| Local dev server | `serve.ps1` | PowerShell HttpListener on `http://localhost:8080/`, local use only |
| Hosting / repository | GitHub Pages, git history (74 commits; earlier pages such as `donations.html`, `transitions.js` were removed) | Site integrity depends on the GitHub account and repo |

## Trust boundaries and entry points
- Visitor's browser ↔ GitHub Pages: anyone on the internet can request any page. Inputs an attacker controls: URL (path, query, fragment); nothing in `main.js` reads `location`.
- Form input → `mailto:` URL: `main.js` URL-encodes the form values into the body/subject and navigates to `mailto:fam.feichtenhofer@gmx.at`. The data goes to the visitor's own mail client; nothing is sent to a server.
- Lightbox: `img.src` from existing gallery images, caption set with `textContent`; the only `innerHTML` is a static template.
- Repository push access → published site: whoever can push to the default branch controls the live site.

## Assets
*(user)* All of the following matter equally: site integrity, privacy of guests' inquiry data, and the owner's e-mail / GitHub account.
- Integrity of the published site (no defacement, injected scripts, phishing content).
- Visitors' trust/booking inquiries: name, address, e-mail, phone, travel dates typed into the inquiry form (stay in the browser/mail client).
- Owner's public e-mail address `fam.feichtenhofer@gmx.at` (intentionally published).
- Anything accidentally committed to git history (secrets, personal data).

## Attacker profiles
- Anonymous internet attacker: can only send crafted URLs to visitors or scrape the site. No accounts exist (no login in the code).
- Account takeover of the GitHub owner / supply-chain via third-party resources (Google Fonts) – outside this repository's code.

## Existing controls
- No dynamic server-side code; attack surface limited to client-side JS.
- `encodeURIComponent` on all `mailto:` parts; `textContent` for captions.
- HTTPS by GitHub Pages.

## Gaps noticed (inferred)
- No Content-Security-Policy / referrer policy meta tags; GitHub Pages cannot set headers.
- Google Fonts loaded from Google (privacy/GDPR consideration under Austrian/EU law).
- `kontakt/index.html` privacy text mentions a newsletter sign-up that the site does not implement.

## Out of scope / accepted risk
*(user)* Accepted risks, still to be reported but ranked low (the owner asked to report everything):
- The public e-mail address on the site (spam/scraping).
- Google Fonts loaded from Google (privacy/GDPR).
- `serve.ps1`, the local dev server.
Everything else: report, no attacker or asset ruled out.

## Open questions
- None currently.
