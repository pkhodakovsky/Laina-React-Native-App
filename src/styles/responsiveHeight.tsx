import { heightPercentageOrientation as ho } from '../common/responsiveFunct';
import { LANDSCAPE } from '../common/variables';

export const Resp_Height = (orientation: string, height: number, num: number, diff: number) => orientation == LANDSCAPE ? ho(`${num}%`, height) : ho(`${diff}%`, height);