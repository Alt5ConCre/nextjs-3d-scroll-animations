from PIL import Image, ImageDraw
import numpy as np, subprocess, os, sys
W,H=1920,1080; FPS=15; SEG_FRAMES=15; NSEG=8
os.makedirs('public/house/media', exist_ok=True); os.makedirs('public/house/mobile', exist_ok=True)

def gradient(top,bottom):
    t=np.linspace(0,1,H,dtype=np.float32)[:,None,None]
    a=np.array(top,dtype=np.float32)[None,None,:]; b=np.array(bottom,dtype=np.float32)[None,None,:]
    row=(a*(1-t)+b*t).astype(np.uint8)
    return Image.fromarray(np.repeat(row,W,axis=1),'RGB').convert('RGBA')
def rect(d,b,fill,outline=None,width=1): d.rounded_rectangle(b,radius=10,fill=fill,outline=outline,width=width)
def poly(d,p,fill,outline=None,width=1): d.polygon(p,fill=fill); outline and d.line(p+[p[0]],fill=outline,width=width,joint='curve')
def line(d,p,fill,width=1): d.line(p,fill=fill,width=width,joint='curve')
def win(d,x,y,w,h,lit=True):
    rect(d,(x,y,x+w,y+h),(52,72,82) if lit else (29,40,47),outline=(10,14,16),width=10); line(d,[(x+w//2,y+10),(x+w//2,y+h-10)],(15,20,22),8)
def ext():
    img=gradient((28,35,48),(7,10,13)); d=ImageDraw.Draw(img)
    poly(d,[(0,700),(1920,590),(1920,1080),(0,1080)],(20,26,25)); poly(d,[(0,1000),(650,760),(1180,760),(1920,1000),(1920,1080),(0,1080)],(39,40,38)); poly(d,[(1180,800),(1780,790),(1920,850),(1920,990),(1220,970)],(25,57,62))
    bx,by,bw,bh=260,320,1380,420
    poly(d,[(bx,by+bh),(bx+bw,by+bh),(bx+bw-45,by),(bx+45,by)],(187,176,157),(76,70,61),7); poly(d,[(bx-30,by+15),(bx+bw+60,by+15),(bx+bw-20,by-230),(bx+90,by-230)],(173,164,148),(63,60,55),8)
    for i in range(9): line(d,[(bx+110+i*150,by-215),(bx+100+i*150,by+10)],(77,52,35),15)
    win(d,bx+90,by+55,1190,270,True); rect(d,(bx+530,by+170,bx+820,by+590),(26,31,32),outline=(104,92,76),width=8); line(d,[(bx+930,by-90),(bx+1350,by-90)],(30,34,34),8)
    for i in range(7): line(d,[(bx+940+i*65,by-90),(bx+940+i*65-4,by-225)],(30,34,34),6)
    for x in [130,310,1610,1780]: d.ellipse((x-35,720,x+35,810),fill=(25,58,37)); d.ellipse((x-22,660,x+22,750),fill=(35,75,47))
    d.ellipse((bx+625,by+315,bx+730,by+420),fill=(255,202,135)); return img
def room(kind):
    palettes={'foyer':((24,29,30),(10,12,14)),'living':((29,31,30),(12,14,14)),'kitchen':((34,35,33),(15,16,15)),'dining':((28,31,30),(12,14,13)),'suite':((41,36,33),(16,15,14)),'bath':((38,41,39),(15,17,16))}
    img=gradient(*palettes[kind]); d=ImageDraw.Draw(img); poly(d,[(0,680),(1920,680),(1920,1080),(0,1080)],(75,65,54))
    if kind=='foyer':
        for i in range(8): poly(d,[(200+i*150,720-i*35),(850+i*150,720-i*35),(850+i*150,760-i*35),(200+i*150,760-i*35)],(128,111,92),(64,55,47),3)
        line(d,[(160,710),(1020,390)],(160,165,160),9)
        for i in range(8): line(d,[(220+i*110,680-i*38),(220+i*110,510-i*38)],(110,115,111),4)
        rect(d,(1360,440,1810,640),(34,35,35),outline=(165,142,108),width=5)
    elif kind=='living':
        win(d,110,170,760,520,False); win(d,900,170,900,520,True); rect(d,(280,610,1060,810),(110,99,86),outline=(55,49,42),width=6); rect(d,(350,540,1010,675),(124,110,96)); d.ellipse((820,760,1320,900),fill=(76,57,43)); rect(d,(1450,420,1810,710),(43,40,35),outline=(110,92,71),width=7); rect(d,(1510,480,1750,690),(16,15,13))
    elif kind=='kitchen':
        for i in range(6): rect(d,(80+i*300,250,330+i*300,560),(74,66,56),outline=(40,37,33),width=5)
        rect(d,(500,650,1650,825),(168,160,147),outline=(49,45,40),width=6); poly(d,[(650,825),(1650,825),(1650,960),(650,960)],(72,67,61))
        for x in [800,1070,1340]: line(d,[(x,0),(x,560)],(90,85,78),3); d.ellipse((x-30,560,x+30,620),fill=(201,167,114))
    elif kind=='dining':
        win(d,90,120,1740,500,True); poly(d,[(1040,720),(1880,690),(1920,740),(1920,1020),(1100,980)],(18,58,63)); d.ellipse((350,650,1450,870),fill=(94,67,45),outline=(48,36,26))
        for x in [520,760,1000,1240]: rect(d,(x,620,x+90,710),(54,48,43))
    elif kind=='suite':
        win(d,1020,120,760,500,True); rect(d,(220,520,1200,730),(80,64,54),outline=(42,35,30),width=6); rect(d,(300,450,1140,570),(100,86,74)); rect(d,(330,560,1110,770),(213,198,181)); rect(d,(300,800,1120,900),(92,75,58))
        for x in [420,750]: rect(d,(x,490,x+230,550),(233,221,203))
    else:
        for x in [220,700,1180,1660]: line(d,[(x,0),(x+25,1080)],(76,80,75),3)
        for y in [300,600,900]: line(d,[(0,y),(1920,y+10)],(76,80,75),3)
        d.ellipse((550,600,1410,900),fill=(213,209,199),outline=(115,112,105),width=8); d.ellipse((610,640,1350,850),fill=(180,188,185)); rect(d,(120,500,480,690),(90,82,71),outline=(40,37,32),width=6); rect(d,(124,220,480,460),(63,70,69),outline=(145,137,120),width=5); win(d,1480,190,320,620,False)
    return img
plates=[ext()]+[room(k) for k in ['foyer','living','kitchen','dining','suite','bath']]+[ext()]
plates[0].convert('RGB').save('public/house/poster.webp',format='WEBP',quality=90,method=6)
cmd=['ffmpeg','-y','-f','rawvideo','-pix_fmt','rgba','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-vf','scale=3840:2160:flags=lanczos','-c:v','libx264','-preset','ultrafast','-crf','20','-pix_fmt','yuv420p','-movflags','+faststart','public/house/media/luxury-house-master-4k.mp4']
p=subprocess.Popen(cmd,stdin=subprocess.PIPE)
for s in range(NSEG):
    for f in range(SEG_FRAMES):
        pimg=plates[s]; t=f/(SEG_FRAMES-1); scale=1.0+(0.07 if s in (0,7) else 0.045)*(1-abs(2*t-1)); pan=(t-0.5)*(70 if s in (0,7) else 55)
        cw=int(W/scale); ch=int(H/scale); cx=int(W/2+pan); cy=H//2; left=max(0,min(W-cw,cx-cw//2)); top=max(0,min(H-ch,cy-ch//2))
        frame=pimg.crop((left,top,left+cw,top+ch)).resize((W,H),Image.Resampling.LANCZOS)
        if f<2 and s>0: frame=Image.blend(plates[s-1],frame,f/2)
        p.stdin.write(frame.tobytes())
    print('segment',s+1,'/8',file=sys.stderr)
p.stdin.close(); p.wait()
for s in range(NSEG):
    start=s*(SEG_FRAMES/FPS); dur=SEG_FRAMES/FPS; out=f'public/house/mobile/{s+1:02d}.mp4'
    subprocess.run(['ffmpeg','-y','-ss',f'{start:.3f}','-i','public/house/media/luxury-house-master-4k.mp4','-t',f'{dur:.3f}','-vf','scale=854:480:flags=lanczos','-c:v','libx264','-preset','veryfast','-crf','24','-pix_fmt','yuv420p','-an','-movflags','+faststart',out],stdout=subprocess.DEVNULL,stderr=subprocess.DEVNULL)
