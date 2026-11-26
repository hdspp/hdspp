import {Composition} from 'remotion';
import {Tema01, TEMA01_DURATION} from './tema01/Tema01';
import {AdvientoB01, ADVIENTO_B01_DURATION} from './advientoB01/AdvientoB01';

export const RemotionRoot: React.FC = () => (
  <>
  <Composition
    id="Tema01"
    component={Tema01}
    durationInFrames={TEMA01_DURATION}
    fps={30}
    width={1920}
    height={1080}
  />
  <Composition
    id="AdvientoB01"
    component={AdvientoB01}
    durationInFrames={ADVIENTO_B01_DURATION}
    fps={30}
    width={1080}
    height={1920}
  />
  </>
);
