import numpy as np, cv2
from PIL import Image
im=np.asarray(Image.open('/mnt/user-data/uploads/7c039960-image.png').convert('RGB')).astype(np.float32)
bg=np.array([236,244,249],np.float32)
d=np.sqrt(((im-bg)**2).sum(2))
S=6  # upsample for smooth outlines
d=cv2.resize(d,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
d=cv2.GaussianBlur(d,(0,0),S*0.8)
m=(d>70).astype(np.uint8)*255
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(S*2+1,S*2+1)))
# keep the orbit ring visually separate from the globe: split by hue, cut a thin gap around the globe
up=cv2.resize(im,None,fx=S,fy=S,interpolation=cv2.INTER_CUBIC)
orange=((up[...,0]>up[...,2]+30)&(m>0)).astype(np.uint8)*255
blue=((m>0)&(orange==0)).astype(np.uint8)*255
blue=cv2.morphologyEx(blue,cv2.MORPH_OPEN,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(S*2+1,S*2+1)))
gap=cv2.dilate(blue,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(int(S*5),int(S*5))))
orange=cv2.morphologyEx(orange,cv2.MORPH_CLOSE,cv2.getStructuringElement(cv2.MORPH_ELLIPSE,(S*2+1,S*2+1)))
orange[gap>0]=0
m=np.maximum(blue,orange)
cs,hier=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
ys,xs=np.where(m>0);x0,y0,x1,y1=xs.min(),ys.min(),xs.max(),ys.max();pad=S*4
W,H=(x1-x0+2*pad)/S,(y1-y0+2*pad)/S
def smooth_path(c):
  pts=c[:,0,:].astype(float)
  if cv2.contourArea(c)<(S*3)**2: return ''
  # resample, smooth, then emit Catmull-Rom as cubic beziers
  L=np.r_[0,np.cumsum(np.hypot(*np.diff(np.vstack([pts,pts[:1]]),axis=0).T))]
  n=max(24,int(L[-1]/(S*2.2)));t=np.linspace(0,L[-1],n,endpoint=False)
  P=np.c_[np.interp(t,L,np.r_[pts[:,0],pts[0,0]]),np.interp(t,L,np.r_[pts[:,1],pts[0,1]])]
  for _ in range(2):P=(np.roll(P,1,0)+2*P+np.roll(P,-1,0))/4
  P=(P-[x0-pad,y0-pad])/S
  out=f'M{P[0,0]:.2f} {P[0,1]:.2f}'
  for i in range(len(P)):
    p0,p1,p2,p3=P[i-1],P[i],P[(i+1)%len(P)],P[(i+2)%len(P)]
    c1=p1+(p2-p0)/6;c2=p2-(p3-p1)/6
    out+=f'C{c1[0]:.2f} {c1[1]:.2f} {c2[0]:.2f} {c2[1]:.2f} {p2[0]:.2f} {p2[1]:.2f}'
  return out+'Z'
d_all=''.join(smooth_path(c) for c in cs)
svg=f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W:.1f} {H:.1f}" width="{W:.0f}" height="{H:.0f}"><title>Pro-Vision Optical mark</title><path fill="#000" fill-rule="evenodd" d="{d_all}"/></svg>'
open('/home/claude/provision/img/provision-logo-black.svg','w').write(svg)
import cairosvg
cairosvg.svg2png(bytestring=svg.encode(),write_to='/home/claude/provision/img/provision-logo-black.png',output_width=1200)
print('contours',len(cs),'viewBox',round(W,1),round(H,1),'bytes',len(svg))
