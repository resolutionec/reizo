from PIL import Image; import numpy as np, cv2, json
a=np.asarray(Image.open('ref/bridge.png').convert('RGB')).astype(int)
white=(np.abs(a-255).sum(2)<40)
m=np.load('bmask.npy');AX=532
F=json.load(open('front_mm.json'));s=F['s'];cy=F['cy']
sc=0.0395; topF=440  # close-up mm/px; bar top in the front photo (px)
Y0=143
tomm=lambda x,y:[round((x-AX)*sc,3),round(-((topF-cy)*s+(y-Y0)*sc),3)]
cs,hier=cv2.findContours(m,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_NONE)
outer=max([c for i,c in enumerate(cs) if hier[0][i][3]<0],key=cv2.contourArea)[:,0]
holes=[c[:,0] for i,c in enumerate(cs) if hier[0][i][3]>=0 and cv2.contourArea(c)>200]
# right half of the bar outline above y=300, walked from the top centre clockwise
R=[p for p in outer if p[0]>=AX and p[1]<=300]
R=np.array(R)
top=R[R[:,1]<200];right_top=top[np.argsort(top[:,0])]
# split: upper edge (top surface) vs lower edge (opening) by y for each x — simpler: order by angle around a point inside the shoulder
ctr=np.array([AX+150,230.])
ang=np.arctan2(R[:,1]-ctr[1],R[:,0]-ctr[0]);R=R[np.argsort(ang)]
# legs below y=300: inner edge from the white opening, outer edge = inner + 40 px
legin=[];legout=[]
for y in range(300,436,4):
  xs=np.where(white[y,AX:AX+260])[0]
  if not len(xs):continue
  xi=AX+xs.max()+1 if False else AX+np.argmax(~white[y,AX:AX+260][::1].astype(bool)[xs.max():]==0)
  # first metal pixel to the right of the opening
  row=white[y,AX:AX+300];k=np.where(~row)[0];xi=AX+k[0] if len(k) else None
  legin.append((xi,y));legout.append((xi+40,y))
print('leg inner x top/bottom',legin[0],legin[-1])
# assemble the right half: from axis at the bar top, along the top edge to the outer shoulder, down the outer leg, round the foot, up the inner leg, along the bar underside to the axis
up=[p for p in outer if p[0]>=AX and p[1]<=300]
up=np.array(up)
# top surface: for each x the min y; underside (opening): for x between axis and leg the max y of the bar above y 300
xsr=np.arange(AX,up[:,0].max()+1,3)
topE=[(x,up[up[:,0]==x][:,1].min()) for x in xsr if (up[:,0]==x).any()]
inner_bar=[]
for x in range(AX,legin[0][0],3):
  col=white[150:300,x];k=np.where(col)[0]
  if len(k):inner_bar.append((x,150+k[0]))
# outer edge of the shoulder from the outermost top point down to y=300
xo_top=topE[-1]
outer_side=[]
for y in range(xo_top[1],300,4):
  row=m[y,AX:];k=np.where(row)[0]
  if len(k):outer_side.append((AX+k.max(),y))
foot=[(legout[-1][0]-20+20*np.cos(t),legout[-1][1]+12*np.sin(t)) for t in np.linspace(0,np.pi,9)]
half=topE+outer_side+legout+foot+legin[::-1]+inner_bar[::-1]
half=[tomm(x,y) for x,y in half]
full=[[-x,y] for x,y in half[::-1]][:-1]+half
holeR=[h for h in holes if h[:,0].mean()>AX][0]
slot=[tomm(x,y) for x,y in holeR[::3]]
json.dump({'BR':full,'SLOT':slot},open('bridge_mm.json','w'))
xs=[p[0] for p in full];ys=[p[1] for p in full];print('bridge mm x',min(xs),max(xs),'y',min(ys),max(ys),'pts',len(full))
# overlay on the front photo
A=np.asarray(Image.open('ref/front.png').convert('RGB')).copy()
px=lambda q:[int(1499.5+q[0]/s),int(cy-q[1]/s)]
cv2.polylines(A,[np.array([px(q) for q in full]).reshape(-1,1,2)],True,(255,0,0),2,cv2.LINE_AA)
for sx in [1,-1]:cv2.polylines(A,[np.array([px([sx*q[0],q[1]]) for q in slot]).reshape(-1,1,2)],True,(0,0,255),2,cv2.LINE_AA)
L=np.array(F['lens_px']);
for sx in [1,-1]:
  Q=L.copy();Q[:,0]=Q[:,0] if sx>0 else 2999-Q[:,0];cv2.polylines(A,[Q.astype(np.int32).reshape(-1,1,2)],True,(0,140,255),2,cv2.LINE_AA)
Image.fromarray(A[380:900,1150:1850]).save('/tmp/bf.png')
