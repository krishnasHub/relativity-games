// Flies every mission with a simple autopilot (the way a careful player would) and checks it can be won,
// then reports the margins: ship time against par and life support, and fuel left.
// Usage: node tests/verify-levels.js
const E=require('./load')();
const DT=1/60;
let failed=0;

// Fly to beacon `id` from rest: thrust toward it to rapidity `phi`, coast, hold the brake once the stopping distance
// (plus a little reaction slack) reaches the distance left. The arrival computer does the rest.
function flyTo(s,id,phi,slack){
  const b=E.beacon(s,id);slack=slack||1.15;
  const gi=s.L.goals.findIndex((g,k)=>k>=s.goal&&g.type==='dock'&&g.target===id);
  while(s.status==='fly'&&s.goal<=gi){
    const r=E.sub(b.pos,s.pos),d=E.len(r);
    if(E.stopDist(s)*slack>=d&&E.dot(r,s.w)>0)E.step(s,{brake:true},DT);
    else if(E.rapidity(s.w)<phi)E.step(s,{thrust:E.norm(E.shipFrame(s,b.pos))},DT);
    else E.step(s,{},DT);
  }
}
function stop(s){while(s.status==='fly'&&E.len(s.w)>0)E.step(s,{brake:true},DT);}

const PLANS={
  'first-light':s=>{flyTo(s,'alpha',4.2);},
  'twin-clocks':s=>{flyTo(s,'kepler',5.8);flyTo(s,'home',5.8);},
  'invisible-light':s=>{
    // Head for the buoy at about 0.76c and look for Echo; lock as soon as it shows.
    while(s.status==='fly'&&!s.locked.echo&&s.tau<40){
      const echo=E.beacon(s,'echo'),v=E.beaconView(s,echo);
      if(v.visible)E.tryLock(s,v.n,'echo');
      E.step(s,E.rapidity(s.w)<1.0?{thrust:[0,0,-1]}:{},DT);
    }
    stop(s);flyTo(s,'echo',3);
  },
};

for(let i=0;i<E.LEVELS.length;i++){
  const L=E.LEVELS[i];
  if(!PLANS[L.id]){ // free flight: no goals; check the milestones can all be reached
    const s=E.makeSim(i);
    while(E.gam(s.w)<700&&s.tau<20)E.step(s,{thrust:[0,0,-1]},DT);
    stop(s);
    const az=E.body(s,'Azure').pos;s.pos=E.add(az,[0,0,35]);E.step(s,{},DT); // teleport check for the visit milestone
    const g=E.makeSim(i);while(g.pos[2]>-80)E.step(g,{thrust:[0,0,-1]},DT);
    const all=L.milestones.filter(m=>m.id!=='gate'&&m.id!=='azure').every(m=>s.done[m.id])&&s.done.azure&&g.gateBest>=0.99;
    console.log(`${all?'PASS':'FAIL'} ${i+1}. ${L.name}: milestones ${new Set([...Object.keys(s.done),...Object.keys(g.done)]).size}/${L.milestones.length}`);
    if(!all)failed++;continue;
  }
  const s=E.makeSim(i);PLANS[L.id](s);
  const ok=s.status==='won';if(!ok)failed++;
  const fuel=s.unlimited?'∞':E.fuelLeft(s).toFixed(2);
  console.log(`${ok?'PASS':'FAIL'} ${i+1}. ${L.name}: ${s.status}${s.reason?' ('+s.reason+')':''}, ship ${s.tau.toFixed(1)} s`+
    ` (par ${L.par[0]}/${L.par[1]}${L.life?', life '+L.life:''}), universe ${(s.t/60).toFixed(1)} min, max γ ${s.maxGamma.toFixed(1)}, fuel left ${fuel}, ★${E.rating(s)}`);
}
// The twin mission must need real speed: a slow plan (gamma ~ 30) should run out of air.
{
  const i=E.LEVELS.findIndex(L=>L.id==='twin-clocks'),s=E.makeSim(i);flyTo(s,'kepler',4);flyTo(s,'home',4);
  const ok=s.status==='lost';if(!ok)failed++;
  console.log(`${ok?'PASS':'FAIL'} twin mission is lost at γ≈27: ${s.status}${s.reason?' ('+s.reason+')':''}`);
}
// Invisible Light: Echo must be invisible at rest and when flying too fast toward the buoy.
{
  const i=E.LEVELS.findIndex(L=>L.id==='invisible-light'),s=E.makeSim(i),echo=E.beacon(s,'echo');
  const atRest=E.beaconView(s,echo).visible;s.w=[0,0,-Math.sinh(2.2)];const tooFast=E.beaconView(s,echo).visible;
  s.w=[0,0,-Math.sinh(1)];const right=E.beaconView(s,echo).visible;
  const ok=!atRest&&!tooFast&&right;if(!ok)failed++;
  console.log(`${ok?'PASS':'FAIL'} Echo visible only in the Doppler window: rest ${atRest}, φ=1 ${right}, φ=2.2 ${tooFast}`);
}
console.log(failed?`\n${failed} check(s) failed`:'\nAll missions verified');
process.exit(failed?1:0);
