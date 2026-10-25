"""Render an original, deterministic 32-second suspense loop; no external API."""
from pathlib import Path
import subprocess, tempfile, wave
import numpy as np
import imageio_ffmpeg

RATE = 44100
DURATION = 32
rng = np.random.default_rng(141)
t = np.arange(RATE * DURATION) / RATE
mix = np.zeros((len(t), 2))

def place(signal, start, level, pan=0):
    indices = (int(start * RATE) + np.arange(len(signal))) % len(t)
    mix[indices, 0] += signal * level * np.sqrt((1 - pan) / 2)
    mix[indices, 1] += signal * level * np.sqrt((1 + pan) / 2)

def note(freq, length, decay):
    x = np.arange(int(length * RATE)) / RATE
    envelope = (1 - np.exp(-x * 70)) * np.exp(-x * decay)
    envelope *= np.minimum(1, (length - x) * 30)
    return (np.sin(2*np.pi*freq*x) + .22*np.sin(4*np.pi*freq*x)) * envelope

# Sixteen bars at 120 BPM: restrained bass, mechanical ticks and bowed pulses.
for step in range(128):
    start = step * .25
    if step % 4 == 0:
        place(note([55, 55, 51.913, 58.27][step//32], 1.6, 3), start, .17)
    notes = [110, 164.814, 146.832, 110, 130.813, 164.814, 116.541, 146.832]
    place(note(notes[step % 8], .55, 7), start, .055, .32 if step%2 else -.32)
    if step % 2 == 0:
        x = np.arange(int(.06 * RATE)) / RATE
        tick = rng.normal(0, 1, len(x)) * np.exp(-x*115) * (1-np.exp(-x*1500))
        place(tick, start, .035, -.5 if step%4 else .5)
    if step % 8 == 6:
        place(note(880, 1.8, 3), start, .012, .65)

# Breathy string-like harmonics and low tom accents add a second layer of suspense.
for bar in range(16):
    root = [110, 103.826, 110, 116.541][bar // 4]
    x = np.arange(int(2.8 * RATE)) / RATE
    swell = np.sin(np.pi * np.minimum(x / 2.8, 1)) ** 2
    bowed = sum(np.sin(2*np.pi*root*h*x + .25*np.sin(2*np.pi*4*x))/h**1.6 for h in range(1,7))
    place(bowed*swell, bar*2, .025, -.4 if bar%2 else .4)
    if bar % 2:
        x = np.arange(int(.38 * RATE)) / RATE
        drum = np.sin(2*np.pi*(48*x+18*(1-np.exp(-x*18))/18))*np.exp(-x*13)
        place(drum, bar*2+1.5, .1)

# Integer-cycle drones and modulation keep the loop boundary continuous.
for freq, level in [(55, .035), (82.40625, .022), (116.53125, .008)]:
    drone = np.sin(2*np.pi*freq*t) * (1 + .25*np.sin(2*np.pi*t/16))
    mix += drone[:, None] * level
mix = np.tanh(mix * 1.3)
peak = np.max(np.abs(mix))
mix *= .72 / peak
destination = Path(__file__).resolve().parents[1] / '3d/media/midnight-breach.mp3'
with tempfile.TemporaryDirectory() as directory:
    wav = Path(directory) / 'score.wav'
    with wave.open(str(wav), 'wb') as output:
        output.setnchannels(2); output.setsampwidth(2); output.setframerate(RATE)
        output.writeframes((mix * 32767).astype('<i2').tobytes())
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(), '-y', '-i', str(wav), '-codec:a', 'libmp3lame', '-b:a', '128k', str(destination)], check=True, capture_output=True)
print(f'{destination}: {DURATION}s stereo; peak {np.max(np.abs(mix)):.3f}')

# Separate fourteen-second cinematic cue: a title swell, restrained radio bed,
# then a rising pulse that resolves into the doors-opening chime.
DURATION = 14
t = np.arange(RATE * DURATION) / RATE
mix = np.zeros((len(t), 2))
for freq, level in [(55,.09),(82.406,.045),(110,.025),(116.541,.009)]:
    envelope = np.minimum(t/1.8,1)*np.minimum((14-t)/1.5,1)
    drone = np.sin(2*np.pi*freq*t+.15*np.sin(2*np.pi*.4*t))*envelope
    mix += drone[:,None]*level
for start, freq in [(0,220),(1.2,261.626),(2.4,293.665),(8,220),(9,261.626),(10,329.628)]:
    place(note(freq,3,1.1),start,.055,-.35 if int(start)%2 else .35)
for start in np.arange(3.5,12.5,.75):
    place(note(55,.6,8),start,.1)
x = np.arange(int(3.5*RATE))/RATE
riser = rng.normal(0,1,len(x))*.004*(x/3.5)**2
place(riser,8,.7)
mix *= np.minimum(t/.12,1)[:,None]*np.minimum((14-t)/.9,1)[:,None]
mix = np.tanh(mix*1.4)
mix *= .65/np.max(np.abs(mix))
destination = destination.with_name('elevator-title.mp3')
with tempfile.TemporaryDirectory() as directory:
    wav = Path(directory)/'intro.wav'
    with wave.open(str(wav),'wb') as output:
        output.setnchannels(2);output.setsampwidth(2);output.setframerate(RATE)
        output.writeframes((mix*32767).astype('<i2').tobytes())
    subprocess.run([imageio_ffmpeg.get_ffmpeg_exe(),'-y','-i',str(wav),'-codec:a','libmp3lame','-b:a','128k',str(destination)],check=True,capture_output=True)
print(f'{destination}: {DURATION}s stereo; peak {np.max(np.abs(mix)):.3f}')
