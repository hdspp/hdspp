import '@fontsource/cormorant-garamond/latin-400.css';
import '@fontsource/cormorant-garamond/latin-500.css';
import '@fontsource/cormorant-garamond/latin-400-italic.css';
import '@fontsource/inter/latin-400.css';
import '@fontsource/inter/latin-600.css';

export const serif = '"Cormorant Garamond", Georgia, serif';
export const sans = 'Inter, Helvetica, Arial, sans-serif';

export const colors = {
  night: '#070b1a',
  deep: '#121a3a',
  dawn: '#3b2a4f',
  gold: '#e8c77a',
  goldSoft: '#f4e3b5',
  ivory: '#f7f1e3',
  muted: 'rgba(247,241,227,0.62)',
};

// Esperar a que las fuentes estén cargadas antes de capturar cada fotograma.
import {continueRender, delayRender} from 'remotion';
const fontHandle = delayRender('Cargando fuentes');
Promise.all(
  ['400 40px "Cormorant Garamond"', '500 40px "Cormorant Garamond"', 'italic 400 40px "Cormorant Garamond"', '400 20px Inter', '600 20px Inter'].map(
    (f) => document.fonts.load(f, 'áéíóúñ«»'),
  ),
).then(() => continueRender(fontHandle));
