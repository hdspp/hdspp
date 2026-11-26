# Videos — Historia de la Salvación

Videos de los temas hechos con [Remotion](https://www.remotion.dev/).

## Tema 1 · «En el principio»

Composición `Tema01` (1920×1080, 30 fps, ~4 min 45 s, con narración y música):

1. Portada
2. Lectura bíblica (Gn 1,1–2,4a) y los siete días con animaciones
3. Tradición judía
4. Padres de la Iglesia y Magisterio
5. Comentario e interpretación
6. Pregunta para la reflexión

Los textos en pantalla están en `src/tema01/content.ts` y el guion de la
narración en `src/tema01/narracion.json`.

## Audio

- **Narración**: voz neuronal [Piper](https://github.com/rhasspy/piper) `es_MX-claude-high`.
  Si cambias el guion, regenera los clips y `timing.json` (la duración de cada
  escena se ajusta sola a su narración):

  ```bash
  pip install piper-tts
  # modelo: https://github.com/k2-fsa/sherpa-onnx/releases/download/tts-models/vits-piper-es_MX-claude-high.tar.bz2
  python3 scripts/narracion.py ruta/a/es_MX-claude-high.onnx tema01
  ```

- **Música**: pieza ambiental original generada por código (`scripts/musica.py`),
  sin derechos de terceros. Baja de volumen automáticamente mientras habla el narrador.

  ```bash
  python3 scripts/musica.py 300 public/tema01/musica.mp3
  ```

Antes de renderizar, instala en el sistema las fuentes de `public/fonts`
(Cormorant Garamond e Inter; en Linux, conviértelas a TTF y cópialas a `~/.fonts`).

```bash
npm install
npm run studio   # vista previa
npm run render   # genera out/tema-01-en-el-principio.mp4
```

## I Domingo de Adviento (B) · «Velad» — vertical

Composición `AdvientoB01` (1080×1920, para celular, ~2 min 30 s), basada en el
«Comentario e interpretación» de la ficha. Guion en `src/advientoB01/narracion.json`.

```bash
python3 scripts/narracion.py ruta/a/es_MX-claude-high.onnx advientoB01
python3 scripts/musica.py 200 public/advientoB01/musica.mp3 adviento
npx remotion render src/index.ts AdvientoB01 out/adviento-b-01-velad-vertical.mp4
```
