/// <reference types="react-scripts" />

import theme from 'styleSheets/theme';

type ThemeProps = { theme?: typeof theme };

type StationStatus = '過站' | '進站中' | '即將進站' | '10分';
