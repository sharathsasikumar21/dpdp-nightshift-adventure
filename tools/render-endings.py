"""Retain the original city/shield and dark-eye ending designs, improved for
one continuous 14-second shot. VideoGen photo previews were rejected as a
visual mismatch. No burned-in subtitles; original local score and Kokoro voice.
Run from the repository root after tools/render-voices.py.
"""
from pathlib import Path
import argparse, hashlib, importlib.util, subprocess
import imageio_ffmpeg

W,H,FPS,DURATION=960,540,24,14
ROOT=Path(__file__).resolve().parent.parent
spec=importlib.util.spec_from_file_location('original_score',ROOT/'tools/render-cinematics.py')
original=importlib.util.module_from_spec(spec);spec.loader.exec_module(original)

def render(kind,cache,visuals_only):
 heroic=kind=='good-ending';label='heroic' if heroic else 'dark';ffmpeg=imageio_ffmpeg.get_ffmpeg_exe()
 revision=hashlib.sha256((ROOT/'tools/render-cinematics.py').read_bytes()+Path(__file__).read_bytes()).hexdigest()[:12]
 visual=cache/f'{kind}-original-{revision}.mp4';music=cache/f'{kind}-music.wav'
 if not visual.exists():
  command=[ffmpeg,'-hide_banner','-loglevel','error','-y','-f','rawvideo','-vcodec','rawvideo','-pix_fmt','rgb24','-s',f'{W}x{H}','-r',str(FPS),'-i','-','-an','-c:v','libx264','-threads','2','-preset','fast','-crf','21','-pix_fmt','yuv420p','-g',str(FPS),'-keyint_min',str(FPS),'-sc_threshold','0','-movflags','+faststart',str(visual)]
  process=subprocess.Popen(command,stdin=subprocess.PIPE)
  try:
   for n in range(FPS*DURATION):
    process.stdin.write(original.frame(n/FPS,heroic,kind).tobytes())
    if n%96==0:print(kind,n,'/',FPS*DURATION,flush=True)
  finally:process.stdin.close()
  if process.wait():raise RuntimeError('Video render failed')
 original.score(music,heroic,kind)
 if visuals_only:return
 narration=ROOT/'3d/media/voices'/f'{label}-narration.mp3'
 if not narration.exists():raise RuntimeError('Render narration before muxing the final film')
 output=ROOT/'3d/media'/f'{kind}.mp4'
 filters='[1:a]volume=0.38[m];[2:a]adelay=900|900,volume=1.1[v];[m][v]amix=inputs=2:duration=first:normalize=0,loudnorm=I=-17:TP=-1.5:LRA=7,afade=t=in:d=0.3,afade=t=out:st=12.7:d=1.3[a]'
 subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(visual),'-i',str(music),'-i',str(narration),'-filter_complex',filters,'-map','0:v:0','-map','[a]','-c:v','copy','-c:a','aac','-b:a','128k','-ar','44100','-t','14','-movflags','+faststart',str(output)],check=True)
 original.frame(7,heroic,kind).save(ROOT/'3d/media'/f'{kind}-poster.jpg',quality=93)
 print('Finished',output,flush=True)

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--cache',default='../../outputs/endings-render');parser.add_argument('--visuals-only',action='store_true');args=parser.parse_args();cache=Path(args.cache);cache.mkdir(parents=True,exist_ok=True)
 for kind in ['good-ending','bad-ending']:render(kind,cache,args.visuals_only)
