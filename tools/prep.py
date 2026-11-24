from PIL import Image, ImageOps; import numpy as np, json, base64, io
s=0.04896
d=json.load(open('front_px.json'));R=d['R']
def mm(a,step=2):
  a=np.array(a)[::step];return [[round((x-1500)*s,3),round(-(y-683)*s,3)] for x,y in a]
br=np.array(json.load(open('bridge_mm.json')))
# light smoothing of the bridge outline (circular moving average)
k=3;sm=np.array([br[[(i+j)%len(br) for j in range(-k,k+1)]].mean(0) for i in range(len(br))])
crop=Image.open('ref/m8_front_black_gold.png').convert('L').crop((1230,330,1770,640))
crop=ImageOps.autocontrast(crop,cutoff=1)
b=io.BytesIO();crop.save(b,'JPEG',quality=82)
out={'c':[round((R['c'][0]-1500)*s,3),round(-(R['c'][1]-683)*s,3)],'IN':mm(R['inner']),'OUT':mm(R['outer']),
 'BR':[[round(x,2),round(y,2)] for x,y in sm],
 'BRUV':[1/(s*540),(1500-1230)/540,1/(s*310),1-353/310],
 'BRTEX':'data:image/jpeg;base64,'+base64.b64encode(b.getvalue()).decode()}
json.dump(out,open('geo.json','w'),separators=(',',':'))
print(out['c'],len(out['IN']),len(out['BR']),len(out['BRTEX']))
xs=[p[0] for p in out['OUT']];ys=[p[1] for p in out['OUT']];print(min(xs),max(xs),min(ys),max(ys))
xs=[p[0] for p in out['IN']];ys=[p[1] for p in out['IN']];print(min(xs),max(xs),min(ys),max(ys))
