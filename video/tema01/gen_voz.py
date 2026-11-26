"""Genera la voz de cada frase de guion.json con el TTS local de HyperFrames (Kokoro)
y guarda las duraciones en voz/duraciones.json.  Sólo regenera las frases cuyo texto cambió."""
import hashlib, json, os, subprocess, wave

D = os.path.dirname(os.path.abspath(__file__))
g = json.load(open(os.path.join(D, "guion.json"), encoding="utf-8"))
os.makedirs(os.path.join(D, "voz"), exist_ok=True)
dur_path = os.path.join(D, "voz", "duraciones.json")
prev = json.load(open(dur_path)) if os.path.exists(dur_path) else {}
out = {}
for esc in g["escenas"]:
    for f in esc["frases"]:
        h = hashlib.sha1((f["voz"] + g["voz"]["id"] + str(g["voz"]["velocidad"])).encode()).hexdigest()[:10]
        wav = os.path.join(D, "voz", f"{f['id']}.wav")
        if prev.get(f["id"], {}).get("hash") != h or not os.path.exists(wav):
            subprocess.run(["npx", "hyperframes", "tts", "--text-file", "/dev/stdin", "-v", g["voz"]["id"],
                            "-s", str(g["voz"]["velocidad"]), "-o", wav],
                           input=f["voz"].encode(), cwd=D, check=True, capture_output=True)
            print("voz", f["id"])
        with wave.open(wav) as w:
            out[f["id"]] = {"hash": h, "dur": round(w.getnframes() / w.getframerate(), 3)}
json.dump(out, open(dur_path, "w"), indent=1)
print("total voz:", round(sum(v["dur"] for v in out.values()), 1), "s")
