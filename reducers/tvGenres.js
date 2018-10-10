import { 
  FETCH_TV_GENRES_REQUESTED,
  FETCH_TV_GENRES_SUCCESS,
  FETCH_TV_GENRES_FAILED
} from '../actions/names';

const tvGenres = (state = [], action) => {
  switch (action.type) {
    case FETCH_TV_GENRES_REQUESTED:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_TV_GENRES_SUCCESS:
      return {
        ...state,
        results: action,
        fetching: false,
      }
    case FETCH_TV_GENRES_FAILED:
      return {
        ...state,
        fetching: false,
      }
    default:
      return state
  }
}

export default tvGenres;