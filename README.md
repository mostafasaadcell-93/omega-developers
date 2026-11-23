# Omega Developers — website

Static site (HTML, CSS, JS — no build step). Deploy the folder as-is on Vercel.

## Pages (hash routes)
- `#home` — full-bleed hero, space finder, facts, "Choose your space", build / sell / lease, projects, business-owners form
- `#projects` — project rows, saved filter, schematic Byblos map
- `#central-byblos`, `#jbeil-commercial` — project pages with gallery + lightbox
- `#plan` — payment-plan studio: pick a space, enter a price, see 20% down, 80% over 48 months, keys at year 3; sends the plan to WhatsApp
- `#about`, `#contact`, `#saved`

Arabic (RTL) toggle in the header. Every form opens WhatsApp (+961 79 338 163) with the request filled in.

## Edit content
- `assets/js/data.js` — projects, facts, renders, phone numbers
- `assets/js/i18n.js` — Arabic text (keys are the exact English text)
- Renders live in `assets/media/byblos/` (`name.webp` 1600px + `name-sm.webp` 720px)

## To confirm with the client
- Exact plot location of the Central Byblos building (map pin is approximate)
- Relationship with Ardi Properties (shown as sales contact + Jbeil Commercial Centers)
- Real unit prices (the plan calculator uses the visitor's own number, no prices are shown)
