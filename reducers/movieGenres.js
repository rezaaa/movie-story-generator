import { 
  FETCH_MOVIE_GENRES_REQUESTED,
  FETCH_MOVIE_GENRES_SUCCESS,
  FETCH_MOVIE_GENRES_FAILED,
} from '../actions/names';

const movieGenres = (state = [], action) => {
  switch (action.type) {
    case FETCH_MOVIE_GENRES_REQUESTED:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_MOVIE_GENRES_SUCCESS:
      return {
        ...state,
        results: action,
        fetching: false,
      }
    case FETCH_MOVIE_GENRES_FAILED:
      return {
        ...state,
        fetching: false,
      }
    default:
      return state
  }
}

export default movieGenres;