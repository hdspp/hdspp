import React from 'react';
import {AbsoluteFill, interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {colors, sans, serif} from './theme';

/** Fade the whole scene in and out at its edges. */
export const SceneFade: React.FC<{children: React.ReactNode; fadeIn?: number; fadeOut?: number}> = ({
  children,
  fadeIn = 18,
  fadeOut = 18,
}) => {
  const frame = useCurrentFrame();
  const {durationInFrames} = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, fadeIn, durationInFrames - fadeOut, durationInFrames],
    [0, 1, 1, 0],
    {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'},
  );
  return <AbsoluteFill style={{opacity}}>{children}</AbsoluteFill>;
};

/** Night sky gradient, with optional warmth (0 = night, 1 = dawn). */
export const Sky: React.FC<{warmth?: number; stars?: boolean}> = ({warmth = 0, stars = true}) => {
  const frame = useCurrentFrame();
  const {width, height} = useVideoConfig();
  const top = mix(colors.night, '#1b1530', warmth);
  const mid = mix(colors.deep, '#5a3a55', warmth);
  const bottom = mix('#1a2147', '#c98a5a', warmth);
  return (
    <AbsoluteFill style={{background: `linear-gradient(180deg, ${top} 0%, ${mid} 60%, ${bottom} 130%)`}}>
      {stars &&
        new Array(90).fill(0).map((_, i) => {
          const x = random(`x${i}`) * width;
          const y = random(`y${i}`) * height;
          const s = 1 + random(`s${i}`) * 2.2;
          const tw = 0.35 + 0.65 * Math.abs(Math.sin(frame / (25 + random(`t${i}`) * 40) + i));
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: x,
                top: y,
                width: s,
                height: s,
                borderRadius: s,
                background: colors.ivory,
                opacity: tw * (0.25 + random(`o${i}`) * 0.5) * (1 - warmth * 0.7),
              }}
            />
          );
        })}
      <AbsoluteFill
        style={{background: 'radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)'}}
      />
    </AbsoluteFill>
  );
};

/** Text that reveals word by word. */
export const Reveal: React.FC<{
  text: string;
  delay?: number;
  perWord?: number;
  style?: React.CSSProperties;
}> = ({text, delay = 0, perWord = 2.2, style}) => {
  const frame = useCurrentFrame();
  const words = text.split(' ');
  return (
    <div style={style}>
      {words.map((w, i) => {
        const start = delay + i * perWord;
        const o = interpolate(frame, [start, start + 14], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = interpolate(frame, [start, start + 18], [14, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
          easing: Easing.out(Easing.cubic),
        });
        return (
          <span key={i} style={{display: 'inline-block', opacity: o, transform: `translateY(${y}px)`, whiteSpace: 'pre'}}>
            {w}
            {i < words.length - 1 ? ' ' : ''}
          </span>
        );
      })}
    </div>
  );
};

export const FadeUp: React.FC<{delay?: number; children: React.ReactNode; style?: React.CSSProperties}> = ({
  delay = 0,
  children,
  style,
}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const p = spring({frame: frame - delay, fps, config: {damping: 200}});
  return <div style={{opacity: p, transform: `translateY(${(1 - p) * 24}px)`, ...style}}>{children}</div>;
};

export const Kicker: React.FC<{children: React.ReactNode; delay?: number}> = ({children, delay = 0}) => (
  <FadeUp delay={delay}>
    <div
      style={{
        fontFamily: sans,
        fontSize: 26,
        letterSpacing: 8,
        textTransform: 'uppercase',
        color: colors.gold,
        fontWeight: 600,
      }}
    >
      {children}
    </div>
  </FadeUp>
);

export const GoldRule: React.FC<{delay?: number; width?: number}> = ({delay = 0, width = 220}) => {
  const frame = useCurrentFrame();
  const w = interpolate(frame, [delay, delay + 30], [0, width], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });
  return <div style={{height: 2, width: w, background: colors.gold, margin: '28px auto', opacity: 0.8}} />;
};

/** Small persistent footer with the topic label. */
export const Footer: React.FC<{text?: string; bottom?: number}> = ({
  text = 'Historia de la Salvación · Tema 1 · «En el principio»',
  bottom = 44,
}) => (
  <div
    style={{
      position: 'absolute',
      bottom,
      left: 0,
      right: 0,
      textAlign: 'center',
      fontFamily: sans,
      fontSize: 20,
      letterSpacing: 4,
      color: colors.muted,
      textTransform: 'uppercase',
    }}
  >
    {text}
  </div>
);

export const quoteStyle: React.CSSProperties = {
  fontFamily: serif,
  fontSize: 60,
  lineHeight: 1.3,
  color: colors.ivory,
  textAlign: 'center',
  maxWidth: 1500,
};

function mix(a: string, b: string, t: number) {
  const pa = hex(a);
  const pb = hex(b);
  const c = pa.map((v, i) => Math.round(v + (pb[i] - v) * t));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}
function hex(h: string) {
  const n = parseInt(h.slice(1), 16);
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
}
