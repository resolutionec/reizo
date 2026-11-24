from PIL import Image; import numpy as np, cv2, json
im=np.asarray(Image.open('ref/m3_side.png').convert('RGB')).astype(int);H,W,_=im.shape
nw=(np.abs(im-255).sum(2)>40).astype(np.uint8)
r,g,b=im[...,0],im[...,1],im[...,2]
teal=((g-r>12)&(b-r>12)).astype(np.uint8)
# near temple: columns left of the joint; keep runs within 75px of the topmost run (drops the far temple)
X0=2697
shadow=(im.max(2)-im.min(2)<14)&(im.mean(2)>150)
m=(nw&~shadow).astype(np.uint8);m[:,X0:]=0;m[:430]=0
far=np.array([[1060,690],[1175,655],[1175,700],[1120,1140],[480,1140],[540,960]],np.int32)
cv2.fillPoly(m,[far],0)
m[1150:]=0
def edges(x):
  ys=np.where(m[:,x])[0];r=np.split(ys,np.where(np.diff(ys)>1)[0]+1)[0];return r[0],r[-1]
xa,xb=1000,1230;ya,yb=edges(xa)[1],edges(xb)[1]
for x in range(xa,xb+1):
  t,_=edges(x);yl=int(round(ya+(yb-ya)*(x-xa)/(xb-xa)));m[t:yl+1,x]=1;m[yl+1:yl+60,x]=0
m=cv2.morphologyEx(m,cv2.MORPH_OPEN,np.ones((3,3),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(m);k=1+st[1:,4].argmax();m=(lab==k).astype(np.uint8)
cs,hier=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
areas=[cv2.contourArea(c) for c in cs];oi=int(np.argmax(areas))
outer=cs[oi][:,0];holes=[cs[i][:,0] for i in range(len(cs)) if hier[0][i][3]==oi and areas[i]>300]
hm=np.zeros_like(m);[cv2.fillPoly(hm,[h.reshape(-1,1,2)],1) for h in holes];hm=cv2.dilate(hm,np.ones((9,9),np.uint8));holes=[c[:,0] for c in cv2.findContours(hm,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0]]
tm=(teal&m);tm=cv2.morphologyEx(tm,cv2.MORPH_CLOSE,np.ones((5,5),np.uint8));tm=cv2.morphologyEx(tm,cv2.MORPH_OPEN,np.ones((5,5),np.uint8))
n,lab,st,_=cv2.connectedComponentsWithStats(tm);k=1+st[1:,4].argmax();tm=(lab==k).astype(np.uint8)
tc=max(cv2.findContours(tm,cv2.RETR_EXTERNAL,cv2.CHAIN_APPROX_NONE)[0],key=cv2.contourArea)[:,0]
print('outer',len(outer),'holes',[len(h) for h in holes],'teal x',tc[:,0].min(),tc[:,0].max())
vis=im.astype(np.uint8).copy()
cv2.polylines(vis,[outer.reshape(-1,1,2)],True,(255,0,0),3);[cv2.polylines(vis,[h.reshape(-1,1,2)],True,(0,0,255),3) for h in holes]
cv2.polylines(vis,[tc.reshape(-1,1,2)],True,(0,200,0),2)
Image.fromarray(vis).resize((1500,625)).save('/tmp/st_full.png')
Image.fromarray(vis[420:620,2380:2760]).resize((760,400)).save('/tmp/st_flame.png')
Image.fromarray(vis[540:700,1150:1550]).resize((800,320)).save('/tmp/st_dia.png')
Image.fromarray(vis[620:1180,80:900]).save('/tmp/st_tip.png')
ss=45.94/866;Y0=512
def mm(c,eps=0.8,k=4):
  c=c.astype(float);n=len(c);c=np.array([c[[(i+j)%n for j in range(-k,k+1)]].mean(0) for i in range(n)])
  c=cv2.approxPolyDP(c.reshape(-1,1,2).astype(np.float32),eps,True)[:,0]
  return [[round(float(X0-x)*ss,3),round(float(Y0-y)*ss,3)] for x,y in c]
json.dump({'ss':ss,'outer':mm(outer),'holes':[mm(h) for h in holes],'teal':mm(tc)},open('temple_mm.json','w'))
