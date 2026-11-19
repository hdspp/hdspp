"""Genera la narración del tema con Piper TTS y escribe la duración de cada clip.

Uso: python3 scripts/narracion.py <modelo.onnx> tema01
Requiere: pip install piper-tts ; ffmpeg
"""
import json, subprocess, sys, tempfile, wave
from pathlib import Path

model, tema = sys.argv[1], sys.argv[2]
root = Path(__file__).resolve().parent.parent
items = json.loads((root / f'src/{tema}/narracion.json').read_text())
out = root / f'public/{tema}/narracion'
out.mkdir(parents=True, exist_ok=True)
timing = {}
with tempfile.TemporaryDirectory() as tmp:
    for it in items:
        wav = Path(tmp) / f"{it['id']}.wav"
        subprocess.run([sys.executable, '-m', 'piper', '-m', model, '-f', str(wav),
                        '--length-scale', '1.12', '--sentence-silence', '0.45'],
                       input=it['text'].encode(), check=True, capture_output=True)
        with wave.open(str(wav)) as w:
            timing[it['id']] = round(w.getnframes() / w.getframerate(), 3)
        # Leve compresión y normalización para voz clara.
        subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', str(wav), '-af',
                        'highpass=f=70,acompressor=threshold=-20dB:ratio=3,loudnorm=I=-16:TP=-1.5',
                        '-ar', '44100', '-b:a', '128k', str(out / f"{it['id']}.mp3")], check=True)
        print(it['id'], timing[it['id']])
(root / f'src/{tema}/timing.json').write_text(json.dumps(timing, indent=2) + '\n')
