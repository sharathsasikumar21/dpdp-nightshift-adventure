"""Render reusable CPU AI speech; no model or paid API is used by the browser.
pip install kokoro-onnx==0.6.0 soundfile imageio-ffmpeg
python tools/render-voices.py --model MODEL.onnx --voices VOICES.bin
"""
import argparse, hashlib, json, subprocess
from pathlib import Path
import numpy as np
import soundfile as sf
from kokoro_onnx import Kokoro
import imageio_ffmpeg
import onnxruntime as ort

LINES = {
 'evidence-1': ('evidence', 'Source record secured. Check the other two before drawing a conclusion.'),
 'evidence-2': ('evidence', 'One record is a lead. Compare it with the evidence on this desk.'),
 'terminal-1': ('terminal', 'Verify the facts before you make the call. The order of your actions matters.'),
 'terminal-2': ('terminal', 'Read all three records. Then choose the response you can defend.'),
 'coffee-1': ('coffee', 'Stay sharp. The records still need you, even after the coffee.'),
 'coffee-2': ('coffee', 'One coffee. Still no permission to guess. Back to the evidence.'),
 'keepsake-1': ('keepsake', 'Every desk has a story. Tonight, the records matter more than the souvenirs.'),
 'keepsake-2': ('keepsake', 'Someone left a little history on this desk. Take a look.'),
 'lift-1': ('lift', 'Check the department on your objective. Your next lead may be on another floor.'),
 'lift-2': ('lift', 'Four floors, one investigation. Follow the case, not a hunch.'),
 'warning-1': ('warning', 'Slow down. Preserve the evidence and check the facts before your next decision.'),
 'warning-2': ('warning', 'The risk is still active. Contain it, verify the scope, and keep a clear record.'),
 'arrival-1': ('arrival', 'Find your active case desk. The badge, door log and witness account are together on that table.'),
 'arrival-2': ('arrival', 'Three arrival clues. Read them together before deciding what happened tonight.'),
 'mira-1': ('mira', 'I kept the visitor record. Please check the time against the door log.'),
 'mira-2': ('mira', 'The badge and the dashboard do not tell the same story. Check the original record.'),
 'arjun-1': ('arjun', 'The job number connects these records. A shared account does not name a person.'),
 'arjun-2': ('arjun', 'Start with the source log. The dashboard can show when an event arrived.'),
 'leena-1': ('leena', 'Separate authorisation from safeguards. We need to check both before making a call.'),
 'leena-2': ('leena', 'Preserve the record. Then establish what actually happened, and document the reasoning.'),
 'tutorial-1': ('tutorial-1', 'You are the Data Protection Officer. Find out what happened to the records, protect the people affected, and explain your decisions.'),
 'tutorial-2': ('tutorial-2', 'First, practise moving. Press W or the up arrow, or choose Take a Step. Reach the practice desk in three steps.'),
 'tutorial-3': ('tutorial-3', 'Look toward an object before interacting. Turn right to find the practice terminal, then press E or choose Inspect Terminal.'),
 'tutorial-4': ('tutorial-4', 'Follow the yellow arrow. Read the floor number in your objective. Use Lift and Floors if the case is in another department.'),
 'tutorial-5': ('tutorial-5', 'Inspect all three records. Return to all evidence after each one. Compare what was requested, what was approved, and what actually happened.'),
 'tutorial-6': ('tutorial-6', 'Now make a practice decision. Choose what you would do first. If the answer is unsafe, read the explanation and try again.'),
 'tutorial-7': ('tutorial-7', 'Read the result of every decision. Take a break after a case. Untimed mode lets you investigate without a question countdown.'),
 'tutorial-8': ('tutorial-8', 'Begin with the three arrival clues. Then follow your objective, inspect the case records, and open the terminal. You are ready for the night shift.'),
 'radio-mira': ('radio-mira', 'Arjun, the visitor badge and dashboard disagree. Can you verify the original door log?'),
 'radio-arjun': ('radio-arjun', 'Checking the controller now, Mira. Preserve both records. A delayed dashboard update could explain the mismatch.'),
 'radio-leena': ('radio-leena', 'Arjun, secure the transfer route, but keep the audit trail intact. We still need the signed authorisation.'),
 'radio-security': ('radio-security', 'Understood, Leena. I will preserve the logs while we check the scope of the export.'),
 'radio-analyst': ('radio-analyst', 'Leena, the next case records are on the marked workstation. Should we open the terminal now?'),
 'radio-counsel': ('radio-counsel', 'Read all three first, Mira. Then let the Data Protection Officer make the call.'),
 'evidence-banter-1': ('evidence', 'One clue down. Please do not solve the entire case from a paperclip.'),
 'evidence-banter-2': ('evidence', 'Excellent. Actual evidence. The guessing department is closed tonight.'),
 'coffee-banter-1': ('coffee', 'Coffee acquired. Legal immunity still unavailable.'),
 'coffee-banter-2': ('coffee', 'That is your coffee break. The breach did not take one.'),
 'terminal-banter-1': ('terminal', 'Confidence is not a lawful basis. Check the record.'),
 'terminal-banter-2': ('terminal', 'Four options. Somehow, guessing still feels like a fifth.'),
 'warning-banter-1': ('warning', 'Bold choice. The audit log disagrees. Check the evidence before the next call.'),
 'warning-banter-2': ('warning', 'The evidence called. It wants a second opinion. Preserve the records and verify the facts.'),
 'pet-dpo-1': ('pet-dpo', 'Hey, Chikku. Good boy. I am right here.'),
 'pet-dpo-2': ('pet-dpo', 'There you are, Chikku. Good boy. You are safe with me.'),
 'pet-mira': ('pet-mira', 'Hey, Chikku. Good boy. Keeping the night crew company?'),
 'pet-arjun': ('pet-arjun', 'Chikku, my favourite member of security. Good boy.'),
 'pet-leena': ('pet-leena', 'Hello, Chikku. One quick scratch, then back to the investigation.'),
 'heroic-narration': ('ending', 'The copies are contained. The evidence is intact. Mumbai wakes to a safer morning. You held the line.'),
 'dark-narration': ('ending', 'You found the signature. The copies survived. Somewhere beyond this room, the incident is still unfolding. The night is not over.')
}

DPO_GROUPS={'evidence','terminal','coffee','keepsake','warning','pet-dpo'}

def speaker_for(group):
 if group in DPO_GROUPS:return 'Simon Ghost Riley · DPO'
 if group in ('mira','radio-mira','radio-analyst','pet-mira'):return 'Mira · Incident analyst'
 if group in ('arjun','radio-arjun','radio-security','pet-arjun'):return 'Arjun · Security engineer'
 if group in ('leena','radio-leena','radio-counsel','pet-leena'):return 'Leena · Privacy counsel'
 return 'Control · Operations'

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--model',required=True);parser.add_argument('--voices',required=True);parser.add_argument('--output',default='3d/media/voices');parser.add_argument('--only',nargs='*');parser.add_argument('--reuse-existing',action='store_true');args=parser.parse_args()
 out=Path(args.output);out.mkdir(parents=True,exist_ok=True)
 options=ort.SessionOptions();options.intra_op_num_threads=2;options.inter_op_num_threads=1
 model=Kokoro.from_session(ort.InferenceSession(args.model,sess_options=options,providers=['CPUExecutionProvider']),args.voices)
 ffmpeg=imageio_ffmpeg.get_ffmpeg_exe();manifest={};metadata=json.loads((out/'voice-lines.json').read_text(encoding='utf-8')) if args.only and (out/'voice-lines.json').exists() else {}
 for story in json.loads(Path('3d/stories.json').read_text(encoding='utf-8')):
  LINES['story-'+story['id']]=('story-'+story['id'],story['brief'])
 for name,(group,text) in LINES.items():
  voice='am_adam' if group in DPO_GROUPS else 'am_michael' if group in ('arjun','radio-arjun','radio-security','pet-arjun') else 'bf_emma' if group in ('leena','radio-leena','radio-counsel','pet-leena') else 'af_heart'
  lang='en-gb' if voice.startswith('b') else 'en-us';target=out/(name+'.mp3')
  if args.only and name not in args.only:continue
  if args.reuse_existing and target.exists():duration=sf.info(target).duration
  else:
   audio,rate=model.create(text,voice=voice,speed=.92 if group=='pet-dpo' else .98,lang=lang)
   audio=np.concatenate([np.zeros(int(rate*.12)),audio,np.zeros(int(rate*.18))]).astype(np.float32)
   duration=len(audio)/rate;wav=out/(name+'.wav');sf.write(wav,audio,rate)
   subprocess.run([ffmpeg,'-hide_banner','-loglevel','error','-y','-i',str(wav),'-af',('asetrate=24000*0.92,aresample=24000,atempo='+str(1/.92)+',' if group in DPO_GROUPS else '')+'loudnorm=I=-18:TP=-2:LRA=7','-ar','24000','-ac','1','-b:a','56k',str(target)],check=True);wav.unlink()
  digest=hashlib.sha256(target.read_bytes()).hexdigest()[:12]
  manifest.setdefault(group,[]).append({'id':name,'src':'media/voices/'+name+'.mp3?v='+digest,'text':text,'speaker':speaker_for(group)})
  metadata[name]={'text':text,'voice':voice,'duration':round(duration,3),'sha256':hashlib.sha256(target.read_bytes()).hexdigest()}
  print(name,metadata[name]['duration'],flush=True)
 manifest={}
 for name,(group,text) in LINES.items():
  target=out/(name+'.mp3')
  if target.exists() and name in metadata:
   digest=hashlib.sha256(target.read_bytes()).hexdigest()[:12];manifest.setdefault(group,[]).append({'id':name,'src':'media/voices/'+name+'.mp3?v='+digest,'text':text,'speaker':speaker_for(group)})
 (out/'voice-lines.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
 (out.parent.parent/'voice-manifest.js').write_text('// Locally rendered Kokoro speech. No runtime generation service.\nexport const VOICE_CLIPS='+json.dumps(manifest,indent=2)+';\n',encoding='utf-8')

if __name__=='__main__':main()
