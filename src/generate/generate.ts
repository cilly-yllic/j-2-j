import { join } from 'path';
import * as merge from 'merge';
import { error, info } from '../log';
import getI18n from './i18n';
import { getFilePaths, readJson, writeJsonFile } from '../fs';
import { updateObject, removeComment, getBeforeFilename } from '../utils';
import { Output, Separators, Dirs, Files, PROJECT_DIR, Options } from './interfaces';
import split from './split-filename';

const getPaths = ( reg: RegExp, file: string, extension = true ) => {
  if ( extension ) {
    return file.replace( reg, '' ).split( '/' ).filter( dir => !!dir ).map( path => path.replace( /(.*)\.json$/, '$1' ) );
  } else {
    return file.replace( reg, '' ).split( '/' ).filter( dir => !!dir && dir.search( /\.json$/ ) === - 1 );
  }
};

const i18n = ( object, separators: Separators, state = {} ) => {
  const result = getI18n( object, separators );
  const langs = Object.keys( result );
  if ( !langs.length ) {
    return state;
  }
  langs.forEach( lang => state[lang] = merge.recursive( state[lang] || {}, result[lang] ) );
  return state;
};

const common = ( object, separators: Separators, state = {} ) => {
  return merge.recursive( state || {}, removeComment( object, separators.comment.prefix, separators.comment.suffix ) );
};

const generate  = ( removePath: string, { type, outputFilename }: Output, files: string[], separators: Separators, outputPath: string, trim: boolean = false ): void => {
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
        return i18n( updateObject( {}, getPaths( reg, file ), json ), separators, state );
      case 'simple':
        return common( updateObject( {}, getPaths( reg, file ), json ), separators, state );
      case 'filename':
        return common( updateObject( {}, getPaths( reg, file, false ), json ), separators, state );
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
      writeJsonFile( join( outputPath, outputFilename, `${mergedKey}.json` ), merged[mergedKey], trim );
    } );
  } else {
    writeJsonFile( join( outputPath, `${outputFilename}.json` ), merged, trim );
  }
};

export default function ( cwd: string, options: Options, dirs: Dirs, files: Files, separators: Separators, outputPath: string ) {
  dirs.forEach( dir => {
    const dirPath     = join( cwd, PROJECT_DIR, dir.dir );
    const dirFiles    = getFilePaths( dirPath ).filter( dirFile => !files.length || files.every( file => join( cwd, PROJECT_DIR, file.file ) !== dirFile ) );
    if ( !dirFiles.length ) {
      return;
    }
    if ( dir.type === 'filename' ) {
      const filenamesFiles    = split( dirFiles );
      const filenamesFileKeys = Object.keys( filenamesFiles );
      if ( !filenamesFileKeys.length ) {
        return;
      }
      filenamesFileKeys.forEach( key => {
        generate( dirPath, { type: dir.type, outputFilename: key }, filenamesFiles[key], separators, join( cwd, dir.outputPath ? dir.outputPath : `${outputPath}/${dir.dir}` ), options.trim )
      } );
      return;
    }
    generate( dirPath, dir, dirFiles, separators, join( cwd, dir.outputPath ? dir.outputPath : `${outputPath}/${dir.dir}` ), options.trim )
  } );

  files.forEach( file => {
    const filePath    = join( cwd, PROJECT_DIR, file.file );
    let output        = join( cwd, file.outputPath ? file.outputPath : '' );
    if ( !file.outputPath ) {
      output          = join( cwd, outputPath, getBeforeFilename( file.file ) );
    }
    generate( filePath, file, [ filePath ], separators, output, options.trim )
  } );
}
