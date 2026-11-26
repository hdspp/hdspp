<!doctype html>
<html lang="es" data-resolution="portrait">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=1080, height=1920" />
  <title>Tema 1 · Primer domingo de Adviento</title>
  <!-- Generado por construir.py a partir de plantilla.html y guion.json. No editar a mano. -->
  <script src="assets/vendor/gsap.min.js"></script>
  <style>
    @font-face { font-family: "Cormorant Garamond"; font-weight: 600; src: url(assets/fonts/cormorant-garamond-latin-600-normal.woff2); }
    @font-face { font-family: "Cormorant Garamond"; font-weight: 600; font-style: italic; src: url(assets/fonts/cormorant-garamond-latin-600-italic.woff2); }
    @font-face { font-family: "Cormorant Garamond"; font-weight: 700; src: url(assets/fonts/cormorant-garamond-latin-700-normal.woff2); }
    @font-face { font-family: "EB Garamond"; font-weight: 400; src: url(assets/fonts/eb-garamond-latin-400-normal.woff2); }
    @font-face { font-family: "EB Garamond"; font-weight: 400; font-style: italic; src: url(assets/fonts/eb-garamond-latin-400-italic.woff2); }
    @font-face { font-family: "EB Garamond"; font-weight: 500; src: url(assets/fonts/eb-garamond-latin-500-normal.woff2); }
    @font-face { font-family: "Noto Color Emoji"; src: url(assets/fonts/NotoColorEmoji.ttf); }

    :root {
      --rojo: #681b11; --rojo-claro: #8f2c1b; --rojo-oscuro: #3e0e07;
      --oro: #b78934; --oro-claro: #e3bf6e;
      --crema: #f3e6d3; --papel: #f6efe2; --tinta: #2a2118; --rubrica: #8c2f1e;
      --display: "Cormorant Garamond", Georgia, serif;
      --texto: "EB Garamond", Georgia, serif;
      --emoji: "Noto Color Emoji", sans-serif;
    }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    html, body { width: 1080px; height: 1920px; overflow: hidden; background: var(--rojo-oscuro); }
    #root { position: relative; width: 1080px; height: 1920px; overflow: hidden; background: var(--rojo-oscuro); }
    .clip { position: absolute; inset: 0; width: 1080px; height: 1920px; }
    video.clip { object-fit: cover; }
    .escena { overflow: hidden; font-family: var(--texto); color: var(--crema); opacity: 0; }
    .escena > * { position: absolute; }

    /* Zona segura común a Shorts, Reels y TikTok: texto entre x 120–888 e y 288–1248. */
    /* ---------- elementos comunes ---------- */
    .sec { z-index: 3; top: 296px; left: 120px; width: 768px; display: flex; align-items: baseline; justify-content: center; gap: 18px; text-align: center; }
    .sec .num { font-family: var(--display); font-weight: 700; font-size: 54px; line-height: 1; color: var(--oro-claro); }
    .sec .nom { font-family: var(--texto); font-weight: 500; font-size: 28px; letter-spacing: .16em; text-transform: uppercase; color: var(--oro-claro); }
    .caps { left: 120px; width: 768px; top: 830px; height: 412px; }
    .cap { position: absolute; left: 0; right: 0; top: 0; bottom: 0; display: flex; flex-direction: column; justify-content: center; align-items: center;
           padding: 26px 30px; border-radius: 30px; background: rgba(30, 8, 4, .62); box-shadow: 0 14px 40px rgba(0,0,0,.25); opacity: 0; text-align: center; }
    .cap p { font-size: 45px; line-height: 1.24; }
    .cap small { margin-top: 16px; font-size: 28px; letter-spacing: .03em; color: var(--oro-claro); font-style: italic; }

    .medal { width: 240px; height: 270px; display: flex; flex-direction: column; align-items: center; gap: 12px; }
    .medal .emo { width: 200px; height: 200px; border-radius: 50%; display: flex; align-items: center; justify-content: center;
                  font-family: var(--emoji); font-size: 110px; line-height: 1; background: radial-gradient(circle at 50% 40%, #fffaf0, var(--crema));
                  border: 7px solid var(--oro); box-shadow: 0 0 0 6px rgba(227,191,110,.25), 0 16px 40px rgba(0,0,0,.35); }
    .medal .lab { font-size: 30px; font-weight: 500; letter-spacing: .08em; text-transform: uppercase; color: var(--oro-claro); white-space: nowrap; }
    .medal.solo { left: 384px; top: 430px; }
    .medal.grande { width: 380px; height: 380px; left: 314px; top: 400px; }
    .medal.grande .emo { width: 370px; height: 370px; font-size: 210px; border-width: 11px; }

    /* ---------- portada ---------- */
    .esc-portada { background: radial-gradient(ellipse 80% 60% at 50% 35%, var(--rojo-claro), var(--rojo) 50%, var(--rojo-oscuro)); }
    .corona { left: 154px; top: 330px; width: 700px; }
    .corona-svg { width: 700px; height: 367px; overflow: visible; }
    .titulo { left: 120px; width: 768px; top: 690px; text-align: center; font-family: var(--display); font-weight: 600; font-size: 64px; white-space: nowrap; line-height: 1.02; color: var(--crema); }
    .lema { left: 120px; width: 768px; top: 775px; text-align: center; font-family: var(--display); font-style: italic; font-weight: 600; font-size: 66px; color: var(--oro-claro); }
    .esc-portada .caps { top: 920px; height: 322px; }

    /* ---------- lectura ---------- */
    .cielo, .cielo i { position: absolute; inset: 0; }
    .cielo i { opacity: 0; }
    .cielo .c0 { opacity: 1; background: linear-gradient(#141a3a, #33315e 55%, #6a4a6e); }
    .cielo .c1 { background: linear-gradient(#3b2a5a, #c2577a 45%, #f3a35b 75%); }
    .cielo .c2 { background: linear-gradient(#05071a, #0d1640 60%, #1d2856); }
    .cielo .c3 { background: linear-gradient(#1b1d45, #4c4777 55%, #a77c8c); }
    .cielo .c4 { background: linear-gradient(#6fb0e4, #f6c9a1 60%, #ffd98f); }
    .estrellas { inset: 0; }
    .estrellas i { position: absolute; border-radius: 50%; background: #fff6da; box-shadow: 0 0 10px #fff1c0; }
    .astro { width: 130px; height: 130px; border-radius: 50%; }
    #luna { left: 690px; top: 560px; background: radial-gradient(circle at 38% 38%, #fffbe8, #f1e2b0); box-shadow: 0 0 60px 20px rgba(255,240,190,.45); opacity: 0; }
    #sol { left: 200px; top: 900px; width: 180px; height: 180px; background: radial-gradient(circle, #fff6c8, #ffc24a 60%, #ff9b2f); box-shadow: 0 0 120px 50px rgba(255,190,80,.6); opacity: 0; }
    .casa { left: 154px; top: 420px; width: 700px; height: 493px; }
    .cita { z-index: 3; left: 120px; width: 768px; top: 372px; text-align: center; display: flex; flex-direction: column; gap: 6px; }
    .cita b { font-family: var(--display); font-weight: 700; font-size: 42px; color: var(--oro-claro); }
    .cita i { font-family: var(--texto); font-style: italic; font-size: 30px; line-height: 1.22; color: var(--crema); }
    .portero { left: 650px; top: 700px; width: 110px; height: 110px; }
    .portero .emo { width: 110px; height: 110px; font-size: 62px; border-width: 5px; }
    .gallo { left: 720px; top: 480px; width: 140px; height: 140px; }
    .gallo .emo { width: 140px; height: 140px; font-size: 82px; border-width: 5px; }
    .zzz { left: 300px; top: 610px; font-family: var(--display); font-style: italic; font-weight: 700; font-size: 70px; color: #dfe6ff; opacity: 0; letter-spacing: .1em; }
    .esc-lectura .caps { top: 880px; height: 362px; }
    .velo { left: 0; right: 0; top: 0; height: 640px; background: linear-gradient(rgba(12,10,30,.62), rgba(12,10,30,.5) 70%, transparent); }
    .suelo { left: 0; right: 0; top: 880px; bottom: 0; background: linear-gradient(#1d2a1a, #142012 40%, #0c140b); }
    .sello { left: 450px; top: 1420px; width: 180px; height: 180px; border-radius: 26px; box-shadow: 0 12px 40px rgba(0,0,0,.35); opacity: .92; }

    /* ---------- tradición judía ---------- */
    .noche { inset: 0; background: radial-gradient(ellipse 90% 70% at 50% 30%, #2a2f6b, #161a45 55%, #0b0d26); }
    .guardias { left: 120px; width: 768px; top: 410px; display: flex; justify-content: space-between; }
    .reloj { left: 150px; width: 708px; top: 420px; display: grid; grid-template-columns: 1fr 1fr; gap: 18px; }
    .cuarto { position: relative; height: 150px; border-radius: 24px; border: 4px solid rgba(227,191,110,.55); display: flex; align-items: center; justify-content: center;
              background: rgba(227,191,110,.12); opacity: 0; }
    .cuarto span { font-family: var(--display); font-weight: 600; font-size: 44px; color: var(--crema); }

    /* ---------- padres ---------- */
    .papel { inset: 0; background: radial-gradient(ellipse 90% 70% at 50% 35%, #fbf6ec, var(--papel) 60%, #eadcc2); }
    .esc-padres .sec .num, .esc-padres .sec .nom { color: var(--rubrica); }
    .venidas { left: 120px; width: 768px; top: 400px; height: 280px; }
    .venidas .medal { position: absolute; top: 0; }
    #v-belen { left: 0; } #v-hoy { left: 264px; } #v-gloria { left: 528px; }
    .esc-padres .medal .lab { color: var(--rubrica); }
    .autor { left: 120px; width: 768px; top: 700px; text-align: center; font-family: var(--display); font-weight: 600; font-size: 58px; color: var(--rubrica); opacity: 0; }
    .esc-padres .cap { background: rgba(255,255,255,.66); border: 2px solid #e2d2b4; box-shadow: 0 12px 36px rgba(90,60,20,.12); }
    .esc-padres .cap p { color: var(--tinta); }
    .esc-padres .cap small { color: var(--rubrica); }

    /* ---------- comentario ---------- */
    .calido { inset: 0; background: radial-gradient(ellipse 70% 45% at 50% 30%, #a8572a, #5a2412 55%, #2a0d06); }
    .esc-comentario .medal { opacity: 0; }

    /* ---------- pregunta ---------- */
    .rojo { inset: 0; background: radial-gradient(ellipse 85% 60% at 50% 40%, var(--rojo-claro), var(--rojo) 55%, var(--rojo-oscuro)); }
    .pq { left: 120px; width: 768px; top: 430px; text-align: center; font-family: var(--display); font-weight: 600; font-size: 74px; line-height: 1.12; color: var(--crema); opacity: 0; }
    .pq .comilla { color: var(--oro-claro); }
  </style>
</head>
<body>
  <div id="root" data-composition-id="main" data-start="0" data-duration="{{TOTAL}}" data-width="1080" data-height="1920">
    <video id="apertura" class="clip" src="assets/apertura_9x16.mp4" data-start="0" data-duration="{{INTRO}}" data-has-audio="true" data-track-index="0"></video>
{{ESCENAS}}
    <video id="cierre" class="clip" src="assets/cierre_9x16.mp4" data-start="{{OUTRO_T}}" data-duration="6" data-has-audio="true" data-track-index="0"></video>
    <audio id="musica" src="musica/fondo.wav" data-start="{{MUSICA_T}}" data-duration="{{MUSICA_D}}" data-volume="0.5" data-fade-in="1.5" data-fade-out="2" data-track-index="2"></audio>
    {{AUDIOS}}
  </div>
  <script>
    const EV = {{EVENTOS}};
    const tl = gsap.timeline({ paused: true });
    const $ = s => document.querySelector(s);

    // Cielo de la lectura: capas que se funden
    (function () {
      const c = document.getElementById("cielo");
      for (let k = 0; k < 5; k++) { const i = document.createElement("i"); i.className = "c" + k; c.appendChild(i); }
    })();

    // ---- escenas: aparecer y desaparecer ----
    for (const e of EV.escenas) {
      const el = "#esc-" + e.id;
      tl.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power1.out" }, e.t);
      tl.to(el, { opacity: 0, duration: 0.5, ease: "power1.in" }, e.t + e.d - 0.5);
      if ($(el + " .sec")) tl.from(el + " .sec", { y: -40, opacity: 0, duration: 0.7, ease: "power3.out" }, e.t + 0.25);
      // movimiento lento y continuo del fondo/ilustración (evita planos congelados)
      tl.fromTo(el + " > :first-child", { scale: 1 }, { scale: 1.07, y: -24, duration: e.d, ease: "none" }, e.t);
      if ($(el + " .caps")) tl.fromTo(el + " .caps", { y: 6 }, { y: -6, duration: 2.4, ease: "sine.inOut", yoyo: true, repeat: Math.floor(e.d / 2.4) }, e.t);
    }

    // ---- subtítulos: cada frase visible mientras se dice ----
    EV.frases.forEach((f, i) => {
      const sig = EV.frases[i + 1];
      const esc = EV.escenas.find(e => e.id === f.esc);
      const fin = sig && sig.esc === f.esc ? sig.t - 0.28 : esc.t + esc.d - 0.6;
      const el = "#cap-" + f.id;
      tl.fromTo(el, { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" }, f.t - 0.2);
      tl.to(el, { opacity: 0, y: -20, duration: 0.3, ease: "power1.in" }, fin);
    });

    // ---- portada ----
    {
      const t = EV.escenas[0].t;
      tl.from(".corona", { opacity: 0, scale: 0.85, y: 40, duration: 1.0, ease: "back.out(1.4)" }, t + 0.1);
      tl.from(".titulo", { opacity: 0, y: 40, duration: 0.8, ease: "power3.out" }, t + 0.5);
      tl.from(".lema", { opacity: 0, scale: 0.7, duration: 0.8, ease: "back.out(2)" }, t + 0.95);
      tl.set("#llama1", { opacity: 0 }, 0);
      tl.fromTo("#llama1", { opacity: 0, scale: 0.2, transformOrigin: "50% 100%" }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2.2)" }, EV.vela);
      tl.to("#llama1", { scaleY: 1.08, scaleX: 0.95, transformOrigin: "50% 100%", duration: 0.22, ease: "sine.inOut", yoyo: true, repeat: 40 }, EV.vela + 0.7);
    }

    // ---- lectura: la noche del portero ----
    {
      const [atar, media, gallo, amanecer] = EV.cielo;
      const capa = k => "#cielo .c" + k;
      tl.to(capa(1), { opacity: 1, duration: 0.9 }, atar - 0.2);
      tl.to(capa(2), { opacity: 1, duration: 0.9 }, media - 0.2);
      tl.to("#luna", { opacity: 1, y: -60, duration: 1.2, ease: "power2.out" }, media - 0.2);
      tl.to("#estrellas", { opacity: 1, duration: 0.8 }, media - 0.1);
      tl.to(capa(3), { opacity: 1, duration: 0.8 }, gallo - 0.2);
      tl.fromTo("#m-gallo", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.4)" }, gallo - 0.1);
      tl.to(capa(4), { opacity: 1, duration: 1.0 }, amanecer - 0.2);
      tl.to("#luna", { opacity: 0, duration: 0.8 }, amanecer);
      tl.to("#estrellas", { opacity: 0, duration: 0.8 }, amanecer);
      tl.fromTo("#sol", { opacity: 0, y: 160 }, { opacity: 1, y: -380, duration: 2.6, ease: "power2.out" }, amanecer - 0.2);
      tl.set("#estrellas", { opacity: 0.55 }, 0);
      tl.fromTo("#m-portero", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.4)" }, EV.portero);
      tl.fromTo("#zzz", { opacity: 0, y: 20 }, { opacity: 1, y: -20, duration: 0.9, ease: "power1.out" }, EV.dormidos);
      tl.to("#zzz", { opacity: 0, duration: 0.4 }, EV.velad - 0.2);
      tl.to("#m-portero", { scale: 1.35, duration: 0.3, yoyo: true, repeat: 3, ease: "sine.inOut" }, EV.velad);
      tl.from(".cita", { opacity: 0, y: 30, duration: 0.8, ease: "power2.out" }, EV.escenas[1].t + 0.4);
    }

    // ---- tradición judía ----
    {
      ["#m-burro", "#m-perro", "#m-bebe"].forEach((m, k) => {
        tl.fromTo(m, { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2.2)" }, EV.guardias[k] - 0.1);
      });
      const nombres = ["#q0", "#q1", "#q2", "#q3"];
      const j3 = EV.frases.find(f => f.id === "j3");
      tl.to(".guardias", { opacity: 0, scale: 0.9, duration: 0.5 }, EV.reloj - 0.4);
      nombres.forEach((q, k) => {
        tl.fromTo(q, { opacity: 0, scale: 0.8 }, { opacity: 1, scale: 1, duration: 0.45, ease: "back.out(2)" }, EV.reloj + k * (j3.d * 0.5 / 4));
      });
      tl.to([".guardias", ".reloj"], { opacity: 0, duration: 0.5 }, EV.rollo - 0.4);
      tl.fromTo("#m-rollo", { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.7, ease: "back.out(2)" }, EV.rollo);
      tl.set("#m-rollo", { opacity: 0 }, 0);
    }

    // ---- padres ----
    {
      tl.set(["#v-belen", "#v-hoy", "#v-gloria"], { opacity: 0 }, 0);
      tl.fromTo(["#v-belen", "#v-gloria"], { opacity: 0, scale: 0.4 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(2)", stagger: 0.2 }, EV.cirilo);
      tl.fromTo("#a-cirilo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, EV.cirilo + 0.2);
      tl.to("#v-belen", { scale: 1.12, duration: 0.35, yoyo: true, repeat: 1 }, EV.belen);
      tl.to("#v-gloria", { scale: 1.12, duration: 0.35, yoyo: true, repeat: 1 }, EV.gloria);
      tl.to("#a-cirilo", { opacity: 0, duration: 0.4 }, EV.bernardo - 0.3);
      tl.fromTo("#a-bernardo", { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6 }, EV.bernardo);
      tl.fromTo("#v-hoy", { opacity: 0, scale: 0.3 }, { opacity: 1, scale: 1.1, duration: 0.7, ease: "back.out(2.4)" }, EV.hoy - 0.1);
      tl.to("#v-hoy", { scale: 1, duration: 0.4 }, EV.hoy + 0.7);
    }

    // ---- comentario: un medallón por idea ----
    {
      const ids = ["#k-c1", "#k-c2", "#k-c3", "#k-c4", "#k-c5"];
      ids.forEach((m, k) => {
        tl.fromTo(m, { opacity: 0, scale: 0.6 }, { opacity: 1, scale: 1, duration: 0.6, ease: "back.out(1.8)" }, EV.coment[k] - 0.15);
        if (k < ids.length - 1) tl.to(m, { opacity: 0, scale: 0.9, duration: 0.35 }, EV.coment[k + 1] - 0.35);
      });
    }

    // ---- pregunta final ----
    tl.fromTo("#pq", { opacity: 0, scale: 0.92 }, { opacity: 1, scale: 1, duration: 0.9, ease: "power3.out" }, EV.pregunta - 0.3);

    window.__timelines = window.__timelines || {};
    window.__timelines["main"] = tl;
    tl.seek(0);
  </script>
</body>
</html>
