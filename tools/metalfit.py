import numpy as np, cv2, json, base64, io
from PIL import Image, ImageOps, ImageFilter
U='/mnt/user-data/uploads/'
def gray(img):
  g=ImageOps.autocontrast(img.convert('L'),cutoff=1).filter(ImageFilter.UnsharpMask(radius=1.2,percent=60))
  # lift into a bright-silver range (dark swirls stay readable) so the metal tint doesn't go muddy
  return g.point(lambda v:int(95+160*((v/255)**0.8)))
def b64(img,q=82):
  bf=io.BytesIO();img.save(bf,'JPEG',quality=q);return 'data:image/jpeg;base64,'+base64.b64encode(bf.getvalue()).decode()
out={}
# ---------- end-piece (image 1): px -> ep-local mm ----------
s=0.0457; L=lambda px,py:[round(-3.4+(232-px)*s,3),round(.5+(505-py)*s,3)]
plate=[(228,119),(245,114),(262,119),(272,132),(273,147),(265,159),(250,167),(238,178),(230,192),(228,210),(228,440),(236,460),(241,480),(236,496),(224,504),(209,506),(195,500),(184,484),(171,463),(162,445),(162,352),(152,352),(152,178),(157,166),(175,150),(200,134),(218,122)]
up=[(166,172),(222,131),(233,136),(227,165),(223,200),(222,262),(164,262),(163,182)]
lo=[(168,358),(218,358),(218,440),(206,455),(186,455),(169,440)]
out['endPlate']=[L(*p) for p in plate];out['endUp']=[L(*p) for p in up];out['endLo']=[L(*p) for p in lo]
out['endRivets']=[L(245,140),L(212,485)];out['crystal']=L(180,312);out['tbar']={'x0':L(232,0)[0],'x1':L(62,0)[0],'y0':L(0,352)[1],'y1':L(0,268)[1]}
im1=Image.open(U+'21de8bb6-image.png').convert('RGB')
X0,Y0,W1,H1=140,100,145,420
out['endTex']=b64(gray(im1.crop((X0,Y0,X0+W1,Y0+H1)).resize((W1*2,H1*2),Image.LANCZOS)))
# uv: px=232-(x+3.4)/s ; u=(px-X0)/W1 ; py=505-(y-.5)/s ; v=1-(py-Y0)/H1
out['endUV']=[-1/(s*W1),(232-3.4/s-X0)/W1, 1/(s*H1), 1-(505+.5/s-Y0)/H1]
# ---------- brow bar (image 2) ----------
sb=69.2/1440; cx=775
pb=lambda px,py:[round((px-cx)*sb,3),round(32.1-(py-78)*sb,3)]
inner=[(305,131),(345,90),(1195,90),(1238,122),(1195,163),(345,163)]
out['barInner']=[pb(*p) for p in inner]
im2=Image.open(U+'ec359e2b-image.png').convert('RGB')
BX,BY,BW,BH=290,75,960,105
out['barTex']=b64(gray(im2.crop((BX,BY,BX+BW,BY+BH))))
out['barUV']=[1/(sb*BW),(cx-BX)/BW, 1/(sb*BH), 1-(78+32.1/sb-BY)/BH]
# ---------- temple plate (image 3): rectify the engraved panel ----------
im3=np.asarray(Image.open(U+'fd3bafc0-image.png').convert('RGB'))
src=np.float32([(565,300),(1030,150),(1050,203),(565,392)])
TW,TH=1100,128
dst=np.float32([(0,0),(900,0),(900,TH),(0,TH)])
Mx=cv2.getPerspectiveTransform(src,dst);rect=cv2.warpPerspective(im3,Mx,(TW,TH),borderMode=cv2.BORDER_REPLICATE)
out['tplTex']=b64(gray(Image.fromarray(rect)))
# inlay local: x 9.5..60.6 -> u 0..900/TW ; y -3..3.4 -> v 0..1
out['tplUV']=[900/TW/51.1,-9.5*900/TW/51.1, 1/6.4, 3/6.4]
# clasp bands: straight crops
b1=gray(Image.fromarray(im3[250:485,447:490]));b2=gray(Image.fromarray(im3[245:470,503:541]))
band=Image.new('L',(b1.width+b2.width,max(b1.height,b2.height)));band.paste(b1,(0,0));band.paste(b2,(b1.width,0))
out['bandTex']=b64(b1.resize((64,256)))
Image.fromarray(rect).save('tpl_rect.png');gray(im2.crop((BX,BY,BX+BW,BY+BH))).save('bar_tex.png')
json.dump(out,open('metal.json','w'))
print({k:(len(v) if isinstance(v,(list,str)) else v) for k,v in out.items()})
