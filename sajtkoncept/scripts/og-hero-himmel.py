"""OG-heron: byt himmel och förläng en drönarbild till vinterbildens mått (2500x2798, horisont y=1532).
Körning (från sajtkoncept/og/desktop):
  python3 ../../scripts/og-hero-himmel.py <scratch> "<källbild>" assets/img/og-hero-sky.jpg assets/img/og-hero-sky-summer
Himlen = vinterbildens radprofil, tonad mot källans horisontfärg sista 220 px. Landskapet = källans pixlar.
Kräver numpy + Pillow. Byggd 2026-11-19 för DJI_20250630211758_0812_D (Webb_sommar)."""
import sys
import numpy as np
from PIL import Image
S, src, winter, out = sys.argv[1:5]
o=np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H0,W=o.shape[:2]
lum=0.2126*o[...,0]+0.7152*o[...,1]+0.0722*o[...,2]
# Horisont per kolumn: första raden där 15 rader i följd är mörka (skog/berg).
seg=lum[250:900]<120
cs=np.cumsum(np.vstack([np.zeros((1,W)),seg]),axis=0)
run=(cs[15:]-cs[:-15])>=14
hz=np.where(run.any(0), run.argmax(0)+250, 500).astype(np.float32)
# median i fönster 41 px
k=20; hp=np.pad(hz,k,mode='edge')
hz=np.array([np.median(hp[i:i+2*k+1]) for i in range(W)])
print('horisont min/median/max', hz.min(), np.median(hz), hz.max())
H=2798; HZ=1532                      # samma mått och horisont som vinterbilden (61,3vw)
dy=int(HZ-np.median(hz))
print('dy',dy,'tappar nederst',H0+dy-H)
# Himmel: vinterns egen himmelprofil (radmedel), tonad mot sommarens horisontfärg sista 220 px.
wi=np.asarray(Image.open(winter).convert('RGB').resize((W,H))).astype(np.float32)
prof=wi[:, W//4:3*W//4].mean(1)        # (H,3)
canvas=np.repeat(prof[:,None,:],W,axis=1)
# sommarens himmelfärg strax ovanför horisonten, per kolumn (utjämnad)
sky_s=np.stack([o[max(int(h)-40,0):int(h)-12, x].mean(0) for x,h in enumerate(hz)])
kk=60; sp=np.pad(sky_s,((kk,kk),(0,0)),mode='edge'); c=np.cumsum(sp,0)
sky_s=(c[2*kk:]-c[:-2*kk])/(2*kk)
ys=np.arange(H)[:,None]
hzc=(hz+dy)[None,:]
t=np.clip(1-(hzc-ys)/220,0,1)[...,None]**1.5
canvas=canvas*(1-t)+sky_s[None,:,:]*t
# Lägg in originalet under horisonten med luminansmatte i ett band runt horisonten.
y0=max(dy,0)
orig_on=np.zeros_like(canvas); orig_on[y0:min(H,H0+dy)]=o[y0-dy:min(H,H0+dy)-dy]
L=0.2126*orig_on[...,0]+0.7152*orig_on[...,1]+0.0722*orig_on[...,2]
rel=ys-hzc   # <0 ovanför horisont
a_band=np.clip((190-L)/(190-120),0,1)
a=np.where(rel<-35,0.0,np.where(rel>8,1.0,a_band))
a[:y0]=0
canvas=canvas*(1-a[...,None])+orig_on*a[...,None]
im=Image.fromarray(np.clip(canvas,0,255).astype(np.uint8))
im.save(out+'.jpg',quality=86,optimize=True,progressive=True)
im.resize((1600,int(1600*H/W)),Image.LANCZOS).save(out+'-1600.jpg',quality=84,optimize=True,progressive=True)
im.resize((500,int(500*H/W))).save(S+'/summer-preview.jpg')
# flottens läge i ny bild (orig ca y=1251 vid x≈0.42W)
print('flotte y', 1251+dy, 'av', H, '= under horisont', 1251-np.median(hz))
