import { join } from 'path';
import { readJson } from '../fs';
import { Settings, PROJECT_DIR, SETTING_FILE, DEFAULT_SETTINGS } from './interfaces';

export default function ( cwd: string ): Settings {
  const settingFile   = join( cwd, PROJECT_DIR, SETTING_FILE );
  const settings      = readJson( settingFile ) || DEFAULT_SETTINGS;
  return { separators: settings.separators };
};
