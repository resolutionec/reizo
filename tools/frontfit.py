import numpy as np, json
from shapely.geometry import Polygon, box, Point
from shapely.affinity import scale as sscale, affine_transform
from shapely.ops import unary_union
from PIL import Image, ImageDraw
hulls=np.load('hulls.npy',allow_pickle=True)
s=0.1684; ax=447.25; yc=235.5
tomm=lambda g:affine_transform(g,[s,0,0,-s,-ax*s,yc*s])
R=[h for h in hulls if h[:,0].mean()>ax][0]
Lv=tomm(Polygon(R)).buffer(0)
Lm=sscale(Lv,xfact=-1,origin=(0,0))
W=5.6                                   # even acetate band around each lens
BR_TOP=(yc-143)*s; BR_BOT=(yc-215)*s     # bridge: top just above the metal plate, bottom = nose-arch apex
print('bridge mm',round(BR_TOP,1),round(BR_BOT,1))
rims=unary_union([Lv.buffer(W,join_style=1),Lm.buffer(W,join_style=1)])
bridge=box(-14,BR_BOT,14,BR_TOP)
full=unary_union([rims,bridge])
full=full.buffer(2.6,join_style=1).buffer(-2.6,join_style=1)   # fillets where bridge meets rims
if full.geom_type!='Polygon': full=max(full.geoms,key=lambda g:g.area)
# end-piece wings: the front sweeps outward to carry the hinge (traced from the end-piece close-up: ~3.3mm past the
# rim edge between the rivet heights, with concave fillets back into the rim) - one solid piece with the front
EPX,EPY=63.3,-1.3            # end-piece origin in front coords
wing=box(EPX-6,EPY+2.3,EPX+7.3,EPY+15.7)
wings=unary_union([wing,sscale(wing,xfact=-1,origin=(0,0))])
merged=unary_union([full,wings])
fil=merged.buffer(4.2,join_style=1).buffer(-4.2,join_style=1)
region=unary_union([box(EPX-8,EPY-6,EPX+8,EPY+24),box(-EPX-8,EPY-6,-EPX+8,EPY+24)])
full=unary_union([merged,fil.intersection(region)])
if full.geom_type!='Polygon': full=max(full.geoms,key=lambda g:g.area)
B=1.2
outerG=full.buffer(-B,join_style=1)
holeG=Lv.buffer(B,join_style=1)
lensC=Lv.buffer(2.8,join_style=1).intersection(outerG.buffer(-.4))
def arr(g,N):
  L=g.exterior.length;pts=np.array([g.exterior.interpolate(L*i/N).coords[0] for i in range(N)])
  for _ in range(2): pts=(np.roll(pts,1,0)+2*pts+np.roll(pts,-1,0))/4
  return [[round(float(x),2),round(float(y),2)] for x,y in pts]
def topy(g,x): return g.intersection(box(x-.05,-100,x+.05,100)).bounds[3]
ep=outerG.intersection(box(0,0,200,18)).bounds[2]
# gap under the bar: free height at x=0 between bar underside (~28.5) and bridge top
print('outer bounds',[round(v,1) for v in full.bounds],'top33',round(topy(full,33),2),'ep',round(ep,2))
print('top-gap width at y=25:',[round(v,1) for v in full.intersection(box(-30,24.95,30,25.05)).geoms[0].bounds] if full.intersection(box(-30,24.95,30,25.05)).geom_type!='Polygon' else 'closed')
# extension cross-section = the wing (and its fillets) beyond x>=EPX+1.1, in end-piece local coords, inset for its bevel
wingX=full.intersection(box(EPX+1.1,-100,200,100))
if wingX.geom_type!='Polygon': wingX=max(wingX.geoms,key=lambda g:g.area)
from shapely.affinity import translate
lugL=translate(wingX,-EPX,-EPY).buffer(-.9,join_style=1)
if lugL.geom_type!='Polygon': lugL=max(lugL.geoms,key=lambda g:g.area)
print('lug local bounds',[round(v,2) for v in lugL.bounds])
out={'lug':arr(lugL,140),'outer':arr(outerG,360),'hole':arr(holeG,200),'lens':arr(lensC,120),'ep':round(ep,2),'top33':round(topy(full,33),2)}
json.dump(out,open('trace.json','w'))
pv=Image.open('/mnt/user-data/uploads/bfed03d6-image.jpg').convert('RGB');dr=ImageDraw.Draw(pv)
tp=lambda pts:[(x/s+ax,yc-y/s) for x,y in pts]
for g,c in [(full,(0,200,0)),(Lv,(255,0,0)),(Lm,(255,0,255))]:
  pts=tp(arr(g,300));dr.line(pts+pts[:1],fill=c,width=2)
pv.save('trace4.png')
