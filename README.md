# Clubhouse - FC 26 auction prototype

A browser-based first pass for a four-captain FC 26 tournament service.

## Included

- Demo role login for organizers, captains, and players
- Explicit tournament lifecycle: Draft setup, Registration open, Captain selection, Auction live, Squad confirmation, Tournament live, Complete
- Tournament creation, phase controls, and tournament-scoped data
- Tournament selection after captain or player login
- Player self-registration while registration is open
- CSV player-pool import before registration is locked
- Persistent dark and light themes
- Editable player profiles and shared player pool
- Dynamic team-size formations with goalkeeper and outfield positions
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

Use `|` between multiple preferred positions or specializations. Imported players become login profiles and can select tournaments whose player pools include them. Existing demo players can also register themselves during the Registration open phase.

## Standard setup outside a synced folder

```powershell
npm install
npm run dev
```

Then open `http://127.0.0.1:5173`.

## Prototype assumptions

- V1 is intentionally locked to four captains because the current fixture path is a four-team League + Finals format.
- Team size is flexible; each squad contains the captain plus `teamSize - 1` auctioned players.
- The organizer dashboard owns phase transitions and controls starting/advancing rounds (nomination reveal, awarding lots, and passing lots).
- Captains place bids from their own tabs, and the organizer dashboard acts as a read-only live monitor for active rounds.
- Real-time tab synchronization is supported via a `BroadcastChannel` based local multi-tab sync, which can be easily replaced by Supabase Realtime in future iterations.
- Enforced rules ensure captain nominations require shortlist readiness, player profiles require completeness, and cleanup tasks are scoped to deleted tournaments.

