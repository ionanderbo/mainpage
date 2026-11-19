# Ion Ander Bolado — Personal Portfolio & Private Creator Studio

Compartmentalized engineering portfolio and build-in-public Lab Log for **Ion Ander Bolado** (Biomedical Engineering, University of Deusto, Bilbao).

## File Architecture

- `index.html` — Semantic section bands and interactive widgets.
- `styles.css` — Surgical Fjord, Porcelain & Terracotta Signal palette, responsive layout grids, and Creator Studio styling.
- `animations.css` — Levitating schematics, CT trajectory path animation, rolling buttons, directional wipes, and scroll sweeps.
- `config.js` — Supabase Project URL & Anon Key configuration.
- `data.js` — Initial seed data for profile facts, projects, Lab Log posts, roadmap, and focus domains.
- `shared.js` — Data loader (Supabase + local fallback), dynamic section renderer, and navigation chrome.
- `widgets.js` — CardioPatch ECG sinus-wave canvas simulator, CT biopsy & rigid registration replays, Lab Log filter, and email copy helper.
- `studio.js` — Private X-style Creator & Project Studio summoned exclusively via **`Ctrl + Alt + Shift + I`**.
- `supabase-schema.sql` — Ready-to-run SQL setup for Supabase Postgres tables, Row Level Security (RLS), and Storage bucket.
- `vercel.json` — Vercel static hosting config.

## How to Open Your Private Studio

1. Press **`Ctrl + Alt + Shift + I`** anywhere on the site (no visible icon on the public page).
2. Before Supabase is connected, enter any preview password to test creating, editing, coloring, tagging, and deleting Lab Log entries and Projects locally in your browser.

## Connecting Supabase (Cloud Sync Across Uni, Library & Home PCs)

1. Create a free project at [supabase.com](https://supabase.com).
2. Open **SQL Editor -> New Query**, paste the contents of `supabase-schema.sql`, and click **Run**.
3. Go to **Authentication -> Users -> Add User** (create your admin email + password) and disable public signups under **Authentication -> Providers -> Email**.
4. Copy your **Project URL** and **Anon Public Key** from **Project Settings -> API** into `config.js`, then push to GitHub/Vercel.
