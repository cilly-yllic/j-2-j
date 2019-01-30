import chalk from 'chalk';

export const error = ( value: string ) => console.log( chalk.bold.red( value ) );
export const warning = ( value: string ) => console.log( chalk.bold.yellow( value ) );
export const success = ( value: string ) => console.log( chalk.bold.green( value ) );
export const info = ( value: string ) => console.log( chalk.bold.blue( value ) );