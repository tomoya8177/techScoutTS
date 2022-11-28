import Autolinker from 'autolinker';
import nl2br from 'nl2br';

export const richText = (str) => {
  return Autolinker.link(nl2br(str));
};
