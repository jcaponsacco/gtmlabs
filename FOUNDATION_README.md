# Foundation 16.1 — Solid green pill with black shading overlay

**Change from 16:** The floating navigation pill has a fully opaque green base (`var(--deep)`), rather than an alpha-green surface. A separate top-to-bottom **transparent-to-black** overlay adds depth toward the bottom. The page behind the pill no longer bleeds through. Removed backdrop blur from the pill. Full-width navigation remains unchanged.

The 90px scroll trigger, pill dimensions, link typography and remaining homepage are unchanged. Tune the `FOUNDATION 16.1 / OPAQUE GREEN PILL` block in `styles.css` to adjust the black shading.

# Foundation 16 — Approved navigation gradient

Based on the approved Foundation 15 homepage. The **only visual change** is the floating navigation: once scroll passes 90px, the floating pill retains the established shape and gains the approved green-to-near-black, partially translucent vertical gradient with blur and refined shadow. The full-width initial masthead stays solid green. The effect matches the Page 3 navigation gradient study.

Edit the `FOUNDATION 16 / APPROVED NAVIGATION PILL GRADIENT` block in `styles.css` to adjust the effect. Floating state is driven by the existing `scrollY>90` toggle in `main.js`. No other homepage sections or copy were modified.

# G2M Labs — Foundation 11

Foundation 07 preserves the **approved Growth Engine Concept 03** from Foundation 03 and replaces only **Section 05 / How We Help** with the approved Chris-style cards from Services Cards Concept 01.

## Files
- `index.html` — numbered, annotated homepage structure.
- `styles.css` — site styles plus isolated Growth Engine and Services card treatments.
- `main.js` — site interactions, including the scroll-controlled Growth Engine and click-only services cards.
- `assets/hero-background.webp` — unchanged hero background.

## Section 05 / Services cards
- Chris-style sage front faces, geometric illustrations, dark green backs, and Velocity™ copy.
- Click once to flip; cards **stay flipped** until clicked again. They do not flip on hover.
- Keyboard support: focus card then Enter or Space to toggle; Escape returns it to the front.
- Reverse-side links to `how-we-help.html` are retained as placeholders for the future page; navigation does not trigger a card flip.
- CSS rules are prefixed with `#services` and appear under `SECTION 05 — FOUNDATION 04` near the end of `styles.css`.
- JS behavior is grouped in `SECTION 05 — APPROVED SERVICES CARDS` near the end of `main.js`.

## Notes
- Other homepage sections remain as in Foundation 04.
- The existing hero, section containers, flexible background treatments, and Growth Engine are not redesigned.
- The standalone HTML embeds CSS, JS and the original hero image for direct browser review.
- JavaScript syntax and static HTML/asset checks were run; physical mobile and full interactive browser regression tests are still recommended.

## Section 02B / Reframe the Question — Foundation 07
- Added between the pipeline (Section 02) and investment calculator (Section 03).
- Uses Chris's dark green palette, large editorial statement, and separate concentric-circle layers; retains the screenshot's statement and supporting copy.
- The layers live within `#reframe .reframe-art` and can be swapped for an image. `--reframe-image` in `styles.css` can also add a background image without affecting text.
- No new JavaScript or scrolling controller; the existing sections and click-to-flip service cards remain unchanged.
- Check rendering on physical devices and the pipeline-to-interlude transition.


## SECTION 07 — Approved animated footer (Foundation 07)
The existing homepage footer has been replaced by the approved motion study:
- 07A: large editable `G2M LABS` wordmark on a light stage, visually cropped by the black content panel.
- 07B: black content panel with editable brand tile, Explore, G2M Labs, and Contact columns.
- 07C: **dark-green legal strip** (`--footer-sage:#264a3a`) with contrasting light text.
- 07D: small near-black closing line.
The scroll-linked entrance uses CSS variables controlled by the footer-only JavaScript controller at the end of `main.js`. It honors reduced-motion preferences.
Change footer colors, dimensions, or type via the `#g2mFooter` variables near the end of `styles.css`; all text and link markup is in `index.html`.
Navigation links pointing to future pages and provisional email/contact details are placeholders until those pages and addresses are verified.
No changes were made to sections 00–06.


## SECTION 02 — Growth Engine headline upgrade (Foundation 07)
- Based on approved Growth Engine Concept 04; replaces only headline markup and Section 02 controller from Foundation 06.
- The pipeline movement, yellow pulse, red alerts, fade/split, and five-stage original diagnostic reveal remain in place.
- The four large stage headlines are assembled word by word, with letters sweeping from purple (`#7861a5`) to dark ink (`#18342c`) according to scroll progress.
- The reveal reverses naturally on upward scrolling, with reduced-motion support and an accessible complete `aria-label`.
- Edit headline phrases in `main.js` under `SECTION 02 / ENGINE CONTROLLER` (`scenes` array). Adjust `sceneStarts`, `sceneEnds` and `drawTitle` for timing.
- Style via `styles.css` under `SECTION 02 / FOUNDATION 07`.
- The rest of the homepage remains from Foundation 06. Browser/device regression testing recommended.


## SECTION 02 — Target-first reveal timing (Foundation 08)
- At scroll progress `p=.76`, the heading “The problem may begin elsewhere.” begins. The first diagnostic stage, **TARGET**, is dark green.
- TARGET remains selected through `p=.84`; scrolling further progressively selects ENGAGE, DISCOVER, PROPOSE, then WIN.
- Clicking any diagnostic stage still selects it and keeps that user-selected stage active.
- Adjust the `.76` / `.84` / `.16` progress thresholds in `main.js` under `SECTION 02 / ENGINE CONTROLLER` to tune the timing.
- No changes to navigation, hero, pipeline movement, calculator, pulse, services cards, reframe or footer.


## Foundation 09 — Precise Target activation cue
The Target box stays unselected while the final headline is revealing. Only after the last letter of “elsewhere.” completes its purple-to-ink change does Target turn dark green. Scrolling farther holds Target briefly, then advances through Engage, Discover, Propose, and Win. Edit `finalLocal < .30` and `.47` in `main.js` to adjust cue and dwell.


## Foundation 10 — Section 06 / Dark-green conversation CTA
- Changed only the visual palette for `#contact.closing`; the exact CTA copy, links, section order, and interactions remain from Foundation 09.
- Background is deep green (`#14382e`); headline is light, body copy muted sage-white, eyebrow and primary button warm yellow. Secondary action uses a light outline.
- To adjust colors without editing markup, find `FOUNDATION 10 / SECTION 06` at the end of `styles.css` and change the `--closing-*` variables. The section still supports the existing `editable-surface` background image/color overlays.
- The oversized black wordmark footer remains separate, with its approved scroll animation.
- Provisional contact email and future-page links have not been changed.
- Validate CTA contrast and footer boundary on real mobile devices before release.


## Foundation 11 — Pipeline alert / body-text clearance
- The red diagnostic alert cards no longer rise across the supporting paragraph in desktop layouts.
- Only `#pipeline .pipeline-zone` is shifted downward; red-card emergence, yellow pulses, pipe opening/fade, final headline, Target activation, and diagnostic stage scrolling use their existing animation controller unchanged.
- Adjust `--pipeline-alert-clearance` (default `58px`) and `--pipeline-alert-clearance-mobile` (default `30px`) in `styles.css` under `FOUNDATION 11 / SECTION 02`.
- Short viewports receive a smaller offset to preserve the pipeline within the available stage.
- Review at 1440×900, laptop heights, and on real mobile devices; no browser-based regression was performed.


## Foundation 12 — Section 06B / Keep in Touch
- New standalone subscription panel placed after the dark-green conversation CTA and before the animated footer.
- Soft lavender background, deep purple typography and button, white form fields; adjustable `--keep-*` tokens under `FOUNDATION 12 / SECTION 06B` in `styles.css`.
- First name, last name, email, and explicit opt-in checkbox; native browser validity checks, responsive layout, and accessible status feedback.
- **Important: design preview only.** Form submission is intercepted in `main.js`; no personal details are sent or saved. Before public launch, integrate an email service, configure consent handling/confirmation/unsubscribe, and publish a working privacy policy.
- Existing sections, animations, and other JS functionality preserved from Foundation 11.


## Foundation 15 — Full-width Keep in Touch layout
- Replaces only the Foundation 12 two-column newsletter layout with the approved full-width composition: lavender title and copy above a white form panel.
- Three real fields share one row on desktop; consent and the deep-purple action button share the next row. On narrower viewports fields and actions stack for comfortable touch use.
- Edit the section under `SECTION 06B` in `index.html` and the `FOUNDATION 13 / SECTION 06B` CSS block. Deep purple and lavender colors remain configurable via `--keep-*` variables.
- **Still preview-only**: existing `main.js` submit handler validates but does not transmit/store personal information. A privacy policy and email marketing integration are required before launch.
- All other homepage components are unchanged from Foundation 12.


## Foundation 15 update
- Replaced the static hero treatment with an animated signal overlay on the hero image.
- Commented out the floating right-side hero signal card in the HTML so it can be restored later.
 

## Foundation 15 — Hero simplification
- Removed the signal-monitor card markup entirely (the Foundation 14 comment contained a nested HTML comment, which could expose the card in browsers).
- Expanded the hero text grid to use the available horizontal space.
- Preserved the animated SVG signal paths, hero photo, headline, CTA and all other sections.
