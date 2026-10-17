# Notes for Claude

- Start with TODO.md. DESIGN.md has the rules and the physics model.
- HTML first. Unreal waits until the user says so.
- Other repos under `C:\Users\krish\dev` (causal-games, quantum-games, ...) are **read-only** references. Never change them.
- Keep both test scripts passing when you touch the engine or levels. Run the game in a browser to check visuals; `?debug` exposes `window.PT`. The Chrome extension's JS runs in an isolated world, so inject a `<script>` to reach it.
- Keep the Info screen honest: any new tuning or sci-fi goes in the "Tuned so it plays" list.
- Commits go out as Krishna Jayanthi (repo-local git config).
