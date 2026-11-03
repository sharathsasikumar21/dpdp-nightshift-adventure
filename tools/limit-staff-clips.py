"""Keep staff speech brief without truncating words or altering pitch."""
import hashlib, json, subprocess
from pathlib import Path
import soundfile as sf
import imageio_ffmpeg
root=Path(__file__).resolve().parents[1]
out=root/'3d/media/voices'
lines=json.loads((out/'staff-lines.json').read_text(encoding='utf-8'))
metadata=json.loads((out/'voice-lines.json').read_text(encoding='utf-8'))
manifest_file=root/'3d/voice-manifest.js'
manifest=json.loads(manifest_file.read_text(encoding='utf-8').split('export const VOICE_CLIPS=')[1].strip().removesuffix(';'))
for line in lines:
 target=out/(line['id']+'.mp3')
 duration=sf.info(target).duration
 if duration>15:
  temp=out/(line['id']+'.retimed.mp3')
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(target),'-af','atempo='+str(duration/14.7),'-ar','24000','-ac','1','-b:a','56k',str(temp)],check=True)
  temp.replace(target);duration=sf.info(target).duration
  print('Retimed',line['id'],round(duration,2),flush=True)
 digest=hashlib.sha256(target.read_bytes()).hexdigest()
 metadata[line['id']]['duration']=round(duration,3)
 metadata[line['id']]['sha256']=digest
 manifest[line['group']][0]['src']='media/voices/'+line['id']+'.mp3?v='+digest[:12]
(out/'voice-lines.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
manifest_file.write_text('// Locally rendered Kokoro speech. No runtime generation service.\nexport const VOICE_CLIPS='+json.dumps(manifest,indent=2)+';\n',encoding='utf-8')
