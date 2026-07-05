# Clubhouse — FC 26 auction prototype

A browser-based first pass for a four-captain FC 26 tournament draft.

## Included

- Demo role login for organizers, captains, and players
- Tournament creation, start controls, and tournament-scoped data
- Tournament selection after captain or player login
- CSV player-pool import after a tournament starts
- Persistent dark and light themes
- Editable player profiles and shared player pool
- Four eleven-a-side formations with goalkeeper and outfield positions
- Click-to-assign lineup builder plus position-aware auto-placement
- Three-player captain shortlists and nomination voting
- Preloaded rival-captain shortlists for repeatable auction testing
- Majority-wins nomination with random tie resolution
- 1,000-coin captain budgets, 50-coin opening bids, and 25-coin raises
- Player awards, budget deductions, and squad placement
- Browser persistence through local storage

## Run it from Nexus (recommended)

Google Drive can struggle with the thousands of tiny files in `node_modules`. The included launcher keeps source in Nexus but puts disposable dependencies on the local disk:

```powershell
.\run-local.ps1
```

Then open `http://127.0.0.1:5173`.

## Player CSV format

Required columns:

```csv
name,gamertag,preferred_positions,specializations,play_style
Naeem Rahman,Naeem8,CM|CAM,Tiki Taka|First Touch,Creator
```

Use `|` between multiple preferred positions or specializations. Imported players become login profiles and can only select tournaments whose player pools include them.

## Standard setup outside a synced folder

```powershell
npm install
npm run dev
```

Then open `http://127.0.0.1:5173`.

## Prototype assumptions

- Each starting XI contains the captain plus up to ten auctioned players; the captain starts in goal but can be reassigned manually.
- “Fill remaining demo votes” and “Simulate rival +25” stand in for other connected browsers.
- Authentication and true multi-user live state require a backend in the next pass (Supabase is a sensible fit).
