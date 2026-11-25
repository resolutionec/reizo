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
  M5.br[k]=new THREE.MeshStandardMaterial({color:f.c,map:brMap5,bumpMap:brBump5,bumpScale:.45,metalness:.82,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
}
for(const [k,w] of Object.entries(WAYS5))M5.lens[k]=new THREE.MeshPhysicalMaterial({color:0xffffff,map:tintTex(w.lens),transparent:true,roughness:.04,metalness:0,clearcoat:1,clearcoatRoughness:.03,envMapIntensity:1.4,depthWrite:false,side:THREE.DoubleSide});

const LZ=0; // lens front face
const lensS5=new THREE.Shape(G5.LENS.map(([x,y])=>V(x,y)));
let lensG5=ext(lensS5,1.6,.25,2,8);lensG5.translate(0,0,-1.6-.25);
{ const p=lensG5.attributes.position;let y0=1e9,y1=-1e9;for(let i=0;i<p.count;i++){y0=Math.min(y0,p.getY(i));y1=Math.max(y1,p.getY(i))}
  const uv=lensG5.attributes.uv;for(let i=0;i<p.count;i++){uv.setXY(i,.5,(p.getY(i)-y0)/(y1-y0))}uv.needsUpdate=true;
  for(let i=0;i<p.count;i++){const dx=p.getX(i)-34,dy=p.getY(i);p.setZ(i,p.getZ(i)-(dx*dx+dy*dy)/(2*220))} // gentle base curve
  lensG5.computeVertexNormals(); }
// bridge: flat stepped arch traced from the front, slot cutouts, engraving projected from the close-up
const brS5=new THREE.Shape(G5.BR.map(([x,y])=>V(x,y)));
for(const sl of G5.SLOTS){let h=sl.map(([x,y])=>V(x,y));if(THREE.ShapeUtils.isClockWise(h)===THREE.ShapeUtils.isClockWise(brS5.getPoints()))h.reverse();brS5.holes.push(new THREE.Path(h))}
let brG5=ext(brS5,1.0,.22,3,8);brG5.translate(0,0,.15);brG5=smooth(brG5);
const brFace5=linUV(new THREE.ShapeGeometry(brS5,8),G5.BRUV);

const MT=G5.MOUNTS;
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
  padG5=ext(sh,.5,.22,3,8);padG5.translate(0,0,-.25);const q=padG5.attributes.position;for(let i=0;i<q.count;i++){const y=q.getY(i);q.setZ(i,q.getZ(i)-.022*y*y)}padG5=smooth(padG5);}
function side5(sign){
  const g=new THREE.Group();g.scale.x=sign;g.rotation.y=sign*.06;frame5.add(g);
  mk(lensG5,'k:lens','lens',g).renderOrder=3;
  // nasal mount (retraced): tall flange on the lens edge, a tab welding it to the bridge leg, a tapered post and an elongated faceted knob
  const NM=G5.NASAL,[nx,ny]=[NM.flange[0],NM.flange[1]];
  const fl=mk(new RoundedBoxGeometry(NM.flange[2],NM.flange[3],1.1,3,.45),'k:metal','end',g);fl.position.set(NM.flange[0],NM.flange[1],.55);
  const blk=mk(new RoundedBoxGeometry(1.9,3.6,2.4,2,.4),'k:metal','end',g);blk.position.set(NM.flange[0],NM.flange[1]-.3,-.9); // clamp behind the lens
  const tab=mk(new RoundedBoxGeometry(NM.tab[2]+.6,NM.tab[3],.9,2,.3),'k:metal','end',g);tab.position.set(NM.tab[0],NM.tab[1],.65);
  { const [px,py,pr]=NM.post,[kx,ky,kr,kl]=NM.knob,L=kx-px;const post=mk(new THREE.CylinderGeometry(pr*.62,pr,L,16),'k:metal','end',g);post.rotation.z=Math.PI/2;post.position.set(px+L/2,(py+ky)/2,.75);
    hexPost(g,kx+.4,ky,2.6); }
  // end-piece retraced as one cast piece (close-up outline): rounded paddle on the lens with a slotted bolt, a neck to the slanted cross-bar
  // that grips the lens edge, then the engraved arm out to the corner; it turns back to the hinge from there
  const [tx,ty]=MT.temporal_post.knob,EX=G5.EP_END[0]-.55,EY=G5.EP_END[1];
  { const sh=new THREE.Shape(G5.EPW.map(([x,y])=>V(x,y)));let eg=ext(sh,.9,.22,3,8);eg.translate(0,0,.05);mk(smooth(eg),'k:metal','end',g);
    // engraved face of the arm, UVs set per traced point
    const P=G5.EPF,pts=P.map(([x,y])=>V(x,y)),tri=THREE.ShapeUtils.triangulateShape(pts,[]),pos=[],uv=[];
    for(const [x,y,u,v] of P){pos.push(x,y,0);uv.push(u,v)}
    const fg=new THREE.BufferGeometry();fg.setAttribute('position',new THREE.Float32BufferAttribute(pos,3));fg.setAttribute('uv',new THREE.Float32BufferAttribute(uv,2));fg.setIndex(tri.flat());fg.computeVertexNormals();
    if(fg.attributes.normal.getZ(0)<0){fg.setIndex(tri.flatMap(t=>[t[0],t[2],t[1]]));fg.computeVertexNormals()}
    mk(fg,'k:arm','end',g).position.z=1.2;
    // bolt through the paddle and the lens: slotted head in front, hex nut, stub and hex end behind (as on the nasal side)
    const sag=((tx-34)**2+ty*ty)/440,zb=-2.1-sag;
    const hd=mk(new THREE.CylinderGeometry(.62,.62,.35,20),'k:metal','end',g);hd.rotation.x=Math.PI/2;hd.position.set(tx,ty,1.25);
    const sl=mk(new THREE.BoxGeometry(1.0,.22,.12),'k:dark','end',g);sl.position.set(tx,ty,1.42);sl.rotation.z=.15;
    const sk=mk(new THREE.CylinderGeometry(.38,.38,1.3-zb,12),'k:metal','end',g);sk.rotation.x=Math.PI/2;sk.position.set(tx,ty,(1.3+zb)/2);
    const nt=mk(new THREE.CylinderGeometry(.95,.95,.85,6),'k:metal','end',g);nt.rotation.x=Math.PI/2;nt.position.set(tx,ty,zb-.43);
    const sb=mk(new THREE.CylinderGeometry(.42,.42,1.2,12),'k:metal','end',g);sb.rotation.x=Math.PI/2;sb.position.set(tx,ty,zb-1.45);
    const en=mk(new THREE.CylinderGeometry(.6,.6,.65,6),'k:metal','end',g);en.rotation.x=Math.PI/2;en.position.set(tx,ty,zb-2.35);
    // clamp block behind the lens edge under the cross-bar
    const cb=mk(new RoundedBoxGeometry(1.8,3.2,2.2,2,.4),'k:metal','end',g);cb.position.set(57.9,ty+.3,-1.1); }
  const back=mk(new RoundedBoxGeometry(1.1,3.4,10,2,.3),'k:metal','end',g);back.position.set(EX+.35,EY,-4.1);
  const bF=mk(linUV(new THREE.PlaneGeometry(9.2,3.0),[-1/9.2,.5,1/3.0,.5]),'k:arm','end',g);bF.position.set(EX+.92,EY,-4.1);bF.rotation.y=Math.PI/2;
  // hinge block and screw at the back of the end-piece
  const hb=mk(new RoundedBoxGeometry(1.6,2.8,2.2,2,.3),'k:metal','end',g);hb.position.set(EX+.1,EY,-9.9);
  const hs=mk(new THREE.CylinderGeometry(.45,.45,.25,14),'k:dark','end',g);hs.position.set(EX+.1,EY-1.5,-9.9);
  // temple (traced from the side photograph): flat grooved plate for the first 32 mm, then a slim fluted rod that runs almost level
  // to ~92 mm, bends down behind the ear and drops in a straight line so the tip ends level with the bottom of the lens
  const tg=new THREE.Group();tg.position.set(EX+.1,EY,-10.6);g.add(tg);
  const strip=mk(new RoundedBoxGeometry(1.0,2.4,32,2,.35),'k:brushed','temple',tg);strip.position.set(0,-.2,-16);
  { const oval=new THREE.Shape();oval.absellipse(0,0,13.5,.85,0,Math.PI*2);const og=linUV(new THREE.ShapeGeometry(oval,32),[1/27,.5,1/2.4,.5]);og.rotateY(Math.PI/2);
    const ov=mk(og,'k:eng','temple',tg);ov.position.set(.52,-.2,-17.5); }
  const PRO=[[30,-.42],[46,-1.0],[62,-1.9],[78,-3.0],[92,-4.5],[98,-5.8],[104,-8.0],[110.5,-12.3],[119.3,-19.3],[128.2,-27.2],[133.6,-32.0]]; // (mm back from the hinge, mm down)
  const crv=new THREE.CatmullRomCurve3(PRO.map(([u,v])=>new THREE.Vector3(-.1,v,-u)),false,'centripetal');
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
  const prof=[[re*.98,-1.9],[re+.04,-1.6],[CR-.05,-1.12],[CR+.13,-1.02],[CR+.13,-.86],[CR,-.78],[CR,.78],[CR+.13,.86],[CR+.13,1.02],[CR-.05,1.12],[CR-.2,1.16]].map(([r,h])=>new THREE.Vector2(r,h));
  const lat=mk(new THREE.LatheGeometry(prof,40),'k:metal','temple',tg);lat.position.copy(cc);lat.quaternion.copy(q);
  const band=mk(new THREE.CylinderGeometry(CR+.015,CR+.015,1.5,40,1,true),'k:col','temple',tg);band.position.copy(cc);band.quaternion.copy(q);
  const cap=mk(new THREE.SphereGeometry(CR-.2,24,16,0,Math.PI*2,0,Math.PI/2),'k:tip','temple',tg);cap.position.copy(cc).addScaledVector(dir,1.14);cap.quaternion.copy(q);cap.scale.y=.95;
  // nose pad (retraced from the rear close-up): round wire arm leaves the clamp behind the lens, hooks back and drops straight down
  // to a pad box with a screw on its back face; a long, narrow, curved titanium pad hangs from the box facing the nose
  const pa=new THREE.CatmullRomCurve3([[nx-.2,ny-1.6,-1.7],[nx-.35,ny-1.1,-3.1],[nx-.5,ny-2.2,-4.0],[nx-.6,ny-4.4,-4.15],[nx-.6,ny-6.0,-4.1]].map(a=>new THREE.Vector3(...a)));
  mk(new THREE.TubeGeometry(pa,32,.34,10),'k:metal','brow',g);
  const pb=mk(new RoundedBoxGeometry(1.6,1.9,1.6,2,.35),'k:metal','brow',g);pb.position.set(nx-.6,ny-6.9,-4.1);
  { const sc=mk(new THREE.CylinderGeometry(.42,.42,.18,16),'k:dark','brow',g);sc.rotation.x=Math.PI/2;sc.position.set(nx-.6,ny-6.9,-4.95);
    const ring=mk(new THREE.TorusGeometry(.42,.08,6,18),'k:metal','brow',g);ring.position.set(nx-.6,ny-6.9,-5.0); }
  const neck=mk(new RoundedBoxGeometry(1.0,.9,.8,2,.2),'k:metal','brow',g);neck.position.set(nx-1.5,ny-6.9,-4.1);
  const pd=mk(padG5,'k:brushed','brow',g);pd.position.set(nx-2.05,ny-7.6,-4.2);pd.rotation.set(.12,Math.PI/2-.55,0);
}
mk(brG5,'k:metal','brow',frame5);mk(brFace5,'k:br','brow',frame5).position.z=1.47;
side5(1);side5(-1);
root.add(frame5);
{ const b=new THREE.Box3().setFromObject(frame5),c=b.getCenter(new THREE.Vector3());frame5.position.sub(c);frame5.position.y+=4; }
