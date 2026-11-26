import React from 'react';
import {AbsoluteFill, Audio, Sequence, Series, interpolate, staticFile, useCurrentFrame} from 'remotion';
import {colors, sans, serif} from '../common/theme';
import {FadeUp, Footer, GoldRule, Kicker, Reveal, SceneFade, Sky} from '../common/ui';
import {Dawn, Gift, Journey, Lamp, OpenDoor, Potter, TornSky, Watches, Wreath} from './Visuals';
import timing from './timing.json';

// Video vertical (1080×1920) sobre el comentario del I Domingo de Adviento (B).

const FOOTER = 'I Domingo de Adviento · Ciclo B';

/** Fondo nocturno con tinte morado de Adviento. */
const AdventSky: React.FC<{warmth?: number; stars?: boolean}> = ({warmth = 0.15, stars = true}) => (
  <>
    <Sky warmth={warmth} stars={stars} />
    <AbsoluteFill
      style={{background: 'linear-gradient(180deg, rgba(76,40,120,0.35) 0%, rgba(40,20,70,0.1) 55%, rgba(90,50,140,0.35) 100%)'}}
    />
  </>
);

const textStyle: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 70,
  lineHeight: 1.25,
  color: colors.ivory,
  textAlign: 'center',
  maxWidth: 940,
};

type Beat = {
  id: string;
  kicker: string;
  text: string;
  ref?: string;
  Visual: React.FC;
  warmth?: number;
};

const beats: Beat[] = [
  {id: 'casa', kicker: 'La casa', text: 'El Señor se fue, pero la casa sigue siendo suya.', ref: 'Mc 13,34', Visual: Journey},
  {id: 'velar', kicker: 'Velar', text: 'Velar no es asustarse. Es tener la mirada en otra parte.', ref: '«¡Ven, Señor Jesús!» · Ap 22,20', Visual: Lamp},
  {id: 'cielo', kicker: 'La súplica', text: '«¡Ojalá rasgases el cielo y bajases!»', ref: 'Is 63,19', Visual: TornSky},
  {id: 'arcilla', kicker: 'Sin méritos', text: 'El que espera al Señor se presenta como arcilla en manos del alfarero.', ref: 'cf. Is 64,5', Visual: Potter},
  {id: 'fiel', kicker: 'Lo radical', text: 'No velamos para ganarnos su venida. Él viene porque es fiel.', ref: '1 Co 1,9', Visual: Dawn, warmth: 0.4},
  {id: 'don', kicker: 'El don', text: 'La salvación es un regalo, no un premio al esfuerzo.', ref: 'Ef 2,8-9', Visual: Gift, warmth: 0.45},
  {id: 'puerta', kicker: 'La puerta abierta', text: 'Las buenas obras no compran su venida: son la casa en orden de quien sabe que el dueño llega.', Visual: OpenDoor, warmth: 0.35},
  {id: 'sueno', kicker: 'El sueño', text: 'El sueño del que habla Jesús es el de quien se acostumbra.', ref: 'Mc 13,35', Visual: Watches, warmth: 0.1},
];

const BeatScene: React.FC<{b: Beat}> = ({b}) => {
  const {Visual} = b;
  return (
    <SceneFade fadeIn={14} fadeOut={14}>
      <AdventSky warmth={b.warmth} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 200}}>
        <Kicker>{b.kicker}</Kicker>
        <div style={{marginTop: 40}}>
          <Visual />
        </div>
        <Reveal delay={30} perWord={3} text={b.text} style={{...textStyle, marginTop: 50}} />
        {b.ref && (
          <FadeUp delay={70}>
            <div style={{fontFamily: sans, fontSize: 32, color: colors.gold, letterSpacing: 2, marginTop: 30}}>{b.ref}</div>
          </FadeUp>
        )}
      </AbsoluteFill>
      <Footer text={FOOTER} bottom={150} />
    </SceneFade>
  );
};

const TitleScene: React.FC = () => (
  <SceneFade fadeIn={20}>
    <AdventSky warmth={0.05} />
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 260}}>
      <Kicker>I Domingo de Adviento · B</Kicker>
      <GoldRule delay={8} />
      <Reveal text="«Velad»" delay={15} perWord={1} style={{fontFamily: serif, fontSize: 190, color: colors.ivory, fontWeight: 500}} />
      <FadeUp delay={40}>
        <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 50, color: colors.muted, marginTop: 10}}>Mc 13,33-37</div>
      </FadeUp>
      <div style={{marginTop: 60}}>
        <Wreath />
      </div>
    </AbsoluteFill>
  </SceneFade>
);

const QuestionScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, 200], [0.2, 0.7], {extrapolateRight: 'clamp'});
  return (
    <SceneFade fadeIn={20} fadeOut={20}>
      <AdventSky warmth={0.3} stars={false} />
      <AbsoluteFill style={{background: `radial-gradient(circle at 50% 50%, rgba(232,199,122,${glow * 0.3}) 0%, transparent 60%)`}} />
      <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 70px'}}>
        <Kicker>Para la reflexión</Kicker>
        <GoldRule delay={10} />
        <Reveal
          delay={25}
          perWord={4}
          text="¿Dices «¡Ven, Señor Jesús!», pero vives como si no fuera a volver nunca?"
          style={{...textStyle, fontSize: 84, fontStyle: 'italic'}}
        />
      </AbsoluteFill>
      <Footer text={FOOTER} bottom={150} />
    </SceneFade>
  );
};

const EndScene: React.FC = () => (
  <SceneFade fadeIn={20} fadeOut={40}>
    <AdventSky warmth={0.05} />
    <AbsoluteFill style={{alignItems: 'center', paddingTop: 300}}>
      <FadeUp>
        <div style={{fontFamily: serif, fontSize: 150, color: colors.ivory, fontStyle: 'italic'}}>Maran atha</div>
      </FadeUp>
      <FadeUp delay={15}>
        <div style={{fontFamily: sans, fontSize: 34, letterSpacing: 8, color: colors.gold, textTransform: 'uppercase', marginTop: 10}}>
          Ven, Señor
        </div>
      </FadeUp>
      <div style={{marginTop: 80}}>
        <Wreath />
      </div>
    </AbsoluteFill>
    <Footer text={FOOTER} bottom={150} />
  </SceneFade>
);

type Scene = {id: string; base: number; delay?: number; tail?: number; el: React.ReactNode};

const scenes: Scene[] = [
  {id: 'title', base: 150, delay: 30, tail: 45, el: <TitleScene />},
  ...beats.map((b) => ({id: b.id, base: 210, el: <BeatScene b={b} />})),
  {id: 'question', base: 240, delay: 30, tail: 150, el: <QuestionScene />},
  {id: 'end', base: 180, delay: 25, tail: 100, el: <EndScene />},
];

const FPS = 30;
const timeline = (() => {
  let from = 0;
  return scenes.map((sc) => {
    const delay = sc.delay ?? 25;
    const voice = Math.ceil(((timing as Record<string, number>)[sc.id] ?? 0) * FPS);
    const duration = Math.max(sc.base, delay + voice + (sc.tail ?? 40));
    const item = {...sc, delay, voice, duration, from};
    from += duration;
    return item;
  });
})();

export const ADVIENTO_B01_DURATION = timeline.reduce((a, s) => a + s.duration, 0);

const musicVolume = (f: number) => {
  let duck = 0;
  for (const s of timeline) {
    const a = s.from + s.delay;
    const b = a + s.voice;
    duck = Math.max(duck, interpolate(f, [a - 12, a, b, b + 20], [0, 1, 1, 0], {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'}));
  }
  const fade = interpolate(f, [0, 45, ADVIENTO_B01_DURATION - 120, ADVIENTO_B01_DURATION], [0, 1, 1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (0.55 - 0.33 * duck) * fade;
};

export const AdvientoB01: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Audio src={staticFile('advientoB01/musica.mp3')} volume={musicVolume} />
    <Series>
      {timeline.map((s) => (
        <Series.Sequence key={s.id} durationInFrames={s.duration}>
          {s.el}
          {s.voice > 0 && (
            <Sequence from={s.delay} layout="none">
              <Audio src={staticFile(`advientoB01/narracion/${s.id}.mp3`)} />
            </Sequence>
          )}
        </Series.Sequence>
      ))}
    </Series>
  </AbsoluteFill>
);
