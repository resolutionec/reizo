from PIL import Image; import numpy as np, cv2, json
F=json.load(open('front_mm.json'));s=F['s'];cy=F['cy'];X0,Y0=1150,380
# right half in crop px (front photo), from the top centre clockwise
K=[(350,58),(420,58),(470,60),(500,72),(530,86),(553,96),(551,120),(546,160),(540,205),(535,250),(531,290),(527,306),(518,313),(505,313),(497,306),
   (494,285),(495,250),(497,215),(500,180),(503,152),(500,140),(488,125),(470,110),(455,104),(400,104),(350,104)]
from scipy.interpolate import splprep,splev
P=np.array(K,float)
# keep corners sharp at the shoulder tip and the bar top; smooth the long curves with a light Chaikin pass
def chaikin(p,it=2):
  for _ in range(it):
    q=[p[0]]
    for i in range(len(p)-1):q+=[p[i]*.75+p[i+1]*.25,p[i]*.25+p[i+1]*.75]
    q.append(p[-1]);p=np.array(q)
  return p
P=chaikin(P,2)
tomm=lambda x,y:[round((X0+x-1499.5)*s,3),round(-(Y0+y-cy)*s,3)]
half=[tomm(x,y) for x,y in P]
full=[[-x,y] for x,y in half[::-1]]+half[1:-1]
B=json.load(open('bridge_mm.json'));B['BR']=full;json.dump(B,open('bridge_mm.json','w'))
A=np.asarray(Image.open('ref/front.png').convert('RGB')).copy()
px=lambda q:[int(round(1499.5+q[0]/s)),int(round(cy-q[1]/s))]
cv2.polylines(A,[np.array([px(q) for q in full]).reshape(-1,1,2)],True,(255,0,0),2,cv2.LINE_AA)
for sx in [1,-1]:cv2.polylines(A,[np.array([px([sx*q[0],q[1]]) for q in B['SLOT']]).reshape(-1,1,2)],True,(0,0,255),2,cv2.LINE_AA)
Image.fromarray(A[380:900,1150:1850]).save('/tmp/bf.png')
xs=[p[0] for p in full];ys=[p[1] for p in full];print('bridge mm x',min(xs),max(xs),'y',min(ys),max(ys))
