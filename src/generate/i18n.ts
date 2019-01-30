import { isString, isArray, isObject, updateObject, hasPrefixSuffix, removePrefixSuffix } from '../utils';

const getStringValue  = ( object, separators, paths: string[] = [], result = {} ): Object => {
  Object.keys( object ).forEach( ( key: string ) => {
    if ( hasPrefixSuffix( key, separators.comment.prefix, separators.comment.suffix ) ) {
      return;
    }
    const value = object[key];
    if ( ( isString( value ) || isArray( value ) ) && hasPrefixSuffix( key, separators.i18n.prefix, separators.i18n.suffix ) ) {
      result          = updateObject( result, [ removePrefixSuffix( key, separators.i18n.prefix, separators.i18n.suffix ) ].concat( paths ), value );
    } else if ( isObject( value ) ) {
      paths.push( key );
      getStringValue( value, separators, paths, result );
      paths.pop();
    }
  } );
  return result;
};

export default function ( object, separators ): Object {
  if ( !Object.keys( object ).length ) {
    return {};
  }
  return getStringValue( object, separators );
}