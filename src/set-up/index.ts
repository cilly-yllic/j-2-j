import { join } from 'path';
import { isDir, getFilePaths, readJson, writeJsonFile } from '../fs';
import { error, info } from '../log';
import getI18n from './i18n';
import getSettings from './settings';
import { Options } from './interfaces';

export default function ( cwd: string, options: Options ): void {
  const input           = join( cwd, options.input );
  const files           = isDir( input ) ? getFilePaths( input ) : [ input ];
  const { separators }  = getSettings( cwd );
  const brokenFiles: string[] = [];
  const jsons           = files.reduce( ( state, file ) => {
    const json          = readJson( file );
    if ( json === undefined ) {
      brokenFiles.push( file );
      return state;
    }
    state[file.replace( /.*\/([^\/]+).json$/, '$1' )] = json;
    return state;
  }, {} );

  const path            = `${join( cwd, options.output )}/i18n.json`;
  if ( !!brokenFiles.length ) {
    error( `some json files are broken, therefore skip generate ${path}` );
    brokenFiles.forEach( brokenFile => info( brokenFile ) );
    return;
  }
  const langs           = Object.keys( jsons );
  if ( !langs.length ) {
    return;
  }
  const result          = langs.reduce( ( state, lang ) => getI18n( lang, jsons[lang], separators, state, options ), {} );
  writeJsonFile( path, result )
};