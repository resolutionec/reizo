from PIL import Image; import numpy as np, cv2, json
d=json.load(open('lens_px.json'));W=3000
def resamp(P,n=360):
  P=np.vstack([P,P[:1]]);L=np.r_[0,np.cumsum(np.hypot(*np.diff(P,axis=0).T))];t=np.linspace(0,L[-1],n,endpoint=False)
  return np.c_[np.interp(t,L,P[:,0]),np.interp(t,L,P[:,1])]
H={}
for k in 'LR':
  h=cv2.convexHull(np.array(d[k],np.int32))[:,0].astype(float)
  H[k]=h
# mirror L into R coordinates and compare via polar radius around R centre
R=H['R'];L=H['L'].copy();L[:,0]=W-1-L[:,0]
c=np.array([(R[:,0].min()+R[:,0].max())/2,(R[:,1].min()+R[:,1].max())/2])
ang=np.linspace(-np.pi,np.pi,720,endpoint=False)
def polar(P):
  P=resamp(P,2000);v=P-c;a=np.arctan2(v[:,1],v[:,0]);r=np.hypot(*v.T);o=np.argsort(a)
  return np.interp(ang,a[o],r[o],period=2*np.pi)
rR,rL=polar(R),polar(L);print('L/R max diff px',np.abs(rR-rL).max().round(1),'mean',np.abs(rR-rL).mean().round(2))
r=(rR+rL)/2
k=np.ones(9)/9;r=np.convolve(np.r_[r[-9:],r,r[:9]],k,'same')[9:-9]
P=np.c_[c[0]+r*np.cos(ang),c[1]+r*np.sin(ang)]
s=46/(P[:,0].max()-P[:,0].min())
print('scale mm/px',s,'A',46,'B mm',round((P[:,1].max()-P[:,1].min())*s,2),'DBL mm',round(2*(P[:,0].min()-1499.5)*s,2))
cy=c[1]
json.dump({'s':s,'cy':cy,'lens_px':P[::2].round(2).tolist(),'lens_mm':[[round((x-1499.5)*s,3),round(-(y-cy)*s,3)] for x,y in P[::2]]},open('front_mm.json','w'))
a=np.asarray(Image.open('ref/front.png').convert('RGB')).copy()
for sx in [1,-1]:
  Q=P.copy()
  if sx<0:Q[:,0]=W-1-Q[:,0]
  cv2.polylines(a,[Q.astype(np.int32).reshape(-1,1,2)],True,(0,140,255),3,cv2.LINE_AA)
Image.fromarray(a).resize((1500,625)).save('/tmp/l6.png')
Image.fromarray(a[250:1200,1500:2800]).resize((650,475)).save('/tmp/l6z.png')
