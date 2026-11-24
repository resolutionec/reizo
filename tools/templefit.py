import numpy as np, cv2, json
near=np.load('near.npy').astype(np.uint8)*255
near=cv2.morphologyEx(near,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
c=max(cv2.findContours(near,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0],key=cv2.contourArea)[:,0,:].astype(float)
# level the straight rear section (top edge x 640..813 slopes up to the right)
th=np.arctan2(114-91,813-643)
X0,Y0=813,91
def tf(p):  # image px -> temple (u along arm toward tip, v up), mm
  dx,dy=p[:,0]-X0,p[:,1]-Y0
  xr= dx*np.cos(th)-dy*np.sin(th)   # rotate so top edge is horizontal
  yr= dx*np.sin(th)+dy*np.cos(th)
  return np.c_[-xr, -yr]
s=12/86.0                    # 86px thick section -> 12mm, matching the arm height at that point
P=tf(c)*s
# drop the image-edge cut (rightmost column) so we can join the front of the arm there
keep=c[:,0]<812
P=P[keep]
# order: start at top-right (u min, v max) and walk to bottom-right
i0=np.argmin(P[:,0]-P[:,1]*.01); P=np.roll(P,-i0,0)
if P[5,0]<P[0,0]: P=P[::-1]
# simplify + smooth
P=cv2.approxPolyDP(P.astype(np.float32).reshape(-1,1,2),.08,False)[:,0,:]
U0=40.0;VT=6.6
P[:,0]+=U0; P[:,1]+=VT
print('traced u range',P[:,0].min().round(1),P[:,0].max().round(1),'v range',P[:,1].min().round(1),P[:,1].max().round(1))
print('start',P[0].round(2),'end',P[-1].round(2),'n',len(P))
json.dump([[round(float(x),2),round(float(y),2)] for x,y in P],open('temple.json','w'))
# preview
import PIL.Image as I, PIL.ImageDraw as D
im=I.new('RGB',(900,320),'white');d=D.Draw(im);k=5
pts=[(30+x*k,60-y*k) for x,y in [(0,7.2)]+P.tolist()+[(0,-6.8)]];d.line(pts+pts[:1],fill='black',width=2);im.save('temple_prof.png')
