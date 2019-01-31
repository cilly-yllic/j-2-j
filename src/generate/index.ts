import { join } from 'path';
import getSettings from './settings';
import { getFilePaths } from '../fs';
import generate from './generate';
import split from './split-filename';
import { Options, PROJECT_DIR } from './interfaces';

export default function ( cwd: string, options: Options ): void {
  const { separators, dirs, outputPath, files } = getSettings( cwd, options );
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
        generate( dirPath, { type: dir.type, outputFilename: key }, filenamesFiles[key], separators, join( cwd, dir.outputPath ? dir.outputPath : outputPath ) )
      } );
      return;
    }
    generate( dirPath, dir, dirFiles, separators, join( cwd, dir.outputPath ? dir.outputPath : outputPath ), options.trim )
  } );
  files.forEach( file => {
    const filePath    = join( cwd, PROJECT_DIR, file.file );
    generate( filePath, file, [ filePath ], separators, join( cwd, file.outputPath ? file.outputPath : outputPath ), options.trim )
  } );
};
