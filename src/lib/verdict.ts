import { Icon } from './icon';
import { Emoji } from './emoji';
import { Color } from './color';

export const Verdict = {
  Icon: (verdict: string) => Icon[verdict] || Icon.Uncertain,
  Emoji: (verdict: string) => Emoji[verdict] || Emoji.Uncertain,
  Color: (verdict: string) => Color[verdict] || Color.Uncertain
}