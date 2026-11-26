# Tema 1 · Primer domingo de Adviento (ciclo B)

Vídeo vertical de 1080×1920, de unos 2 min 34 s, hecho con [HyperFrames](https://hyperframes.heygen.com). Lleva voz y el texto en pantalla, y empieza y termina con la apertura y el cierre de `../salida/`.

| Tramo | Contenido |
|---|---|
| Apertura | `assets/apertura_9x16.mp4` (6 s, jingle) |
| Portada | Corona de Adviento: se enciende la primera vela. «¡Velad!» |
| I. Lectura bíblica | **Marcos 13,33-37**, *Velad, pues no sabéis cuándo vendrá el dueño de la casa*. El cielo cambia con cada vigilia: atardecer, medianoche, canto del gallo, amanecer |
| II. De la tradición judía | Las guardias de la noche (Mishná, Berajot 1,1; Talmud, Berajot 3a), las cuatro vigilias de Jesús y Maimónides (esperar al Mesías cada día) |
| III. Padres de la Iglesia y Magisterio | San Cirilo de Jerusalén (las dos venidas, *Catequesis* 15,1) y san Bernardo (la venida intermedia, *Sermón 5 sobre el Adviento*) |
| IV. Comentario e interpretación | Eje de radicalidad **17 · Vigilancia y esperanza del Reino** |
| Pregunta final | «¿A Jesús le dices «te espero», pero cuando tu hermano te necesita, te haces el dormido?» |
| Cierre | `assets/cierre_9x16.mp4` |

## Pendiente de verificar

- **El texto del evangelio** de `guion.json` no se copió del Leccionario del proyecto, porque desde la sesión en la nube no hay acceso a él. Hay que cotejarlo y, si cambia algo, corregirlo en `guion.json` y volver a generar.
- **Magisterio:** falta un texto pontificio verificable. Se puede añadir una frase a la escena `padres`.

## Cómo cambiarlo y volver a renderizar

1. Edita `guion.json`: los textos de voz y pantalla, las fuentes, la voz y la velocidad.
2. Ejecuta:

   ```sh
   python3 gen_voz.py      # voz con Kokoro (npx hyperframes tts); solo rehace las frases que cambian
   python3 construir.py    # genera index.html desde plantilla.html.tpl y la línea de tiempo
   npx hyperframes check   # validación (zonas seguras, contraste, solapes…)
   npx hyperframes render -q delivery -o salida/tema01_adviento1_9x16.mp4
   ```

- El diseño y las animaciones están en `plantilla.html.tpl`, con CSS y GSAP. Las animaciones se sincronizan con la voz a partir de las duraciones reales de cada frase.
- Todo el texto queda dentro de la zona segura común a YouTube Shorts e Instagram Reels (x 120–888, y 288–1248), para que no lo tapen los botones de la app. En TikTok, el borde derecho de los subtítulos puede quedar un poco por debajo de los iconos.
- La música de fondo (`musica/fondo.wav`) reutiliza el motivo del jingle (`../jingle.py`). Para regenerarla: `python3 construir.py --musica`.
