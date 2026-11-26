// Renderiza la apertura y el cierre a MP4.
// Uso:  node render.js                → todo (16:9 y 9:16)
//       node render.js apertura 16x9  → sólo una pieza
//       node render.js --fotos 0.5,1.2,3   → sólo fotogramas sueltos (PNG) para revisar
const { chromium } = require("playwright");
const { execFileSync } = require("child_process");
const fs = require("fs");
const path = require("path");

const DIR = __dirname;
const BUILD = path.join(DIR, "build");
const SALIDA = path.join(DIR, "salida");
const FPS = 30, DUR = 6.0;
const FORMATOS = { "16x9": [1920, 1080], "9x16": [1080, 1920] };

async function main() {
  const args = process.argv.slice(2);
  const fotos = args.includes("--fotos") ? args[args.indexOf("--fotos") + 1].split(",").map(Number) : null;
  const tipos = args.filter(a => ["apertura", "cierre"].includes(a));
  const forms = args.filter(a => a in FORMATOS);
  fs.mkdirSync(SALIDA, { recursive: true });

  const browser = await chromium.launch();
  for (const tipo of tipos.length ? tipos : ["apertura", "cierre"]) {
    for (const f of forms.length ? forms : Object.keys(FORMATOS)) {
      const [w, h] = FORMATOS[f];
      const page = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: 1 });
      await page.goto(`file://${DIR}/escena.html?tipo=${tipo}&w=${w}&h=${h}`);
      await page.evaluate(() => window.ready);
      const stage = await page.$("#stage");

      if (fotos) {
        for (const t of fotos) {
          await page.evaluate(t => window.render(t), t);
          await stage.screenshot({ path: path.join(BUILD, `foto_${tipo}_${f}_${t}.png`) });
        }
        await page.close();
        continue;
      }

      const frames = path.join(BUILD, `frames_${tipo}_${f}`);
      fs.rmSync(frames, { recursive: true, force: true });
      fs.mkdirSync(frames, { recursive: true });
      const n = Math.round(DUR * FPS);
      for (let i = 0; i < n; i++) {
        await page.evaluate(t => window.render(t), i / FPS);
        await stage.screenshot({ path: path.join(frames, `${String(i).padStart(4, "0")}.png`) });
      }
      await page.close();

      const out = path.join(SALIDA, `${tipo}_${f}.mp4`);
      execFileSync("ffmpeg", [
        "-y", "-hide_banner", "-loglevel", "error",
        "-framerate", String(FPS), "-i", path.join(frames, "%04d.png"),
        "-i", path.join(BUILD, `${tipo}.wav`),
        "-af", "loudnorm=I=-14:TP=-1.5:LRA=11",
        "-c:v", "libx264", "-preset", "slow", "-crf", "17", "-pix_fmt", "yuv420p", "-movflags", "+faststart",
        "-c:a", "aac", "-b:a", "192k", "-ar", "48000",
        "-shortest", out,
      ]);
      fs.rmSync(frames, { recursive: true, force: true });
      console.log("✓", path.relative(DIR, out));
    }
  }
  await browser.close();
}
main().catch(e => { console.error(e); process.exit(1); });
