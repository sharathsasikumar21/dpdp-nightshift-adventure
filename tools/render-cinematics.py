"""Reproducible original motion graphics and synth score. Requires Pillow, numpy,
and imageio-ffmpeg. Run from repository root; no downloaded artwork or music."""
from pathlib import Path
import math, random, subprocess, wave, tempfile, sys
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import imageio_ffmpeg

W, H, FPS, DURATION = 960, 540, 24, 14
OUT = Path('3d/media'); OUT.mkdir(parents=True, exist_ok=True)
FONT = Path('C:/Windows/Fonts')
def font(size, bold=False):
    return ImageFont.truetype(str(FONT / ('bahnschrift.ttf' if bold else 'consola.ttf')), size)
GREEN, WHITE, AMBER = (168, 248, 207), (235, 246, 240), (245, 181, 120)
rng = random.Random(1701)
buildings = [[(rng.randrange(-180, W+240), rng.randrange(32, 104), rng.randrange(65, 280), rng.randrange(9999)) for _ in range(24)] for _ in range(3)]
rain = [(rng.random()*W, rng.random()*H, rng.uniform(20, 48)) for _ in range(90)]
nodes = [(rng.randrange(70, W-70), rng.randrange(130, 370)) for _ in range(12)]
def smooth(x):
    x=max(0,min(1,x)); return x*x*(3-2*x)
def envelope(t,a,b): return smooth((t-a)/.65)*smooth((b-t)/.65)
def label(layer, text, y, size, color=WHITE, alpha=1, bold=False):
    if alpha <= .001: return
    d=ImageDraw.Draw(layer); f=font(size,bold); box=d.textbbox((0,0),text,font=f)
    d.text(((W-box[2])/2,y), text, font=f, fill=(*color,int(255*alpha)))
def frame(t, credits=False, ending=None):
    dawn=smooth(t/12) if credits else 0
    yy=np.linspace(0,1,H)[:,None,None]
    top=np.array([5,13,24]); bottom=np.array([14+38*dawn,43+14*dawn,49+4*dawn])
    bg=np.tile((top*(1-yy)+bottom*yy).astype('uint8'),(1,W,1))
    im=Image.fromarray(bg); d=ImageDraw.Draw(im)
    # Slow camera drift, layered skyline and warm sunrise behind the silhouettes.
    glow=Image.new('RGBA',(W,H)); gd=ImageDraw.Draw(glow)
    cx=705-int(t*1.5); cy=240-int(dawn*30)
    gd.ellipse((cx-58,cy-58,cx+58,cy+58), fill=(247,183,120,int(75+100*dawn)))
    im=Image.alpha_composite(im.convert('RGBA'),glow.filter(ImageFilter.GaussianBlur(32)))
    d=ImageDraw.Draw(im)
    for depth, layer in enumerate(buildings):
        ground=394+depth*27
        for x,bw,bh,seed in layer:
            x=int(x-t*(1.8+depth*3)); bh=int(bh*(.64+depth*.2))
            shade=(12-depth*3,29-depth*6,37-depth*6)
            d.rectangle((x,ground-bh,x+bw,ground),fill=shade)
            d.line((x,ground-bh,x+bw,ground-bh),fill=(34,60,65),width=1)
            br=random.Random(seed)
            for wx in range(x+7,x+bw-3,12):
                for wy in range(ground-bh+12,ground-6,17):
                    if br.random()<.38:
                        col=(92,140,135) if br.random()<.68 else (158,116,79)
                        d.rectangle((wx,wy,wx+3,wy+5),fill=col)
    # Wet boulevard, vanishing point and drifting reflected light.
    d.polygon([(435,390),(535,390),(860,H),(90,H)],fill=(7,17,23))
    for j in range(9):
        y=400+((j*19+t*22)%140)
        spread=(y-388)*2.6
        d.line((480-spread,y,480+spread,y),fill=(20,51,54),width=1)
    for j in range(6):
        p=(j/6+t*.055)%1; y=392+150*p*p; x=480+(95+45*j)*p
        d.line((x,y,x+8*p+1,y),fill=AMBER,width=2)
    overlay=Image.new('RGBA',(W,H)); od=ImageDraw.Draw(overlay)
    for x,y,length in rain:
        rx=(x-t*35)%W; ry=(y+t*210)%H
        od.line((rx,ry,rx-7,ry+length),fill=(148,201,212,24 if credits else 42),width=1)
    # Data traces reveal the network beneath the city.
    net=envelope(t,2.6,9.6) if not credits else .25
    for i in range(len(nodes)-1):
        x,y=nodes[i]; xx,yy=nodes[i+1]
        od.line((x,y,xx,yy),fill=(*GREEN,int(38*net)),width=1)
        p=(t*.36+i*.17)%1; px=x+(xx-x)*p; py=y+(yy-y)*p
        od.ellipse((px-2,py-2,px+2,py+2),fill=(*GREEN,int(230*net)))
        od.ellipse((x-4,y-4,x+4,y+4),outline=(*GREEN,int(130*net)))
    # Letterbox and broad text scrim retain readability on a small phone.
    od.rectangle((0,0,W,55),fill=(2,8,13,245)); od.rectangle((0,H-55,W,H),fill=(2,8,13,245))
    od.rectangle((0,152,W,368),fill=(3,11,18,145))
    od.line((62,77,124,77),fill=(*GREEN,190),width=2)
    od.text((62,90),'N / OPERATIONS FILM',font=font(12),fill=(*GREEN,180))
    od.text((W-200,H-38),'06:00 / HANDOVER' if credits or ending else '01:17 / INCOMING',font=font(12),fill=(*GREEN,180))
    if ending:
        # A wide shield at dawn versus a looming red surveillance eye in blackout.
        if ending=='bad-ending':
            red=Image.new('RGBA',(W,H),(45,0,4,135))
            im=Image.alpha_composite(im,red)
            color=(255,104,96)
            od.rectangle((0,135,W,385),fill=(15,2,8,215))
            eye_y=112; radius=20+5*math.sin(t*.5)
            od.arc((W/2-92,eye_y-44,W/2+92,eye_y+44),180,360,fill=(*color,160),width=2)
            od.arc((W/2-92,eye_y-44,W/2+92,eye_y+44),0,180,fill=(*color,160),width=2)
            od.ellipse((W/2-radius,eye_y-radius,W/2+radius,eye_y+radius),outline=(*color,210),width=3)
            od.line((W/2,72,W/2,151),fill=(*color,180),width=2)
            for j in range(8):
                y=400+j*9; x=80+(j*139+t*18)%800
                od.line((x,y,x+50,y),fill=(*color,80),width=1)
            cards=[(0,4.5,'THE LEAK DID NOT STOP.','THE CITY REMEMBERS EVERY SHORTCUT.'),(4.3,9,'TRUST WENT DARK.','RECORDS EXPOSED. PEOPLE LEFT AT RISK.'),(8.8,14,'THE NIGHT IS NOT OVER.','REVIEW YOUR CALLS. COME BACK READY.')]
        else:
            color=GREEN
            od.polygon([(W/2,70),(W/2+38,84),(W/2+32,121),(W/2,146),(W/2-32,121),(W/2-38,84)],fill=(25,63,54,220),outline=(*GREEN,255),width=3)
            od.line((W/2-16,106,W/2-4,117,W/2+20,91),fill=(*GREEN,255),width=4)
            for j in range(18):
                x=(j*97+t*13)%W;y=H-(j*31+t*30)%H
                od.ellipse((x,y,x+2,y+8),fill=(*AMBER,90))
            cards=[(0,4.5,'YOU HELD THE LINE.','YOUR JUDGEMENT PROTECTED THE CITY.'),(4.3,9,'THE CITY WAKES SAFER.','EVERY CAREFUL CALL MADE A DIFFERENCE.'),(8.8,14,'PRIVACY SENTINEL','NIGHTSHIFT COMPLETE. TRUST DEFENDED.')]
        for a,b,line,sub in cards:
            e=envelope(t,a,b);label(overlay,line,205,44,color,e,True);label(overlay,sub,272,17,WHITE,e)
        label(overlay,'SIGNAL LOST / UNRESOLVED RISK' if ending=='bad-ending' else 'SIGNAL RESTORED / CITY PROTECTED',335,12,color,.8)
    elif credits:
        a=envelope(t,0,3.1)
        label(overlay,'THE SHIFT HAS ENDED.',207,43,alpha=a,bold=True)
        label(overlay,'THE STORY STAYS WITH YOU.',269,18,GREEN,a)
        a=envelope(t,3,10.6)
        label(overlay,'THE TEAM BEHIND THE NIGHTSHIFT',171,15,GREEN,a)
        for name,y,delay in [('Rips',205,3),('Niks',254,3.7),('SharkBytes',303,4.4)]:
            label(overlay,name,y,40,alpha=envelope(t,delay,10.6),bold=True)
        a=envelope(t,10.3,14)
        label(overlay,'THANK YOU FOR PLAYING',209,38,alpha=a,bold=True)
        label(overlay,'EVERY BETTER MORNING STARTS WITH A CALL.',270,16,GREEN,a)
    else:
        for a,b,line,sub in [(0,4.1,'THE CITY NEVER STOPS.','NEITHER DOES ITS DATA.'),(3.9,8.1,'ONE SHORTCUT. A THOUSAND LIVES.','TONIGHT, THE NEXT CALL IS YOURS.')]:
            e=envelope(t,a,b); label(overlay,line,211,36,alpha=e,bold=True);label(overlay,sub,269,17,GREEN,e)
        e=envelope(t,7.9,14)
        label(overlay,'DPDP',174,24,GREEN,e)
        label(overlay,'NIGHTSHIFT',209,78,alpha=e,bold=True)
        label(overlay,'FOLLOW THE DATA. PROTECT THE PEOPLE.',308,16,GREEN,e)
    # Restrained fades, with no strobe or flashing cuts.
    im=Image.alpha_composite(im,overlay).convert('RGB')
    fade=smooth(t/.6)*smooth((DURATION-t)/.7)
    return Image.blend(Image.new('RGB',(W,H),(3,9,15)),im,fade)

def score(path, credits, ending=None):
    rate=44100; t=np.arange(rate*DURATION)/rate; signal=np.zeros_like(t)
    notes=[55,82.4069,110,164.8138] if not credits else [65.4064,98,130.8128,164.8138]
    if ending=='bad-ending': notes=[41.2034,43.6535,61.7354,87.3071]
    if ending=='good-ending': notes=[65.4064,98,130.8128,196]
    for i,f in enumerate(notes): signal+=.036*np.sin(2*np.pi*f*t+.35*np.sin(t*.55+i))
    for beat in np.arange(.6,13.4,.75):
        dt=np.maximum(t-beat,0); signal+=.12*np.sin(2*np.pi*(47*dt+2*(1-np.exp(-dt*22))))*np.exp(-dt*13)*(t>=beat)
    for i,at in enumerate([1,4,7.9,10.6]):
        dt=np.maximum(t-at,0); signal+=.045*np.sin(2*np.pi*notes[i%4]*4*dt)*np.exp(-dt*1.2)*(t>=at)
    if ending=='good-ending':
        for i,at in enumerate(np.arange(1,13,.65)):
            dt=np.maximum(t-at,0); f=[261.63,329.63,392,523.25][i%4]
            signal+=.06*(np.sin(2*np.pi*f*dt)+.22*np.sin(4*np.pi*f*dt))*np.exp(-dt*2)*(t>=at)
    if ending=='bad-ending':
        signal+=.032*np.sin(2*np.pi*(170*t-2*t*t))*(.5+.5*np.sin(t*.8))
    signal*=np.minimum(t/.8,1)*np.clip((DURATION-t)/1.4,0,1)
    stereo=np.column_stack([signal,signal*.96]).clip(-.8,.8)
    with wave.open(str(path),'wb') as f:
        f.setnchannels(2);f.setsampwidth(2);f.setframerate(rate);f.writeframes((stereo*32767).astype('<i2').tobytes())

if __name__=='__main__':
    for kind in (sys.argv[1:] or ['opening','credits','good-ending','bad-ending']):
        credits=kind in ['credits','good-ending']; ending=kind if kind.endswith('-ending') else None
        with tempfile.TemporaryDirectory() as tmp:
            wav=Path(tmp)/'score.wav'; score(wav,credits,ending)
            args=[imageio_ffmpeg.get_ffmpeg_exe(),'-y','-f','rawvideo','-vcodec','rawvideo','-s',f'{W}x{H}','-pix_fmt','rgb24','-r',str(FPS),'-i','-','-i',str(wav),'-t',str(DURATION),'-c:v','libx264','-preset','slow','-crf','27','-pix_fmt','yuv420p','-c:a','aac','-b:a','80k','-movflags','+faststart',str(OUT/f'{kind}.mp4')]
            p=subprocess.Popen(args,stdin=subprocess.PIPE,stderr=subprocess.DEVNULL)
            for n in range(FPS*DURATION):p.stdin.write(frame(n/FPS,credits,ending).tobytes())
            p.stdin.close()
            if p.wait():raise RuntimeError('Video encoding failed')
        frame(7 if ending or credits else 9,credits,ending).save(OUT/f'{kind}-poster.jpg',quality=88)
        print(kind,(OUT/f'{kind}.mp4').stat().st_size,'bytes; 14.000s',flush=True)
