/* ---------- Model M5006: rimless titanium sunglasses, traced from the front photograph (mm; lens centre height = 0) ---------- */
const G5=__GEO5__;
const frame5=new THREE.Group();
// colourways: frame finish / lens tint (top -> bottom of the gradient, alpha top -> bottom)
const FIN5={pw:{c:0xdedcd8,r:.2},ag:{c:0xb39b72,r:.42},bg:{c:0xd8bd84,r:.34}};
const WAYS5={
  'pw-cobalt':{fin:'pw',lens:['#8fa2d8','#c7d0ec',.82,.55]},
  'pw-violet':{fin:'pw',lens:['#b98fb8','#f3ebf3',.78,.22]},
  'ag-sage':{fin:'ag',lens:['#5f7a4c','#5f7a4c',.9,.9]},
  'bg-grey':{fin:'bg',lens:['#4b4b4b','#4b4b4b',.9,.9]},
  'bg-blue':{fin:'bg',lens:['#8e86d8','#f0eefc',.8,.22]}};
function tintTex([t,b,at,ab]){const c=document.createElement('canvas');c.width=4;c.height=256;const g=c.getContext('2d');
  const hex=(h,a)=>`rgba(${parseInt(h.slice(1,3),16)},${parseInt(h.slice(3,5),16)},${parseInt(h.slice(5,7),16)},${a})`;
  const gr=g.createLinearGradient(0,0,0,256);gr.addColorStop(0,hex(t,at));gr.addColorStop(.12,hex(t,at));gr.addColorStop(1,hex(b,ab));g.fillStyle=gr;g.fillRect(0,0,4,256);
  const x=new THREE.CanvasTexture(c);x.colorSpace=THREE.SRGBColorSpace;return x}
// engraving for the end-piece arm and the temple plate: leafy scrolls between beaded edges (generic, tinted by the metal)
const ENG5=canvasTex(512,128,(g,w,h)=>{g.fillStyle='#e6e6e6';g.fillRect(0,0,w,h);g.fillStyle='#8a8a8a';
  for(const y of [10,h-10])for(let x=6;x<w;x+=12){g.beginPath();g.arc(x,y,3.2,0,7);g.fill()}
  g.strokeStyle='#2a2a2a';g.lineCap='round';
  for(let x=0;x<w;x+=96){g.lineWidth=5;g.beginPath();g.moveTo(x+8,h/2+18);g.bezierCurveTo(x+30,h/2-40,x+64,h/2+40,x+90,h/2-14);g.stroke();
    g.lineWidth=3.5;g.beginPath();g.ellipse(x+48,h/2,12,6,.6,0,7);g.stroke();g.beginPath();g.moveTo(x+60,h/2+22);g.quadraticCurveTo(x+76,h/2+2,x+70,h/2-22);g.stroke()}});
// tip collar: C-shaped scroll curls between two plain rims (tip close-up); one tile = a quarter of the circumference
const COL5=canvasTex(256,128,(g,w,h)=>{g.fillStyle='#e4e4e4';g.fillRect(0,0,w,h);g.fillStyle='#9a9a9a';g.fillRect(0,0,w,10);g.fillRect(0,h-10,w,10);
  g.strokeStyle='#1e1e1e';g.lineCap='round';g.lineWidth=9;
  for(const [cx,dir] of [[64,1],[192,-1]]){g.beginPath();g.arc(cx,h/2,24,dir>0?.35*Math.PI:1.35*Math.PI,dir>0?2.1*Math.PI:3.1*Math.PI);g.stroke();
    g.beginPath();g.arc(cx+dir*8,h/2+4,10,0,Math.PI*1.6);g.stroke();
    g.beginPath();g.moveTo(cx+dir*26,h/2+6);g.quadraticCurveTo(cx+dir*48,h/2+30,cx+dir*60,h/2+4);g.stroke()}});
COL5.map.repeat.set(4,1);COL5.bump.repeat.set(4,1);
const armMap5=texLoader.load(G5.ARMTEX);armMap5.colorSpace=THREE.SRGBColorSpace;armMap5.anisotropy=8;const armBump5=texLoader.load(G5.ARMTEX); // end-piece engraving from the close-up
const brMap5=texLoader.load(G5.BRTEX);brMap5.colorSpace=THREE.SRGBColorSpace;brMap5.anisotropy=8;const brBump5=texLoader.load(G5.BRTEX);
const M5={metal:{},brushed:{},eng:{},br:{},lens:{},
  dark:new THREE.MeshStandardMaterial({color:0x141414,metalness:.4,roughness:.45,...PO(-3)}),
  tip:new THREE.MeshPhysicalMaterial({color:0x17181a,roughness:.25,clearcoat:1,clearcoatRoughness:.08}),
  pad:new THREE.MeshPhysicalMaterial({color:0xc9cdd2,roughness:.12,transparent:true,opacity:.32,depthWrite:false,clearcoat:1,envMapIntensity:1.6})};
for(const [k,f] of Object.entries(FIN5)){
  M5.metal[k]=new THREE.MeshStandardMaterial({color:f.c,metalness:1,roughness:f.r*.7,envMapIntensity:1.9,...PO(-1)});
  M5.brushed[k]=new THREE.MeshStandardMaterial({color:f.c,metalness:.85,roughness:f.r+.12,envMapIntensity:1.6,...PO(-1)});
  M5.eng[k]=new THREE.MeshStandardMaterial({color:f.c,map:ENG5.map,bumpMap:ENG5.bump,bumpScale:.7,metalness:.85,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
  (M5.col||(M5.col={}))[k]=new THREE.MeshStandardMaterial({color:f.c,map:COL5.map,bumpMap:COL5.bump,bumpScale:.6,metalness:.85,roughness:f.r*.9,envMapIntensity:1.8,...PO(-2)});
  (M5.arm||(M5.arm={}))[k]=new THREE.MeshStandardMaterial({color:f.c,map:armMap5,bumpMap:armBump5,bumpScale:.5,metalness:.82,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
  M5.br[k]=new THREE.MeshStandardMaterial({color:f.c,map:brMap5,bumpMap:brBump5,bumpScale:.25,metalness:.82,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
}
for(const [k,w] of Object.entries(WAYS5))M5.lens[k]=new THREE.MeshPhysicalMaterial({color:0xffffff,map:tintTex(w.lens),transparent:true,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:1.4,depthWrite:false,side:THREE.DoubleSide});

const LZ=0; // lens front face
const lensG5=(()=>{ // smooth rimless lens: concentric rings from the exact traced outline in to the centre, front and back, plus edge wall
  const P0=G5.LENS,sag=(x,y)=>((x-34)**2+y*y)/440,T=1.6,R=28;let cx=0,cy=0,y0=1e9,y1=-1e9;
  for(const [x,y] of P0){cx+=x/P0.length;cy+=y/P0.length;y0=Math.min(y0,y);y1=Math.max(y1,y)}
  const n=P0.length,pos=[],uv=[],idx=[];const V2=(x,y,z)=>{pos.push(x,y,z);uv.push(.5,(y-y0)/(y1-y0));return pos.length/3-1};
  for(const back of [0,1]){const base=pos.length/3;
    for(let k=0;k<R;k++){const f=1-k/R;for(const [x,y] of P0){const X=cx+(x-cx)*f,Y=cy+(y-cy)*f;V2(X,Y,-sag(X,Y)-(back?T:0))}}
    const c=V2(cx,cy,-sag(cx,cy)-(back?T:0));
    for(let k=0;k<R-1;k++)for(let i=0;i<n;i++){const a=base+k*n+i,b=base+k*n+(i+1)%n,a2=a+n,b2=b+n;back?idx.push(a,a2,b,b,a2,b2):idx.push(a,b,a2,b,b2,a2)}
    for(let i=0;i<n;i++){const a=base+(R-1)*n+i,b=base+(R-1)*n+(i+1)%n;back?idx.push(a,c,b):idx.push(a,b,c)}}
  for(let i=0;i<n;i++){const a=i,b=(i+1)%n,a2=R*n+1+i,b2=R*n+1+(i+1)%n;idx.push(a,a2,b,b,a2,b2)} // edge wall
  const g=new THREE.BufferGeometry();g.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));g.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return g})();
// bridge: flat stepped arch traced from the front, slot cutouts, engraving projected from the close-up
const brS5=new THREE.Shape(G5.BR.map(([x,y])=>V(x,y)));
for(const sl of G5.SLOTS){let h=sl.map(([x,y])=>V(x,y));if(THREE.ShapeUtils.isClockWise(h)===THREE.ShapeUtils.isClockWise(brS5.getPoints()))h.reverse();brS5.holes.push(new THREE.Path(h))}
let brG5=ext(brS5,1.0,.22,3,8);brG5.translate(0,0,-1.55);brG5=smooth(brG5);
const brFace5=linUV(new THREE.ShapeGeometry(brS5,8),G5.BRUV);

const MT=G5.MOUNTS;
const SAG5=(x,y)=>((x-34)**2+y*y)/440,LT=1.6; // lens front-surface sag and lens thickness
function neckPiece(g,bx,by,fx,fy){ // symmetric: round bulb at the bolt, waisted neck flaring into the fin
  const dx=fx-bx,dy=fy-by,Ln=Math.hypot(dx,dy),r=1.45,sh=new THREE.Shape(),a0=Math.atan2(.82,1.15);
  sh.moveTo(Ln,1.0);sh.quadraticCurveTo(Ln*.55,.55,1.15,.82);sh.absarc(0,0,r,a0,-a0,false);sh.quadraticCurveTo(Ln*.55,-.55,Ln,-1.0);sh.closePath();
  let ng=ext(sh,.8,.32,4,32);ng.translate(0,0,.32);ng.rotateZ(Math.atan2(dy,dx));ng.translate(bx,by,0);
  {const q=ng.attributes.position;for(let i=0;i<q.count;i++)q.setZ(i,q.getZ(i)-SAG5(q.getX(i),q.getY(i)))}
  ng=smooth(ng);mk(ng,'k:metal','end',g)}
function lensFin(g,x,y,up,down,W=1.25){ // edge clamp: a rounded strip that wraps the lens edge for the full lens depth, swept along the traced outline
  const L=G5.LENS,n=L.length;let i0=0,dm=1e9;L.forEach(([a,b],i)=>{const d=(a-x)**2+(b-y)**2;if(d<dm){dm=d;i0=i}});
  const res=[];for(let k=-140;k<=140;k++){const i=(i0+k+n)%n;res.push([k,L[i]])}
  let acc={},s0=0;acc[0]=0;for(let k=1;k<=140;k++){s0+=Math.hypot(L[(i0+k)%n][0]-L[(i0+k-1)%n][0],L[(i0+k)%n][1]-L[(i0+k-1)%n][1]);acc[k]=s0}
  s0=0;for(let k=-1;k>=-140;k--){s0-=Math.hypot(L[(i0+k+n)%n][0]-L[(i0+k+1+n)%n][0],L[(i0+k+n)%n][1]-L[(i0+k+1+n)%n][1]);acc[k]=s0}
  const upDir=L[(i0+3)%n][1]>L[i0][1]?1:-1;const lo=-down,hi=up;
  const pts=res.filter(([k])=>{const a=acc[k]*upDir;return a>=lo&&a<=hi}).map(([k,p])=>[acc[k]*upDir,p]).sort((u,v)=>u[0]-v[0]);
  const cv=new THREE.CatmullRomCurve3(pts.map(([,[px,py]])=>new THREE.Vector3(px,py,0)),false,'centripetal');
  const N=48,RS=20,pos=[],idx=[];let cx=0,cy=0;for(const [px,py] of L){cx+=px/n;cy+=py/n}
  for(let i=0;i<=N;i++){const t=i/N,p=cv.getPoint(t),d=cv.getTangent(t);let nx=d.y,ny=-d.x;if(nx*(p.x-cx)+ny*(p.y-cy)<0){nx=-nx;ny=-ny}
    const e=Math.sin(Math.PI*Math.min(1,Math.min(t,1-t)*7)/2)**.5,w=W*(.35+.65*e),zf=-SAG5(p.x,p.y)+.38,zb=-SAG5(p.x,p.y)-LT-.12,zc=(zf+zb)/2,D=(zf-zb)*(.55+.45*e);
    for(let j=0;j<RS;j++){const th=j/RS*Math.PI*2,c=Math.cos(th),sn=Math.sin(th),sc=Math.sign(c)*Math.abs(c)**.45,ss=Math.sign(sn)*Math.abs(sn)**.45;
      const r=-.05+w/2+w/2*sc;pos.push(p.x+nx*r,p.y+ny*r,zc+D/2*ss)}}
  for(let i=0;i<N;i++)for(let j=0;j<RS;j++){const a=i*RS+j,b=i*RS+(j+1)%RS;idx.push(a,b,a+RS,b,b+RS,a+RS)}
  for(const [i,f] of [[0,1],[N,0]]){const c0=pos.length/3;let mx=0,my=0,mz=0;for(let j=0;j<RS;j++){mx+=pos[(i*RS+j)*3]/RS;my+=pos[(i*RS+j)*3+1]/RS;mz+=pos[(i*RS+j)*3+2]/RS}
    pos.push(mx,my,mz);for(let j=0;j<RS;j++){const a=i*RS+j,b=i*RS+(j+1)%RS;f?idx.push(a,c0,b):idx.push(a,b,c0)}}
  const geo=new THREE.BufferGeometry();geo.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));geo.setIndex(idx);geo.computeVertexNormals();
  // check outward-facing normals (sample a side vertex); flip winding if needed
  const nrm=geo.attributes.normal,p0=cv.getPoint(.5),j0=Math.floor(N/2)*RS;const vx=pos[j0*3]-p0.x,vy=pos[j0*3+1]-p0.y;
  if(nrm.getX(j0)*vx+nrm.getY(j0)*vy<0){const ix=geo.index.array;for(let k=0;k<ix.length;k+=3){const t=ix[k+1];ix[k+1]=ix[k+2];ix[k+2]=t}geo.computeVertexNormals()}
  mk(geo,'k:metal','end',g);return cv}
function hexPost(g,x,y,len){ // a bolt through the lens: elongated hex knob lying on the lens front with an axial hex head at its tip,
  // the shank passing through the lens, then a hex nut on the back face, a short threaded stub and a small hex end (close-ups)
  const sag=(x,y)=>((x-34)**2+y*y)/440,bx=x+len/2-.35,zf=-sag(x,y),zb=-2.1-sag(bx,y);
  const k=mk(new THREE.CylinderGeometry(1.0,.78,len,6),'k:metal','end',g);k.rotation.z=Math.PI/2;k.rotation.x=Math.PI/6;k.position.set(x,y,zf+.85);
  const tip=mk(new THREE.SphereGeometry(1.0,6,10),'k:metal','end',g);tip.rotation.set(Math.PI/6,0,Math.PI/2,'XZY');tip.scale.set(1,.55,1);tip.position.set(x+len/2,y,zf+.85);
  const head=mk(new THREE.CylinderGeometry(.62,.62,.55,6),'k:metal','end',g);head.rotation.x=Math.PI/2;head.position.set(bx,y,zf+1.85);
  const shank=mk(new THREE.CylinderGeometry(.38,.38,zf+1.6-zb,12),'k:metal','end',g);shank.rotation.x=Math.PI/2;shank.position.set(bx,y,(zf+1.6+zb)/2);
  const nut=mk(new THREE.CylinderGeometry(.95,.95,.85,6),'k:metal','end',g);nut.rotation.x=Math.PI/2;nut.position.set(bx,y,zb-.43);
  const stub=mk(new THREE.CylinderGeometry(.42,.42,1.2,12),'k:metal','end',g);stub.rotation.x=Math.PI/2;stub.position.set(bx,y,zb-1.45);
  const end=mk(new THREE.CylinderGeometry(.6,.6,.65,6),'k:metal','end',g);end.rotation.x=Math.PI/2;end.position.set(bx,y,zb-2.35);}
let padG5;{const sh=new THREE.Shape();const N=40;for(let i=0;i<=N;i++){const t=i/N*Math.PI*2,y=6.6*Math.cos(t),w=(y>0?1.55:2.05)*Math.sin(t);i?sh.lineTo(w,y):sh.moveTo(w,y)}
  padG5=ext(sh,.5,.22,3,8);padG5.translate(0,0,-.25);const q=padG5.attributes.position;for(let i=0;i<q.count;i++){const y=q.getY(i);q.setZ(i,q.getZ(i)+.02*y*y)}padG5=smooth(padG5);}
function side5(sign){
  const g=new THREE.Group();g.scale.x=sign;g.rotation.y=sign*.06;frame5.add(g);
  mk(lensG5,'k:lens','lens',g).renderOrder=3;
  // nasal mount retraced from the close-up as one cast piece: rounded paddle on the lens with a slotted bolt, a neck to the
  // cross-bar standing on the lens edge, and a block joining it to the bridge leg
  const [nx,ny]=G5.NBAR;
  { const [bx,by]=G5.NBOLT,yb=ny,sag=((bx-34)**2+by*by)/440,zb=-2.1-sag;
    // neck: tapers from the round bulb at the bolt to a flare where it meets the fin (close-up proportions)
    neckPiece(g,bx,by,nx+.2,yb);
    // polished hexagonal bolt head on the bulb, with its slot
    const hd=mk(new THREE.CylinderGeometry(1.15,1.2,.45,6),'k:metal','end',g);hd.rotation.set(Math.PI/2,0,0);hd.rotateY(Math.PI/6);hd.position.set(bx,by,-SAG5(bx,by)+1.62);
    // fin: a tall rounded blade standing on the lens edge, longer below the neck than above
    lensFin(g,nx+.35,yb,3.6,4.5,2.9); // wide enough to weld onto the bridge leg
    // square block joining the fin to the bridge leg
    const sk=mk(new THREE.CylinderGeometry(.38,.38,1.3-zb,12),'k:metal','end',g);sk.rotation.x=Math.PI/2;sk.position.set(bx,by,(1.3+zb)/2);
    const nt=mk(new THREE.CylinderGeometry(.95,.95,.85,6),'k:metal','end',g);nt.rotation.x=Math.PI/2;nt.position.set(bx,by,zb-.43);
    const sb=mk(new THREE.CylinderGeometry(.42,.42,1.2,12),'k:metal','end',g);sb.rotation.x=Math.PI/2;sb.position.set(bx,by,zb-1.45);
    const en=mk(new THREE.CylinderGeometry(.6,.6,.65,6),'k:metal','end',g);en.rotation.x=Math.PI/2;en.position.set(bx,by,zb-2.35);
 } // clamp behind the lens edge
  // end-piece retraced as one cast piece (close-up outline): rounded paddle on the lens with a slotted bolt, a neck to the slanted cross-bar
  // that grips the lens edge, then the engraved arm out to the corner; it turns back to the hinge from there
  const [tx,ty]=MT.temporal_post.knob,EX=G5.EP_END[0]-.55,EY=G5.EP_END[1];
  { // arm body = traced engraved arm outline only; paddle, neck and fin rebuilt as rounded solids from the close-up
    // (arm is the swept strap built below)
    const FX=57.6,FY=ty+.9,TL=.34; // fin centre, tilt (top leans toward the lens)
    neckPiece(g,tx,ty,FX+.2,FY);
    lensFin(g,FX,FY,3.9,3.7);
    // engraved face of the arm, UVs set per traced point
    // bolt through the paddle and the lens: slotted head in front, hex nut, stub and hex end behind (as on the nasal side)
    const sag=((tx-34)**2+ty*ty)/440,zb=-2.1-sag;
    const hd=mk(new THREE.CylinderGeometry(1.0,1.05,.45,6),'k:metal','end',g);hd.rotation.set(Math.PI/2,0,0);hd.rotateY(Math.PI/6);hd.position.set(tx,ty,-SAG5(tx,ty)+1.62);
    const sk=mk(new THREE.CylinderGeometry(.38,.38,1.3-zb,12),'k:metal','end',g);sk.rotation.x=Math.PI/2;sk.position.set(tx,ty,(1.3+zb)/2);
    const nt=mk(new THREE.CylinderGeometry(.95,.95,.85,6),'k:metal','end',g);nt.rotation.x=Math.PI/2;nt.position.set(tx,ty,zb-.43);
    const sb=mk(new THREE.CylinderGeometry(.42,.42,1.2,12),'k:metal','end',g);sb.rotation.x=Math.PI/2;sb.position.set(tx,ty,zb-1.45);
    const en=mk(new THREE.CylinderGeometry(.6,.6,.65,6),'k:metal','end',g);en.rotation.x=Math.PI/2;en.position.set(tx,ty,zb-2.35);
    // clamp block behind the lens edge under the cross-bar
    }
  { // end-piece arm (retraced): one strap that leaves the fin, sweeps round the corner and runs back to the hinge clevis,
    // waisted in the middle, with the engraving along its outer face
    const c=new THREE.CubicBezierCurve3(new THREE.Vector3(57.4,0,-SAG5(57.6,ty+.9)-.4),new THREE.Vector3(63.0,0,-SAG5(57.6,ty+.9)-.6),new THREE.Vector3(EX+.5,0,-2.4),new THREE.Vector3(EX+.45,0,-9.2));
    const N=60,T=.9,pos=[],uv=[],idx=[],fp=[],fuv=[],fidx=[];
    const H=t=>3.1-.75*Math.sin(Math.PI*Math.min(1,t*1.15))+.35*t,Y=t=>EY-.25+.25*t;
    for(let i=0;i<=N;i++){const t=i/N,p=c.getPoint(t),d=c.getTangent(t),n=new THREE.Vector3(d.z,0,-d.x); // outward normal in xz
      if(n.x+n.z<0)n.negate();const h=H(t),y=Y(t),o=p.clone(),inn=p.clone().addScaledVector(n,-T);
      const ring=[[o,h/2],[o,-h/2],[inn,-h/2],[inn,h/2]];for(const [q,dy] of ring)pos.push(q.x,y+dy,q.z);
      const fo=p.clone().addScaledVector(n,.02);fp.push(fo.x,y+h/2-.15,fo.z,fo.x,y-h/2+.15,fo.z);fuv.push(t,1,t,0)}
    for(let i=0;i<N;i++){for(let k=0;k<4;k++){const a=i*4+k,b=i*4+(k+1)%4,a2=a+4,b2=b+4;idx.push(a,b,a2,b,b2,a2)}
      const q=i*2;fidx.push(q,q+1,q+2,q+1,q+3,q+2)}
    const cap=(i0,flip)=>{const a=i0*4;flip?idx.push(a,a+2,a+1,a,a+3,a+2):idx.push(a,a+1,a+2,a,a+2,a+3)};cap(0,true);cap(N,false);
    let sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));sg.setIndex(idx);sg=sg.toNonIndexed();sg.computeVertexNormals();
    mk(sg,'k:metal','end',g);
    const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(fp,3));fg.setAttribute('uv',new THREE.Float32BufferAttribute(fuv,2));fg.setIndex(fidx);fg.computeVertexNormals();
    mk(fg,'k:arm','end',g); }

  // hinge block and screw at the back of the end-piece
  const hb=mk(new RoundedBoxGeometry(1.6,2.8,2.2,2,.3),'k:metal','end',g);hb.position.set(EX+.1,EY,-9.9);
  const hs=mk(new THREE.CylinderGeometry(.45,.45,.25,14),'k:dark','end',g);hs.position.set(EX+.1,EY-1.5,-9.9);
  // temple (traced from the side photograph): flat grooved plate for the first 32 mm, then a slim fluted rod that runs almost level
  // to ~92 mm, bends down behind the ear and drops in a straight line so the tip ends level with the bottom of the lens
  const tg=new THREE.Group();tg.position.set(EX+.1,EY,-10.6);g.add(tg);
  // front section (retraced from the close-up): a polished lozenge sleeve with long pointed ends and a groove running down
  // each side, threaded on the slim rod that continues from the hinge into the temple
  { const U0=2.5,U1=34,N=64,RS=40,pos=[],idx=[];
    for(let i=0;i<=N;i++){const u=U0+(U1-U0)*i/N,e=Math.min(1,(u-U0)/3,(U1-u)/6),sm=e*e*(3-2*e),h=.7+.6*sm,t=.62+.18*sm,yc=-.2-.007*u;
      for(let j=0;j<=RS;j++){const th=j/RS*Math.PI*2,c=Math.cos(th),sn=Math.sin(th),q=Math.abs(sn),st=1/(1+Math.exp(-(.58-q)*40)),gr=(.58+.42*st)*(1-.12*sm*Math.exp(-((sn/.12)**2))); // raised middle band with a step down to the top and bottom ledges; fine centre line
        pos.push(-.1+t*c*gr,yc+h*sn,-u)}}
    for(let i=0;i<N;i++)for(let j=0;j<RS;j++){const a=i*(RS+1)+j,b=a+RS+1;idx.push(a,b,a+1,b,b+1,a+1)}
    const sg=new THREE.BufferGeometry();sg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));sg.setIndex(idx);sg.computeVertexNormals();mk(sg,'k:metal','temple',tg);
    const rd=mk(new THREE.CylinderGeometry(.62,.62,4,14),'k:metal','temple',tg);rd.rotation.x=Math.PI/2;rd.position.set(-.1,-.21,-2); }
  const PRO=[[30,-.42],[46,-1.0],[62,-1.9],[78,-3.0],[92,-4.5],[98,-5.8],[104,-8.0],[110.5,-12.3],[119.3,-19.3],[128.2,-27.2],[133.6,-32.0]]; // (mm back from the hinge, mm down)
  const WR=u=>u>96?-.0045*(u-96)**2:0; // top view: the last ~38 mm turn inward (~6 mm at the tip) to wrap behind the head above the mastoid
  const crv=new THREE.CatmullRomCurve3(PRO.map(([u,v])=>new THREE.Vector3(-.1+WR(u),v,-u)),false,'centripetal');
  const N=140,RS=18,pos=[],idx=[],X=new THREE.Vector3(1,0,0);
  const rad=t=>.68+.55*Math.pow(t,1.6); // 1.4 mm thick near the plate, ~2.5 mm at the tip
  for(let i=0;i<=N;i++){const t=i/N,c=crv.getPointAt(t),T=crv.getTangentAt(t),B=new THREE.Vector3().crossVectors(T,X).normalize();
    for(let j=0;j<=RS;j++){const th=j/RS*Math.PI*2,r=rad(t)*(1+.06*Math.cos(6*th));pos.push(c.x+X.x*Math.cos(th)*r+B.x*Math.sin(th)*r,c.y+B.y*Math.sin(th)*r,c.z+B.z*Math.sin(th)*r)}}
  for(let i=0;i<N;i++)for(let j=0;j<RS;j++){const a=i*(RS+1)+j,b=a+RS+1;idx.push(a,b,a+1,b,b+1,a+1)}
  const rod=new THREE.BufferGeometry();rod.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));rod.setIndex(idx);rod.computeVertexNormals();
  mk(rod,'k:brushed','temple',tg);
  // tip: engraved collar and a domed end cap
  const end=crv.getPointAt(1),dir=crv.getTangentAt(1),re=rad(1);
  // collar: a pronounced engraved band, ~30% wider than the rod, flaring out of the rod with a raised rim at each edge; the domed cap comes out of it
  const q=new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0,1,0),dir),CR=re*1.3,cc=end.clone().addScaledVector(dir,-.6);
  const prof=[[re*.98,-1.9],[re+.04,-1.6],[CR-.05,-1.12],[CR+.13,-1.02],[CR+.13,-.86],[CR,-.78],[CR,.78],[CR+.13,.86],[CR+.13,1.02],[CR-.05,1.12],[CR-.2,1.16]].reverse().map(([r,h])=>new THREE.Vector2(r,h));
  const lat=mk(new THREE.LatheGeometry(prof,40),'k:metal','temple',tg);lat.position.copy(cc);lat.quaternion.copy(q);
  const band=mk(new THREE.CylinderGeometry(CR+.015,CR+.015,1.5,40,1,true),'k:col','temple',tg);band.position.copy(cc);band.quaternion.copy(q);
  const cap=mk(new THREE.SphereGeometry(CR-.15,24,16),'k:tip','temple',tg);cap.position.copy(cc).addScaledVector(dir,1.0);cap.quaternion.copy(q);cap.scale.y=.85;
  {const plug=mk(new THREE.CylinderGeometry(CR-.1,CR-.1,2.4,24),'k:tip','temple',tg);plug.position.copy(cc);plug.quaternion.copy(q)}
  // nose pad (retraced from the rear close-up): round wire arm leaves the clamp behind the lens, hooks back and drops straight down
  // to a pad box with a screw on its back face; a long, narrow, curved titanium pad hangs from the box facing the nose
  const npv=new THREE.Group();npv.position.set(nx-.2,ny-1.6,0);npv.rotation.z=.3;g.add(npv);const np=new THREE.Group();np.position.set(-(nx-.2),-(ny-1.6),0);npv.add(np); // follows the slant of the lens edge
  const pa=new THREE.CatmullRomCurve3([[nx-.2,ny-1.6,-1.7],[nx-.35,ny-1.1,-3.1],[nx-.5,ny-2.2,-4.0],[nx-.6,ny-4.4,-4.15],[nx-.6,ny-6.0,-4.1]].map(a=>new THREE.Vector3(...a)));
  mk(new THREE.TubeGeometry(pa,32,.34,10),'k:metal','brow',np);
  const pb=mk(new RoundedBoxGeometry(1.6,1.9,1.6,2,.35),'k:metal','brow',np);pb.position.set(nx-.6,ny-6.9,-4.1);
  { const sc=mk(new THREE.CylinderGeometry(.42,.42,.18,16),'k:dark','brow',np);sc.rotation.x=Math.PI/2;sc.position.set(nx-.6,ny-6.9,-4.95);
    const ring=mk(new THREE.TorusGeometry(.42,.08,6,18),'k:metal','brow',np);ring.position.set(nx-.6,ny-6.9,-5.0); }
  const neck=mk(new RoundedBoxGeometry(1.0,.9,.8,2,.2),'k:metal','brow',np);neck.position.set(nx-1.5,ny-6.9,-4.1);
  const pd=mk(padG5,'k:brushed','brow',np);pd.position.set(nx-2.05,ny-7.6,-4.2);pd.rotation.set(.12,Math.PI/2-.55,0);
}
mk(brG5,'k:metal','brow',frame5);mk(brFace5,'k:br','brow',frame5).position.z=-.24;
side5(1);side5(-1);
root.add(frame5);
{ const b=new THREE.Box3().setFromObject(frame5),c=b.getCenter(new THREE.Vector3());frame5.position.sub(c);frame5.position.y+=4; }
