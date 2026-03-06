import 'styled-components/native';
import { AppTheme } from './themes';

declare module 'styled-components/native' {
  export interface DefaultTheme extends AppTheme {}
}
