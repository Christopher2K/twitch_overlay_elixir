# Overlay audit → design port

Source of truth for layout: `apps/web/lib/twitch_overlays_web/router.ex` (17 overlay routes) and
`apps/web/assets/js/pages/overlay/**`. Every routed overlay has one artboard in
`design/computer-overlay.pen`; previews in `design/exports/` (see [DESIGN.md](DESIGN.md) for the
language itself).

## Design language (applied to every scene)

| token | value |
|---|---|
| canvas | 1920×1080 / 1080×1920, opaque `$preview-bg` on content scenes, transparent on transitions |
| frame | 16px inset, 1px `$line` border |
| gaps | 16px everywhere; leftover width becomes the 176px gutter |
| radii | none |
| shadows / gradients / animation | none |
| labels | mono lowercase, 11–13px, ~0.16em tracking, `$text-dim` |
| accent | `$accent` — one element per scene (live dot, active label, ticker mark, action line) |
| type | `$text-primary` for content, `$text-dim` for meta, `$accent-muted` for the live word |

Legacy tokens replaced: `bg-desktop` → `$preview-bg`, `bg-placeholder` → `$region-fill`,
`card` → 1px border + `$widget-fill`, `text-one`…`text-nine` → 11/12/13/14/16/44/56 mono steps,
`text-accent` → `$accent`, `border-white`/`rounded-*` → dropped.

## Reusable components in the file

- **Region** — bordered frame + lowercase corner label (screen, cam, overhead, host, guest, frame).
- **Title banner** — 64px bar: live dot + `live` + title (16px).
- **Now playing** — full panel (artwork, track, artist) or compact pill (artwork, label, track).
- **Recent event ticker** — 30px: accent `+` + latest event.
- **Participant tag** — name + role inside a bordered chip.
- **Audio row** — on-air dot + name + role.
- **Alert card** — kind mark, accent header, content, timestamp.
- **Transition stage** — brand + status header, centered headline / rule / subline / action, footer.

## Landscape — 1920×1080

| # | route | legacy source | legacy structure | ported artboard |
|---|---|---|---|---|
| 01 | `/overlay/start` | `start.svelte` + `transition-screen-layout` | logo, "Starting soon", 05:00 counter, tagline, socials | stage, headline, countdown box |
| 02 | `/overlay/brb` | `brb.svelte` | "Be right back!", white rule, discord + follow line | stage, headline, accent rule, discord line |
| 03 | `/overlay/end` | `end.svelte` | "See you next time", follow line, socials | stage, headline, follow line (accent) |
| 04 | `/overlay/computer` | `computer.svelte` | 4:3 main + 493px rail: 9:16 cam (music) + 16:9 keyboard cam (title banner) | screen + banner, cam (now playing), overhead 16:9, ticker |
| 05 | `/overlay/computer-small` | `computer-small.svelte` | 4:3 main + rail with one 66% cam, banner + music bottom-right | screen + banner, full cam 9:16, now-playing panel in the overhead slot, ticker |
| 06 | `/overlay/computer-built-in` | `computer-built-in.svelte` | 16:10 laptop screen + 9:16 cam, banner + music | screen 16:10 + banner (pinned to bottom), cam 9:16, now-playing panel, ticker |
| 07 | `/overlay/talk` | `talk.svelte` | full-bleed main, music + title banner bottom-left | one full frame, banner + now-playing pill bottom-left, ticker bottom-right |
| 08 | `/overlay/audio-guest` | `audio-guest.svelte` | full-bleed main, banner bottom-left, participant stack right (ON AIR chip) | frame, banner, 3 audio rows with on-air dot |
| 09 | `/overlay/video-guest` | `video-guest.svelte` | N equal columns with participant tags | 3 equal 618.67px columns (host + 2 guests), tags bottom-left |
| 10 | `/overlay/computer-guest` | `computer-guest.svelte` | 4:3 main (banner inside) + host cam + stacked guest cams with tags | screen + banner, host cam 9:16 + tag, guest cam 16:9 + tag, ticker |
| 11 | `/overlay/alerts` | `alerts.svelte` + `notification.svelte` | top-left stack, max 3, 5s each, fly/flip animation | 3 static alert cards, no animation |
| — | `/overlay/multi-cam` | `multi-cam.svelte` | **not routed** (dead file) | not ported |

## Vertical — 1080×1920

| # | route | legacy source | state | ported artboard |
|---|---|---|---|---|
| 12 | `/overlay/vertical/start` | wrapper around `start.svelte` | reuses landscape component | vertical stage |
| 13 | `/overlay/vertical/brb` | wrapper around `brb.svelte` | reuses landscape component | vertical stage |
| 14 | `/overlay/vertical/end` | wrapper around `end.svelte` | reuses landscape component | vertical stage |
| 15 | `/overlay/vertical/computer` | `vertical/computer.svelte` | **empty placeholder** | screen 4:3 + banner + cam 9:16 + now playing + ticker |
| 16 | `/overlay/vertical/talk` | `vertical/talk.svelte` | **empty placeholder** | frame + banner + now playing |

### Vertical computer format (decided)

Screen stays 4:3 at 1048×786 with the 9:16 head cam at 540×960 and the ticker matching the
cam width — the 254px side gutters are accepted as negative space.

Two alternatives were built and rejected: a 1:1 960×960 cam (closes flush on the frame, but
loses the portrait crop) and a 16:9 1048×589.5 cam with a full player card (screen-first, but
a 16:9 crop of a 9:16 source is too tight).

Legibility reference for a 1920×1080 capture at 1048 wide: 0.55× if letterboxed in 16:9,
0.73× on the 4:3 cover crop (17.5% of the width cropped), 0.97× on a square crop. The 4:3
choice buys the +33%; editor font size covers the rest.

## Deviations and open points

- **Vertical 15/16** have no legacy layout (empty divs). They are composed from the same
  blocks as their landscape counterparts, not invented new scenes.
- **Video guest** keeps the legacy full-height column crop (0.59:1) rather than 16:9, because
  three 16:9 feeds would leave two thirds of the canvas empty.
- **Computer guest** shows one guest in the 16:9 slot. Legacy stacks `flex-1` regions for N
  guests; the 9:16 host + 16:9 guest pair keeps exact ratios for the common 1-guest case.
- **Computer built-in** spends its 177px leftover height as the same gutter as the horizontal
  one; the banner is pinned to the bottom so the frame edges line up.
- **Focus mode** (red 10px border + banner over every region) is a runtime state, not a scene.
  Not drawn; the equivalent in this language is a 1px `$accent` border plus one accent label.
- **States not drawn:** title/banner absent, no guests, no music, countdown finished, >3 alerts.
  Each scene is drawn in its populated state.
