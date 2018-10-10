import { combineReducers } from 'redux';
import movies from './movies';
import movieGenres from './movieGenres';
import tvGenres from './tvGenres';
import trending from './trending';

const rootReducer = combineReducers({
  movieGenres,
  tvGenres,
  movies,
  trending,
})

export default rootReducer