from PIL import Image; import numpy as np, cv2, json
im=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).astype(int)
nw=(np.abs(im-255).sum(2)>45).astype(np.uint8)
d=json.load(open('front_px.json'))
s=0.04896
x0,x1,y0,y1=1500,1780,320,640
m=nw.copy()
# remove right ring: inside the ring's outer contour dilated by 4px
ring=np.zeros_like(m);cv2.fillPoly(ring,[np.array(d['R']['outer'],np.int32)],1)
ring=cv2.dilate(ring,np.ones((9,9),np.uint8))
m[ring>0]=0
m[:,:x0]=0;m[:,x1:]=0;m[:y0]=0;m[y1:]=0
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((7,7),np.uint8))
# mirror to the left to make a symmetric closed shape across axis
L=m[:,x0:x1];full=np.zeros_like(m);full[:,x0:x1]=L;full[:,x0-(x1-x0):x0]=L[:,::-1]
n,lab,st,_=cv2.connectedComponentsWithStats(full);k=1+st[1:,4].argmax();b=(lab==k).astype(np.uint8)
# fill holes
ff=b.copy();h,w=ff.shape;mask=np.zeros((h+2,w+2),np.uint8);cv2.floodFill(ff,mask,(0,0),1);b=b|(1-ff)
cs,_=cv2.findContours(b,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE);c=max(cs,key=cv2.contourArea)[:,0,:]
c=cv2.approxPolyDP(c.reshape(-1,1,2),1.2,True)[:,0,:]
pts=[[round((x-1500)*s,2),round(-(y-683)*s,2)] for x,y in c]
print(len(pts),min(p[0] for p in pts),max(p[0] for p in pts),min(p[1] for p in pts),max(p[1] for p in pts))
json.dump(pts,open('bridge_mm.json','w'))
vis=np.asarray(Image.open('ref/m8_front_black_gold.png').convert('RGB')).copy()
cv2.polylines(vis,[c.reshape(-1,1,2).astype(np.int32)],True,(255,0,0),3)
Image.fromarray(vis[300:700,1150:1850]).save('/tmp/bridge_vis.png')
