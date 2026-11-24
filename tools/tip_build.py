import json,numpy as np
t=json.load(open('temple_mm.json'));O=np.array(t['outer'],float);f=json.load(open('tip_fit.json'))
P=np.array(f['P']);c=np.array(f['c']);r=f['r'];R=r+1.2
a=(c-P)/np.linalg.norm(c-P);n=np.array([-a[1],a[0]])
def tangents(Q,c,R):
  d=Q-c;L=np.linalg.norm(d);th=np.arctan2(d[1],d[0]);al=np.arccos(R/L)
  return [c+R*np.array([np.cos(th+s*al),np.sin(th+s*al)]) for s in (1,-1)]
def arc(c,R,p0,p1,ccw,N=40):
  a0=np.arctan2(*(p0-c)[::-1]);a1=np.arctan2(*(p1-c)[::-1])
  if ccw and a1<a0:a1+=2*np.pi
  if not ccw and a1>a0:a1-=2*np.pi
  return [c+R*np.array([np.cos(x),np.sin(x)]) for x in np.linspace(a0,a1,N)]
# ---- hole: tangent lines from the point P to the round end, closed by the far arc
T1,T2=tangents(P,c,r)
s1=(T1-P)[0]*a[1]-(T1-P)[1]*a[0]
if s1<0:T1,T2=T2,T1
hole=[P]+[P+(T1-P)*k/10 for k in range(1,10)]+arc(c,r,T1,T2,ccw=False)+[T2+(P-T2)*k/10 for k in range(1,10)]
# make sure the arc goes round the far side (away from P)
mid=hole[len(hole)//2]
if np.dot(mid-c,a)<0:hole=[P]+[P+(T1-P)*k/10 for k in range(1,10)]+arc(c,r,T1,T2,ccw=True)+[T2+(P-T2)*k/10 for k in range(1,10)]
# ---- outer: cut the traced outline at a section 3 mm before P, then two tangents and the round end
S=P-a*3.0
idx=[i for i in range(len(O)) if np.dot(O[i]-S,a)>-0.3]
side=lambda p:np.dot(p-S,n)
# section crossing points on each side: the outline points nearest the section line
cand=sorted(range(len(O)),key=lambda i:abs(np.dot(O[i]-S,a)))
iA=next(i for i in cand if side(O[i])>0);iB=next(i for i in cand if side(O[i])<0)
print('section pts',O[iA],O[iB])
# walk the ring from iA to iB the short way that goes through the tip region
N=len(O)
def path(i,j,step):
  out=[i]
  while out[-1]!=j:out.append((out[-1]+step)%N)
  return out
p1=path(iA,iB,1);p2=path(iA,iB,-1)
tipside=p1 if max(np.dot(O[k]-S,a) for k in p1)>max(np.dot(O[k]-S,a) for k in p2) else p2
keep=p2 if tipside is p1 else p1   # outline from iA back round the hinge to iB
QA,QB=O[iA],O[iB]
tA=min(tangents(QA,c,R),key=lambda p:np.dot(p-c,-a)*-1+np.linalg.norm(p-QA)*0) # pick tangent on A's side
tA=[p for p in tangents(QA,c,R) if side(p)>0];tA=tA[0] if tA else tangents(QA,c,R)[0]
tB=[p for p in tangents(QB,c,R) if side(p)<0];tB=tB[0] if tB else tangents(QB,c,R)[0]
cap=arc(c,R,tA,tB,ccw=True);
if np.dot(cap[len(cap)//2]-c,a)<0:cap=arc(c,R,tA,tB,ccw=False)
newtip=[QA+(tA-QA)*k/8 for k in range(1,8)]+cap+[tB+(QB-tB)*k/8 for k in range(1,8)]
ring=[O[k] for k in keep[::-1]] # iB ... iA (around hinge)
outer=ring+newtip if np.linalg.norm(ring[-1]-QA)<1e-6 else [O[k] for k in keep]+newtip[::-1]
# light smoothing of the traced part (Chaikin, two passes)
def chaikin(pts,it=2):
  p=np.array(pts)
  for _ in range(it):
    q=[];m=len(p)
    for i in range(m):
      a0,b0=p[i],p[(i+1)%m];q+= [a0*.75+b0*.25,a0*.25+b0*.75]
    p=np.array(q)
  return p
outer=chaikin(outer,2)
json.dump({'outer':np.round(outer,3).tolist(),'hole':np.round(np.array(hole),3).tolist()},open('tip_out.json','w'))
print(len(outer),len(hole))
# preview
from PIL import Image,ImageDraw
im=Image.new('RGB',(1400,700),'white');d=ImageDraw.Draw(im)
S2=lambda p:(1400-(p[0]-40)*12,60-p[1]*12)
d.polygon([S2(p) for p in outer],outline='black');d.polygon([S2(p) for p in hole],outline='blue')
im.save('/tmp/tipprev.png')
