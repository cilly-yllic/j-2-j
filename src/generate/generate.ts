import { join } from 'path';
import { success, error, info } from '../log';
import getI18n from './i18n';
import { readJson, writeJsonFile } from '../fs';
import { updateObject, removeComment } from '../utils';
import { Output, Separators } from './interfaces';

const getPaths = ( reg: RegExp, file: string, extension = true ) => {
  if ( extension ) {
    return file.replace( reg, '' ).split( '/' ).filter( dir => !!dir ).map( path => path.replace( /(.*)\.json$/, '$1' ) );
  } else {
    return file.replace( reg, '' ).split( '/' ).filter( dir => !!dir && dir.search( /\.json$/ ) === - 1 );
  }
};

const generateI18n = ( object, separators: Separators, state = {} ) => {
  const result = getI18n( object, separators );
  const langs = Object.keys( result );
  if ( !langs.length ) {
    return state;
  }
  langs.forEach( lang => state[lang] = { ...state[lang] || {}, ...result[lang] } );
  return state;
};

const generate = ( object, separators: Separators, state = {} ) => {
  return { ...state || {}, ...removeComment( object, separators.comment.prefix, separators.comment.suffix ) };
};

export default function ( removePath: string, { type, outputFilename }: Output, files: string[], separators: Separators, outputPath: string ): void {
  const reg       = new RegExp( `^${removePath}` );
  const brokenFiles: string[] = [];
  const merged    = files.reduce( ( state, file ) => {
    const json    = readJson( file );
    if ( json === undefined ) {
      brokenFiles.push( file );
      return state;
    }
    switch ( type ) {
      case 'i18n':
        return generateI18n( updateObject( {}, getPaths( reg, file ), json ), separators, state );
      case 'simple':
        return generate( updateObject( {}, getPaths( reg, file ), json ), separators, state );
      case 'filename':
        return generate( updateObject( {}, getPaths( reg, file, false ), json ), separators, state );
      default:
        return state;
    }
  }, {} );
  if ( !!brokenFiles.length ) {
    error( `some json files are broken, therefore skip generate ${join( outputPath, outputFilename )}` );
    brokenFiles.forEach( brokenFile => info( brokenFile ) );
    return;
  }

  if ( type === 'i18n' ) {
    const mergedKeys = Object.keys( merged );
    if ( !mergedKeys.length ) {
      return;
    }
    mergedKeys.forEach( mergedKey => {
      const i18nFilePath = join( outputPath, outputFilename, `${mergedKey}.json` );
      writeJsonFile( i18nFilePath, merged[mergedKey] );
      success( `File: ${i18nFilePath} generated!` );
    } );
  } else {
    const filePath = join( outputPath, `${outputFilename}.json` );
    writeJsonFile( join( outputPath, `${outputFilename}.json` ), merged );
    success( `File: ${filePath} generated!` );
  }
}