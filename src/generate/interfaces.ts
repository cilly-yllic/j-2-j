import { Separators } from '../interfaces';

export * from '../interfaces';
export interface Options {
  all: boolean;
  trim: boolean;
}

export type Type = 'i18n' | 'simple' | 'filename';

export interface Output {
  type: Type;
  outputFilename: string;
  outputPath?: string;
}

export interface Dir extends Output {
  dir: string;
}

export interface File extends Output {
  file: string;
}

export type Dirs  = Dir[];
export type Files = File[];

export interface Settings {
  outputPath: string;
  separators: Separators;
  dirs: Dirs;
  files: Files;
}