# Relativity Games: design

Browser prototypes about special and general relativity. Each game is one standalone HTML file that can go on github.io. The long-term goal is a first-person Unreal Engine game. These HTML versions exist to find out what is fun before that work starts.

## Rules for every game
- One standalone HTML file. No build step, no server needed.
- It opens on an almost static title screen with **New Game**, **Info** and **Controls**.
- It must teach. **Realism rule:** keep the physics real unless that makes the game boring; then go sci-fi. Either way the Info screen says plainly which parts are exact and which are tuned.
- The engine sits in a `<script id="engine">` block with no DOM, so node tests can load it and fly the missions.

## Proper Time (`proper-time/`)
You fly a relativistic courier from the cockpit. Every frame is computed from special relativity.

### The core loop
- **Two clocks.** Ship time τ is your real time (1 s of play = 1 s of ship time). Universe time t runs γ times faster. Deadlines and life support use one clock or the other, so the tension comes from the twin paradox.
- **Rapidity drive.** Thrust adds rapidity φ at 1 per ship-second. β = tanh φ, γ = cosh φ. The speed dial counts "nines of c" (−log₁₀(1−β)) and shades from blue to red.
- **Photon rocket fuel.** Δφ = ln(m₀/m₁). The bar shows rapidity left, and the small print shows how little fuel mass is left (the exponential is the lesson).
- **Arrival computer.** Hold S to brake (Space is plain reverse thrust). When the target is ahead, the burn is throttled to stop you at it. The skill is starting early enough; the HUD shows a brake zone. Without this a human would have to hit a ±0.03 s window at γ = 100.

### What you see (the renderer)
- Sky: the galaxy band and the 2.725 K CMB, both treated as diluted blackbodies ε·B(T). For each pixel, de-aberrate the view direction, find the Doppler factor D, and look up B(D·T) in a table (Planck spectrum against CIE 1931 colour matching, then sRGB). The beaming falls out of the blackbody shift.
- Stars: 7,000 point sources with real magnitude statistics. Each is aberrated and shifted in the vertex shader; its flux scales as Y(D·T)/D² × Ω.
- Bodies: stars, planets and the ring are meshes. Each vertex is moved to where its light appears: direction aberrated, distance d·D (the light's emission event in the ship frame). That gives Terrell rotation and "things you passed still appear ahead".
- Beacons: monochromatic lines at λ/D, blinking and spinning by their own delayed clock (t − d), so approaching clocks run fast.
- Exposure works like an eye: it meters the mean light in view, with extra samples in the bright forward cap. X locks it.
- **V** switches to the Newtonian view (what is there, with no relativity) for comparison.
- **Z** is a starbow zoom. At γ = 1,500 the whole sky fits in 0.04°.

### Tuned and sci-fi (all listed on the Info screen)
- Space is compressed: stars are light-seconds apart.
- Inertial dampers: full thrust is about 3×10⁷ g.
- A perfect antimatter photon drive, with a governor at φ = 10.
- Nearby bodies are drawn 10¹⁰ times dimmer than reality so they show up next to the starfield.
- Planet colours are tinted after the Doppler shift (not spectral), and the ship's axes ignore Thomas precession.

### Missions
1. **First Light.** The tutorial: 0.9c, 0.99c and 0.999c, through the Halo Gate, then stop at a beacon 150 ls ahead.
2. **Twin Clocks.** A 2,400 ls round trip on 70 s of life support. Needs γ ≈ 100+. Debrief: your twin aged 80 minutes and you aged under a minute. The spacetime diagram shows the bent worldline.
3. **Invisible Light.** Beacon Echo shines at 1550 nm. It is only visible when D is between about 2.1 and 4.6, so you find it by speed, lock on, then stop at it while it fades back to infrared.
4. **Free Flight.** Unlimited fuel and milestones, up to lighting up the CMB at γ ≥ 600.

### Ideas not built yet
- Black holes: gravitational time dilation as a "skip ahead" tool, lensing (a ray-marched Schwarzschild sky), tides (small holes spaghettify, supermassive ones don't), ISCO, gravitational redshift of messages home.
- Simultaneity gates: two gates that open "at the same time" in the station frame.
- Signal lag: orders from home arrive late.
- Wormholes / tachyon relays for late-game travel, clearly labelled as fiction.
- Touch controls.

## Unreal plan (later)
The HTML engine maps cleanly onto Unreal:
- Ship state (position, proper velocity w, τ, t) becomes a C++ actor component.
- `aberrate()` becomes a vertex-shader material function on every mesh: direction aberrated, distance × D.
- The sky becomes a post-process material that does the same de-aberration and blackbody lookup.
- The blackbody table becomes a 1-D float texture.
- Mission logic ports almost directly.
