import * as fs from 'fs';
import { join } from 'path';
import { warning } from './log';
import { isJson } from './utils';

interface DirsFiles {
  dirs: string[];
  files: string[];
}

export const exists     = ( path: string ): boolean => fs.existsSync( path );
export const readFile   = ( path: string ) => exists( path ) && fs.readFileSync( path );
export const readJson   = ( path: string ) => {
  const isNotJson = undefined;
  if ( path.search( /\/\.?\w*.json$/ ) === - 1 ) {
    warning( `File: ${path} is not JSON file extension` );
    return;
  }
  if ( !exists( path ) ) {
    warning( `File: ${path} does not exist` );
    return isNotJson;
  }
  const value     = readFile( path ).toString();
  if ( !value || !isJson( value ) ) {
    warning( `File: ${path} is not JSON` );
    return isNotJson;
  }
  return JSON.parse( value );
};

export const writeJsonFile  = ( path: string, object: Object ): void => {
  checkBeforeFiles( path );
  fs.writeFileSync( path, JSON.stringify( object, null, '  ' ) );
};

export const isDir      = ( path: string ): boolean => fs.lstatSync( path ).isDirectory();
export const getDirs    = ( path: string ): string[] => fs.readdirSync( path ).filter( dir => fs.lstatSync( join( path, dir ) ).isDirectory() );
export const readDir    = ( path: string ): DirsFiles => fs.readdirSync( path ).reduce( ( state: DirsFiles, current ) => {
  const childPath = join( path, current );
  if ( !fs.statSync( childPath ) ) {
    return state;
  }
  if ( fs.lstatSync( childPath ).isDirectory() ) {
    state.dirs.push( childPath )
  } else {
    state.files.push( childPath )
  }
  return state;
}, { dirs: [], files: [] } );

export const getFilePaths = ( dir: string, state: string[] = [] ): string[] => {
  if ( !fs.statSync( dir ) ) {
    return [];
  }
  const { dirs, files }   = readDir( dir );
  state = state.concat( files );
  return dirs.reduce( ( state, childDir ) => {
    state = getFilePaths( childDir, state );
    return state;
  }, state )
};

export const checkBeforeFiles = ( path: string ): void => {
  if ( !path ) {
    return;
  }
  const paths = path.split( '/' ).filter( tmp => !!tmp );
  if ( paths.length < 2 ) {
    return;
  }
  paths.pop();
  let combine = '/';
  paths.forEach( path => {
    if ( !path ) {
      return;
    }
    combine   = join( combine, path );
    if ( fs.existsSync( combine ) ) {
      return;
    }
    fs.mkdirSync( combine );
  } );
};