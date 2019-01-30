import { getFileName } from '../utils'

export default function ( files ) {
  return files.reduce( ( state, file ) => {
    const filename    = getFileName( file )
    if ( !state[filename] ) {
      state[filename] = [];
    }
    state[filename].push( file );
    return state;
  }, {} );
}