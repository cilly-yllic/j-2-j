import { join } from 'path';
import { isDir, getFilePaths } from '../fs';
import setUp from './setup';
import getSettings from './settings';
import { Options } from './interfaces';

export default function ( cwd: string, options: Options ): void {
  const input           = join( cwd, options.input );
  const files           = isDir( input ) ? getFilePaths( input ) : [ input ];
  const { separators }  = getSettings( cwd );
  setUp( cwd, files, separators, options );
};