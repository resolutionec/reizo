from PIL import Image; import numpy as np, json, cv2
im=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).astype(int)
bg=(np.abs(im-255).sum(2)<40)
N=720;ang=np.linspace(0,2*np.pi,N,endpoint=False);s=0.04896
raw=json.load(open('trace2_raw.json'))
def A(K):return np.c_[np.ones(N),*[f(k*ang) for k in range(1,K+1) for f in (np.cos,np.sin)]]
def clean(r,K=8,th=2.5):
  ok=~np.isnan(r);M=A(K)
  for _ in range(6):
    c,*_=np.linalg.lstsq(M[ok],r[ok],rcond=None);res=r-M@c;ok=(~np.isnan(r))&(np.abs(res)<th)
  r=np.where(ok,r,np.nan);x=np.arange(N)
  f=np.interp(x,np.r_[x[ok]-N,x[ok],x[ok]+N],np.r_[r[ok],r[ok],r[ok]])
  k=np.ones(5)/5;return np.convolve(np.r_[f[-5:],f,f[:5]],k,'same')[5:-5],np.sum(~ok)
def mir(a):idx=(np.round((np.pi-ang)%(2*np.pi)/(2*np.pi)*N).astype(int))%N;return np.asarray(a,float)[idx]
cy=(raw['R']['c'][1]+raw['L']['c'][1])/2
res={}
for side in 'RL':
  c=raw[side]['c'];rin=np.array(raw[side]['rin'],float);ren=np.array(raw[side]['ren'],float)
  # re-reference rays to common centre height not needed (same cy within .01px)
  # inner grey lip: walk inward from rin until white
  lip=[]
  for i,a in enumerate(ang):
    if np.isnan(rin[i]):continue
    dx,dy=np.cos(a),-np.sin(a);r=rin[i]-1;n=0
    while n<15 and not bg[int(round(c[1]+dy*r)),int(round(c[0]+dx*r))]:r-=1;n+=1
    if n<15:lip.append(n)
  res[side]=dict(rin=rin,ren=ren,lip=np.median(lip))
rin=np.nanmean(np.vstack([res['R']['rin'],mir(res['L']['rin'])]),0);ren=np.nanmean(np.vstack([res['R']['ren'],mir(res['L']['ren'])]),0)
rin_s,b1=clean(rin);ren_s,b2=clean(ren)
lipIn=(res['R']['lip']+res['L']['lip'])/2
# outer metal lip: median over upper half rays (no floor shadow)
rw=np.array(raw['R']['rw'],float);ren0=np.array(raw['R']['ren'],float);up=np.sin(ang)>0.2
lipOut=np.nanmedian((rw-ren0)[up])
print('rejected',b1,b2,'inner lip px',lipIn,'outer lip px',lipOut)
cx=(raw['R']['c'][0]+3000-raw['L']['c'][0])/2
P={'lens':rin_s-lipIn,'enamel_in':rin_s,'enamel_out':ren_s,'wire':ren_s+lipOut}
pts=lambda r:np.c_[cx+np.cos(ang)*r,cy-np.sin(ang)*r]
vis=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).copy()
for k,col in [('lens',(0,160,255)),('enamel_out',(255,0,0)),('wire',(0,190,0))]:
  for sx in [1,-1]:
    p=pts(P[k]);
    if sx<0:p[:,0]=3000-p[:,0]
    cv2.polylines(vis,[np.round(p).astype(np.int32).reshape(-1,1,2)],True,col,2,cv2.LINE_AA)
  pp=pts(P[k]);print(k,'w',round(np.ptp(pp[:,0])*s,2),'h',round(np.ptp(pp[:,1])*s,2))
Image.fromarray(vis).resize((1500,625)).save('/tmp/t3_full.png')
for n,(x0,y0) in {'r_outer':(2450,450),'bl':(1650,850),'top':(2000,90),'nose':(1650,350)}.items():Image.fromarray(vis[y0:y0+400,x0:x0+600]).save(f'/tmp/t3_{n}.png')
mm=lambda r:[[round((x-1500)*s,3),round(-(y-683)*s,3)] for x,y in pts(r)[::2]]
json.dump({'c':[round((cx-1500)*s,3),round(-(cy-683)*s,3)],'LENS':mm(P['lens']),'EN_IN':mm(P['enamel_in']),'EN_OUT':mm(P['enamel_out']),'WIRE':mm(P['wire'])},open('front2_mm.json','w'),separators=(',',':'))
