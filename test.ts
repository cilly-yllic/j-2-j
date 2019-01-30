// import * as program from 'commander';
import { join } from 'path';
import index from './index';

const [, cwd] = process.argv;

index( join( cwd, '..' ) );