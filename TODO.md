# TODO (start here)

Live at https://krishnashub.github.io/relativity-games/. Pushing to `main` redeploys it in about a minute.

## Where we left off (2026-10-17)
The user played First Light by hand. Their feedback and what was done about it:
- **Struggled with the controls:** added an on-screen key strip.
- **No idea what to do or where to go** (the biggest problem): added a coach line above the speed dial that always says the next action. First Light's speed goals became bonus ticks; stopping at the beacon is the only goal.
- **Missed the target without noticing:** added the approach bar. It has a stopping-distance zone that wobbles when you're in it without braking and turns red when it's too late, plus a "you flew past it" warning.
- **Hunting for the B key:** S brakes, right under W, with the arrival computer. Space is reverse thrust (the user wanted to keep it). B still brakes as a hidden alias.

## 1. Next: a second hand playtest
Ask how it went. Play all four missions and write notes in `PLAYTEST.md`:
- Does the coach plus approach bar make First Light obvious now?
- Is the wobble a helpful nudge or annoying?
- Holding S far from the target only brakes gently (the arrival computer aims to stop at the target). Does that feel wrong? If so, brake at full power until the amber zone.
- Twin Clocks: is the 70 s of life support tense, and are the ★★★ times (50 s / 62 s) fair?
- Invisible Light: is the search understandable?
- Mouse sensitivity and turning feel. The user hasn't said yet whether "struggled with controls" also meant how steering feels.

## 2. Then
- Tune from those notes.
- Pick the next chapter: black holes or simultaneity gates (see DESIGN.md, "Ideas not built yet").
- Touch controls, if phones matter.
- Only then the Unreal spike (DESIGN.md, "Unreal plan").

## Checks
- `node proper-time/tests/verify-physics.js`: the relativity against independent formulas.
- `node proper-time/tests/verify-levels.js`: an autopilot flies every mission and reports the margins.
- `proper-time/index.html?debug` exposes `window.PT = {ui, E, render, ...}`. The Chrome extension's JS runs in an isolated world, so inject a `<script>` to reach it. An automated Chrome window is throttled to about 1–3 fps, so stage a scene and then pause before taking a screenshot.
