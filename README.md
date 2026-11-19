# G2M Labs — Foundation V36.9 | Verified CSS Repair

## Source and scope
- Based on the complete Foundation V36.7 website package.
- Replaces **only** `styles.css` with the browser-tested V36.8 correction.
- The precise fix is one missing closing brace after the `@media (max-height:650px)` block, immediately before the `prefers-reduced-motion` rules.
- Updates `?v=36.7` to `?v=36.9` in HTML asset references to avoid old browser/CDN cache entries.
- Does not change site copy, layout choices, approved animations, JavaScript logic, founder profiles, or contact links.

## Three primary pages
- `index.html` — Homepage, including the repaired pipeline and footer
- `methodology.html` — How We Help, including approved Velocity cycles
- `help.html` — About Us, including the founder bio transformations

## Cloudflare Pages deployment
1. Extract the ZIP. Ensure `index.html`, `styles.css`, `main.js`, and the other files are together at the folder root (with the `assets/` subfolder).
2. Upload the **contents** of this folder as a complete new Cloudflare Pages deployment. Do not upload only the HTML pages.
3. Verify the new deployment, then use **Cmd+Shift+R** in Chrome to refresh.
4. Check the homepage pipeline through the final reveal, its footer, Page 2 Velocity, and Page 3 founder cards.
5. If a problem remains, use Developer Tools > Network to confirm the referenced `?v=36.9` CSS and JS files return HTTP 200.

## Editing notes
- `.vscode/settings.json` enables source word-wrap in VS Code.
- Source sections remain labeled; no changes were made to their identifiers.
- This package is the deployable three-page continuation of the validated V36.8 single-file diagnostic.
