import Color = require('color');
import PopupOptions from './PopupOptions';
import Cards from './Cards';
import Quotes from './Quotes';
import Fonts from './Fonts';
import Occasions from './Occasions';
import Settings from './Settings';
import Enviroment from './Enviroment';
import { ThemeOptions } from './ThemeOptions';

export interface WidgetOptions {
  campaign: Number,
  popup: PopupOptions,
  showSmartPopup: Boolean,
  showOnDesktop: Boolean,
  showOnMobile: Boolean,
  keyword: String;
  theme: ThemeOptions,
  settings: Settings,
  cards: Array<Cards>,
  quotes: Array<Quotes>,
  fonts: Array<Fonts>,
  occasions: Array<Occasions>,
  enviroment: Enviroment,
}
