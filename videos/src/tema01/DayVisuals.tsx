import React from 'react';
import {interpolate, random, spring, useCurrentFrame, useVideoConfig, Easing} from 'remotion';
import {colors} from '../common/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
const W = 900;
const H = 420;

const Frame: React.FC<{children: React.ReactNode}> = ({children}) => (
  <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} style={{overflow: 'visible'}}>
    {children}
  </svg>
);

/** Día 1: la luz irrumpe en la oscuridad. */
export const Light: React.FC = () => {
  const f = useCurrentFrame();
  const r = interpolate(f, [10, 90], [0, 260], {...clamp, easing: Easing.out(Easing.cubic)});
  const core = interpolate(f, [10, 40], [0, 1], clamp);
  return (
    <Frame>
      <defs>
        <radialGradient id="lg">
          <stop offset="0%" stopColor="#fff8e1" stopOpacity={1} />
          <stop offset="35%" stopColor={colors.gold} stopOpacity={0.7} />
          <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={W / 2} cy={H / 2} r={r} fill="url(#lg)" />
      {new Array(16).fill(0).map((_, i) => {
        const a = (i / 16) * Math.PI * 2 + f / 200;
        const len = r * 0.9;
        return (
          <line
            key={i}
            x1={W / 2 + Math.cos(a) * 40}
            y1={H / 2 + Math.sin(a) * 40}
            x2={W / 2 + Math.cos(a) * len}
            y2={H / 2 + Math.sin(a) * len}
            stroke={colors.goldSoft}
            strokeWidth={2}
            opacity={0.35 * core}
          />
        );
      })}
      <circle cx={W / 2} cy={H / 2} r={30 * core} fill="#fffaf0" />
    </Frame>
  );
};

const wave = (y: number, amp: number, phase: number, w = W) => {
  let d = `M 0 ${y}`;
  for (let x = 0; x <= w; x += 20) d += ` L ${x} ${y + Math.sin(x / 60 + phase) * amp}`;
  return d;
};

/** Día 2: el firmamento separa las aguas de arriba y las de abajo. */
export const Firmament: React.FC = () => {
  const f = useCurrentFrame();
  const sep = interpolate(f, [15, 80], [0, 110], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const lineW = interpolate(f, [30, 90], [0, W], clamp);
  return (
    <Frame>
      {[0, 1, 2].map((k) => (
        <path key={`u${k}`} d={wave(H / 2 - sep - k * 22, 8, f / 12 + k, W)} stroke="#7fb2e5" strokeWidth={3} fill="none" opacity={0.75 - k * 0.2} />
      ))}
      {[0, 1, 2].map((k) => (
        <path key={`d${k}`} d={wave(H / 2 + sep + k * 22, 8, -f / 12 + k, W)} stroke="#4e86c4" strokeWidth={3} fill="none" opacity={0.75 - k * 0.2} />
      ))}
      <line x1={(W - lineW) / 2} x2={(W + lineW) / 2} y1={H / 2} y2={H / 2} stroke={colors.gold} strokeWidth={2} />
    </Frame>
  );
};

/** Día 3: aparece lo seco y brota la vegetación. */
export const Land: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const rise = spring({frame: f - 10, fps, config: {damping: 200}, durationInFrames: 60});
  const hillY = H - 40 - rise * 150;
  return (
    <Frame>
      <path d={wave(H - 30, 6, f / 14)} stroke="#4e86c4" strokeWidth={3} fill="none" opacity={0.8} />
      <path d={`M 80 ${H - 30} Q ${W / 2} ${hillY - 60} ${W - 80} ${H - 30} Z`} fill="#3e5b37" opacity={0.95} />
      {new Array(14).fill(0).map((_, i) => {
        const x = 170 + i * 42;
        const t = (x - W / 2) / (W / 2 - 80);
        const baseY = H - 30 - (1 - t * t) * (H - 30 - (hillY - 60)) * 0.5;
        const g = interpolate(f, [55 + i * 4, 95 + i * 4], [0, 1], {...clamp, easing: Easing.out(Easing.back(1.4))});
        const h = (40 + random(`h${i}`) * 50) * g;
        const tree = i % 3 === 1;
        return (
          <g key={i}>
            <line x1={x} y1={baseY} x2={x} y2={baseY - h} stroke="#9bc27a" strokeWidth={tree ? 5 : 3} />
            {tree ? (
              <circle cx={x} cy={baseY - h} r={18 * g} fill="#79a85c" />
            ) : (
              <>
                <ellipse cx={x - 8} cy={baseY - h * 0.6} rx={9 * g} ry={4 * g} fill="#9bc27a" />
                <ellipse cx={x + 8} cy={baseY - h * 0.8} rx={9 * g} ry={4 * g} fill="#9bc27a" />
              </>
            )}
            {tree && g > 0.9 && <circle cx={x + 6} cy={baseY - h + 4} r={4} fill={colors.gold} />}
          </g>
        );
      })}
    </Frame>
  );
};

/** Día 4: el sol, la luna y las estrellas: criaturas, no dioses. */
export const Luminaries: React.FC = () => {
  const f = useCurrentFrame();
  const sun = interpolate(f, [10, 70], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const moon = interpolate(f, [40, 100], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  return (
    <Frame>
      <circle cx={260} cy={H / 2 + (1 - sun) * 120} r={80} fill="#f6c453" opacity={sun} />
      <circle cx={260} cy={H / 2 + (1 - sun) * 120} r={120} fill="#f6c453" opacity={sun * 0.18} />
      <g opacity={moon} transform={`translate(${640} ${H / 2 + (1 - moon) * 120})`}>
        <circle r={60} fill="#e9e6da" />
        <circle r={58} cx={24} cy={-10} fill={colors.deep} />
      </g>
      {new Array(26).fill(0).map((_, i) => {
        const s = interpolate(f, [70 + i * 2, 90 + i * 2], [0, 1], clamp);
        const tw = 0.5 + 0.5 * Math.sin(f / 8 + i);
        return (
          <circle key={i} cx={random(`sx${i}`) * W} cy={random(`sy${i}`) * H} r={2 + random(`sr${i}`) * 2.5} fill={colors.ivory} opacity={s * tw} />
        );
      })}
    </Frame>
  );
};

/** Día 5: bullen las aguas de vida y vuelan las aves. */
export const SeaAndSky: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      <path d={wave(H / 2 + 30, 8, f / 12)} stroke="#7fb2e5" strokeWidth={3} fill="none" />
      <path d={`${wave(H / 2 + 30, 8, f / 12)} L ${W} ${H} L 0 ${H} Z`} fill="#1f4a7a" opacity={0.55} />
      {new Array(7).fill(0).map((_, i) => {
        const appear = interpolate(f, [20 + i * 8, 40 + i * 8], [0, 1], clamp);
        const x = ((random(`fx${i}`) * W + f * (1.5 + random(`fv${i}`) * 2)) % (W + 80)) - 40;
        const y = H / 2 + 90 + random(`fy${i}`) * 140;
        return (
          <g key={`f${i}`} transform={`translate(${x} ${y})`} opacity={appear * 0.9}>
            <ellipse rx={26} ry={10} fill="#e8c77a" />
            <path d="M -24 0 L -42 -12 L -42 12 Z" fill="#e8c77a" />
          </g>
        );
      })}
      {new Array(6).fill(0).map((_, i) => {
        const appear = interpolate(f, [50 + i * 7, 70 + i * 7], [0, 1], clamp);
        const x = 120 + i * 120 + f * 1.2;
        const y = 70 + random(`by${i}`) * 90 + Math.sin(f / 10 + i) * 8;
        const flap = Math.sin(f / 4 + i) * 10;
        return (
          <path
            key={`b${i}`}
            d={`M ${x - 22} ${y - flap} Q ${x - 10} ${y - 6} ${x} ${y} Q ${x + 10} ${y - 6} ${x + 22} ${y - flap}`}
            stroke={colors.ivory}
            strokeWidth={3}
            fill="none"
            opacity={appear}
          />
        );
      })}
    </Frame>
  );
};

/** Día 6: el ser humano, varón y mujer, a imagen de Dios. */
export const Humans: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const a = spring({frame: f - 15, fps, config: {damping: 200}});
  const b = spring({frame: f - 30, fps, config: {damping: 200}});
  const halo = interpolate(f, [60, 120], [0, 1], clamp);
  const figure = (x: number, p: number, key: string) => (
    <g key={key} opacity={p} transform={`translate(${x} ${H / 2 + 40 + (1 - p) * 30})`}>
      <circle cy={-120} r={34} fill={colors.ivory} />
      <path d="M -50 80 Q -48 -60 0 -70 Q 48 -60 50 80 Z" fill={colors.ivory} />
    </g>
  );
  return (
    <Frame>
      <defs>
        <radialGradient id="halo">
          <stop offset="0%" stopColor={colors.gold} stopOpacity={0.55} />
          <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
        </radialGradient>
      </defs>
      <ellipse cx={W / 2} cy={H / 2 - 20} rx={340 * halo} ry={230 * halo} fill="url(#halo)" />
      {figure(W / 2 - 80, a, 'm')}
      {figure(W / 2 + 80, b, 'w')}
    </Frame>
  );
};

/** Día 7: Dios descansa y bendice el día. Siete luces que se completan. */
export const Rest: React.FC = () => {
  const f = useCurrentFrame();
  return (
    <Frame>
      {new Array(7).fill(0).map((_, i) => {
        const on = interpolate(f, [10 + i * 10, 25 + i * 10], [0, 1], clamp);
        const last = i === 6;
        const x = W / 2 + (i - 3) * 110;
        const pulse = last ? 1 + 0.12 * Math.sin(f / 10) : 1;
        return (
          <g key={i} opacity={on}>
            <circle cx={x} cy={H / 2} r={(last ? 46 : 26) * pulse} fill={last ? colors.gold : colors.goldSoft} opacity={last ? 1 : 0.55} />
            {last && <circle cx={x} cy={H / 2} r={90 * pulse} fill={colors.gold} opacity={0.15} />}
          </g>
        );
      })}
    </Frame>
  );
};
