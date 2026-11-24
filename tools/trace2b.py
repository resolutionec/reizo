from PIL import Image; import numpy as np, json, cv2
N=720;ang=np.linspace(0,2*np.pi,N,endpoint=False)
raw=json.load(open('trace2_raw.json'));rin,ren,rw=np.load('comb.npy')
def fill_smooth(r,win=7):
  ok=~np.isnan(r);x=np.arange(N)
  f=np.interp(x,np.r_[x[ok]-N,x[ok],x[ok]+N],np.r_[r[ok],r[ok],r[ok]])
  k=np.ones(win)/win;return np.convolve(np.r_[f[-win:],f,f[:win]],k,'same')[win:-win]
rin_s,ren_s=fill_smooth(rin),fill_smooth(ren)
# eyewire: thin lip beyond enamel; smooth the lip width heavily, then add to enamel outer
lip=fill_smooth(rw-ren,41);lip=np.clip(lip,4,9)
rw_s=ren_s+lip
s=0.04896
cR=raw['R']['c'];cL=raw['L']['c']
print('centres',cR,cL,'IPD-ish mm',(cR[0]-cL[0])*s)
cx=(cR[0]-(3000-cL[0]))/2+ (3000-cL[0]) if False else (cR[0]+(3000-cL[0]))/2  # symmetric about x=1500
cy=(cR[1]+cL[1])/2
print('use centre',cx,cy)
def pts(r,cx=cx,cy=cy):return np.c_[cx+np.cos(ang)*r,cy-np.sin(ang)*r]
P={'lens':pts(rin_s),'enamel':pts(ren_s),'wire':pts(rw_s)}
for k,p in P.items():print(k,'w mm',round((p[:,0].max()-p[:,0].min())*s,2),'h mm',round((p[:,1].max()-p[:,1].min())*s,2))
vis=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).copy()
for k,col in [('lens',(0,160,255)),('enamel',(255,0,0)),('wire',(0,200,0))]:
  for sx in [1,-1]:
    p=P[k].copy();
    if sx<0:p[:,0]=3000-p[:,0]
    cv2.polylines(vis,[p.astype(np.int32).reshape(-1,1,2)],True,col,2,cv2.LINE_AA)
Image.fromarray(vis).resize((1500,625)).save('/tmp/t2_full.png')
for n,(x0,y0) in {'tr':(2350,130),'bl':(1650,850),'br':(2350,850),'tl':(1650,130)}.items():
  Image.fromarray(vis[y0:y0+400,x0:x0+600]).save(f'/tmp/t2_{n}.png')
mm=lambda p:[[round((x-1500)*s,3),round(-(y-683)*s,3)] for x,y in p[::2]]
json.dump({'c':[round((cx-1500)*s,3),round(-(cy-683)*s,3)],'LENS':mm(P['lens']),'ENAMEL':mm(P['enamel']),'WIRE':mm(P['wire'])},open('front2_mm.json','w'))
