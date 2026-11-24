from PIL import Image; import numpy as np, json, cv2
im=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).astype(int)
H,W,_=im.shape; mean=im.mean(2); sat=im.max(2)-im.min(2)
dark=(mean<60)&(sat<30)          # black enamel ring (neutral), not gold shadow
bg=(np.abs(im-255).sum(2)<40)    # white background
N=720; ang=np.linspace(0,2*np.pi,N,endpoint=False)
def cast(cx,cy):
  rin=np.full(N,np.nan);ren=np.full(N,np.nan);rw=np.full(N,np.nan)
  for i,a in enumerate(ang):
    dx,dy=np.cos(a),-np.sin(a)
    r=200
    while r<720:
      x,y=int(round(cx+dx*r)),int(round(cy+dy*r))
      if not(0<=x<W and 0<=y<H):break
      if dark[y,x]:
        r2=r
        while r2<r+70 and dark[int(round(cy+dy*r2)),int(round(cx+dx*r2))]:r2+=1
        if 18<=r2-r<=50:
          rin[i]=r;ren[i]=r2
          r3=r2
          while r3<r2+40 and not bg[int(round(cy+dy*r3)),int(round(cx+dx*r3))]:r3+=1
          if r3<r2+40:rw[i]=r3
          break
        r=r2
      r+=1
  return rin,ren,rw
def fourier(r,K,mask=None):
  ok=~np.isnan(r) if mask is None else mask
  A=np.c_[np.ones(N),*[f(k*ang) for k in range(1,K+1) for f in (np.cos,np.sin)]]
  for _ in range(5):
    c,*_=np.linalg.lstsq(A[ok],r[ok],rcond=None);res=r-A@c
    ok=(~np.isnan(r))&(np.abs(res)<max(2.5,3*np.nanstd(res[ok])))
  return A@c,ok
out={}
for side,(cx,cy) in [('L',(764,687)),('R',(2224,685))]:
  for it in range(2):
    rin,ren,rw=cast(cx,cy)
    fi,_=fourier(rin,12)
    p=np.c_[cx+np.cos(ang)*fi,cy-np.sin(ang)*fi];ncx,ncy=(p[:,0].max()+p[:,0].min())/2,(p[:,1].max()+p[:,1].min())/2
    if it==0:cx,cy=ncx,ncy
  out[side]=dict(c=[cx,cy],rin=rin,ren=ren,rw=rw)
  print(side,'valid in',np.sum(~np.isnan(rin)),'wire',np.sum(~np.isnan(rw)),'thick px',np.nanmedian(ren-rin),'metal px',np.nanmedian(rw-ren))
# mirror L onto R angles: angle a on L corresponds to pi-a on R
def mir(arr):idx=(np.round((np.pi-ang)%(2*np.pi)/(2*np.pi)*N).astype(int))%N;return arr[idx]
comb={}
for k in ['rin','ren','rw']:
  R=out['R'][k];L=mir(out['L'][k])
  st=np.vstack([R,L]);d=np.abs(R-L)
  m=np.where(np.isnan(R),L,np.where(np.isnan(L),R,np.where(d<6,(R+L)/2,np.nan)))
  comb[k]=m;print(k,'agree<6px',np.sum(d<6),'disagree',np.sum(d>=6),'both nan',np.sum(np.isnan(m)))
json.dump({s:{k:(v.tolist() if isinstance(v,np.ndarray) else v) for k,v in out[s].items()} for s in out},open('trace2_raw.json','w'),default=lambda o:None)
np.save('comb.npy',np.vstack([comb['rin'],comb['ren'],comb['rw']]))
