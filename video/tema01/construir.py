"""Construye index.html (composición de HyperFrames) a partir de guion.json y de las
duraciones de la voz (voz/duraciones.json). También genera la música de fondo.

    python3 gen_voz.py && python3 construir.py && npx hyperframes render ...
"""
import html, json, os, sys

D = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, os.path.join(D, ".."))
g = json.load(open(os.path.join(D, "guion.json"), encoding="utf-8"))
dur = {k: v["dur"] for k, v in json.load(open(os.path.join(D, "voz", "duraciones.json"))).items()}

INTRO, OUTRO = 6.0, 6.0
GAP, LEAD, TAIL = 0.55, 1.1, 0.9
TAILS = {"pregunta": 3.2, "lectura": 1.4}

# ---------------- línea de tiempo ----------------
t = INTRO
escenas = []
for esc in g["escenas"]:
    s0 = t
    c = s0 + LEAD + (0.6 if esc["id"] == "lectura" else 0)
    frases = []
    for f in esc["frases"]:
        frases.append({**f, "t": round(c, 3), "d": dur[f["id"]]})
        c += dur[f["id"]] + GAP
    end = c - GAP + TAILS.get(esc["id"], TAIL)
    escenas.append({**esc, "t": round(s0, 3), "d": round(end - s0, 3), "frases": frases})
    t = end
CONT_END = t
TOTAL = round(CONT_END + OUTRO, 3)
json.dump({"total": TOTAL, "escenas": [{k: e[k] for k in ("id", "t", "d")} | {"frases": [{k: f[k] for k in ("id", "t", "d")} for f in e["frases"]]} for e in escenas]},
          open(os.path.join(D, "voz", "linea_tiempo.json"), "w"), indent=1)

# ---------------- música de fondo (motivo del jingle, muy suave) ----------------
def musica(seg):
    import numpy as np
    import jingle as J
    SR = J.SR
    mix = np.zeros((int((seg + 3) * SR), 2))
    acordes = [["D3", "A3", "F#4"], ["B2", "F#3", "D4"], ["G2", "D3", "B3"], ["A2", "E3", "C#4"]]
    paso = 4.8
    k = 0; tt = 0.0
    while tt < seg:
        ac = acordes[k % 4]
        J.add(mix, J.pad([J.hz(n) for n in ac], paso + 1.6, 0.5, 1.4, 1.6), tt)
        if k % 2 == 0:   # el motivo, en campanita, cada dos acordes
            for i, n in enumerate(["D5", "F#5", "A5"] if k % 4 == 0 else ["A4", "D5", "E5"]):
                J.add(mix, J.bell(J.hz(n), 2.2, 0.10), tt + 0.6 + i * 0.6, pan=-0.2 + 0.2 * i)
        tt += paso; k += 1
    y = J.reverb(mix, 2.6, 0.35)[: int(seg * SR)]
    n = len(y); x = np.arange(n) / SR
    y *= (np.clip(x / 2.0, 0, 1) * np.clip((seg - x) / 2.5, 0, 1))[:, None]
    y *= 0.5 / np.abs(y).max()
    J.write_wav(os.path.join(D, "musica", "fondo.wav"), y)

seg_musica = round(CONT_END - INTRO + 0.5, 2)
if not os.path.exists(os.path.join(D, "musica", "fondo.wav")) or "--musica" in sys.argv:
    musica(seg_musica)

# ---------------- HTML ----------------
E = lambda s: html.escape(s, quote=True)

def pos(f, palabra, frac=0.0):
    """Instante aproximado en que la voz dice `palabra` dentro de la frase f."""
    i = f["voz"].find(palabra)
    return round(f["t"] + f["d"] * (max(i, 0) / len(f["voz"])) + frac, 3)

F = {f["id"]: f for e in escenas for f in e["frases"]}
S = {e["id"]: e for e in escenas}

def cabecera(esc):
    s = esc.get("seccion")
    if not s:
        return ""
    num = f'<span class="num">{E(s["num"])}</span>' if s["num"] else ""
    return f'<header class="sec">{num}<span class="nom">{E(s["nombre"])}</span></header>'

def subtitulos(esc):
    out = []
    for f in esc["frases"]:
        fuente = f.get("fuente")
        out.append(
            f'<div class="cap" id="cap-{f["id"]}"><p>{E(f["voz"])}</p>'
            + (f'<small>{E(fuente)}</small>' if fuente else "")
            + "</div>")
    return '<div class="caps">' + "".join(out) + "</div>"

def medal(id_, emoji, label="", cls=""):
    lab = f'<span class="lab">{E(label)}</span>' if label else ""
    return f'<div class="medal {cls}" id="{id_}"><span class="emo">{emoji}</span>{lab}</div>'

ilus = {
"portada": f'''
  <div class="corona">
    <svg viewBox="0 0 800 420" class="corona-svg">
      <defs>
        <radialGradient id="glowv" cx="50%" cy="50%" r="50%"><stop offset="0" stop-color="#ffe6a8" stop-opacity=".9"/><stop offset="1" stop-color="#ffcf70" stop-opacity="0"/></radialGradient>
        <linearGradient id="morado" x1="0" x2="1"><stop offset="0" stop-color="#4b2a6b"/><stop offset=".5" stop-color="#6d3f96"/><stop offset="1" stop-color="#47265f"/></linearGradient>
        <linearGradient id="rosa" x1="0" x2="1"><stop offset="0" stop-color="#b9647f"/><stop offset=".5" stop-color="#e08aa5"/><stop offset="1" stop-color="#ad5873"/></linearGradient>
      </defs>
      <ellipse cx="400" cy="330" rx="330" ry="78" fill="#2f5a2c"/>
      <ellipse cx="400" cy="322" rx="300" ry="62" fill="#3f7a39"/>
      <ellipse cx="400" cy="330" rx="210" ry="40" fill="#5b1a10"/>
      {''.join(f'<circle cx="{400+300*__import__("math").cos(a)}" cy="{326+64*__import__("math").sin(a)}" r="{14 + (i%3)*3}" fill="{["#2d6a2a","#4c8f43","#356f30"][i%3]}"/>' for i,a in enumerate([k*0.2618 for k in range(24)]))}
      {''.join(f'<circle cx="{400+305*__import__("math").cos(a)}" cy="{330+66*__import__("math").sin(a)}" r="8" fill="#b8332a"/>' for a in [0.4,1.9,3.3,4.6,5.7])}
      <g id="velas">
        <rect x="150" y="150" width="64" height="190" rx="8" fill="url(#morado)"/>
        <rect x="290" y="120" width="64" height="210" rx="8" fill="url(#morado)"/>
        <rect x="446" y="120" width="64" height="210" rx="8" fill="url(#rosa)"/>
        <rect x="586" y="150" width="64" height="190" rx="8" fill="url(#morado)"/>
        <g stroke="#2a2118" stroke-width="4"><line x1="182" y1="150" x2="182" y2="134"/><line x1="322" y1="120" x2="322" y2="104"/><line x1="478" y1="120" x2="478" y2="104"/><line x1="618" y1="150" x2="618" y2="134"/></g>
      </g>
      <g id="llama1" transform="translate(182 128)">
        <circle r="70" fill="url(#glowv)"/>
        <path d="M0,-52 C 18,-28 20,-8 0,6 C -20,-8 -18,-28 0,-52 Z" fill="#ffb933"/>
        <path d="M0,-34 C 9,-20 10,-8 0,0 C -10,-8 -9,-20 0,-34 Z" fill="#fff3c4"/>
      </g>
    </svg>
  </div>
  <h1 class="titulo">{E(g["titulo"])}</h1>
  <div class="lema">{E(g["lema"])}</div>''',

"lectura": f'''
  <div class="cielo" id="cielo"></div>
  <div class="cita"><b>{E(S["lectura"]["cita"])}</b><i>{E(S["lectura"]["subtitulo"])}</i></div>
  <div class="astro" id="luna"></div>
  <div class="astro" id="sol"></div>
  <div class="estrellas" id="estrellas">{"".join(f'<i style="left:{40 + (abs(__import__("math").sin(k*12.9898)*43758.5453)%1)*1000:.0f}px;top:{250 + (abs(__import__("math").sin(k*78.233)*12345.678)%1)*560:.0f}px;width:{3+(k%3)*2}px;height:{3+(k%3)*2}px"></i>' for k in range(40))}</div>
  <div class="velo"></div>
  <div class="suelo"></div>
  <svg class="casa" viewBox="0 0 1080 760">
    <path d="M0,620 C 260,560 820,560 1080,620 L1080,760 L0,760 Z" fill="#1d2a1a"/>
    <g transform="translate(300 250)">
      <polygon points="-30,170 240,10 510,170" fill="#4a2a1c"/>
      <rect x="0" y="160" width="480" height="300" fill="#7a4a2e"/>
      <rect x="40" y="220" width="110" height="100" rx="6" fill="#ffd27a" id="ventana"/>
      <line x1="95" y1="220" x2="95" y2="320" stroke="#7a4a2e" stroke-width="8"/><line x1="40" y1="270" x2="150" y2="270" stroke="#7a4a2e" stroke-width="8"/>
      <path d="M300,460 L300,290 Q355,230 410,290 L410,460 Z" fill="#3a2015"/>
      <path d="M308,460 L308,296 Q355,244 402,296 L402,460 Z" fill="#ffcf75" id="puerta" opacity=".9"/>
    </g>
  </svg>
  {medal("m-portero", "🏮", "", "portero")}
  {medal("m-gallo", "🐓", "", "gallo")}
  <div class="zzz" id="zzz">Z z z</div>''',

"judia": f'''
  <div class="noche"></div>
  <div class="guardias">
    {medal("m-burro", "🫏", "1.ª guardia")}
    {medal("m-perro", "🐕", "2.ª guardia")}
    {medal("m-bebe", "👶", "3.ª guardia")}
  </div>
  <div class="reloj" id="reloj">
    {''.join(f'<div class="cuarto" id="q{k}"><span>{lab}</span></div>' for k, lab in enumerate(["Atardecer", "Medianoche", "Canto del gallo", "Amanecer"]))}
  </div>
  {medal("m-rollo", "📜", "Maimónides", "solo")}''',

"padres": f'''
  <div class="papel"></div>
  <div class="venidas">
    {medal("v-belen", "⭐", "Belén")}
    {medal("v-hoy", "❤️", "Hoy")}
    {medal("v-gloria", "👑", "En la gloria")}
  </div>
  <div class="autor" id="a-cirilo"><i>San Cirilo de Jerusalén</i></div>
  <div class="autor" id="a-bernardo"><i>San Bernardo</i></div>''',

"comentario": f'''
  <div class="calido"></div>
  {medal("k-c1", "🏮", "", "solo grande")}
  {medal("k-c2", "🚪", "", "solo grande")}
  {medal("k-c3", "😴", "", "solo grande")}
  {medal("k-c4", "⛪", "", "solo grande")}
  {medal("k-c5", "🤝", "", "solo grande")}''',

"pregunta": f'''
  <div class="rojo"></div>
  <div class="pq" id="pq"><span class="comilla">¿</span>{E(F["q1"]["voz"][1:-1])}<span class="comilla">?</span></div>''',
}

escenas_html = []
for esc in escenas:
    escenas_html.append(f'''
    <section id="esc-{esc["id"]}" class="escena clip esc-{esc["id"]}" data-start="{esc["t"]}" data-duration="{esc["d"]}" data-track-index="1">
      {ilus[esc["id"]]}
      {cabecera(esc)}
      <img class="sello" src="assets/logo.png" alt="">
      {subtitulos(esc) if esc["id"] != "pregunta" else ""}
    </section>''')

audios = [f'<audio id="voz-{f["id"]}" src="voz/{f["id"]}.wav" data-start="{f["t"]}" data-duration="{f["d"]}" data-volume="1" data-track-index="3"></audio>'
          for e in escenas for f in e["frases"]]

# eventos de animación (todos con tiempos absolutos)
ev = {
    "total": TOTAL, "intro": INTRO, "contEnd": round(CONT_END, 3),
    "escenas": [{"id": e["id"], "t": e["t"], "d": e["d"]} for e in escenas],
    "frases": [{"id": f["id"], "t": f["t"], "d": f["d"], "esc": e["id"]} for e in escenas for f in e["frases"] if e["id"] != "pregunta"],
    "vela": F["p2"]["t"] + 0.2,
    "cielo": [pos(F["l4"], "atardecer"), pos(F["l4"], "medianoche"), pos(F["l4"], "gallo"), pos(F["l4"], "amanecer")],
    "dormidos": pos(F["l5"], "dormidos"), "velad": pos(F["l6"], "¡Velad"),
    "portero": pos(F["l3"], "portero"),
    "guardias": [pos(F["j2"], "primera"), pos(F["j2"], "segunda"), pos(F["j2"], "tercera")],
    "reloj": F["j3"]["t"], "rollo": F["j4"]["t"],
    "cirilo": F["f1"]["t"], "belen": pos(F["f2"], "primera"), "gloria": pos(F["f2"], "segunda"),
    "bernardo": F["f3"]["t"], "hoy": pos(F["f3"], "en medio"),
    "coment": [F[k]["t"] for k in ("c1", "c2", "c3", "c4", "c5")],
    "pregunta": F["q1"]["t"],
}

tpl = open(os.path.join(D, "plantilla.html.tpl"), encoding="utf-8").read()
out = (tpl.replace("{{TOTAL}}", str(TOTAL))
          .replace("{{INTRO}}", str(INTRO))
          .replace("{{OUTRO_T}}", str(round(CONT_END, 3)))
          .replace("{{MUSICA_T}}", str(INTRO - 0.2))
          .replace("{{MUSICA_D}}", str(seg_musica))
          .replace("{{ESCENAS}}", "\n".join(escenas_html))
          .replace("{{AUDIOS}}", "\n    ".join(audios))
          .replace("{{EVENTOS}}", json.dumps(ev, ensure_ascii=False)))
open(os.path.join(D, "index.html"), "w", encoding="utf-8").write(out)
print(f"index.html listo · duración total {TOTAL:.1f} s ({int(TOTAL // 60)}:{int(TOTAL % 60):02d})")
