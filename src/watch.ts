import * as chokidar from 'chokidar';
import { join } from 'path';
import generate from './generate';

export interface Options {
  all: boolean;
}

// TODO generate only changed file or same root dir files.
const changed = ( cwd: string, options: Options, path: string ) => {
  console.log( `updated file: ${path}` );
  console.log( '> re generate' );
  generate( cwd, options );
};

export default function ( cwd: string, options: Options ) {
  const watcher = chokidar.watch( join( cwd, './.j-2-j'), {
    // ignored: /[\/\\]\./,
    persistent: true
  } );

  watcher.once( 'ready', () => {
    console.log( '> watch ./.j-2-j dir' );
    console.log( '> generate' );
    generate( cwd, options );
    watcher
        .on( 'add', ( path: string ) => changed( cwd, options, path ) )
        .on( 'addDir', ( path: string ) => changed( cwd, options, path ) )
        .on( 'unlink', ( path: string ) => changed( cwd, options, path ) )
        .on( 'unlinkDir', ( path: string ) => changed( cwd, options, path ) )
        .on( 'change', ( path: string ) => changed( cwd, options, path ) )
  } )
      .on( 'error', (error) => console.log( '--- error ---', error ) )
  ;
}
