import getSettings from './settings';
import generate from './generate';
import { Options } from './interfaces';

export default function ( cwd: string, options: Options, targetFile: string = '' ): void {
  const { separators, dirs, outputPath, files } = getSettings( cwd, options, targetFile );
  generate( cwd, options, dirs, files, separators, outputPath );
};
