import { join } from 'path';
import { Options, Separators } from './interfaces';
import { readJson, writeJsonFile } from '../fs';
import { error, info } from '../log';
import getI18n from './i18n';
import getFilename from './filename';

const setupI18n      = ( jsons, separators, options ) => Object.keys( jsons ).reduce( ( state, lang ) => getI18n( lang, jsons[lang], separators, state, options ), {} );

export default function ( cwd: string, files: string[], separators: Separators, options: Options ) {
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

  const output            = join( cwd, options.output );
  if ( !!brokenFiles.length ) {
    error( `some json files are broken, therefore skip generate ${output}` );
    brokenFiles.forEach( brokenFile => info( brokenFile ) );
    return;
  }
  const langs           = Object.keys( jsons );
  if ( !langs.length ) {
    return;
  }
  if ( options.type === 'i18n' ) {
    if ( options.depth > 0 ) {
      const files   = getFilename( setupI18n( jsons, separators, options ), options.depth + 1, separators );
      files.forEach( ( { object, path } ) => {
        const paths = path.split( '/' );
        const filename = paths.pop();
        writeJsonFile( join( output, paths.join( '/' ), `${filename}.json` ), object );
      } );
    } else {
      writeJsonFile( join( output, `${options.type}.json` ), setupI18n( jsons, separators, options ) )
    }
  } else {
    langs.forEach( lang => {
      getFilename( jsons[lang], options.depth, separators ).forEach( ( { object, path } ) => {
        writeJsonFile( join( output, path, `${lang}.json` ), object );
      } );
    } );
  }
}
