import { join, normalize } from 'path';
import { getDirs, exists, readJson } from '../fs';
import { Options, Settings, PROJECT_DIR, SETTING_FILE, DEFAULT_SETTINGS, DEFAULT_DIR_SETTING } from './interfaces';
import { getFileName, getBeforeFilename } from '../utils';
import { warning } from '../log';

export default function ( cwd: string, options: Options, target: string = '' ): Settings {
  const projectDir            = join( cwd, PROJECT_DIR );
  const settingFile           = join( projectDir, SETTING_FILE );
  const settings              = readJson( settingFile ) || DEFAULT_SETTINGS;
  let settingDirs             = settings.dirs || {};
  const settingFiles          = settings.files || [];
  const targetDir             = getBeforeFilename( target );
  const allDirs               = getDirs( projectDir ).filter( dir => !!targetDir ? dir === targetDir : true );
  const settingExistDirNames  = Object.keys( settingDirs ).filter( dirKey => !settingDirs[dirKey].locked && allDirs.some( dir => dir === dirKey ) );
  settingDirs                 = settingExistDirNames.reduce( ( state, current ) => {
    state[current]            = settingDirs[current];
    return state;
  }, {} );

  const dirs                  = ( options.all ? allDirs : settingExistDirNames ).map( current => {
    if ( !settingDirs[current] ) {
      settingDirs[current]              = { ...DEFAULT_DIR_SETTING }
    }
    settingDirs[current].dir            = current;
    if ( !settingDirs[current].type ) {
      settingDirs[current].type         = DEFAULT_DIR_SETTING.type;
    }
    settingDirs[current].outputFilename = settingDirs[current].dir;
    return settingDirs[current];
  } ) || [];
  const files                           = settingFiles.filter( file => {
    if ( file.locked ) {
      return false;
    }
    if ( !!target && normalize( file.file ) !== normalize( target ) ) {
      return false;
    }
    if ( !file.file ) {
      warning( 'there is no file path setting' );
      warning( file );
      return false;
    }
    const filePath  = join( projectDir, file.file );
    if ( !exists( filePath ) ) {
      warning( `File: ${filePath} does not exist` );
      return false;
    }
    file.type       = 'i18n';
    return true;
  } ).map( file => {
    file.outputFilename = getFileName( file.file );
    return file;
  } ) || [];
  return { separators: settings.separators, outputPath: settings.outputPath, dirs, files };
};
