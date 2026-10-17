# TODO (start here)

## 1. Hand playtest of Proper Time (next)
Open `proper-time/index.html` (double-click works, or serve the repo and visit `/proper-time/`). Play all four missions with keyboard and mouse. Write notes in `PLAYTEST.md`:
- Is accelerating to 0.999c *fun*, or just pretty? Does the dial feel good?
- Is braking with the arrival computer too easy, too hard, or about right?
- Twin Clocks: is the 70 s life support tense? Are the ★★★ times (50 s / 62 s) fair?
- Invisible Light: is the search understandable without reading the brief twice?
- Are the captions readable, and do they come at the right moments?
- Anything confusing on the HUD?
- Performance: what frame rate on your machine?

## 2. Then
- Tune from the playtest notes.
- Decide the next chapter: black holes or simultaneity gates (see DESIGN.md, "Ideas not built yet").
- Touch controls, if phones matter.
- Only then the Unreal spike (see DESIGN.md, "Unreal plan").

## Checks
- `node proper-time/tests/verify-physics.js`: the relativity against independent formulas.
- `node proper-time/tests/verify-levels.js`: an autopilot flies every mission and reports the margins.
- `proper-time/index.html?debug` exposes `window.PT = {ui, E}` for driving flights from the console.
