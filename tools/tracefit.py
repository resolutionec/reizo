import numpy as np, json
from shapely.geometry import Polygon, box, Point
from shapely.affinity import scale as sscale
from shapely.ops import unary_union
from PIL import Image
im=np.asarray(Image.open('/mnt/user-data/uploads/bfed03d6-image.jpg').convert('RGB')).astype(int)
dark=(im.mean(2)<120)
c=np.load('outer.npy'); hulls=np.load('hulls.npy',allow_pickle=True)
s=0.1684; ax=447.25; yc=235.5
P=Polygon(c).buffer(0)
# rim top just right of the brow bar
col=dark[:,660]; rimTop=int(np.argmax(col[70:])+70); print('rimTop px',rimTop)
Rh=P.intersection(box(ax,rimTop,900,460))
# end-piece: the metal plate hides the rim edge between y~106..262; fit a smooth edge through the visible rim above and below
from scipy.interpolate import PchipInterpolator as CubicSpline
def xr(y):
  return Rh.intersection(box(0,y-.5,900,y+.5)).bounds[2]
ys=[y for y in list(range(rimTop+8,100,3))+list(range(268,320,4))]
cs=CubicSpline(ys,[xr(y) for y in ys])
edge=[(float(cs(y)),float(y)) for y in np.arange(95,266,2)]
print('edge samples',[(round(x),y) for x,y in edge[::10]])
strip=Polygon([(760,95)]+edge+[(760,265)])
Rh=Rh.difference(box(760,95,900,265)).union(strip).buffer(0)
Rh=Rh.intersection(box(ax,rimTop,900,460))
# also clip anything right of the fitted edge
if Rh.geom_type!='Polygon': Rh=max(Rh.geoms,key=lambda g:g.area)
L=Polygon(hulls[1]) if hulls[1][:,0].mean()>ax else Polygon(hulls[0])
Lm=Polygon(hulls[0]) if hulls[0][:,0].mean()<ax else Polygon(hulls[1])
Lm=sscale(Lm,xfact=-1,origin=(ax,0))
lensPx=L.intersection(Lm).buffer(1.5).union(L.intersection(Lm)) # symmetric average-ish
lensPx=unary_union([L,Lm]).buffer(-1.5).buffer(1.5) if False else L.buffer(0)
def tomm(g):
  from shapely.affinity import affine_transform
  return affine_transform(g,[s,0,0,-s,-ax*s,yc*s])
Rm=tomm(Rh).buffer(.6).buffer(-.6); Lv=tomm(lensPx).simplify(.05)
full=unary_union([Rm,sscale(Rm,xfact=-1,origin=(0,0))]).buffer(1.2).buffer(-1.2).buffer(-3.2,join_style=1).buffer(3.2,join_style=1).buffer(2.5,join_style=1).buffer(-2.5,join_style=1)
if full.geom_type!='Polygon': full=max(full.geoms,key=lambda g:g.area)
# below mid-lens the photo outline is polluted by the table shadow: use an even 5.2mm rim around the traced lens there
Lvm_=sscale(Lv,xfact=-1,origin=(0,0))
low=unary_union([Lv.buffer(5.2,join_style=1),Lvm_.buffer(5.2,join_style=1)]).intersection(box(-100,-100,100,-6))
full=unary_union([full.intersection(box(-100,-6,100,100)),low]).buffer(1.5,join_style=1).buffer(-1.5,join_style=1)
if full.geom_type!='Polygon': full=max(full.geoms,key=lambda g:g.area)
B=1.2
outerG=full.buffer(-B,join_style=1).simplify(.08)
holeG=Lv.buffer(B,join_style=1).simplify(.06)
lensC=Lv.buffer(1.5,join_style=1).intersection(outerG.buffer(-.4)).simplify(.1)
# checks
print('outer vis bounds',[round(v,1) for v in full.bounds])
print('lens vis bounds',[round(v,1) for v in Lv.bounds],'w',round(Lv.bounds[2]-Lv.bounds[0],1),'h',round(Lv.bounds[3]-Lv.bounds[1],1))
print('lens grid inside outerG?',outerG.contains(lensC), 'min rim vis', round(full.exterior.distance(Lv),2) if False else '')
d=min(Point(p).distance(full.exterior) for p in Lv.exterior.coords);print('min rim thickness vis mm',round(d,2))
print('lens poke out', lensC.difference(outerG).area)
def topy(g,x): return g.intersection(box(x-.05,-100,x+.05,100)).bounds[3]
print('rim top vis at x=33',round(topy(full,33),2),' at 0',round(topy(full,0),2))
ep=outerG.intersection(box(0,0,200,18)).bounds[2];print('ep x geom',round(ep,2))
nose=full.exterior; 
for y in [-5,-15,-25]:
  seg=full.intersection(box(-30,y-.05,30,y+.05))
  print('nose y',y,[round(g.bounds[0],1) for g in getattr(seg,'geoms',[seg])])
def arr(g,N=None):
  if N:
    L=g.exterior.length;pts=np.array([g.exterior.interpolate(L*i/N).coords[0] for i in range(N)])
    for _ in range(2): pts=(np.roll(pts,1,0)+2*pts+np.roll(pts,-1,0))/4  # light smoothing
    co=pts
  else: co=list(g.exterior.coords)[:-1]
  return [[round(float(x),2),round(float(y),2)] for x,y in co]
out={'outer':arr(outerG,340),'hole':arr(holeG,200),'lens':arr(lensC,120),'ep':round(ep,2),'top33':round(topy(full,33),2)}
print({k:len(v) if isinstance(v,list) else v for k,v in out.items()})
json.dump(out,open('trace.json','w'))
# preview overlay in px
from PIL import ImageDraw
pv=Image.open('/mnt/user-data/uploads/bfed03d6-image.jpg').convert('RGB');dr=ImageDraw.Draw(pv)
tp=lambda pts:[(x/s+ax,yc-y/s) for x,y in pts]
dr.line(tp(arr(full))+tp(arr(full))[:1],fill=(0,200,0),width=2)
dr.line(tp(arr(Lv))+tp(arr(Lv))[:1],fill=(255,0,0),width=2)
Lvm=sscale(Lv,xfact=-1,origin=(0,0));dr.line(tp(arr(Lvm))+tp(arr(Lvm))[:1],fill=(255,0,255),width=2)
pv.save('trace3.png')
