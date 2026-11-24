from PIL import Image; import numpy as np, cv2, json
im=np.asarray(Image.open('ref/m8_front_black_gold.png')).astype(int)
dark=(im.mean(2)<70);H,W=dark.shape
def polar(cx,cy,bad):
  ang=np.linspace(0,2*np.pi,360,endpoint=False);rin=[];rout=[]
  for a in ang:
    dx,dy=np.cos(a),-np.sin(a);hit=None;r=150
    while r<700:
      x,y=int(cx+dx*r),int(cy+dy*r)
      if not(0<=x<W and 0<=y<H):break
      if dark[y,x]:hit=r;break
      r+=1
    if hit is None:rin.append(np.nan);rout.append(np.nan);continue
    r=hit
    while r<hit+80 and dark[int(cy+dy*r),int(cx+dx*r)]:r+=1
    rin.append(hit);rout.append(r if r-hit>15 else np.nan)
  rin=np.array(rin,float);rout=np.array(rout,float)
  deg=np.degrees(ang)
  for lo,hi in bad: rin[(deg>=lo)&(deg<=hi)]=np.nan; rout[(deg>=lo)&(deg<=hi)]=np.nan
  def robust(arr,K=5):
    A=np.c_[np.ones(360),*[f(k*ang) for k in range(1,K+1) for f in (np.cos,np.sin)]]
    ok=~np.isnan(arr)
    for _ in range(6):
      c,*_=np.linalg.lstsq(A[ok],arr[ok],rcond=None);res=arr-A@c
      ok=(~np.isnan(arr))&(np.abs(res)<max(3,2.5*np.nanstd(res[ok])))
    return A@c
  return ang,robust(rin),robust(rout)
out={}
for side,(cx,cy),bad in [('L',(780,682),[(150,265)]),('R',(2220,682),[(275,30+360),(0,30)])]:
  for it in range(3):
    ang,rin,rout=polar(cx,cy,bad)
    pin=np.c_[cx+np.cos(ang)*rin,cy-np.sin(ang)*rin]
    cx,cy=(pin[:,0].max()+pin[:,0].min())/2,(pin[:,1].max()+pin[:,1].min())/2
  pout=np.c_[cx+np.cos(ang)*rout,cy-np.sin(ang)*rout]
  out[side]={'c':[cx,cy],'inner':pin.tolist(),'outer':pout.tolist()}
  print(side,'c',round(cx),round(cy),'inner w,h',round(np.ptp(pin[:,0])),round(np.ptp(pin[:,1])),'outer w,h',round(np.ptp(pout[:,0])),round(np.ptp(pout[:,1])),'ring',round(float(np.median(rout-rin)),1))
json.dump(out,open('front_px.json','w'))
ov=np.asarray(Image.open('ref/m8_front_black_gold.png')).copy()
for s in out.values():
  for k,c in (('outer',(255,0,0)),('inner',(0,160,255))):cv2.polylines(ov,[np.array(s[k],np.int32).reshape(-1,1,2)],True,c,4)
Image.fromarray(ov).resize((1500,625)).save('trace_front.png')
