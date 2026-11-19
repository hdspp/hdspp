import {Composition} from 'remotion';
import {Tema01, TEMA01_DURATION} from './tema01/Tema01';

export const RemotionRoot: React.FC = () => (
  <Composition
    id="Tema01"
    component={Tema01}
    durationInFrames={TEMA01_DURATION}
    fps={30}
    width={1920}
    height={1080}
  />
);
