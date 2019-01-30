export const getValueType = ( value: any ): string => Object.prototype.toString.call( value ).slice( 8, - 1 );
export const isString     = ( value: any ): boolean => getValueType( value ) === 'String';
export const isArray      = ( value: any ): boolean => getValueType( value ) === 'Array';
export const isObject     = ( value: any ): boolean => getValueType( value ) === 'Object';

export function isJson (json ): boolean {
  if ( typeof json !== 'string' ) {
    return false;
  }
  try {
    JSON.parse( json );
  } catch ( err ) {
    return false;
  }
  return true;
}

export const updateObject = ( backup: Object, tmpPath: string[], value: any ): Object => {
  if ( !tmpPath.length ) {
    return { ...backup, ...value };
  }
  const path    = tmpPath.concat();
  const key     = <string>path.pop();
  const data    = backup ? backup : {};
  const result  = path.reduce(
      ( state, current ) => {
        if ( state[current] === undefined ) {
          state[current] = {};
        }
        return state[current];
      }, data
  );
  result[key]   = value;
  return data;
};

const stringReverse = ( str: string ): string => {
  let result  = '';
  for ( let i = 0, n = str.length; i < n; i++ ) {
    result    = result + str[n - i - 1];
  }
  return result;
};

export const hasPrefixSuffix = ( target: string, prefix: string, suffix: string ): boolean => {
  if ( !target ) {
    return false;
  }
  if ( target.length <= prefix.length + suffix.length ) {
    return false;
  }
  return target.indexOf( prefix ) === 0 && stringReverse( target ).indexOf( stringReverse( suffix ) ) === 0;
};

export const removePrefixSuffix = ( target: string, prefix: string, suffix: string ): string => {
  return hasPrefixSuffix( target, prefix, suffix ) ? target.slice( prefix.length ).slice( 0, - suffix.length ) : target;
};

export const removeComment = ( data, prefix: string, suffix: string ): Object => {
  return Object.keys( data ).reduce( ( state, key ) => {
    if ( hasPrefixSuffix( key, prefix, suffix ) ) {
      return state;
    }
    const value = data[key];
    if ( getValueType( value ) === 'Object' ) {
      state[key] = removeComment( value, prefix, suffix );
    } else if ( getValueType( value ) === 'String' ) {
      state[key] = value;
    }
    return state;
  }, {} );
};

export const getFileName = ( path: string ) => path.replace( /.+\/([^\/]+)\.\w+/, '$1' );