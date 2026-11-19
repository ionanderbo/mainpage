# Ion Ander Bolado — Personal Portfolio & Lab Log

Personal engineering portfolio and build-in-public Lab Log for **Ion Ander Bolado** (Biomedical Engineering, University of Deusto, Bilbao).

## File Structure

- `index.html` — Semantic layout and section bands (Hero, About, Projects, Lab Log, Roadmap, Focus, Contact).
- `styles.css` — Design tokens, layout grids, responsive breakpoints, and component styling.
- `animations.css` — Keyframe animations, rolling button tracks, directional wipes, two-tone scroll sweeps, and focus-zoom transitions.
- `data.js` — Centralized content store for profile facts, **Lab & Founder's Log** entries, trajectory roadmap, and focus domains.
- `shared.js` — Dynamic header/drawer navigation, data-driven section rendering, and `IntersectionObserver` scroll reveals.
- `widgets.js` — Interactive CardioPatch ECG sinus-wave canvas simulator, CT biopsy & rigid registration replay controls, Lab Log category filter, and one-click email copy.
- `vercel.json` — Static deployment configuration for Vercel.

## Updating the Lab & Founder's Log

To add a new build-in-public entry, open `data.js` and prepend a new object to `PROFILE_DATA.labLog`:

```js
{
  date: "DEC 2026",
  category: "engineering", // "engineering" | "translation" | "mobility"
  categoryLabel: "Hardware & Signals",
  highlight: false,
  title: "Your update title",
  body: "Two or three sentences explaining what you built, tested, or learned."
}
```
