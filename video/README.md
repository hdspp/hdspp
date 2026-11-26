# Apertura y cierre · «Temas católicos para pequeños»

Cortinillas de 6 segundos para poner al principio y al final de cada vídeo.

| Archivo | Uso |
|---|---|
| `salida/apertura_16x9.mp4` | Inicio de vídeos horizontales (YouTube) |
| `salida/cierre_16x9.mp4` | Final de vídeos horizontales |
| `salida/apertura_9x16.mp4` | Inicio de vídeos verticales (Shorts, Reels, TikTok) |
| `salida/cierre_9x16.mp4` | Final de vídeos verticales |

Las cuatro son 1080p a 30 fps, H.264 con audio AAC a −15 LUFS aprox., y terminan en negro.

## El jingle

El motivo en Re mayor es el mismo en la apertura y en el cierre. Eso es lo que lo hace reconocible.

- **Apertura:** Re · Fa# · La — Si · La — **Re agudo**. Sube y queda abierto, como «¡empezamos!».
- **Cierre:** Re · Fa# · La — Sol · Mi — **Re**. Baja y reposa con una cadencia Sol → Re, tipo «Amén».

Lo tocan campanitas de celesta y un arpa en arpegio, sobre un colchón suave con reverberación. Todo está sintetizado en `jingle.py`, así que no hay derechos de terceros.

## La animación

1. Nota 1: se abre el **libro**.
2. Nota 2: se levanta la **iglesia**.
3. Nota 3: aparece la **familia** desde el centro.
4. Nota 4: un destello en la **cruz**.
5. Acorde final: rayos de luz y el título letra a letra, y después «Historia de la Salvación para Pequeños».

En el cierre el logo ya está completo. Debajo del título sale «¡Hasta el próximo tema!» y la cruz brilla con el «Amén».

## Cómo montarlo en un vídeo

Con ffmpeg, siempre que el vídeo sea 1920×1080 a 30 fps:

```sh
ffmpeg -i salida/apertura_16x9.mp4 -i mi_video.mp4 -i salida/cierre_16x9.mp4 \
  -filter_complex "[0:v][0:a][1:v][1:a][2:v][2:a]concat=n=3:v=1:a=1[v][a]" \
  -map "[v]" -map "[a]" -c:v libx264 -crf 18 -c:a aac final.mp4
```

En CapCut, Premiere o cualquier otro editor basta con arrastrar los MP4 al principio y al final de la línea de tiempo.

## Volver a generarlos

Para cambiar textos, colores o tiempos:

```sh
python3 logo_capas.py   # separa assets/logo.png en capas (iglesia, familia, libro)
python3 jingle.py       # genera build/apertura.wav y build/cierre.wav
node render.js          # genera los 4 MP4 en salida/ (≈3 min)
node render.js --fotos 1,2.5,4   # sólo fotogramas sueltos en build/ para revisar
```

Hace falta Python 3 con numpy y Pillow, Node con Playwright (Chromium) y ffmpeg. Las fuentes Cormorant Garamond y EB Garamond (licencia OFL) están en `fonts/`.
