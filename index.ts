#!/usr/bin/env node
import * as program from 'commander';
import { join } from 'path';
import generate from './src/generate';
import setUp from './src/set-up';
import watch from './src/watch';

const version = '1.0.0';
const name    = 'j-2-j';

console.log( `> run ${name}` );
export default function ( cwd: string = join( __dirname, '../..' ) ) {

  program.version( version, '-v, --version' );
  program.command( 'generate' )
      .alias( 'g' )
      .option( '-a, --all', `generate all dirs inside .${name}` )
      .action( ( command ) => {
        console.log( '> run generate' );
        generate(
            cwd,
            {
              all: command.all
            }
        );
      } )
      .on('--help', () => {
        console.log( '  Examples:' );
        console.log();
        console.log( `    $ ${name} g` );
        console.log();
      });

  program.command( 'watch' )
      .alias( 'w' )
      .option( '-a, --all', `generate all dirs inside .${name}` )
      .action( ( command ) => {
        console.log( '> run watch' );
        watch(
            cwd,
            {
              all: command.all
            }
        );
      } )
      .on('--help', () => {
        console.log( '  Examples:' );
        console.log();
        console.log( `    $ ${name} w` );
        console.log();
      });

  program.command( 'set-up' )
      .alias( 'up' )
      .option( '-i, --input <input>', 'target dir to integrate' )
      .option( '-o, --output <output>', 'target path to generate file' )
      .option( '-c, --comment-keep', 'generate json without comments' )
      .action( (command) => {
        if ( !command.input || !command.output ) {
          program.help();
          return;
        }
        console.log( '> run set-up' )
        setUp(
            cwd,
            {
              input       : command.input,
              output      : command.output,
              commentKeep : command.commentKeep,
            }
        );
      } )
      .on('--help', function() {
        console.log( '  Examples:' );
        console.log();
        console.log( `    $ ${name} up -i [path] -o [path]` );
        console.log();
      });

  program.command( '*' ).action( () => program.help() );

  program.parse(process.argv);
}