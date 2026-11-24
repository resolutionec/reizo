/* ---------- Model M3171: hand-built from the reference photographs (mm). Right lens traced, left mirrored. ---------- */
const GEO=__GEO__;
const texLoader=new THREE.TextureLoader();
const brMap=texLoader.load(GEO.BRTEX);brMap.colorSpace=THREE.SRGBColorSpace;brMap.anisotropy=8;
const brBump=texLoader.load(GEO.BRTEX);brBump.anisotropy=8;
let seed=11;const rnd=()=>(seed=(seed*16807)%2147483647)/2147483647;
function canvasTex(w,h,draw){const c=document.createElement('canvas');c.width=w;c.height=h;draw(c.getContext('2d'),w,h);
  const map=new THREE.CanvasTexture(c),bump=new THREE.CanvasTexture(c);
  for(const t of [map,bump]){t.anisotropy=8;t.wrapS=t.wrapT=THREE.RepeatWrapping}map.colorSpace=THREE.SRGBColorSpace;return {map,bump}}
// rim side band, one 4 mm tile: front strip = engraved diamonds and dots, back strip = fine knurl (canvas top = front of the rim)
const BAND=canvasTex(256,128,(g,w,h)=>{g.fillStyle='#e9e9e9';g.fillRect(0,0,w,h);const k=h*.46;
  g.fillStyle='#2b2b2b';for(let x=0;x<w;x+=16)g.fillRect(x+5,k+5,6,h-k-5);
  g.fillStyle='#9a9a9a';g.fillRect(0,k-1,w,3);
  const cy=k/2;g.lineWidth=7;g.strokeStyle='#262626';
  g.beginPath();g.moveTo(84,cy);g.lineTo(128,cy-cy*.62);g.lineTo(172,cy);g.lineTo(128,cy+cy*.62);g.closePath();g.stroke();
  g.fillStyle='#262626';g.beginPath();g.moveTo(116,cy);g.lineTo(128,cy-cy*.25);g.lineTo(140,cy);g.lineTo(128,cy+cy*.25);g.fill();
  for(const x of [20,236]){g.beginPath();g.arc(x,cy,7,0,7);g.fill()}});
// end-piece face: brushed, with a beaded row along the top and bottom edges (one 4 mm tile)
const EPT=canvasTex(256,256,(g,w,h)=>{g.fillStyle='#dcdcdc';g.fillRect(0,0,w,h);
  for(let i=0;i<220;i++){{const c=rnd()<.5?40:255;g.strokeStyle=`rgba(${c},${c},${c},${.05+rnd()*.08})`};g.lineWidth=1+rnd()*1.5;const y=rnd()*h;g.beginPath();g.moveTo(0,y);g.lineTo(w,y+rnd()*2-1);g.stroke()}
  for(const y of [34,222]){g.fillStyle='#6a6a6a';g.fillRect(0,y-16,w,32);g.fillStyle='#f2f2f2';for(let x=8;x<w;x+=16){g.beginPath();g.arc(x,y,6,0,7);g.fill()}}});
// coloured temple: soft tonal patches and a fine diagonal grain
const CAMO=canvasTex(512,512,(g,w,h)=>{g.fillStyle='#d8d8d8';g.fillRect(0,0,w,h);
  for(let i=0;i<70;i++){const x=rnd()*w,y=rnd()*h,r=20+rnd()*70,a=rnd()*3;for(const [dx,dy] of [[0,0],[w,0],[-w,0],[0,h],[0,-h]]){
    g.fillStyle=rnd()<.5?'rgba(150,150,150,.35)':'rgba(255,255,255,.3)';g.beginPath();g.ellipse(x+dx,y+dy,r*1.8,r*.6,a,0,7);g.fill()}}
  g.strokeStyle='rgba(60,60,60,.18)';g.lineWidth=1;for(let i=-h;i<w;i+=5){g.beginPath();g.moveTo(i,0);g.lineTo(i+h,h);g.stroke()}});
CAMO.map.repeat.set(1/26,1/26);CAMO.bump.repeat.set(1/26,1/26);

/* ---------- colourways (fixed SKUs) and materials ---------- */
const WAYS={
  teal:{enamel:0x0d3a41,metal:0xb39a6b,rough:.4},
  blackgold:{enamel:0x0e0e0e,metal:0xdcc08b,rough:.26},
  blacksilver:{enamel:0x0e0e0e,metal:0xd6d6d4,rough:.24},
  navy:{enamel:0x1c2944,metal:0xa29f99,rough:.4}};
const PO=f=>({polygonOffset:true,polygonOffsetFactor:f,polygonOffsetUnits:f});
const M={metal:{},brushed:{},enamel:{},camo:{},band:{},ep:{},br:{},
  lens:new THREE.MeshPhysicalMaterial({color:0xf4f6f8,roughness:.02,metalness:0,transparent:true,opacity:.16,clearcoat:1,envMapIntensity:1.6,depthWrite:false,side:THREE.DoubleSide}),
  dark:new THREE.MeshStandardMaterial({color:0x151515,metalness:.6,roughness:.5,...PO(-3)})};
for(const [k,w] of Object.entries(WAYS)){
  M.metal[k]=new THREE.MeshStandardMaterial({color:w.metal,metalness:1,roughness:w.rough*.7,envMapIntensity:1.8,...PO(-1)});
  M.brushed[k]=new THREE.MeshStandardMaterial({color:w.metal,metalness:1,roughness:w.rough+.12,envMapIntensity:1.6,...PO(-1)});
  M.enamel[k]=new THREE.MeshPhysicalMaterial({color:w.enamel,metalness:.15,roughness:.22,clearcoat:.8,clearcoatRoughness:.1,envMapIntensity:1.2,...PO(-2)});
  M.camo[k]=new THREE.MeshPhysicalMaterial({color:w.enamel,map:CAMO.map,bumpMap:CAMO.bump,bumpScale:.4,metalness:.35,roughness:.38,clearcoat:.5,envMapIntensity:1.3,...PO(-2)});
  M.band[k]=new THREE.MeshStandardMaterial({color:w.metal,map:BAND.map,bumpMap:BAND.bump,bumpScale:.8,metalness:.85,roughness:w.rough,envMapIntensity:1.8,...PO(-2)});
  M.ep[k]=new THREE.MeshStandardMaterial({color:w.metal,map:EPT.map,bumpMap:EPT.bump,bumpScale:.6,metalness:.85,roughness:w.rough*.9,envMapIntensity:1.8,...PO(-2)});
  M.br[k]=new THREE.MeshStandardMaterial({color:w.metal,map:brMap,bumpMap:brBump,bumpScale:1,metalness:.8,roughness:w.rough,envMapIntensity:1.8,...PO(-2)});
}

/* ---------- geometry helpers ---------- */
const parts=[];
function mk(geo,role,part,parent){const m=new THREE.Mesh(geo,new THREE.MeshBasicMaterial());m.userData={role,part};parts.push(m);parent.add(m);return m}
const V=(x,y)=>new THREE.Vector2(x,y);
const ext=(shape,depth,bevel=.2,seg=3,curve=24)=>new THREE.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:seg,curveSegments:curve});
function smooth(g){g.deleteAttribute('normal');g=mergeVertices(g,1e-3);g.computeVertexNormals();return g}
function linUV(g,[au,bu,av,bv]){const p=g.attributes.position,uv=g.attributes.uv;for(let i=0;i<p.count;i++)uv.setXY(i,au*p.getX(i)+bu,av*p.getY(i)+bv);uv.needsUpdate=true;return g}
const C=V(...GEO.c);
const ring=(pts,d)=>pts.map(([x,y])=>{const dx=x-C.x,dy=y-C.y,r=Math.hypot(dx,dy);return V(C.x+dx*(1+d/r),C.y+dy*(1+d/r))});
function annulus(o,h){const s=new THREE.Shape(o);h=h.slice();if(THREE.ShapeUtils.isClockWise(h)===THREE.ShapeUtils.isClockWise(o))h.reverse();s.holes.push(new THREE.Path(h));return s}
function ribbon(pts,z0,z1,tile){ // outward-facing wall along a closed outline, u = arc length, v = depth
  const n=pts.length;let L=0;for(let i=1;i<=n;i++)L+=pts[i%n].distanceTo(pts[i-1]);const t=L/Math.round(L/tile);
  const pos=[],uv=[],idx=[];let s=0;
  for(let i=0;i<=n;i++){const p=pts[i%n];if(i)s+=p.distanceTo(pts[i-1]);pos.push(p.x,p.y,z0,p.x,p.y,z1);uv.push(s/t,0,s/t,1)}
  for(let i=0;i<n;i++){const a=2*i;idx.push(a,a+2,a+1,a+1,a+2,a+3)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
  const nr=g.attributes.normal;if(nr.getX(0)*(pts[0].x-C.x)+nr.getY(0)*(pts[0].y-C.y)<0){g.setIndex(idx.map((v,i)=>idx[i-i%3+[0,2,1][i%3]]));g.computeVertexNormals()}
  return g}

/* ---------- build ---------- */
const frame=new THREE.Group();
const WRAP=.07; // face form: each lens turns ~4° about the bridge

// bridge: stepped arch traced from the front photograph, engraving projected from the same photo
const brShape=new THREE.Shape(GEO.BR.map(([x,y])=>V(x,y)));
const brG=new THREE.Group();brG.position.z=-.75;frame.add(brG);
let br=ext(brShape,1.5,.3,3);br.translate(0,0,-1.5);mk(smooth(br),'metal','brow',brG);
mk(linUV(new THREE.ShapeGeometry(brShape,12),GEO.BRUV),'br','brow',brG).position.z=.39;

const {LENS,EN_IN,EN_OUT,WIRE}=GEO; // traced: lens edge, enamel ring inner/outer, eyewire outer
function lensGeo(){ // gently curved demo lens filling the rim opening
  const pts=ring(LENS,.3);const inside=(x,y)=>{let c=false;for(let i=0,j=pts.length-1;i<pts.length;j=i++){const a=pts[i],b=pts[j];if((a.y>y)!==(b.y>y)&&x<(b.x-a.x)*(y-a.y)/(b.y-a.y)+a.x)c=!c}return c};
  const st=.6,pos=[],idx=[],ids=new Map(),R=160;
  const vid=(i,j)=>{const k=i+'|'+j;if(!ids.has(k)){const x=i*st,y=j*st;ids.set(k,pos.length/3);pos.push(x,y,-.3-((x-C.x)**2+(y-C.y)**2)/(2*R)*.6)}return ids.get(k)};
  for(let i=Math.floor(10/st);i<=Math.ceil(61/st);i++)for(let j=Math.floor(-24/st);j<=Math.ceil(24/st);j++){
    if(!inside((i+.5)*st,(j+.5)*st))continue;const a=vid(i,j),b=vid(i+1,j),c=vid(i+1,j+1),d=vid(i,j+1);idx.push(a,b,c,a,c,d)}
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return g}
const lensG=lensGeo();
// rim: titanium eyewire (traced outer edge), enamel colour ring on the front, engraved/knurled side band
let rimG=ext(annulus(ring(WIRE,-.25),ring(LENS,.25)),2.6,.25,3);rimG.translate(0,0,-1.9);rimG=smooth(rimG);
let enG=ext(annulus(ring(EN_OUT,-.12),ring(EN_IN,.12)),.3,.12,3);enG.translate(0,0,1.0);enG=smooth(enG);
const bandG=ribbon(ring(WIRE,.09),-1.9,.7,4);

// temple: outline, teardrop cutout and coloured section traced from the side photograph (u = mm back from the hinge, v = mm up)
const TT=1.1; // temple thickness
const sh2=(a)=>a.map(([x,y])=>V(x,y));
function shapeWithHole(o,h){const s=new THREE.Shape(o);if(h){h=h.slice();if(THREE.ShapeUtils.isClockWise(h)===THREE.ShapeUtils.isClockWise(o))h.reverse();s.holes.push(new THREE.Path(h))}return s}
const tBase=smooth(ext(shapeWithHole(sh2(GEO.TEMPLE.outer),sh2(GEO.TEMPLE.hole)),TT,.15,3,8));
const tTeal=smooth(ext(new THREE.Shape(sh2(GEO.TEMPLE.teal)),TT,.2,3,8)); // colour wraps the edges; flame and diamond stay metal
// end-piece front plate traced from the front photograph: slanted inner end over the rim, beaded face
const epShape=new THREE.Shape(sh2(GEO.EP));
// the end-piece is one bent strip, 1.4 mm thick like the temple: front plate here, the side piece continues it round the corner
let epG=ext(epShape,1.1,.15,3);epG.translate(0,0,.65);epG=smooth(epG);
const epFace=linUV(new THREE.ShapeGeometry(epShape,8),[1/4,0,.195,-1.859]);
// nose pad: teardrop traced from the side photograph (narrow top, full lower half)
function padShape(){const D=GEO.PAD,n=D.length,vs=D.map(d=>d[1]),v0=vs[0],v1=vs[n-1];
  const fitW=(()=>{const X=D.map(([w,v])=>[1,(v-v0)/(v1-v0),((v-v0)/(v1-v0))**2,((v-v0)/(v1-v0))**3]),y=D.map(d=>d[0]);const A=[0,1,2,3].map(i=>[0,1,2,3].map(j=>X.reduce((s,r)=>s+r[i]*r[j],0))),b=[0,1,2,3].map(i=>X.reduce((s,r,k)=>s+r[i]*y[k],0));
    for(let i=0;i<4;i++){for(let k=i+1;k<4;k++){const f=A[k][i]/A[i][i];for(let j=i;j<4;j++)A[k][j]-=f*A[i][j];b[k]-=f*b[i]}}const c=[0,0,0,0];for(let i=3;i>=0;i--){c[i]=(b[i]-[0,1,2,3].slice(i+1).reduce((s,j)=>s+A[i][j]*c[j],0))/A[i][i]}return t=>c[0]+c[1]*t+c[2]*t*t+c[3]*t**3})();
  const P=Array.from({length:24},(_,i)=>{const t=i/23;return [fitW(t),v0+(v1-v0)*t]}),R=P.map(([w,v])=>V(w,v)),L=P.map(([w,v])=>V(-w,v)).reverse(),pts=[...R];
  const [wb,vb]=P[P.length-1],[wt,vt]=P[0];
  for(let i=1;i<12;i++){const a=-Math.PI*i/12;pts.push(V(wb*Math.cos(a),vb+wb*.45*Math.sin(a)))}
  pts.push(...L);for(let i=1;i<12;i++){const a=Math.PI-Math.PI*i/12;pts.push(V(wt*Math.cos(a),vt+wt*.45*Math.sin(a)))}
  return new THREE.Shape(pts)}
let padG=ext(padShape(),.45,.3,3,8);padG.translate(0,0,-.22);padG=smooth(padG);

function side(sign){
  const g=new THREE.Group();g.scale.x=sign;g.rotation.y=sign*WRAP;frame.add(g);
  mk(lensG,'lens','lens',g).renderOrder=3;
  mk(rimG,'metal','lens',g);mk(enG,'enamel','lens',g);mk(bandG,'band','lens',g);
  // end-piece: traced plate sits in front of the enamel ring, wraps round the corner and back to the hinge
  const ep=new THREE.Group();g.add(ep);
  mk(epG,'metal','end',ep);
  mk(epFace,'ep','end',ep).position.z=1.99;
  // end-piece side + temple share one frame at the outer front corner, turned back by the face-form angle so the temple runs on in line.
  // side piece traced from the side photograph: 6.5 mm long, the same 4.6 mm height as the temple, beaded rows on its outer face
  const hg=new THREE.Group();hg.position.set(67.0,0,1.9);hg.rotation.y=-WRAP;ep.add(hg);
  // same section as the temple where they meet (4.6 mm tall, temple thickness, same edge radius), outer faces flush: no step at the joint
  const EPW=2.0,EPY=12.03,EPH=4.35,EPL=6.0; // solid block, 3 mm deep inward (wider than the temple, as in the close-up); outer faces flush // outer end of the front plate: 9.85-14.2 mm
  // corner: the strip turns through a 45° chamfered face (close-up photo), so front plate, chamfer and side read as one bent piece
  // one solid block seen from above: front flush with the front plate, outer front corner cut at 45° (the chamfered face in the close-up)
  const CH=1.7,FZ=-.15;
  { // outer front corner swept round on a radius, so the front plate flows into the side piece (top view)
    const R=1.7,pts=[V(-EPW,EPL),V(0,EPL),V(0,-FZ+R)];
    for(let i=1;i<12;i++){const t=Math.PI/2*i/12;pts.push(V(-R+R*Math.cos(t),-FZ+R-R*Math.sin(t)))}
    pts.push(V(-R,-FZ),V(-EPW,-FZ));
    let bg=new THREE.ExtrudeGeometry(new THREE.Shape(pts),{depth:EPH-.3,bevelEnabled:true,bevelThickness:.15,bevelSize:.15,bevelSegments:2,curveSegments:12});
    bg.rotateX(-Math.PI/2);bg.translate(0,EPY-EPH/2+.15,0);bg=smooth(bg);mk(bg,'metal','end',hg); }
  // beaded panel on the front 3.7 mm of the outer side face, plain brushed behind it (side photograph)
  const sfx=mk(linUV(new THREE.PlaneGeometry(3.3,EPH-.3),[1/4,0,.195,.5]),'ep','end',hg);sfx.position.set(.09,EPY,-CH-1.75);sfx.rotation.y=Math.PI/2;
  // hinge screw seen from below at the joint
  { const hs=mk(new THREE.CylinderGeometry(.55,.55,.3,16),'metal','end',hg);hs.position.set(-EPW/2,EPY-EPH/2-.12,-EPL+.4);
    for(const r of [0,Math.PI/2]){const sl=mk(new THREE.BoxGeometry(.7,.1,.1),'dark','end',hg);sl.position.set(-EPW/2,EPY-EPH/2-.28,-EPL+.4);sl.rotation.y=r} }
  const HZ=-EPL+.2,HX=-EPW/2; // hinge sits inside the joint, hidden like the real one
  mk(new THREE.CylinderGeometry(.25,.25,3.7,12),'dark','end',hg).position.set(HX,EPY,HZ);
  for(let i=0;i<3;i++){const k=mk(new THREE.CylinderGeometry(.5,.5,1.08,20),'metal','end',hg);k.position.set(HX,EPY-1.2+i*1.2,HZ)}
  // temple: local x runs back from the hinge, y up, z outward (thickness); outer face flush with the end-piece, front edge butting it
  const tg=new THREE.Group();tg.position.set(-TT-.15,12.17,-EPL);tg.rotation.y=Math.PI/2;tg.scale.y=EPH/4.6;hg.add(tg); // traced temple is 4.6 mm at the joint: scale to the end-piece height
  mk(tBase,'brushed','temple',tg);mk(tTeal,'camo','temple',tg);
  // engraving on the diamond: two rings and a dividing line
  for(const [u,v] of [[72.1,-5.73],[69.3,-5.57]]){const r=mk(new THREE.TorusGeometry(.56,.11,8,24),'dark','temple',tg);r.position.set(u,v,TT+.17)}
  {const ln=mk(new THREE.BoxGeometry(.14,3.6,.08),'dark','temple',tg);ln.position.set(70.7,-5.65,TT+.16);ln.rotation.z=-.077}
  // nose pad assembly retraced from the close-ups: a flat pad arm welded down the back of the rim beside the bridge foot,
  // a pad box with a small screw at the top, a clamp tip with a screw at the bottom, and the teardrop pad hung from the box
  const RB=-2.25; // back face of the rim (local z)
  // pad arm: a flat strip welded to the back of the eyewire, following its curve down the nasal side
  const armPts=ring(EN_IN,.25).filter(p=>p.x<C.x&&p.y<3.6&&p.y>-7.2).sort((a,b)=>b.y-a.y).map(p=>new THREE.Vector3(p.x,p.y,RB-.35));
  const armC=new THREE.CatmullRomCurve3(armPts);
  { const tg2=new THREE.TubeGeometry(armC,40,.42,8);const q=tg2.attributes.position; // flatten the tube into a strip (thin along z)
    for(let i=0;i<q.count;i++)q.setZ(i,RB-.35+(q.getZ(i)-(RB-.35))*.55);q.needsUpdate=true;tg2.computeVertexNormals();mk(tg2,'metal','brow',g); }
  // from the third angle: small eye at the top of the arm, the pad box mid-way with its screw beside it, the pad held close to the box
  const top=armC.getPoint(0),mid=armC.getPoint(.45);
  const eye=mk(new THREE.TorusGeometry(.55,.18,8,20),'metal','brow',g);eye.position.set(top.x-.1,top.y+.3,RB-.6);eye.rotation.y=Math.PI/2;
  const pbox=mk(new RoundedBoxGeometry(1.3,2.6,1.6,2,.25),'metal','brow',g);pbox.position.set(mid.x-.25,mid.y,RB-1.2);
  const scr2=mk(new THREE.CylinderGeometry(.5,.5,.3,16),'dark','brow',g);scr2.position.set(mid.x+.45,mid.y-1.6,RB-1.0);scr2.rotation.z=Math.PI/2;
  for(const r of [0,Math.PI/2]){const sl=mk(new THREE.BoxGeometry(.08,.7,.1),'metal','brow',g);sl.position.set(mid.x+.62,mid.y-1.6,RB-1.0);sl.rotation.x=r}
  const pad=mk(padG,'brushed','brow',g);pad.position.set(mid.x-1.0,mid.y+1.2,RB-2.5);pad.rotation.y=.93;
  { const st=mk(new THREE.CylinderGeometry(.35,.35,1.3,10),'metal','brow',g);st.position.set(mid.x-.6,mid.y,RB-2.0);st.rotation.x=Math.PI/2; }
}
side(1);side(-1);

const root=new THREE.Group();root.add(frame);scene.add(root);
const box=new THREE.Box3().setFromObject(frame),ctr=box.getCenter(new THREE.Vector3());
frame.position.sub(ctr);frame.position.y+=4;

/* ---------- materials by state + highlight ---------- */
const hiCache=new Map();
const hi=(m)=>{if(!hiCache.has(m)){const c=m.clone();c.emissive=new THREE.Color(0xb08a52);c.emissiveIntensity=.45;hiCache.set(m,c)}return hiCache.get(m)};
function applyMaterials(){
  const w=window.PV?.cfg?.way||'teal';const p=window.PV?.part;
  for(const m of parts){const r=m.userData.role;
    const base=r==='lens'?M.lens:r==='dark'?M.dark:M[r][w];
    m.material=p&&m.userData.part===p&&r!=='lens'?hi(base):base}
}
applyMaterials();
