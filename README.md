# Relativity Games

Small browser games about special and general relativity, with the physics computed for real: time dilation, Doppler shifts, aberration, the twin paradox, and eventually black holes. Each game's Info screen says plainly what is exact and what was tuned so it plays.

▶ **[Play them at krishnashub.github.io/relativity-games](https://krishnashub.github.io/relativity-games/)**

## Games

### [Proper Time](proper-time/)
Fly a relativistic courier from the cockpit at up to 0.9999999c:
- The sky crowds into a blue starbow ahead.
- Beacons shift out of sight into ultraviolet and X-rays.
- Your twin ages an hour and a half while you age under a minute.
- The Big Bang's afterglow lights up in front of you.

There are four missions plus free flight, for keyboard and mouse. **[Read more →](proper-time/README.md)**

| | |
|---|---|
| ![The starbow at 0.994c](proper-time/screenshots/starbow.jpg) | ![The Halo Gate, behind the ship, still appears ahead](proper-time/screenshots/halo-gate.jpg) |
| *0.994c: the whole sky squeezed into a starbow ahead* | *The gate you just flew through still frames the view ahead* |
| ![Twin Clocks with the spacetime diagram](proper-time/screenshots/twin-clocks.jpg) | ![The CMB glowing ahead at γ 1,500](proper-time/screenshots/cmb.jpg) |
| *Twin Clocks: your bent worldline next to your twin's straight one* | *γ = 1,500: the 2.7 K microwave background blueshifted into visible light* |

## How it's built

- Every game is **one standalone HTML file**: no build step, no install. Open it, or push it to GitHub Pages.
- Each opens on a title screen with **New Game**, **Info** and **Controls**.
- **Realism rule:** keep the physics real unless that makes the game boring; then go sci-fi, and say so on the Info screen.
- The physics engine sits in its own `<script id="engine">` block with no DOM, so node tests can load it, check the maths, and fly every mission with an autopilot.

These are prototypes for finding what's fun. A first-person Unreal Engine version comes later. See [DESIGN.md](DESIGN.md) for the design and the plan, and [TODO.md](TODO.md) for what's next.

## Tests

```
node proper-time/tests/verify-physics.js
node proper-time/tests/verify-levels.js
```
