import {continueRender, delayRender, staticFile} from 'remotion';

export const serif = '"Cormorant Garamond", Georgia, serif';
export const sans = 'Inter, Helvetica, Arial, sans-serif';

// Fuentes locales (public/fonts), cargadas antes de capturar fotogramas.
const fonts: [string, string, string, string][] = [
  ['Cormorant Garamond', 'cormorant-garamond-latin-400-normal.woff2', '400', 'normal'],
  ['Cormorant Garamond', 'cormorant-garamond-latin-500-normal.woff2', '500', 'normal'],
  ['Cormorant Garamond', 'cormorant-garamond-latin-400-italic.woff2', '400', 'italic'],
  ['Inter', 'inter-latin-400-normal.woff2', '400', 'normal'],
  ['Inter', 'inter-latin-600-normal.woff2', '600', 'normal'],
];
const handle = delayRender('Cargando fuentes');
Promise.all(
  fonts.map(async ([family, file, weight, style]) => {
    const face = new FontFace(family, `url(${staticFile(`fonts/${file}`)}) format('woff2')`, {weight, style});
    await face.load();
    document.fonts.add(face);
  }),
)
  .catch((e) => console.error('No se pudieron cargar las fuentes', e))
  .finally(() => continueRender(handle));

export const colors = {
  night: '#070b1a',
  deep: '#121a3a',
  dawn: '#3b2a4f',
  gold: '#e8c77a',
  goldSoft: '#f4e3b5',
  ivory: '#f7f1e3',
  muted: 'rgba(247,241,227,0.62)',
};
