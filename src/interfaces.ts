export const PROJECT_DIR  = `.j-2-j`;
export const SETTING_FILE = '.setting.json';

export const DEFAULT_SETTINGS = {
  output: './src/assets',
  separators: {
    comment: {
      prefix: '/*',
      suffix: '*/'
    },
    i18n: {
      prefix: '::',
      suffix: '::'
    }
  }
};

export const DEFAULT_DIR_SETTING = {
  type: 'simple',
};

export interface Separators {
  comment: {
    prefix: string;
    suffix: string;
  };
  i18n: {
    prefix: string;
    suffix: string;
  }
}