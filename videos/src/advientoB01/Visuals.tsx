import React from 'react';
import {Easing, interpolate, random, spring, useCurrentFrame, useVideoConfig} from 'remotion';
import {colors} from '../common/theme';

const clamp = {extrapolateLeft: 'clamp', extrapolateRight: 'clamp'} as const;
export const VW = 900;
export const VH = 760;
const cx = VW / 2;

const Frame: React.FC<{children: React.ReactNode; soft?: boolean}> = ({children, soft}) => (
  <svg width={VW} height={VH} viewBox={`0 0 ${VW} ${VH}`} style={{overflow: 'visible'}}>
    <defs>
      <radialGradient id="softGlow">
        <stop offset="0%" stopColor={colors.gold} stopOpacity={1} />
        <stop offset="45%" stopColor={colors.gold} stopOpacity={0.45} />
        <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
      </radialGradient>
      <linearGradient id="fadeX" x1="0" y1="0" x2="1" y2="0">
        <stop offset="0%" stopColor="#fff" stopOpacity={0} />
        <stop offset="18%" stopColor="#fff" stopOpacity={1} />
        <stop offset="82%" stopColor="#fff" stopOpacity={1} />
        <stop offset="100%" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <linearGradient id="fadeY" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#fff" stopOpacity={0} />
        <stop offset="22%" stopColor="#fff" stopOpacity={1} />
        <stop offset="80%" stopColor="#fff" stopOpacity={1} />
        <stop offset="100%" stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <mask id="softX" maskUnits="userSpaceOnUse" x={0} y={-100} width={VW} height={VH + 200}>
        <rect x={0} y={-100} width={VW} height={VH + 200} fill="url(#fadeX)" />
      </mask>
      <mask id="softXY" maskUnits="userSpaceOnUse" x={0} y={0} width={VW} height={VH}>
        <rect x={0} y={0} width={VW} height={VH} fill="url(#fadeY)" />
      </mask>
    </defs>
    {soft ? (
      <g mask="url(#softXY)">
        <g mask="url(#softX)">{children}</g>
      </g>
    ) : (
      children
    )}
  </svg>
);

const Glow: React.FC<{x: number; y: number; r: number; o?: number}> = ({x, y, r, o = 1}) => (
  <circle cx={x} cy={y} r={r} fill="url(#softGlow)" opacity={o} />
);

const Flame: React.FC<{x: number; y: number; s?: number; on?: number}> = ({x, y, s = 1, on = 1}) => {
  const f = useCurrentFrame();
  const flick = 1 + 0.08 * Math.sin(f / 3) + 0.05 * Math.sin(f / 1.7);
  const sway = Math.sin(f / 9) * 2;
  return (
    <g transform={`translate(${x} ${y}) scale(${s * on})`} opacity={on}>
      <Glow x={0} y={-18} r={80} o={0.45} />
      <path
        d={`M 0 0 C -14 -12 -10 -30 ${sway} ${-46 * flick} C 10 -30 14 -12 0 0 Z`}
        fill="#ffd37a"
      />
      <path d={`M 0 -2 C -6 -8 -4 -18 ${sway * 0.5} ${-26 * flick} C 4 -18 6 -8 0 -2 Z`} fill="#fff6dc" />
    </g>
  );
};

/** Corona de Adviento: primera vela encendida. */
export const Wreath: React.FC = () => {
  const f = useCurrentFrame();
  const light = interpolate(f, [25, 45], [0, 1], clamp);
  const cols = ['#6b3fa0', '#6b3fa0', '#d58fb4', '#6b3fa0'];
  const pos = [
    [cx - 230, 470],
    [cx - 80, 520],
    [cx + 80, 520],
    [cx + 230, 470],
  ];
  return (
    <Frame>
      <ellipse cx={cx} cy={520} rx={330} ry={110} fill="none" stroke="#2f5a3a" strokeWidth={56} />
      {new Array(40).fill(0).map((_, i) => {
        const a = (i / 40) * Math.PI * 2;
        return (
          <ellipse
            key={i}
            cx={cx + Math.cos(a) * 330}
            cy={520 + Math.sin(a) * 110}
            rx={30}
            ry={12}
            fill={i % 2 ? '#3f7a4d' : '#2c6340'}
            transform={`rotate(${(a * 180) / Math.PI + 60} ${cx + Math.cos(a) * 330} ${520 + Math.sin(a) * 110})`}
          />
        );
      })}
      {pos.map(([x, y], i) => (
        <g key={i}>
          <rect x={x - 26} y={y - 230} width={52} height={230} rx={6} fill={cols[i]} />
          <rect x={x - 26} y={y - 230} width={14} height={230} rx={6} fill="#fff" opacity={0.12} />
          <line x1={x} y1={y - 230} x2={x} y2={y - 244} stroke="#222" strokeWidth={3} />
          {i === 0 && <Flame x={x} y={y - 242} s={1.2} on={light} />}
        </g>
      ))}
    </Frame>
  );
};

/** Un hombre se va de viaje; en la puerta queda el portero con su lámpara. */
export const Journey: React.FC = () => {
  const f = useCurrentFrame();
  const walk = interpolate(f, [20, 220], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  // camino en perspectiva hacia el horizonte
  const px = interpolate(walk, [0, 1], [cx + 40, cx + 250]);
  const py = interpolate(walk, [0, 1], [640, 330]);
  const ps = interpolate(walk, [0, 1], [1, 0.25]);
  const bob = Math.sin(f / 5) * 3 * ps;
  return (
    <Frame>
      <path d={`M ${cx - 60} 760 Q ${cx + 120} 520 ${cx + 260} 320 L ${cx + 275} 320 Q ${cx + 170} 520 ${cx + 120} 760 Z`} fill="#2a2440" />
      <line x1={0} x2={VW} y1={320} y2={320} stroke={colors.gold} strokeOpacity={0.25} />
      {/* casa */}
      <g transform="translate(60 330)">
        <path d="M 0 140 L 150 20 L 300 140 Z" fill="#3a2f55" />
        <rect x={25} y={140} width={250} height={260} fill="#2d2547" />
        <rect x={120} y={260} width={70} height={140} fill="#f2c46d" opacity={0.85} />
        <rect x={60} y={190} width={45} height={45} fill="#f2c46d" opacity={0.35} />
      </g>
      {/* portero junto a la puerta */}
      <g transform="translate(250 690)">
        <circle cy={-118} r={18} fill={colors.ivory} />
        <path d="M -28 0 Q -26 -90 0 -96 Q 26 -90 28 0 Z" fill={colors.ivory} />
        <Flame x={44} y={-60} s={0.45} />
      </g>
      {/* el señor que se va */}
      <g transform={`translate(${px} ${py + bob}) scale(${ps})`} opacity={1 - walk * 0.5}>
        <circle cy={-130} r={20} fill={colors.goldSoft} />
        <path d="M -30 0 Q -28 -100 0 -108 Q 28 -100 30 0 Z" fill={colors.goldSoft} />
        <line x1={34} y1={-90} x2={44} y2={6} stroke={colors.goldSoft} strokeWidth={5} />
      </g>
    </Frame>
  );
};

/** Una lámpara encendida en la noche: el que vela. */
export const Lamp: React.FC = () => {
  const f = useCurrentFrame();
  const on = interpolate(f, [10, 40], [0, 1], clamp);
  const look = interpolate(f, [60, 200], [0, 1], clamp);
  return (
    <Frame>
      <Glow x={cx + 198} y={380} r={380} o={0.35 * on} />
      {/* estrella lejana hacia la que se mira */}
      <g opacity={look}>
        <circle cx={cx + 260} cy={80} r={8} fill={colors.ivory} />
        <Glow x={cx + 260} y={80} r={40 + 6 * Math.sin(f / 12)} o={0.5} />
      </g>
      <g transform={`translate(${cx} 470)`}>
        <path d="M -150 30 Q -160 -40 -40 -40 L 120 -40 Q 190 -40 210 -80 Q 200 -10 150 20 Q 60 70 -60 70 Q -140 70 -150 30 Z" fill="#b07a45" />
        <path d="M -150 30 Q -60 0 150 20" stroke="#7a5230" strokeWidth={4} fill="none" />
        <ellipse cx={-10} cy={-40} rx={40} ry={10} fill="#4d3420" />
        <path d="M -40 70 L -60 130 L 60 130 L 40 70 Z" fill="#8f6238" />
      </g>
      <Flame x={cx + 198} y={392} s={1.4} on={on} />
    </Frame>
  );
};

/** «¡Ojalá rasgases el cielo y bajases!» */
export const TornSky: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [30, 120], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const gap = 140 * open;
  const jag = (dir: number) => {
    let d = '';
    for (let i = 0; i <= 12; i++) {
      const x = (i / 12) * VW;
      const y = 300 + (random(`j${i}`) - 0.5) * 60 + dir * gap;
      d += `${i === 0 ? 'M' : 'L'} ${x} ${y} `;
    }
    return d;
  };
  return (
    <Frame soft>
      <defs>
        <linearGradient id="beam" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff4d6" stopOpacity={0.9} />
          <stop offset="100%" stopColor={colors.gold} stopOpacity={0} />
        </linearGradient>
      </defs>
      <Glow x={cx} y={300} r={460} o={open} />
      <ellipse cx={cx} cy={300} rx={520} ry={150} fill="#fff1cc" opacity={open * 0.55} filter="blur(30px)" style={{filter: 'blur(30px)'}} />
      {new Array(7).fill(0).map((_, i) => {
        const x = 120 + i * 110;
        return (
          <path key={i} d={`M ${x - 30} 300 L ${x + 30} 300 L ${x + 70 + (i - 3) * 30} 760 L ${x - 70 + (i - 3) * 30} 760 Z`} fill="url(#beam)" opacity={open * 0.35} />
        );
      })}
      <path d={`${jag(-1)} L ${VW} -60 L 0 -60 Z`} fill="#1a1433" />
      <path d={`${jag(1)} L ${VW} 460 L 0 460 Z`} fill="#1a1433" />
      <path d={jag(-1)} stroke={colors.gold} strokeWidth={3} fill="none" opacity={open} />
      <path d={jag(1)} stroke={colors.gold} strokeWidth={3} fill="none" opacity={open} />
    </Frame>
  );
};

/** Arcilla en manos del alfarero: una vasija que toma forma en el torno. */
export const Potter: React.FC = () => {
  const f = useCurrentFrame();
  const shape = interpolate(f, [20, 180], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const h = interpolate(shape, [0, 1], [120, 320]);
  const belly = interpolate(shape, [0, 1], [150, 170]);
  const neck = interpolate(shape, [0, 1], [150, 60]);
  const lip = interpolate(shape, [0, 1], [150, 90]);
  const base = 600;
  const top = base - h;
  const path = `M ${cx - 110} ${base}
    C ${cx - belly - 40} ${base - h * 0.35} ${cx - neck - 10} ${top + h * 0.3} ${cx - neck} ${top + 30}
    L ${cx - lip} ${top} L ${cx + lip} ${top} L ${cx + neck} ${top + 30}
    C ${cx + neck + 10} ${top + h * 0.3} ${cx + belly + 40} ${base - h * 0.35} ${cx + 110} ${base} Z`;
  return (
    <Frame>
      <ellipse cx={cx} cy={base + 20} rx={260} ry={46} fill="#3b2f4f" />
      <ellipse cx={cx} cy={base + 10} rx={240} ry={38} fill="#4b3d63" />
      <path d={path} fill="#b5683f" />
      {new Array(6).fill(0).map((_, i) => {
        const yy = top + 40 + ((i * 47 + f * 2) % (h - 50));
        return <line key={i} x1={cx - 200} x2={cx + 200} y1={yy} y2={yy} stroke="#8a4b2c" strokeWidth={2} opacity={0.4} clipPath="url(#vas)" />;
      })}
      <clipPath id="vas">
        <path d={path} />
      </clipPath>
      <path d={path} fill="none" stroke="#e2a07a" strokeWidth={3} opacity={0.6} />
      {/* manos */}
      <g opacity={0.95}>
        <path d={`M ${cx - 300} ${base - h * 0.45} Q ${cx - 200} ${base - h * 0.55} ${cx - belly - 25} ${base - h * 0.4} Q ${cx - 200} ${base - h * 0.25} ${cx - 300} ${base - h * 0.3} Z`} fill={colors.goldSoft} />
        <path d={`M ${cx + 300} ${base - h * 0.45} Q ${cx + 200} ${base - h * 0.55} ${cx + belly + 25} ${base - h * 0.4} Q ${cx + 200} ${base - h * 0.25} ${cx + 300} ${base - h * 0.3} Z`} fill={colors.goldSoft} />
      </g>
    </Frame>
  );
};

/** «Fiel es Dios»: amanece; el que viene, viene. */
export const Dawn: React.FC = () => {
  const f = useCurrentFrame();
  const rise = interpolate(f, [10, 200], [0, 1], {...clamp, easing: Easing.out(Easing.cubic)});
  const sy = 560 - rise * 260;
  return (
    <Frame soft>
      <Glow x={cx} y={sy} r={380} o={0.5 * rise} />
      {new Array(18).fill(0).map((_, i) => {
        const a = (i / 18) * Math.PI * 2 + f / 300;
        return (
          <line key={i} x1={cx + Math.cos(a) * 120} y1={sy + Math.sin(a) * 120} x2={cx + Math.cos(a) * 230} y2={sy + Math.sin(a) * 230} stroke={colors.goldSoft} strokeWidth={3} opacity={0.4 * rise} />
        );
      })}
      <circle cx={cx} cy={sy} r={100} fill="#ffd98a" />
      <rect x={0} y={560} width={VW} height={200} fill="#1a1530" />
      <path d={`M 0 560 Q ${cx} 520 ${VW} 560`} fill="#1a1530" />
      <line x1={0} x2={VW} y1={560} y2={560} stroke={colors.gold} strokeOpacity={0.5} strokeWidth={2} />
    </Frame>
  );
};

/** El don: un regalo que se abre y deja salir la luz. */
export const Gift: React.FC = () => {
  const f = useCurrentFrame();
  const {fps} = useVideoConfig();
  const lid = spring({frame: f - 40, fps, config: {damping: 14}});
  const glow = interpolate(f, [45, 90], [0, 1], clamp);
  return (
    <Frame>
      {new Array(12).fill(0).map((_, i) => {
        const a = -Math.PI / 2 + ((i - 5.5) / 12) * 1.6;
        return <line key={i} x1={cx} y1={420} x2={cx + Math.cos(a) * 420} y2={420 + Math.sin(a) * 420} stroke={colors.goldSoft} strokeWidth={4} opacity={glow * 0.35} />;
      })}
      <Glow x={cx} y={410} r={260} o={glow * 0.55} />
      <rect x={cx - 170} y={430} width={340} height={260} rx={8} fill="#6b3fa0" />
      <rect x={cx - 22} y={430} width={44} height={260} fill={colors.gold} />
      <g transform={`translate(${cx} ${430}) rotate(${-lid * 28}) translate(${-cx} ${-430}) translate(${-lid * 40} ${-lid * 60})`}>
        <rect x={cx - 190} y={380} width={380} height={56} rx={8} fill="#7d4cb8" />
        <rect x={cx - 22} y={380} width={44} height={56} fill={colors.gold} />
        <path d={`M ${cx} 380 C ${cx - 90} 300 ${cx - 120} 380 ${cx} 380 C ${cx + 120} 380 ${cx + 90} 300 ${cx} 380`} fill="none" stroke={colors.gold} strokeWidth={14} />
      </g>
    </Frame>
  );
};

/** La puerta abierta: luz que sale de una casa en orden. */
export const OpenDoor: React.FC = () => {
  const f = useCurrentFrame();
  const open = interpolate(f, [25, 110], [0, 1], {...clamp, easing: Easing.inOut(Easing.cubic)});
  const dw = 220;
  const x0 = cx - dw / 2;
  return (
    <Frame>
      <rect x={cx - 330} y={90} width={660} height={560} fill="#2a2342" />
      <rect x={x0} y={200} width={dw} height={450} fill="#ffe2a0" />
      <rect x={x0} y={200} width={dw} height={450} fill={colors.gold} opacity={0.5} />
      {/* luz derramada sobre el suelo */}
      <path d={`M ${x0} 650 L ${x0 + dw} 650 L ${x0 + dw + 200} 760 L ${x0 - 200} 760 Z`} fill="#ffe2a0" opacity={0.35 * open} />
      {/* hoja de la puerta que gira */}
      <path
        d={`M ${x0} 200 L ${x0 + dw * (1 - open * 0.85)} ${200 + open * 25} L ${x0 + dw * (1 - open * 0.85)} ${650 - open * 25} L ${x0} 650 Z`}
        fill="#5a3b2a"
      />
      <circle cx={x0 + dw * (1 - open * 0.85) - 22} cy={430} r={7} fill={colors.gold} />
      <rect x={x0 - 14} y={186} width={dw + 28} height={14} fill="#4a3a66" />
      <Flame x={cx + 250} y={250} s={0.6} />
      <rect x={cx + 236} y={250} width={28} height={50} fill="#d9c9a8" />
    </Frame>
  );
};

/** Las cuatro vigilias de la noche (Mc 13,35). */
export const Watches: React.FC = () => {
  const f = useCurrentFrame();
  const labels = ['atardecer', 'medianoche', 'canto del gallo', 'amanecer'];
  const p = interpolate(f, [20, 230], [0, 1], {...clamp, easing: Easing.inOut(Easing.quad)});
  const R = 330;
  const cy0 = 600;
  const pt = (t: number) => {
    const a = Math.PI + t * Math.PI;
    return [cx + Math.cos(a) * R, cy0 + Math.sin(a) * R];
  };
  const [mx, my] = pt(p);
  return (
    <Frame>
      <path d={`M ${cx - R} ${cy0} A ${R} ${R} 0 0 1 ${cx + R} ${cy0}`} stroke={colors.muted} strokeDasharray="4 10" strokeWidth={3} fill="none" />
      <line x1={40} x2={VW - 40} y1={cy0} y2={cy0} stroke={colors.gold} strokeOpacity={0.4} strokeWidth={2} />
      {labels.map((l, i) => {
        const t = (i + 0.5) / 4;
        const [x, y] = pt(t);
        const on = interpolate(p, [t - 0.08, t], [0.35, 1], clamp);
        return (
          <g key={l} opacity={on}>
            <circle cx={x} cy={y} r={12} fill={colors.gold} />
            <text x={x} y={y - 30} fill={colors.ivory} fontSize={30} textAnchor="middle" fontFamily="Inter">
              {l}
            </text>
          </g>
        );
      })}
      <circle cx={mx} cy={my} r={34} fill={p > 0.85 ? '#ffd98a' : '#e9e6da'} />
      <Glow x={mx} y={my} r={110} o={0.4} />
    </Frame>
  );
};
