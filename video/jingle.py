"""Jingle de «Temas católicos para pequeños».

Motivo (Re mayor):  Re5 Fa#5 La5 · Si5 La5 · Re6   (apertura: sube y queda abierto)
                    Re5 Fa#5 La5 · Sol5 Mi5 · Re5  (cierre: mismo comienzo, baja y reposa,
                                                     con cadencia plagal Sol → Re, tipo «Amén»)

Uso:  python3 jingle.py   →  build/apertura.wav, build/cierre.wav
Los tiempos de las notas se exportan también en build/tiempos.json para sincronizar la animación.
"""
import json, os, wave
import numpy as np

SR = 48000
BEAT = 0.30          # duración de una corchea (≈100 bpm)
OUT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "build")
rng = np.random.default_rng(7)   # semilla fija: el jingle sale siempre idéntico


def hz(name):
    notes = {"C": -9, "D": -7, "E": -5, "F": -4, "G": -2, "A": 0, "B": 2}
    n, acc, octv = name[0], name[1:-1], int(name[-1])
    semi = notes[n] + (1 if acc == "#" else -1 if acc == "b" else 0) + (octv - 4) * 12
    return 440.0 * 2 ** (semi / 12)


def env(n, attack, decay):
    t = np.arange(n) / SR
    a = np.clip(t / max(attack, 1e-4), 0, 1)
    return a * np.exp(-t / decay)


def bell(f, dur=3.0, amp=1.0):
    """Celesta/campanita: parciales casi armónicos con caída rápida de los agudos."""
    n = int(dur * SR); t = np.arange(n) / SR
    parts = [(1.0, 1.0, 1.6), (2.0, 0.45, 0.7), (3.01, 0.18, 0.35), (4.2, 0.10, 0.18), (5.43, 0.05, 0.10)]
    s = sum(a * np.sin(2 * np.pi * f * r * t) * env(n, 0.002, d) for r, a, d in parts)
    return amp * s


def pluck(f, dur=2.5, amp=1.0, bright=0.5):
    """Arpa: Karplus–Strong."""
    n = int(dur * SR); p = int(SR / f)
    buf = rng.uniform(-1, 1, p)
    buf -= buf.mean()                      # sin componente continua (evita el «golpe» grave)
    out = np.empty(n)
    for i in range(n):
        out[i] = buf[i % p]
        buf[i % p] = 0.996 * (bright * buf[i % p] + (1 - bright) * buf[(i + 1) % p])
    return amp * out * env(n, 0.003, 1.2)


def pad(freqs, dur, amp=1.0, attack=0.8, release=1.5):
    n = int(dur * SR); t = np.arange(n) / SR
    s = np.zeros(n)
    for f in freqs:
        for det in (-0.12, 0.0, 0.12):           # leve coro
            ff = f * 2 ** (det / 12 / 4)
            s += np.sin(2 * np.pi * ff * t) + 0.25 * np.sin(4 * np.pi * ff * t) + 0.08 * np.sin(6 * np.pi * ff * t)
    e = np.clip(t / attack, 0, 1) * np.clip((dur - t) / release, 0, 1)
    return amp * s * e / (len(freqs) * 3)


def shimmer(dur, amp=1.0):
    """Brillo inicial: ruido filtrado que crece (como un «soplo» de luz)."""
    n = int(dur * SR); t = np.arange(n) / SR
    x = rng.normal(0, 1, n)
    X = np.fft.rfft(x); fr = np.fft.rfftfreq(n, 1 / SR)
    X *= np.exp(-((fr - 7000) / 2500) ** 2)
    x = np.fft.irfft(X, n)
    x /= np.abs(x).max()
    return amp * x * (t / dur) ** 2 * np.clip((dur - t) / 0.15, 0, 1)


def add(mix, sig, at, pan=0.0):
    i = int(at * SR); j = min(len(mix), i + len(sig))
    l, r = np.cos((pan + 1) * np.pi / 4), np.sin((pan + 1) * np.pi / 4)
    mix[i:j, 0] += sig[: j - i] * l
    mix[i:j, 1] += sig[: j - i] * r


def reverb(x, seconds=2.2, wet=0.28):
    n = int(seconds * SR); t = np.arange(n) / SR
    ir = rng.normal(0, 1, (n, 2)) * np.exp(-t / (seconds / 6.9))[:, None]
    ir[: int(0.012 * SR)] = 0
    ir /= np.sqrt((ir ** 2).sum(0))
    L = len(x) + n
    y = np.stack([np.fft.irfft(np.fft.rfft(x[:, c], L) * np.fft.rfft(ir[:, c], L), L) for c in (0, 1)], 1)
    out = np.zeros_like(y); out[: len(x)] = x
    return (1 - wet) * out + wet * y


def build(kind):
    total = 6.0
    mix = np.zeros((int((total + 2.5) * SR), 2))
    t0 = 0.45
    if kind == "apertura":
        melody = [("D5", 0, 1), ("F#5", 1, 1), ("A5", 2, 2), ("B5", 4, 1), ("A5", 5, 1), ("D6", 6, 6)]
    else:
        melody = [("D5", 0, 1), ("F#5", 1, 1), ("A5", 2, 2), ("G5", 4, 1), ("E5", 5, 1), ("D5", 6, 6)]

    times = []
    add(mix, shimmer(t0 + 0.05, 0.10), 0.0)
    for k, (note, pos, length) in enumerate(melody):
        at = t0 + pos * BEAT
        times.append(round(at, 3))
        last = k == len(melody) - 1
        f = hz(note)
        add(mix, bell(f, 4.0 if last else 2.2, 0.55 if last else 0.45), at, pan=-0.15 + 0.06 * k)
        add(mix, bell(f * 2, 1.2, 0.07), at, pan=0.3)                # chispa a la octava
        if last:
            add(mix, pluck(f / 2, 3.0, 0.35, 0.6), at, pan=0.2)

    # Arpa en arpegio por debajo del motivo
    arp = ["D4", "A4", "F#4", "A4", "D4", "A4"] if kind == "apertura" else ["D4", "A4", "F#4", "A4", "G4", "B4"]
    for k, n in enumerate(arp):
        add(mix, pluck(hz(n), 2.2, 0.22, 0.55), t0 + k * BEAT, pan=0.35 if k % 2 else -0.35)

    end = t0 + 6 * BEAT
    if kind == "apertura":
        add(mix, pad([hz("D3"), hz("A3"), hz("F#4")], end + 2.6, 0.35, 1.0, 1.8), 0.15)
        add(mix, pad([hz("D4"), hz("A4"), hz("D5"), hz("F#5")], 3.2, 0.25, 0.25, 2.0), end)
    else:   # cadencia plagal: Sol (IV) → Re (I)
        add(mix, pad([hz("D3"), hz("A3"), hz("F#4")], 4 * BEAT + 0.3, 0.35, 0.8, 0.4), 0.15)
        add(mix, pad([hz("G3"), hz("B3"), hz("D4"), hz("G4")], 2 * BEAT + 0.4, 0.33, 0.15, 0.35), t0 + 4 * BEAT - 0.05)
        add(mix, pad([hz("D3"), hz("A3"), hz("D4"), hz("F#4")], 3.6, 0.35, 0.2, 2.2), end - 0.05)
    add(mix, np.sin(2 * np.pi * hz("D2") * np.arange(int(3.2 * SR)) / SR) * env(int(3.2 * SR), 0.02, 1.4) * 0.25, end)

    y = reverb(mix)[: int(total * SR)]
    n = len(y); t = np.arange(n) / SR
    Y = np.fft.rfft(y, axis=0); fr = np.fft.rfftfreq(n, 1 / SR)
    Y *= (1 / np.sqrt(1 + (55 / np.maximum(fr, 1)) ** 8))[:, None]   # paso alto suave a 55 Hz
    y = np.fft.irfft(Y, n, axis=0)
    y *= np.clip((total - t) / 0.9, 0, 1)[:, None]          # cola que se apaga a los 6 s
    y *= 10 ** (-1.0 / 20) / np.abs(y).max()                # pico a −1 dBFS
    return y, times


def write_wav(path, y):
    data = (np.clip(y, -1, 1) * 32767).astype("<i2")
    with wave.open(path, "wb") as w:
        w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(data.tobytes())


if __name__ == "__main__":
    os.makedirs(OUT, exist_ok=True)
    tiempos = {}
    for kind in ("apertura", "cierre"):
        y, times = build(kind)
        write_wav(os.path.join(OUT, f"{kind}.wav"), y)
        tiempos[kind] = times
    with open(os.path.join(OUT, "tiempos.json"), "w") as f:
        json.dump(tiempos, f, indent=2)
    print(json.dumps(tiempos))
