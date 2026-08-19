## Project Overview

Build a corporate B2B website for **Eldama**, a technology company that acts as an all-in-one outsourced IT department for small to medium-sized businesses. Eldama is a certified partner (e.g. Microsoft Gold Partner) across every service category it offers, and the site's job is to convert visitors coming from social media/search — mostly **procurement team members who already know what problem they need solved** — into **quote requests**, while surfacing adjacent services they didn't know they needed.

**Primary goal:** Maximize quote requests.
**Secondary goal:** Cross-sell related services during the discovery/quote journey.
**Tertiary goal:** Establish credibility/competency (partner badges, client logos, case studies).

## Brand & Visual Style

- Corporate, trustworthy, professional — this is an IT services company being evaluated by procurement teams, not a consumer brand.
- Color palette: **navy blue as primary**, with a crisp accent color (e.g. a bright blue, teal, or orange) for CTAs so "Get a Quote" buttons stand out against the navy. Neutral grays/white for backgrounds.
- Typography: clean, modern sans-serif (e.g. Inter, Manrope, or similar). Strong, confident headings; readable body text.
- Use **placeholder logo and imagery for now** — I will supply real brand assets (logo, exact color hex codes, imagery) after reviewing the initial design. Structure the code so swapping the logo and color tokens later is easy (e.g. centralized theme/config, not colors hardcoded everywhere).
- Avoid anything playful, informal, or consumer-tech styled (no bubbly illustrations, no casual copy). Think "enterprise IT vendor," not "startup app."
- More details can be found at DESIGN-posthog.md

## Site Structure: Hybrid Model

**Home page** = overview of everything + primary conversion engine.
**Dedicated pages** = one per service category, for deeper info and SEO/ad-landing use.

### Global Elements (present on every page)
- **Sticky header** with logo, nav links to each service category, and a persistent "Get a Quote" button (high contrast, always visible).
- **Footer** with company info, service category links, partner badges, and contact details.
- On mobile, keep a floating/sticky "Get a Quote" button accessible at all times.

---

## Page 1: Home

Structure top to bottom:

1. **Hero section**
   - Headline focused on the core value prop: Eldama is the outsourced IT department for growing businesses — one partner instead of building an in-house team.
   - Subheadline reinforcing "certified experts across Microsoft, cloud, security, networking, and email."
   - Primary CTA: "Get a Quote". Secondary CTA: "See our services" (scrolls to services grid).

2. **Trust bar** (immediately below hero)
   - Row of partner/certification badges (Microsoft, Fortinet, Sophos, Cynet, Webroot, Datto, Checkpoint, etc. — placeholders for now).
   - Row of client logos: Mace Group, Galleria Mall, Nairobi Hospital (placeholders for now, labeled "Trusted by").

3. **Services grid — the core discovery tool**
   - Five clear category cards, one per service area:
     1. Microsoft 365
     2. IT Outsourcing (Hardware, Software, Networking incl. Telco & firewalls via Fortinet/Sophos)
     3. Endpoint Security (Webroot, Cynet, Usecure, KnowBe4, Keeper Password Manager)
     4. Cloud Services (Azure, Datto, Cove)
     5. Email Security (Checkpoint Harmony)
   - Each card: short description, key tools/logos, "Learn more" (goes to dedicated page) and a small "Get a quote for this" link.
   - Design this grid to be scannable in seconds — procurement visitors should be able to confirm "yes, they offer what I need" almost instantly.

4. **"Complete IT Coverage" / cross-sell section**
   - A visual (e.g. a simple diagram or icon cluster) showing how the 5 categories work together as one IT stack, reinforcing "all-in-one shop" positioning.
   - Framed as: "Most clients start with one service and expand" — subtly primes cross-sell behavior.

5. **Why Eldama / competency section**
   - 3-4 short value props (e.g. "Certified experts, not generalists," "One partner instead of five vendors," "Faster response than building an in-house team," "Proven with [industry types]").
   - Optional: simple stats row (years in business, certifications held, clients served) — use placeholder numbers I can edit later.

6. **Client trust / case study teaser**
   - Short logo + one-line blurb format for Mace Group, Galleria Mall, Nairobi Hospital (e.g. "Nairobi Hospital — Cloud & Endpoint Security"). Placeholder text is fine.

7. **Quote CTA section (repeat, mid/lower page)**
   - Short form or prominent button: "Ready to solve [problem]? Get a tailored quote."

8. **Footer** as described above.

---

## Pages 2–6: Individual Service Category Pages

One dedicated page per category (Microsoft 365, IT Outsourcing, Endpoint Security, Cloud Services, Email Security). Each follows the same template:

1. **Header section**: Category name, one-paragraph description of what Eldama provides in this area, relevant partner badge(s) prominently displayed (e.g. "Microsoft Gold Partner" on the M365 page).
2. **Tools/products list**: The specific named tools Eldama supports in this category (e.g. Fortinet, Sophos, Telco for IT Outsourcing), each with a short explanation of what it does for the client.
3. **Primary CTA**: "Get a Quote for [Category]" — prominent, near top and repeated at bottom.
4. **Cross-sell block**: "Businesses using [this service] often also need..." — 2-3 cards linking to the other service category pages. This is the key mechanism for surfacing additional services.
5. **Relevant client proof**: If applicable, mention which of the 3 clients (Mace Group, Galleria Mall, Nairobi Hospital) used this category, or keep generic if not specified.
6. **Closing CTA** section before footer.

---

## Get a Quote Flow

- Keep the quote form **short** — this audience wants speed, not a long intake process.
- Fields: Name, Company Name, Email, Phone, Service(s) interested in (multi-select checkboxes covering all 5 categories, pre-checked if they arrived from a specific service page), Brief description of need (textarea).
- Make this available both as a **dedicated `/quote` page** and as an **embeddable section/modal** that can be triggered from any "Get a Quote" button sitewide, so the header CTA and per-service CTAs all funnel into the same conversion point without a jarring page reload if possible.
- On submit, show a clear confirmation state (e.g. "Thanks — our team will respond within [X] business hours").
- No payment processing needed — this is a lead-gen form, not checkout.

---

## Content & Tone Guidelines

- Write for a procurement/decision-maker audience: clear, confident, benefit-focused, minimal jargon (define acronyms like "MDR" or similar if used).
- Emphasize *outsourcing convenience* and *breadth of certified expertise* — the core positioning is "one partner instead of an in-house team or multiple vendors."
- Use placeholder/lorem-style copy only where I haven't given specifics — but use the real service names, tool names, and client names provided above wherever relevant since those are final.

## Technical Notes

- Fully responsive (mobile-first), since social campaign traffic will include significant mobile visits.
- Fast-loading hero and services grid — this is the highest-priority content for the "quickly show what we offer" goal.
- Structure theme colors, logo, and client/partner logo placeholders as easily swappable variables/assets, since real brand assets will be provided after initial review.
- Clean, accessible navigation between Home and the 5 service pages.