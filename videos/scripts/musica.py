"""Música de fondo original: pads ambientales en Re mayor con campanas suaves.

Uso: python3 scripts/musica.py <segundos> <salida.mp3> [creacion|adviento]
"""
import subprocess, sys, tempfile, wave
import numpy as np

SR = 44100
dur = float(sys.argv[1]); out = sys.argv[2]
preset = sys.argv[3] if len(sys.argv) > 3 else 'creacion'
n = int(SR * dur)
t = np.arange(n) / SR
rng = np.random.default_rng(7)

def hz(midi):
    return 440.0 * 2 ** ((midi - 69) / 12)

# Progresión (MIDI): D, Bm, G, A, Em, G, D/F#, A  — 10 s por acorde
chords = [
    [50, 57, 62, 66, 69], [47, 54, 62, 66, 71], [43, 55, 62, 67, 71], [45, 57, 61, 64, 69],
    [40, 55, 59, 64, 67], [43, 55, 59, 62, 67], [42, 57, 62, 66, 69], [45, 57, 61, 64, 71],
]
if preset == 'adviento':
    # Re menor, más recogido: Dm, Bb, F, C, Gm, Bb, Dm, A(sus4→A)
    chords = [
        [50, 57, 62, 65, 69], [46, 53, 62, 65, 70], [41, 53, 60, 65, 69], [48, 55, 60, 64, 67],
        [43, 55, 62, 67, 70], [46, 53, 62, 65, 69], [50, 57, 62, 65, 72], [45, 57, 62, 64, 69],
    ]
SEG = 10.0 if preset != 'adviento' else 12.0
pad = np.zeros((2, n))
for k in range(int(dur // SEG) + 2):
    chord = chords[k % len(chords)]
    start = k * SEG - 3.0
    i0, i1 = max(0, int(start * SR)), min(n, int((start + SEG + 6.0) * SR))
    if i0 >= i1:
        continue
    tt = t[i0:i1] - start
    L = SEG + 6.0
    env = np.clip(np.minimum(tt / 4.0, (L - tt) / 4.0), 0, 1) ** 1.5
    for j, m in enumerate(chord):
        f = hz(m)
        amp = 0.16 if j == 0 else 0.1
        for ch, det in ((0, -0.12), (1, 0.12)):
            ph = rng.uniform(0, 2 * np.pi, 3)
            v = (np.sin(2 * np.pi * (f + det) * tt + ph[0])
                 + 0.6 * np.sin(2 * np.pi * (f * 1.003 - det) * tt + ph[1])
                 + 0.18 * np.sin(2 * np.pi * 2 * f * tt + ph[2]))
            trem = 1 + 0.08 * np.sin(2 * np.pi * (0.07 + 0.02 * j) * tt + ph[0])
            pad[ch, i0:i1] += amp * env * v * trem

# Campanas: pentatónica de Re, notas dispersas
bells = np.zeros((2, n))
penta = [74, 76, 78, 81, 83, 86, 88, 90] if preset != 'adviento' else [74, 77, 79, 81, 84, 86, 89]
tb = 4.0
while tb < dur - 4:
    m = penta[rng.integers(len(penta))]
    f = hz(m)
    i0 = int(tb * SR); i1 = min(n, i0 + int(5 * SR))
    tt = t[i0:i1] - tb
    env = np.exp(-tt * 1.1) * np.clip(tt / 0.01, 0, 1)
    v = np.sin(2 * np.pi * f * tt) + 0.25 * np.sin(2 * np.pi * f * 2.76 * tt) * np.exp(-tt * 3)
    pan = rng.uniform(0.25, 0.75)
    bells[0, i0:i1] += 0.05 * (1 - pan) * env * v
    bells[1, i0:i1] += 0.05 * pan * env * v
    tb += rng.uniform(2.5, 6.0)

mix = pad + bells

# Reverb: convolución con ruido de decaimiento exponencial (por canal)
ir_len = int(3.5 * SR)
it = np.arange(ir_len) / SR
wet = np.zeros_like(mix)
for ch in range(2):
    ir = rng.standard_normal(ir_len) * np.exp(-it * 2.0)
    ir /= np.sqrt(np.sum(ir ** 2))
    N = 1 << int(np.ceil(np.log2(n + ir_len)))
    wet[ch] = np.fft.irfft(np.fft.rfft(mix[ch], N) * np.fft.rfft(ir, N), N)[:n]
y = 0.55 * mix + 0.45 * wet

# Fundido de entrada y salida
fade = np.minimum(np.clip(t / 4.0, 0, 1), np.clip((dur - t) / 6.0, 0, 1))
y *= fade
y /= np.max(np.abs(y)) / 0.8

with tempfile.NamedTemporaryFile(suffix='.wav') as tmp:
    with wave.open(tmp.name, 'wb') as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR)
        w.writeframes((y.T * 32767).astype('<i2').tobytes())
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', tmp.name,
                    '-af', 'lowpass=f=6000,loudnorm=I=-20:TP=-2', '-ar', '44100', '-b:a', '160k', out], check=True)
print('ok', out)
