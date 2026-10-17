// Checks the engine's relativity against independent formulas.
// Usage: node tests/verify-physics.js
const E=require('./load')();
let failed=0;
function check(name,ok,detail){console.log(`${ok?'PASS':'FAIL'} ${name}${detail?'  ('+detail+')':''}`);if(!ok)failed++;}
const close=(a,b,tol)=>Math.abs(a-b)<=tol*Math.max(1,Math.abs(b));
let seed=5;const rnd=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};
const unit=()=>{const z=2*rnd()-1,a=rnd()*2*Math.PI,q=Math.sqrt(1-z*z);return [q*Math.cos(a),q*Math.sin(a),z];};

// 1. Aberration and Doppler match a direct Lorentz transform of the light's emission event.
{
  let worst=0,worstD=0;
  for(let i=0;i<2000;i++){
    const phi=rnd()*6,v=unit(),w=E.mul(v,Math.sinh(phi)),n=unit(),d=1+rnd()*100;
    const ev=E.boostToShip(w,-d,E.mul(n,d));           // emission event, seen in the ship frame
    const np=E.norm(ev.x),a=E.aberrate(n,v,phi);
    worst=Math.max(worst,E.len(E.sub(np,a.n)));
    worstD=Math.max(worstD,Math.abs(-ev.t/d-a.D)/a.D); // apparent distance d*D = -t'
  }
  check('aberration matches Lorentz transform',worst<1e-9,'max error '+worst.toExponential(1));
  check('Doppler factor equals d\'/d',worstD<1e-9,'max rel error '+worstD.toExponential(1));
}
// 2. Doppler formula in both forms: D = gamma(1 + beta cos th) = 1 / (gamma (1 - beta cos th')).
{
  let worst=0;
  for(let i=0;i<500;i++){const phi=rnd()*4,v=unit(),n=unit(),g=Math.cosh(phi),b=Math.tanh(phi),a=E.aberrate(n,v,phi);
    worst=Math.max(worst,Math.abs(a.D-g*(1+b*E.dot(n,v)))/a.D,Math.abs(a.D-1/(g*(1-b*E.dot(a.n,v))))/a.D);}
  check('Doppler: gamma(1+b cos) = 1/(gamma(1-b cos\'))',worst<1e-9,worst.toExponential(1));
}
// 3. Deaberrate undoes aberrate, even at gamma ~ 10^4.
{
  let worst=0;for(let i=0;i<500;i++){const phi=rnd()*10,v=unit(),n=unit(),a=E.aberrate(n,v,phi),b=E.deaberrate(a.n,v,phi);worst=Math.max(worst,E.len(E.sub(b.n,n))*(Math.abs(E.dot(n,v))<0.999?1:0));}
  check('deaberrate inverts aberrate',worst<1e-6,worst.toExponential(1));
}
// 4. Straight burn from rest: after 1 s at a = 1, rapidity is 1, distance cosh(1)-1, universe time sinh(1).
{
  const s=E.makeSim(3);E.step(s,{thrust:[1,0,0]},1);
  check('rapidity adds linearly',close(E.rapidity(s.w),1,1e-9),E.rapidity(s.w).toFixed(9));
  check('distance = cosh(phi)-1',close(s.pos[0],Math.cosh(1)-1,1e-4),s.pos[0].toFixed(6));
  check('universe time = sinh(phi)',close(s.t,Math.sinh(1),1e-4),s.t.toFixed(6));
}
// 5. Velocity composition: a sideways boost on top of a forward one gives gamma = cosh(phi1) cosh(phi2), never beyond c.
{
  const w1=[Math.sinh(3),0,0],u=E.boostToWorld(w1,Math.cosh(3),[0,Math.sinh(3),0]);
  check('perpendicular boosts compose',close(u.t,Math.cosh(3)**2,1e-12)&&close(E.gam(u.x),u.t,1e-12)&&E.betaOf(u.x)<1,'gamma '+u.t.toFixed(4));
}
// 6. Photon rocket: Delta phi = ln(m0/m1).
{
  const s=E.makeSim(0);E.step(s,{thrust:[0,0,-1]},2.5);
  check('rocket equation',close(Math.log(1/s.m),2.5,1e-9)&&close(E.fuelLeft(s),7.5,1e-9),'fuel left '+E.fuelLeft(s).toFixed(6));
}
// 7. Brake stops exactly and costs exactly the rapidity it removes.
{
  const s=E.makeSim(3);E.step(s,{thrust:[0,0,-1]},4);const used=s.fuelUsed;E.step(s,{brake:true},5);
  check('brake stops dead',E.len(s.w)===0&&close(s.fuelUsed-used,4,1e-9),'fuel '+(s.fuelUsed-used).toFixed(6));
}
// 8. Nines: -log10(1 - tanh phi), and each nine costs ln(10)/2 = 1.151 of rapidity at high speed.
{
  check('nines at 0.9c',close(E.ninesOf(Math.atanh(0.9)),1,1e-9));
  check('one nine = 1.151 rapidity',close(E.ninesOf(8)-E.ninesOf(8-Math.LN10/2),1,1e-6));
}
// 9. Light: Sun is luminance 1, colours look right, lines are visible only in the visible band.
{
  check('5800 K has luminance 1',close(E.bb(Math.log10(5800)).logY,0,1e-3));
  const c3=E.bb(Math.log10(3000)).rgb,c20=E.bb(Math.log10(20000)).rgb,c65=E.bb(Math.log10(6500)).rgb;
  check('3000 K is orange-red',c3[0]>c3[1]&&c3[1]>c3[2],c3.map(x=>x.toFixed(2)).join(','));
  check('20000 K is blue',c20[2]>c20[0],c20.map(x=>x.toFixed(2)).join(','));
  check('6500 K is near white',Math.max(...c65)/Math.min(...c65)<1.35,c65.map(x=>x.toFixed(2)).join(','));
  check('CMB is dark at rest, bright at D=2000',E.bb(Math.log10(2.725)).logY<-100&&E.bb(Math.log10(2.725*2000)).logY>-1);
  const red=E.line(650).rgb,blue=E.line(460).rgb;
  check('650 nm red, 460 nm blue',red[0]>red[2]&&blue[2]>blue[0]);
  check('1550 nm invisible, 555 nm peak',E.line(1550).Y<1e-12&&close(E.line(555).Y,1,1e-9));
}
// 10. Length contraction: a point 100 ls ahead is 100/gamma ls away in the ship frame.
{
  const s=E.makeSim(3);s.w=[0,0,-Math.sinh(3)];const d=E.len(E.shipFrame(s,[0,0,-100]));
  check('length contraction',close(d,100/Math.cosh(3),1e-9),d.toFixed(4));
}
// 11. A blinking beacon ahead blinks D times faster (its delayed clock), one behind slower.
{
  const s=E.makeSim(3);s.w=[0,0,-Math.sinh(1)];const b={pos:[0,0,-200],lam:500,period:1,duty:0.5,logI:-9};
  const t0=E.beaconView(s,b).tEmit;s.t+=1;s.pos=E.add(s.pos,[0,0,-Math.tanh(1)]);const t1=E.beaconView(s,b).tEmit;
  check('approaching clock runs fast: 1+beta per universe s = D per ship s',close((t1-t0)*Math.cosh(1),Math.exp(1),1e-9),((t1-t0)*Math.cosh(1)).toFixed(4)+' per ship s');
}

console.log(failed?`\n${failed} check(s) failed`:'\nAll physics verified');
process.exit(failed?1:0);
