import { Separators } from '../interfaces';
export { PROJECT_DIR, SETTING_FILE, DEFAULT_SETTINGS } from '../interfaces';

export interface Options {
  input: string;
  output: string;
  commentKeep: boolean;
}

export interface Settings {
  separators: Separators;
}