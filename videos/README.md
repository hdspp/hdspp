# Videos — Historia de la Salvación

Videos de los temas hechos con [Remotion](https://www.remotion.dev/).

## Tema 1 · «En el principio»

Composición `Tema01` (1920×1080, 30 fps, ~3 min 15 s):

1. Portada
2. Lectura bíblica (Gn 1,1–2,4a) y los siete días con animaciones
3. Tradición judía
4. Padres de la Iglesia y Magisterio
5. Comentario e interpretación
6. Pregunta para la reflexión

Los textos están en `src/tema01/content.ts`.

Antes de renderizar, instala en el sistema las fuentes de `public/fonts`
(Cormorant Garamond e Inter; en Linux, conviértelas a TTF y cópialas a `~/.fonts`).

```bash
npm install
npm run studio   # vista previa
npm run render   # genera out/tema-01-en-el-principio.mp4
```
