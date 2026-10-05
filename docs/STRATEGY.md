# TRIM: business strategy

## 1. What TRIM is

TRIM resells **original hyper-brand streetwear** in Argentina: Corteiz, Supreme, Stüssy, BAPE, Palace, Trapstar, Denim Tears, Sp5der and similar labels whose drops sell out abroad and are hard or risky to buy locally. TRIM buys at official stores, brand websites and drops, and sells in Argentina in pesos.

TRIM is an **independent reseller**. It is not affiliated with any brand it carries, and the site says so in the footer and the terms.

## 2. Problem and opportunity

- Hyper-brands drop in limited quantities, mostly in London, New York, Tokyo and Los Angeles. Buying from Argentina means international shipping, customs and currency friction.
- The local resale market runs on Instagram and WhatsApp, and is full of fakes. **Authenticity is the product**: buyers pay a premium to a seller they trust.
- Opportunity: a reseller with a clean catalogue, visible proof of authenticity and fast replies on the channels buyers already use.

## 3. Positioning

> Hyper-brands originales, en Argentina, sin vueltas.

- **Original or nothing**: every garment has a proof of purchase; if it cannot be verified it is not listed (the home page "Si no es original, no entra." block).
- **Direct**: no account, no checkout; one tap opens a WhatsApp chat about a specific garment.
- **Transparent stock**: the catalogue shows sizes, condition (new with tags / used like new) and status (available, reserved, sold).

## 4. Audience

- 16–30, Rosario first (hand delivery in the city), then the rest of the country by courier.
- Follows drop culture on Instagram/TikTok, knows the brands, distrusts unknown sellers.
- Buys from the phone: the site is designed mobile-first.

## 5. Channels and conversion

| Channel | Role |
| --- | --- |
| Instagram | Discovery: drops, new stock, stories. The bio links to the site. |
| Website | Proof and catalogue: what's in stock, how buying works, why it's original. |
| WhatsApp | Conversion: confirms size, price, payment and shipping. |

The site has **no cart and no forms on purpose**: in this market the sale closes in a chat, and every extra step loses buyers. Each "Consultar" button sends a prefilled message with the brand, garment, colour, sizes and a reference (`TRM-XXXX`) so the conversation starts with context.

## 6. Catalogue rules

- Only garments physically in stock (or with a confirmed purchase) are listed.
- Real photos of the actual garment as soon as possible; stock photos must be flagged `illustrative: true`, which prints "Foto ilustrativa" on the card.
- Mark `reservado` when a deposit is paid; `vendido` when delivered. Sold items stay visible for a while as social proof, at the end of the shelf.
- Prices are set in USD and shown in ARS at the live dollar blue "venta" rate (DolarAPI), so they follow the market without manual updates. If the rate is unavailable the site shows an error rather than a possibly wrong peso price. "A consultar" when there is no price yet.

## 7. Legal and brand safety

- Never use the brands' logos or artwork in TRIM's own graphics. Brand names appear only as text, to describe what is sold (nominative use).
- Photos must have a licence that allows commercial use; credit them (see `docs/CREDITS.md`).
- Privacy: the site collects nothing; chats are governed by Ley 25.326 (see `/privacidad/`).

## 8. KPIs

- WhatsApp chats started from the site (UTM-free: count messages containing a `TRM-` reference).
- Chat → sale conversion rate.
- Days in stock per garment.
- Instagram → site clicks (link-in-bio analytics).

## 9. Roadmap

1. Launch with real stock, real photos, real contact numbers (see README "Before launch").
2. Per-garment photo galleries (several photos per product).
3. Optional privacy-friendly analytics (e.g. Vercel Web Analytics) to measure "Consultar" clicks.
4. "Drop" announcements block on the home page fed from a `drops` collection.
