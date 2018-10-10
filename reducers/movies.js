import {FETCH_MOVIES_REQUESTED, FETCH_MOVIES_SUCCESS, FETCH_MOVIES_FAILED, CLEAR_RESULTS} from '../actions/names';


const movies = (state = [], action) => {
  switch (action.type) {
    case FETCH_MOVIES_REQUESTED:
      return {
        ...state,
        movieTitle: action.movieTitle,
        fetching: true,
      }
    case FETCH_MOVIES_SUCCESS:
      return {
        ...state,
        results: action.movies && action.movies.data,
        fetching: false,
      }
    case FETCH_MOVIES_FAILED:
      return {
        ...state,
        fetching: false,
      }
    case CLEAR_RESULTS:
      return {
        ...state,
        movieTitle: '',
        fetching: false,
        results: null,
      }
    default:
      return state
  }
}

export default movies;