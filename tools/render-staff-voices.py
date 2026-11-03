"""Render the authored staff dialogue locally, preserving the existing voice bank."""
import hashlib, json, subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
import imageio_ffmpeg
import onnxruntime as ort
from kokoro_onnx import Kokoro

root=Path(__file__).resolve().parents[1]
workspace=root.parents[1]
out=root/'3d/media/voices'
lines=json.loads((out/'staff-lines.json').read_text(encoding='utf-8'))
options=ort.SessionOptions();options.intra_op_num_threads=4;options.inter_op_num_threads=1
model=Kokoro.from_session(ort.InferenceSession(str(workspace/'work/voice-models/kokoro-v1.0.int8.onnx'),sess_options=options,providers=['CPUExecutionProvider']),str(workspace/'work/voice-models/voices-v1.0.bin'))
manifest_file=root/'3d/voice-manifest.js'
manifest=json.loads(manifest_file.read_text(encoding='utf-8').split('export const VOICE_CLIPS=')[1].strip().removesuffix(';'))
metadata=json.loads((out/'voice-lines.json').read_text(encoding='utf-8'))
for line in lines:
 target=out/(line['id']+'.mp3')
 if not target.exists() or metadata.get(line['id'],{}).get('text')!=line['text'] or metadata.get(line['id'],{}).get('voice')!=line['voice']:
  audio,rate=model.create(line['text'],voice=line['voice'],speed=line['speed'],lang='en-gb' if line['voice'].startswith('b') else 'en-us')
  audio=np.concatenate([np.zeros(int(rate*.1)),audio,np.zeros(int(rate*.15))]).astype(np.float32)
  wav=out/(line['id']+'.wav');sf.write(wav,audio,rate)
  subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-hide_banner','-loglevel','error','-y','-i',str(wav),'-af','loudnorm=I=-18:TP=-2:LRA=7','-ar','24000','-ac','1','-b:a','56k',str(target)],check=True)
  wav.unlink();duration=len(audio)/rate
 else:duration=metadata[line['id']]['duration']
 digest=hashlib.sha256(target.read_bytes()).hexdigest()
 metadata[line['id']]={'text':line['text'],'voice':line['voice'],'duration':round(duration,3),'sha256':digest}
 manifest[line['group']]=[{'id':line['id'],'src':'media/voices/'+line['id']+'.mp3?v='+digest[:12],'text':line['text'],'speaker':line['speaker']}]
 (out/'voice-lines.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
 manifest_file.write_text('// Locally rendered Kokoro speech. No runtime generation service.\nexport const VOICE_CLIPS='+json.dumps(manifest,indent=2)+';\n',encoding='utf-8')
 print(line['id'],round(duration,2),flush=True)


# Apply the speech-length policy after the bank has finished rendering.
exec(compile((root/'tools/limit-staff-clips.py').read_text(encoding='utf-8'),str(root/'tools/limit-staff-clips.py'),'exec'))
