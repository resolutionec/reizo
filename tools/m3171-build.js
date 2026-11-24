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
  for(let i=0;i<220;i++){g.strokeStyle=`rgba(${rnd()<.5?40:255},${rnd()<.5?40:255},${rnd()<.5?40:255},${.05+rnd()*.08})`;g.lineWidth=1+rnd()*1.5;const y=rnd()*h;g.beginPath();g.moveTo(0,y);g.lineTo(w,y+rnd()*2-1);g.stroke()}
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
  M.camo[k]=new THREE.MeshPhysicalMaterial({color:w.enamel,map:CAMO.map,bumpMap:CAMO.bump,bumpScale:.4,metalness:.35,roughness:.38,clearcoat:.5,envMapIntensity:1.3});
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

// temple centre line (side profile, mm): straight run sloping 4.4° down, a bend over the ear, then the drop to the tip
const TL=145,TS=104,TR=8,TB=.62,tailA=-.08-TB; // lengths, bend radius, bend angle
function cl(t){ // point + unit tangent at arc length t
  const a0=-.077;
  if(t<=TS)return {p:V(t*Math.cos(a0),t*Math.sin(a0)),d:V(Math.cos(a0),Math.sin(a0))};
  const pS=V(TS*Math.cos(a0),TS*Math.sin(a0)),bl=TR*TB;
  if(t<=TS+bl){const a=a0-(t-TS)/TR,cx=pS.x+TR*Math.sin(a0),cy=pS.y-TR*Math.cos(a0);return {p:V(cx-TR*Math.sin(a),cy+TR*Math.cos(a)),d:V(Math.cos(a),Math.sin(a))}}
  const e=cl(TS+bl),a=a0-TB;return {p:V(e.p.x+(t-TS-bl)*Math.cos(a),e.p.y+(t-TS-bl)*Math.sin(a)),d:V(Math.cos(a),Math.sin(a))};
}
const lerp=(a,b,f)=>a+(b-a)*Math.min(1,Math.max(0,f));
const tw=t=>t<3?3.9:t<74?lerp(3.9,3.0,(t-3)/71):t<104?lerp(3.0,2.5,(t-74)/30):t<TL-34?2.5:lerp(2.5,6.6,Math.sin(Math.PI/2*Math.min(1,(t-(TL-34))/28))); // height
const off=(t,h)=>{const {p,d}=cl(t);return V(p.x-d.y*h,p.y+d.x*h)};
function tempPts(t0,t1,cap,hw=t=>tw(t)/2,st=1){const L=[],R=[];for(let t=t0;t<=t1+1e-6;t+=st){L.push(off(t,hw(t)));R.push(off(t,-hw(t)))}
  const pts=[...L];if(cap){const {p,d}=cl(t1),r=hw(t1),a0=Math.atan2(d.x,-d.y);for(let i=1;i<16;i++){const a=a0-Math.PI*i/16;pts.push(V(p.x+r*Math.cos(a),p.y+r*Math.sin(a)))}}
  pts.push(...R.reverse());return pts}
const tempShape=(t0,t1,cap)=>new THREE.Shape(tempPts(t0,t1,cap));
const TT=1.1; // temple thickness
const tFront=smooth(ext(tempShape(0,74,false),TT,.18,3));
const rearP=tempPts(74,TL-3.2,true),rearS=new THREE.Shape(rearP);
{const t0=TL-27,hp=tempPts(t0,TL-3.2,true,t=>Math.max(.05,tw(t)/2-1.05)*Math.min(1,(t-t0)/9+.05),.5);
 if(THREE.ShapeUtils.isClockWise(hp)===THREE.ShapeUtils.isClockWise(rearP))hp.reverse();rearS.holes.push(new THREE.Path(hp))}
const tRear=smooth(ext(rearS,TT,.18,3));
// ornaments: flame inlay by the hinge, diamond plate with two engraved dots where the colour ends
const flame=new THREE.Shape([[2.5,1.25],[5.5,1.2],[8.5,.75],[12.5,0],[8.5,-.75],[5.5,-1.2],[2.5,-1.25]].map(([u,v])=>off(u,v)));
const diamond=new THREE.Shape([[-6.2,0],[-3,1.05],[-1.6,2.35],[0,1.6],[1.6,2.35],[3,1.05],[6.2,0],[3,-1.05],[1.6,-2.35],[0,-1.6],[-1.6,-2.35],[-3,-1.05]].map(([u,v])=>off(74+u,v)));

function side(sign){
  const g=new THREE.Group();g.scale.x=sign;g.rotation.y=sign*WRAP;frame.add(g);
  mk(lensG,'lens','lens',g).renderOrder=3;
  mk(rimG,'metal','lens',g);mk(enG,'enamel','lens',g);mk(bandG,'band','lens',g);
  // end-piece: beaded front plate over the rim shoulder, wrapping round the corner and back to the hinge
  const ep=new THREE.Group();g.add(ep);
  const pl=mk(new RoundedBoxGeometry(11.2,4.1,2.6,3,.55),'metal','end',ep);pl.position.set(61.4,12.4,-.15);
  const face=mk(linUV(new THREE.PlaneGeometry(10.2,3.6),[1/4,0,1/4,.5]),'ep','end',ep);face.position.set(61.4,12.4,1.24);
  const arm=mk(new RoundedBoxGeometry(2.4,4.1,8.4,3,.55),'metal','end',ep);arm.position.set(65.8,12.4,-3.9);
  const sfx=mk(linUV(new THREE.PlaneGeometry(8.0,3.6),[1/4,0,1/4,.5]),'ep','end',ep);sfx.position.set(67.09,12.4,-3.9);sfx.rotation.y=Math.PI/2;
  // hinge below the end-piece: three knuckles on a pin, slotted screw on top
  const HZ=-8.6,HX=65.2;
  mk(new THREE.CylinderGeometry(.42,.42,4.6,12),'dark','end',ep).position.set(HX,12.4,HZ);
  for(let i=0;i<3;i++){const k=mk(new THREE.CylinderGeometry(.95,.95,1.15,20),'metal','end',ep);k.position.set(HX,10.9+i*1.5,HZ)}
  const sh=mk(new THREE.CylinderGeometry(.95,.95,.35,20),'metal','end',ep);sh.position.set(HX,14.65,HZ);
  const sl=mk(new THREE.BoxGeometry(1.5,.12,.22),'dark','end',ep);sl.position.set(HX,14.85,HZ);sl.rotation.y=.6;
  // temple: local x runs back from the hinge, y up, z outward (thickness)
  const tg=new THREE.Group();tg.position.set(66.9-TT-.18,12.4,HZ+.4);tg.rotation.y=Math.PI/2-WRAP;g.add(tg); // straight back, no splay
  mk(tFront,'camo','temple',tg);mk(tRear,'brushed','temple',tg);
  const fl=mk(ext(flame,.15,.06,2),'metal','temple',tg);fl.position.z=TT+.2+.05;
  const dm=mk(smooth(ext(diamond,.35,.12,2)),'metal','temple',tg);dm.position.z=TT+.12;
  for(const u of [-1.9,1.9]){const {p}=cl(74+u);const r=mk(new THREE.TorusGeometry(.55,.13,8,20),'dark','temple',tg);r.position.set(p.x,p.y,TT+.72)}
  {const {p,d}=cl(74);const ln=mk(new THREE.BoxGeometry(.16,2.9,.12),'dark','temple',tg);ln.position.set(p.x,p.y,TT+.7);ln.rotation.z=Math.atan2(d.y,d.x)}
  // nose pad on a pad arm from behind the bridge foot
  const pa=new THREE.CatmullRomCurve3([[10.6,3.4,-1.6],[11.2,.4,-3.6],[10.4,-3.6,-5.6],[9.3,-6.2,-6.3]].map(a=>new THREE.Vector3(...a)));
  mk(new THREE.TubeGeometry(pa,24,.36,8),'metal','brow',g);
  const box=mk(new RoundedBoxGeometry(1.6,1.8,1.4,2,.3),'metal','brow',g);box.position.set(9.3,-6.4,-6.3);
  const pad=mk(new THREE.SphereGeometry(1,28,18),'metal','brow',g);pad.scale.set(2.4,4.7,.6);pad.position.set(8.1,-7.2,-6.6);pad.rotation.set(.12,-1.05,.08);
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
