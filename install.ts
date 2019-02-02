import { join } from 'path';
import { exists, writeJsonFile, readJson } from './src/fs';
import { PROJECT_DIR, SETTING_FILE } from './src/interfaces';
import { info, success } from './src/log';

const cwd             = join( __dirname, '../../..' );
const settingFilePath = join( cwd, PROJECT_DIR, SETTING_FILE );
if ( exists( settingFilePath ) ) {
  process.exit( 0 );
}

const settings        = readJson( join( __dirname, SETTING_FILE ) );
if ( settings === undefined ) {
  process.exit( 0 );
}

info( `${SETTING_FILE} does not exist, start create` );
writeJsonFile( settingFilePath, settings );
success( `${settingFilePath} was created.` )
