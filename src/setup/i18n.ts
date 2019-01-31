import { isString, isArray, isObject, updateObject, hasPrefixSuffix } from '../utils';
import { Options } from './interfaces';

const getStringValue = ( lang: string, object, separators, state = {}, options: Options, paths: string[] = [] ): Object => {
  Object.keys( object ).forEach( ( key: string ) => {
    if ( hasPrefixSuffix( key, separators.comment.prefix, separators.comment.suffix ) && !options.commentKeep ) {
      return;
    }
    const value = object[key];
    if ( isString( value ) || isArray( value ) ) {
      state = updateObject( state, paths.concat( key, `${separators.i18n.prefix}${lang}${separators.i18n.suffix}` ), value )
    } else if ( isObject( value ) ) {
      paths.push( key );
      getStringValue( lang, value, separators, state, options, paths );
      paths.pop();
    }
  } );
  return state;
};

export default function ( lang: string, object, separators, state, options: Options ): Object {
  if ( !Object.keys( object ).length ) {
    return {};
  }
  return getStringValue( lang, object, separators, state, options );
}