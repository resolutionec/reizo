from PIL import Image; import numpy as np, cv2, json
a=np.asarray(Image.open('ref/front.png')).astype(int);H,W,_=a.shape
r,g,b=a[...,0],a[...,1],a[...,2]
pink=((r-g)>=3)&((b-g)>=3)&(a.sum(2)<760)
m=pink.astype(np.uint8)
m=cv2.morphologyEx(m,cv2.MORPH_CLOSE,np.ones((25,25),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m)
idx=np.argsort(st[1:,4])[::-1][:2]+1
for i in idx: print('comp',st[i])
out={}
vis=a.astype(np.uint8).copy()
for i in idx:
  c=(lab==i).astype(np.uint8)
  ff=c.copy();mk=np.zeros((H+2,W+2),np.uint8);cv2.floodFill(ff,mk,(0,0),1);c=c|(1-ff)
  cs=max(cv2.findContours(c,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0],key=cv2.contourArea)[:,0]
  side='R' if cs[:,0].mean()>W/2 else 'L'
  out[side]=cs.tolist();cv2.polylines(vis,[cs.reshape(-1,1,2)],True,(0,160,255),3)
  print(side,'x',cs[:,0].min(),cs[:,0].max(),'y',cs[:,1].min(),cs[:,1].max())
json.dump(out,open('lens_px.json','w'))
Image.fromarray(vis).resize((1500,625)).save('/tmp/l5.png')
