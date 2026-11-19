import React from 'react';
import {AbsoluteFill, Series, interpolate, useCurrentFrame} from 'remotion';
import {colors, sans, serif} from '../common/theme';
import {FadeUp, Footer, GoldRule, Kicker, Reveal, SceneFade, Sky, quoteStyle} from '../common/ui';
import {Firmament, Humans, Land, Light, Luminaries, Rest, SeaAndSky} from './DayVisuals';
import {commentary, days, fathers, jewish, question} from './content';

const T = {
  title: 210,
  reading: 330,
  day: 225,
  section: 105,
  card: 255,
  father: 225,
  comment: 195,
  question: 330,
  end: 180,
};

export const TEMA01_DURATION =
  T.title +
  T.reading +
  days.length * T.day +
  T.section * 3 +
  jewish.length * T.card +
  fathers.length * T.father +
  commentary.length * T.comment +
  T.question +
  T.end;

const Center: React.FC<{children: React.ReactNode; style?: React.CSSProperties}> = ({children, style}) => (
  <AbsoluteFill style={{alignItems: 'center', justifyContent: 'center', padding: '0 160px', ...style}}>
    {children}
  </AbsoluteFill>
);

const TitleScene: React.FC = () => {
  const f = useCurrentFrame();
  const scale = interpolate(f, [0, T.title], [1.04, 1]);
  return (
    <SceneFade fadeIn={25}>
      <Sky />
      <Center style={{transform: `scale(${scale})`}}>
        <Kicker>Historia de la Salvación · Tema 1</Kicker>
        <GoldRule delay={10} />
        <Reveal
          text="«En el principio»"
          delay={20}
          perWord={6}
          style={{fontFamily: serif, fontSize: 150, fontWeight: 500, color: colors.ivory, textAlign: 'center'}}
        />
        <FadeUp delay={60}>
          <div style={{fontFamily: serif, fontStyle: 'italic', fontSize: 44, color: colors.muted, marginTop: 20}}>
            Parte I. De Adán a José
          </div>
        </FadeUp>
      </Center>
    </SceneFade>
  );
};

const ReadingScene: React.FC = () => (
  <SceneFade>
    <Sky />
    <Center>
      <Kicker>1 · Lectura bíblica</Kicker>
      <FadeUp delay={10}>
        <div style={{fontFamily: serif, fontSize: 52, color: colors.gold, marginTop: 24}}>Génesis 1,1 – 2,4a</div>
      </FadeUp>
      <GoldRule delay={20} />
      <Reveal
        delay={40}
        perWord={3.2}
        style={{...quoteStyle, fontStyle: 'italic', fontSize: 58}}
        text="En el principio creó Dios los cielos y la tierra. La tierra era caos y confusión y oscuridad por encima del abismo, y un viento de Dios aleteaba por encima de las aguas."
      />
    </Center>
    <Footer />
  </SceneFade>
);

const visuals = [Light, Firmament, Land, Luminaries, SeaAndSky, Humans, Rest];

const DayScene: React.FC<{i: number}> = ({i}) => {
  const d = days[i];
  const Visual = visuals[i];
  // El cielo se va aclarando a medida que avanza la semana.
  const warmth = i / (days.length - 1);
  return (
    <SceneFade fadeIn={14} fadeOut={14}>
      <Sky warmth={warmth * 0.85} stars={i !== 2} />
      <AbsoluteFill style={{alignItems: 'center', paddingTop: 70}}>
        <Kicker>{d.n}</Kicker>
        <div style={{marginTop: 20}}>
          <Visual />
        </div>
        <Reveal
          delay={35}
          perWord={2.4}
          style={{...quoteStyle, fontSize: 54, maxWidth: 1450, marginTop: 30}}
          text={d.text}
        />
        <FadeUp delay={70}>
          <div style={{fontFamily: sans, fontSize: 24, color: colors.gold, letterSpacing: 3, marginTop: 22}}>{d.ref}</div>
        </FadeUp>
      </AbsoluteFill>
      <Footer />
    </SceneFade>
  );
};

const SectionScene: React.FC<{num: string; title: string}> = ({num, title}) => (
  <SceneFade fadeIn={15} fadeOut={15}>
    <Sky warmth={0.25} />
    <Center>
      <FadeUp>
        <div style={{fontFamily: serif, fontSize: 120, color: colors.gold, lineHeight: 1}}>{num}</div>
      </FadeUp>
      <GoldRule delay={10} />
      <Reveal text={title} delay={15} perWord={4} style={{fontFamily: serif, fontSize: 84, color: colors.ivory, textAlign: 'center'}} />
    </Center>
  </SceneFade>
);

const QuoteCard: React.FC<{text: string; src: string; label: string; warmth?: number}> = ({text, src, label, warmth = 0.3}) => (
  <SceneFade fadeIn={15} fadeOut={15}>
    <Sky warmth={warmth} />
    <Center>
      <Kicker>{label}</Kicker>
      <GoldRule delay={8} width={120} />
      <div style={{fontFamily: serif, fontSize: 160, color: colors.gold, lineHeight: 0.5, height: 60, opacity: 0.5}}>“</div>
      <Reveal delay={18} perWord={2.6} text={text} style={quoteStyle} />
      <FadeUp delay={60}>
        <div style={{fontFamily: sans, fontSize: 28, color: colors.gold, marginTop: 40, letterSpacing: 2}}>— {src}</div>
      </FadeUp>
    </Center>
    <Footer />
  </SceneFade>
);

const CommentScene: React.FC<{text: string; i: number}> = ({text, i}) => (
  <SceneFade fadeIn={15} fadeOut={15}>
    <Sky warmth={0.45 + i * 0.1} />
    <Center>
      <Kicker>4 · Comentario</Kicker>
      <GoldRule delay={8} width={120} />
      <Reveal delay={15} perWord={2.6} text={text} style={{...quoteStyle, fontSize: 68}} />
    </Center>
    <Footer />
  </SceneFade>
);

const QuestionScene: React.FC = () => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [0, T.question], [0.2, 0.75]);
  return (
    <SceneFade fadeIn={20} fadeOut={20}>
      <Sky warmth={0.85} stars={false} />
      <AbsoluteFill
        style={{background: `radial-gradient(circle at 50% 55%, rgba(232,199,122,${glow * 0.35}) 0%, transparent 55%)`}}
      />
      <Center>
        <Kicker>Para la reflexión</Kicker>
        <GoldRule delay={10} />
        <Reveal
          delay={25}
          perWord={5}
          text={question}
          style={{...quoteStyle, fontSize: 82, fontStyle: 'italic', maxWidth: 1400}}
        />
      </Center>
    </SceneFade>
  );
};

const EndScene: React.FC = () => (
  <SceneFade fadeIn={20} fadeOut={40}>
    <Sky />
    <Center>
      <FadeUp>
        <div style={{fontFamily: serif, fontSize: 64, color: colors.ivory}}>«Vio Dios cuanto había hecho,</div>
        <div style={{fontFamily: serif, fontSize: 64, color: colors.ivory, textAlign: 'center'}}>y todo estaba muy bien»</div>
      </FadeUp>
      <GoldRule delay={20} />
      <FadeUp delay={30}>
        <div style={{fontFamily: sans, fontSize: 26, letterSpacing: 6, color: colors.gold, textTransform: 'uppercase'}}>
          Historia de la Salvación · 130 temas
        </div>
      </FadeUp>
      <FadeUp delay={45}>
        <div style={{fontFamily: sans, fontSize: 22, letterSpacing: 4, color: colors.muted, marginTop: 18, textTransform: 'uppercase'}}>
          Próximo: Tema 2 · «No es bueno que el hombre esté solo»
        </div>
      </FadeUp>
    </Center>
  </SceneFade>
);

export const Tema01: React.FC = () => (
  <AbsoluteFill style={{background: colors.night}}>
    <Series>
      <Series.Sequence durationInFrames={T.title}>
        <TitleScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={T.reading}>
        <ReadingScene />
      </Series.Sequence>
      {days.map((_, i) => (
        <Series.Sequence key={`d${i}`} durationInFrames={T.day}>
          <DayScene i={i} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={T.section}>
        <SectionScene num="2" title="De la tradición judía" />
      </Series.Sequence>
      {jewish.map((q, i) => (
        <Series.Sequence key={`j${i}`} durationInFrames={T.card}>
          <QuoteCard text={q.text} src={q.src} label="Tradición judía" warmth={0.2} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={T.section}>
        <SectionScene num="3" title="Padres de la Iglesia y Magisterio" />
      </Series.Sequence>
      {fathers.map((q, i) => (
        <Series.Sequence key={`p${i}`} durationInFrames={T.father}>
          <QuoteCard text={q.text} src={q.src} label="Padres y Magisterio" warmth={0.35} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={T.section}>
        <SectionScene num="4" title="Comentario e interpretación" />
      </Series.Sequence>
      {commentary.map((c, i) => (
        <Series.Sequence key={`c${i}`} durationInFrames={T.comment}>
          <CommentScene text={c} i={i} />
        </Series.Sequence>
      ))}
      <Series.Sequence durationInFrames={T.question}>
        <QuestionScene />
      </Series.Sequence>
      <Series.Sequence durationInFrames={T.end}>
        <EndScene />
      </Series.Sequence>
    </Series>
  </AbsoluteFill>
);
