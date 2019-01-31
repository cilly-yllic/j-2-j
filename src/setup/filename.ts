import * as merge from 'merge';
import { isString, isArray, isObject, getObjectDepth, removeComment, hasPrefixSuffix } from '../utils';
import { Options, Separators } from './interfaces';

interface Result {
  path: string;
  object: Object;
}

type Results    = Result[];

const getMerged = ( objects ): Object => objects.reduce( ( state, object ) => merge.recursive( state, object ), {} );

const pushSamePath = ( paths, object, state = {} ) => {
  const path    = `./${paths.join('/')}`;
  if ( !state[path] ) {
    state[path] = [];
  }
  state[path].push( object );
  return state;
};

const getObject = ( tmpPaths, object, state = {} ): Object => {
  const paths   = tmpPaths.concat();
  const key     = paths.pop();
  return pushSamePath( paths, { [key]: object }, state );
};

const separate = ( value, depth, separators: Separators, paths: string[] = [], state: any = {} ) => {
  if ( isString( value ) || isArray( value ) ) {
    return getObject( paths, value, state );
  } else if ( isObject( value ) ) {
    if ( getObjectDepth( value ) <= depth ) {
      return pushSamePath( paths, removeComment( value, separators.comment.prefix, separators.comment.suffix ), state );
    }
    Object.keys( value ).forEach( key => {
      if ( hasPrefixSuffix( key, separators.comment.prefix, separators.comment.suffix ) ) {
        return;
      }
      paths.push( key );
      state = separate( value[key], depth, separators, paths, state );
      paths.pop();
    } );
  }
  return state;
};

export default function ( object, depth: Options['depth'], separators: Separators ): Results {
  const objects = separate( object, depth, separators );
  return Object.keys( objects ).reduce( ( state: Results, path ) => {
    const list  = objects[path];
    if ( !list.length ) {
      return state;
    }
    return state.concat( { path, object: getMerged( list ) } )
  }, [] );
}