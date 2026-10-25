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

def creator_figure(layer, x, t, index):
    """Original brick-style toy portraits with moulded plastic and a gentle wave."""
    d=ImageDraw.Draw(layer); y=202+math.sin(t*1.7+index)*2
    skin=(226,181,109,255); edge=(125,90,48,255)
    coats=[(59,111,126,255),(137,82,104,255),(78,118,99,255)]
    coat=coats[index]; hair=[(41,34,30,255),(48,29,28,255),(77,43,28,255)][index]
    # Floor shadow, two separate block legs and bevel highlights.
    d.ellipse((x-69,356,x+69,373),fill=(0,0,0,100))
    for dx in [-22,22]:
        d.rounded_rectangle((x+dx-19,302,x+dx+18,360),radius=5,fill=(31,43,54,255),outline=(17,24,32,255),width=2)
        d.rectangle((x+dx-15,307,x+dx-11,349),fill=(77,91,99,255))
        d.rounded_rectangle((x+dx-21,347,x+dx+20,365),radius=4,fill=(24,34,45,255))
        d.line((x+dx-17,350,x+dx+16,350),fill=(91,102,107,255),width=2)
    # Long hair is drawn behind the head and shoulders for the two female creators.
    if index:
        d.rounded_rectangle((x-41,y-19,x+41,y+88),radius=24,fill=hair)
        for dx in [-32,-24,27,34]:d.line((x+dx,y+11,x+dx,y+79),fill=(108,69,44,255),width=2)
    d.rounded_rectangle((x-46,253,x+46,310),radius=7,fill=coat,outline=(17,27,32,255),width=2)
    d.polygon([(x-31,256),(x-9,278),(x,261),(x+9,278),(x+31,256)],fill=(223,224,211,255))
    d.line((x,278,x,306),fill=(25,41,47,255),width=3)
    d.rounded_rectangle((x+18,282,x+35,299),radius=2,fill=(204,196,157,255))
    d.line((x-38,264,x-38,298),fill=tuple(min(255,v+35) for v in coat[:3])+(255,),width=3)
    # Capsule arms and unmistakable C-shaped toy hands.
    wave=math.sin(t*2+index)*7
    d.line((x-43,267,x-58,307),fill=coat,width=21)
    d.line((x+43,266,x+62,242+wave),fill=coat,width=21)
    for hx,hy in [(x-60,320),(x+66,230+wave)]:
        d.arc((hx-12,hy-12,hx+12,hy+12),35,325,fill=edge,width=9)
        d.arc((hx-11,hy-11,hx+11,hy+11),35,325,fill=skin,width=7)
    d.rectangle((x-13,y+42,x+13,257),fill=skin)
    d.rounded_rectangle((x-33,y-10,x+33,y+51),radius=13,fill=skin,outline=edge,width=2)
    d.rounded_rectangle((x-14,y-20,x+14,y-8),radius=3,fill=(231,191,124,255))
    d.line((x-27,y+1,x-27,y+34),fill=(248,217,164,255),width=3)
    if index==0:
        d.pieslice((x-34,y-19,x+34,y+23),180,355,fill=hair)
        d.polygon([(x-30,y),(x-19,y+10),(x-9,y-4),(x+26,y+5),(x+31,y-7)],fill=hair)
    else:
        d.pieslice((x-36,y-20,x+36,y+22),180,360,fill=hair)
        d.polygon([(x-31,y-3),(x-17,y+14),(x+8,y-5),(x+31,y+8),(x+31,y-9)],fill=hair)
    for dx in [-12,12]:
        d.ellipse((x+dx-3,y+19,x+dx+3,y+25),fill=(35,30,28,255))
        d.point((x+dx-1,y+20),fill=(255,255,240,255))
    d.arc((x-11,y+26,x+11,y+39),10,170,fill=(77,47,34,255),width=2)
    name=['SHA/020','Niks/141','Rip/911'][index]
    f=font(27,True); bounds=d.textbbox((0,0),name,font=f)
    d.text((x-bounds[2]/2,390),name,font=f,fill=WHITE)
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
        label(overlay,'THE TEAM BEHIND GHOST SHIFT',137,16,GREEN,a)
        for i,x in enumerate([230,480,730]):
            figure=Image.new('RGBA',(W,H));creator_figure(figure,x,t,i)
            fade=envelope(t,3+i*.2,10.6)
            figure.putalpha(figure.getchannel('A').point(lambda v:int(v*fade)))
            overlay=Image.alpha_composite(overlay,figure)
        a=envelope(t,10.3,14)
        label(overlay,'THANK YOU FOR PLAYING',209,38,alpha=a,bold=True)
        label(overlay,'EVERY BETTER MORNING STARTS WITH A CALL.',270,16,GREEN,a)
    else:
        for a,b,line,sub in [(0,4.1,'THE CITY NEVER STOPS.','NEITHER DOES ITS DATA.'),(3.9,8.1,'ONE SHORTCUT. A THOUSAND LIVES.','TONIGHT, THE NEXT CALL IS YOURS.')]:
            e=envelope(t,a,b); label(overlay,line,211,36,alpha=e,bold=True);label(overlay,sub,269,17,GREEN,e)
        e=envelope(t,7.9,14)
        label(overlay,'MIDNIGHT BREACH',174,24,GREEN,e)
        label(overlay,'GHOST SHIFT',209,78,alpha=e,bold=True)
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
