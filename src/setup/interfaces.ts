import { Separators } from '../interfaces';
export { PROJECT_DIR, SETTING_FILE, DEFAULT_SETTINGS, Separators } from '../interfaces';

export interface Options {
  input: string;
  output: string;
  type: string;
  depth: number;
  commentKeep: boolean;
}

export interface Settings {
  separators: Separators;
}