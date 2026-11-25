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
const brMap5=texLoader.load(G5.BRTEX);brMap5.colorSpace=THREE.SRGBColorSpace;brMap5.anisotropy=8;const brBump5=texLoader.load(G5.BRTEX);
const M5={metal:{},brushed:{},eng:{},br:{},lens:{},
  dark:new THREE.MeshStandardMaterial({color:0x141414,metalness:.4,roughness:.45,...PO(-3)}),
  tip:new THREE.MeshPhysicalMaterial({color:0x17181a,roughness:.25,clearcoat:1,clearcoatRoughness:.08}),
  pad:new THREE.MeshPhysicalMaterial({color:0xc9cdd2,roughness:.12,transparent:true,opacity:.32,depthWrite:false,clearcoat:1,envMapIntensity:1.6})};
for(const [k,f] of Object.entries(FIN5)){
  M5.metal[k]=new THREE.MeshStandardMaterial({color:f.c,metalness:1,roughness:f.r*.7,envMapIntensity:1.9,...PO(-1)});
  M5.brushed[k]=new THREE.MeshStandardMaterial({color:f.c,metalness:.85,roughness:f.r+.12,envMapIntensity:1.6,...PO(-1)});
  M5.eng[k]=new THREE.MeshStandardMaterial({color:f.c,map:ENG5.map,bumpMap:ENG5.bump,bumpScale:.7,metalness:.85,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
  M5.br[k]=new THREE.MeshStandardMaterial({color:f.c,map:brMap5,bumpMap:brBump5,bumpScale:.9,metalness:.82,roughness:f.r,envMapIntensity:1.8,...PO(-2)});
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
for(const sx of [1,-1]){let h=G5.SLOT.map(([x,y])=>V(sx*x,y));if(THREE.ShapeUtils.isClockWise(h)===THREE.ShapeUtils.isClockWise(brS5.getPoints()))h.reverse();brS5.holes.push(new THREE.Path(h))}
let brG5=ext(brS5,1.0,.22,3,8);brG5.translate(0,0,.15);brG5=smooth(brG5);
const brFace5=linUV(new THREE.ShapeGeometry(brS5,8),G5.BRUV);

const MT=G5.MOUNTS;
function side5(sign){
  const g=new THREE.Group();g.scale.x=sign;g.rotation.y=sign*.06;frame5.add(g);
  mk(lensG5,'k:lens','lens',g).renderOrder=3;
  // nasal mount (retraced): tall flange on the lens edge, a tab welding it to the bridge leg, a tapered post and an elongated faceted knob
  const NM=G5.NASAL,[nx,ny]=[NM.flange[0],NM.flange[1]];
  const fl=mk(new RoundedBoxGeometry(NM.flange[2],NM.flange[3],1.1,3,.45),'k:metal','end',g);fl.position.set(NM.flange[0],NM.flange[1],.55);
  const blk=mk(new RoundedBoxGeometry(1.9,3.6,2.4,2,.4),'k:metal','end',g);blk.position.set(NM.flange[0],NM.flange[1]-.3,-.9); // clamp behind the lens
  const tab=mk(new RoundedBoxGeometry(NM.tab[2]+.6,NM.tab[3],.9,2,.3),'k:metal','end',g);tab.position.set(NM.tab[0],NM.tab[1],.65);
  { const [px,py,pr]=NM.post,[kx,ky,kr,kl]=NM.knob,L=kx-px;const post=mk(new THREE.CylinderGeometry(pr*.62,pr,L,16),'k:metal','end',g);post.rotation.z=Math.PI/2;post.position.set(px+L/2,(py+ky)/2,.75);
    const kn=mk(new THREE.IcosahedronGeometry(kr,1),'k:metal','end',g);kn.scale.set(kl/kr,1,.85);kn.position.set(kx+.2,ky,.75); }
  // temporal mount and end-piece: knob on the lens, cross-piece, engraved arm out to the hinge, then back along the temple line
  const [tx,ty]=MT.temporal_post.knob,[ex,ey]=MT.temporal_post.to_endpiece,EX=MT.endpiece_arm.to[0]-4.4,EY=MT.endpiece_arm.to[1]-.6;
  // temporal mount mirrors the nasal one: flange on the lens edge, tapered post in to an elongated knob
  { const fx=ex+.3,fy=ey-1.4;const tf=mk(new RoundedBoxGeometry(1.7,7.2,1.1,3,.45),'k:metal','end',g);tf.position.set(fx,fy,.55);tf.rotation.z=-.12;
    const L=fx-tx-.8;const tp=mk(new THREE.CylinderGeometry(.55,.85,L,16),'k:metal','end',g);tp.rotation.z=Math.PI/2;tp.position.set(tx+L/2,ty+.2,.75);
    const tk=mk(new THREE.IcosahedronGeometry(1.5,1),'k:metal','end',g);tk.scale.set(1.23,1,.85);tk.position.set(tx-.4,ty+.2,.75);
    const tb=mk(new RoundedBoxGeometry(1.9,3.6,2.4,2,.4),'k:metal','end',g);tb.position.set(fx,ty+.2,-.9); }
  const armL=EX-ex;const arm=mk(new RoundedBoxGeometry(armL,2.6,1.1,2,.3),'k:metal','end',g);arm.position.set(ex+armL/2+.6,EY,-.2);
  const armF=mk(linUV(new THREE.PlaneGeometry(armL-.6,2.2),[1/(armL),0,.5,.5]),'k:eng','end',g);armF.position.set(ex+armL/2+.6,EY,.37);
  const back=mk(new RoundedBoxGeometry(1.1,2.6,9,2,.3),'k:metal','end',g);back.position.set(EX+.35,EY,-4.6);
  const bF=mk(linUV(new THREE.PlaneGeometry(8.2,2.2),[1/8.2,.5,.5,.5]),'k:eng','end',g);bF.position.set(EX+.92,EY,-4.6);bF.rotation.y=Math.PI/2;
  // hinge block and screw at the back of the end-piece
  const hb=mk(new RoundedBoxGeometry(1.6,2.8,2.2,2,.3),'k:metal','end',g);hb.position.set(EX+.1,EY,-9.9);
  const hs=mk(new THREE.CylinderGeometry(.45,.45,.25,14),'k:dark','end',g);hs.position.set(EX+.1,EY-1.5,-9.9);
  // temple: flat engraved strip to ~48 mm, then a tapered round rod that bends down over the ear to a capped tip
  const tg=new THREE.Group();tg.position.set(EX+.1,EY,-10.6);g.add(tg);
  const strip=mk(new RoundedBoxGeometry(1.0,2.6,46,2,.35),'k:brushed','temple',tg);strip.position.set(0,-.1,-23);
  { const oval=new THREE.Shape();oval.absellipse(0,0,17,1.05,0,Math.PI*2);const og=linUV(new THREE.ShapeGeometry(oval,32),[1/34,.5,1/2.6,.5]);og.rotateY(Math.PI/2);
    const ov=mk(og,'k:eng','temple',tg);ov.position.set(.52,-.1,-24); }
  const pts=[];for(let i=0;i<=60;i++){const t=i/60*97;let z,y;
    if(t<58){z=-46-t;y=-.1-t*.06}else{const a=(t-58)/39*0.62;z=-46-58-Math.sin(a)*39/0.62*.95;y=-.1-58*.06-(1-Math.cos(a))*39/0.62*.95}pts.push(new THREE.Vector3(-.1,y,z))}
  const crv=new THREE.CatmullRomCurve3(pts);const rod=new THREE.TubeGeometry(crv,96,1,12,false);
  { const p=rod.attributes.position,n=97,ring=13;for(let i=0;i<p.count;i++){const seg=Math.floor(i/ring),t=seg/(n-1),c=crv.getPoint(Math.min(1,t)),r=.95+.35*t*t;
      p.setXYZ(i,c.x+(p.getX(i)-c.x)*r*(t<.05?1.1:1)*.9,c.y+(p.getY(i)-c.y)*r*1.25,c.z+(p.getZ(i)-c.z)*r)}p.needsUpdate=true;rod.computeVertexNormals() }
  mk(rod,'k:brushed','temple',tg);
  const end=crv.getPoint(1),dir=crv.getTangent(1);
  const ringM=mk(new THREE.TorusGeometry(1.32,.28,10,24),'k:eng','temple',tg);ringM.position.copy(end).addScaledVector(dir,-.4);ringM.quaternion.setFromUnitVectors(new THREE.Vector3(0,0,1),dir);
  const cap=mk(new THREE.SphereGeometry(1.4,20,14,0,Math.PI*2,0,Math.PI/2),'k:tip','temple',tg);cap.position.copy(end);cap.quaternion.setFromUnitVectors(new THREE.Vector3(0,1,0),dir);cap.scale.y=1.3;
  // nose pad: metal pad arm down from the nasal block, box and screw, clear teardrop pad facing the nose
  const pa=new THREE.CatmullRomCurve3([[nx,ny-3.4,-1.4],[nx-.4,ny-6,-3.0],[nx-.9,ny-8.6,-4.4]].map(a=>new THREE.Vector3(...a)));
  mk(new THREE.TubeGeometry(pa,20,.32,8),'k:metal','brow',g);
  const pb=mk(new RoundedBoxGeometry(1.5,1.8,1.3,2,.3),'k:metal','brow',g);pb.position.set(nx-.9,ny-9.0,-4.6);
  const pd=mk(padG,'k:brushed','brow',g);pd.position.set(nx-1.7,ny-10.2,-5.6);pd.rotation.y=.93;pd.scale.set(1,1.05,1);
}
mk(brG5,'k:metal','brow',frame5);mk(brFace5,'k:br','brow',frame5).position.z=1.47;
side5(1);side5(-1);
root.add(frame5);
{ const b=new THREE.Box3().setFromObject(frame5),c=b.getCenter(new THREE.Vector3());frame5.position.sub(c);frame5.position.y+=4; }
