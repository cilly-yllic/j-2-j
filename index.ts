#!/usr/bin/env node
import * as program from 'commander';
import { join } from 'path';
import { error } from './src/log';
import generate from './src/generate';
import setup from './src/setup';
import watch from './src/watch';

const version = '1.0.0';
const name    = 'j-2-j';

console.log( `> run ${name}` );
export default function ( cwd: string = join( __dirname, '../../..' ) ) {

  program.version( version, '-v, --version' );
  program.command( 'generate' )
      .alias( 'g' )
      .option( '-a, --all', `generate all dirs inside .${name}` )
      .option( '-t, --trim', 'trim generated json file' )
      .action( ( command ) => {
        console.log( '> run generate' );
        generate(
            cwd,
            {
              all: command.all,
              trim: command.trim,
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
      .option( '-t, --trim', 'trim generated json file' )
      .action( ( command ) => {
        console.log( '> run watch' );
        watch(
            cwd,
            {
              all: command.all,
              trim: command.trim,
            }
        );
      } )
      .on('--help', () => {
        console.log( '  Examples:' );
        console.log();
        console.log( `    $ ${name} w` );
        console.log();
      });

  program.command( 'setup' )
      .alias( 'up' )
      .option( '-i, --input <input>', 'target dir to integrate' )
      .option( '-o, --output <output>', 'target path to generate file' )
      .option( '-t, --type <type>', 'i18n, filesystem', 'i18n' )
      .option( '-d, --depth <depth>', 'i18n, filesystem', parseInt )
      .option( '-c, --comment-keep', 'generate json without comments' )
      .action( (command) => {
        if ( !command.input || !command.output ) {
          program.help();
          return;
        }
        console.log( '> run set-up' );
        if ( command.depth > 0 && command.commentKeep ) {
          error( 'when you set depth more than 0, you cannot set -c / --comment-keep' );
          return;
        }
        if ( ( !command.depth  || command.depth < 1 ) && command.type === 'filename' ) {
          error( 'when you set type filename, you must set depth also.' );
          return;
        }

        setup(
            cwd,
            {
              input       : command.input,
              output      : command.output,
              type        : command.type,
              depth       : command.depth || 0,
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