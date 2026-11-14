# Design

The visual language for every twitch overlay in this repo. This is a design document, not an
implementation: the `.pen` file is the source of truth, and the app renders it with React.
See [overlay-audit.md](overlay-audit.md) for the route-by-route inventory.

- Source: [`computer-overlay.pen`](computer-overlay.pen) — 16 artboards, one per routed overlay
- Previews: [`exports/`](exports/) — 1× PNG per artboard, plus `_contact-sheet.png`
- Superseded work: [`archive/`](archive/) — legacy scene exports and layout studies

---

## 1. Philosophy

**The overlay is a frame, not a decoration.**

Everything drawn sits between the viewer and the video. Anything that is not the video or
information about the video is a cost. So the overlay does three things: it holds regions in
place, it labels them, and it says one thing at a time.

Five consequences, and they are the whole design:

1. **The video is the brightest thing on screen.** Surfaces are near-black and translucent.
   Nothing competes with a screen capture or a face.
2. **Structure is drawn, not decorated.** A region is a 1px line. There is no card shadow,
   no gradient, no glass, no noise.
3. **Labels are data.** Everything is lowercase mono, small, tracked out, dim. A label is
   orientation, never a headline.
4. **Accent is a signal.** One orange element per scene marks the live thing — the dot, the
   active region, the newest event. If everything is orange, nothing is.
5. **Air is a material.** Gaps are equal, margins are deliberate, and leftover space is spent
   as one clean gutter rather than smeared around.

## 2. Canvas and grid

| | landscape | vertical |
|---|---|---|
| canvas | 1920 × 1080 | 1080 × 1920 |
| inset | 16 | 16 |
| gap | 16 | 16 |
| leftover width | 176 (gutter) | spent as side air |
| radii | 0 | 0 |

- The canvas is **opaque `$preview-bg` (`#121216`)** on content scenes (computer, laptop, talk,
  guests, alerts), shipped as `--ov-canvas`, so what renders matches the artboard exactly.
  Transition scenes (start / brb / end, landscape and vertical) keep a **transparent** canvas so
  OBS composites them over the scene below.
- The frame is a hard 16px: every scene's outer edge, every gap between blocks, every inset
  from a region border. One number, no exceptions.
- Ratios are law: **4:3** screen, **9:16** head cam, **16:9** overhead/guest, **16:10** laptop.
  Regions get the largest exact-ratio box that fits the grid, and the remainder becomes gutter.
- In the landscape computer scene that remainder is 176px between the two columns. In the
  vertical computer scene it is 254px either side of the 9:16 cam. Both are intentional.

## 3. Colour

| token | value | use |
|---|---|---|
| `$preview-bg` | `#121216` | artboard fill; opaque canvas on content scenes |
| `$surface` | `#0A0A0C` | base near-black |
| `$region-fill` | `#0A0A0C9E` | 62% black behind video regions |
| `$widget-fill` | `#0A0A0CE6` | 90% black behind text blocks |
| `$line` | `#ECECF124` | 14% white for every border and hairline |
| `$text-primary` | `#ECECF1` | content: titles, names, track |
| `$text-dim` | `#74747F` | labels, roles, metadata |
| `$accent` | `#FF6A3D` | the one live thing |
| `$accent-muted` | `#B96A4E` | the word `live` only |

Rules:

- **One accent per scene.** A live dot, an active region label, a ticker mark, an action line.
  Never two competing signals in the same frame.
- Borders are always 1px and always `$line`. No white borders, no 2px, no coloured borders.
- Text on video uses `$widget-fill` behind it (≥90% black) so it reads over any footage.
- `$accent` is never used for decoration, only for state.

## 4. Typography

JetBrains Mono, lowercase, everywhere. Numbers and identifiers keep their case.

| role | size | tracking | colour |
|---|---|---|---|
| micro label | 10–11 | 1.2–1.8 | `$text-dim` |
| label | 12 | 1.92 | `$text-dim` (or `$accent` if active) |
| meta / role | 11–12 | 1.3 | `$text-dim` |
| body | 13–14 | 0.26–0.3 | `$text-primary` |
| title | 16 | 0.32 | `$text-primary` |
| feature | 20 | 0.3 | `$text-primary` |
| transition headline | 44–56 | 0.56 | `$text-primary` |

- Tracking scales with size: ~0.16em on small labels (that is where the technical feel comes
  from), ~0.02em on body and headlines.
- Labels are lowercase. `screen`, `cam`, `overhead`, `host`, `guest 01`, `frame`, `now playing`,
  `live`. Never `SCREEN` and never `[ MAIN_FEED ]`.
- Punctuation is an affordance: `·` separates facts, `//` separates identity from context,
  `[ ]` marks a handle, `—` introduces a track.
- The only place a large type size appears is a transition screen, where the message *is* the
  content.

## 5. Components

Every scene is assembled from these, and nothing else.

**Region** — a bordered frame with a 1px `$line` border, `$region-fill` background, and a
lowercase label 16–20px inside the top-left corner. Optional ratio note top-right (`4:3`,
`16:10`, `9:16`).

**Title banner** — 64px bar: live dot (6px `$accent`), `live` (`$accent-muted`), then the title
at 16px. The dot and the word are the only state; the title is the only content.

**Recent event ticker** — 30px row: `+` in `$accent`, then the latest event in `$text-dim`.
No border, because it sits on the frame edge.

**Now playing** — two sizes. Panel: label, 72px artwork slot, track, artist · year, used when
there is room. Pill: 38px artwork, label, track, used where space is tight.

**Participant tag** — 52px chip inside a feed: name (12, primary) over role (11, dim).

**Audio row** — 50px row: for the host a 5px `$accent` dot, for listeners an invisible 5px
spacer (alignment over decoration), then name and status.

**Alert card** — 78px, 560 wide: kind mark in `$accent`, kind label (`new follow`, `raid`, `sub`),
content line, timestamp right-aligned. Stacked with 8px gaps, max three.

**Transition stage** — 1px frame, brand top-left (`llcoolchris // live`), state top-right
(`starting`, `away`, `offline`), centred column of headline → 360px rule → subline → action,
footer with `llcoolchris // twitch.tv` and `[discord] to join`. Same on 1080×1920.

## 6. Scene language

Three families, one voice.

- **Transition** (`start`, `brb`, `end`) — nothing but the frame, the brand corners, one line
  of copy, and the one action that matters (countdown, discord, follow).
- **Content** (`computer`, `computer-small`, `computer-built-in`, `talk`) — the screen is the
  hero; the rail carries the person and one utility (overhead, player, ticker).
- **Guest** (`audio-guest`, `video-guest`, `computer-guest`) — same grid, plus identity: tags
  on the feed, rows for listeners, one more column per person.
- **Utility** (`alerts`) — no frame at all, because it floats over anything.

## 7. Legibility

A 1920×1080 capture inside a 1048px-wide vertical region is at most 0.55× — that is the real
constraint on a phone, not the layout.

| crop | scale | shows |
|---|---|---|
| 16:9 letterboxed in a 4:3 region | 0.55× | 100% of the desktop |
| 4:3 cover crop | 0.73× | 82% of the width |
| square cover crop | 0.97× | 54% of the width |

The vertical computer scene uses the 4:3 crop on purpose: +33% text size for a 17.5% width
loss. The rest of the fix is not in the overlay — stream vertical with a 18–20px editor font
and the result lands near 14px on a phone.

**Vertical safe areas:** on TikTok/Shorts the platform chrome covers roughly 130px at the top
and 380px at the bottom of a 1080×1920 canvas. The current vertical scenes fill edge to edge,
so if a scene goes to a phone-first platform, lift the bottom blocks (ticker, banner) into the
safe area rather than moving the frame.

## 8. States not drawn

The artboards show each scene populated. These are implementation states, to be styled with
the rules above and not by inventing new chrome:

- **focus mode** — replace the red glow and banners with a single 1px `$accent` border plus one
  accent label on the affected region.
- **empty** — no title, no guests, no music: drop the block, keep the gaps.
- **alerts overflow** — three cards maximum, oldest drops.
- **countdown elapsed** — subline replaces the counter box, no colour change.

## 9. Motion

There is no motion in the design language. Nothing in the `.pen` animates.

If implementation needs it: a 120–150ms opacity fade and nothing else. No slides, no bounces,
no scales, no easing curves that draw attention to the overlay instead of the content.

## 10. Do not

- Add shadows, gradients, blurs, glows, or rounded corners.
- Add a second accent, or use accent as decoration.
- Uppercase a label, add a logo lock-up, or re-introduce `[ MAIN_FEED ]` bracket tags.
- Break a ratio to fill the canvas, or stretch a region.
- Let a widget overlap the outer 16px frame.
- Paint a canvas background only on a transition scene (start / brb / end); content scenes are
  always opaque.

## 11. Working with the file

- Edit `computer-overlay.pen` only through the Pencil tools; never Read/Grep it.
- Artboards are laid out on a grid: landscape at `y = 0 / 1200 / 2400 / 3600`, verticals at
  `y = 4920`, all 1200 apart horizontally.
- Export a scene at 1× and drop it in `exports/` with the scene's number and slug
  (`05-computer-small.png`). Refresh `_contact-sheet.png` after adding or removing a scene.
- Keep `exports/` to current previews only; anything superseded goes to `archive/`.
