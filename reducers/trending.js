import { 
  FETCH_TRENDING_REQUESTED,
  FETCH_TRENDING_SUCCESS,
  FETCH_TRENDING_FAILED
} from '../actions/names';

const trending = (state = [], action) => {
  switch (action.type) {
    case FETCH_TRENDING_REQUESTED:
      return {
        ...state,
        fetching: true,
      }
    case FETCH_TRENDING_SUCCESS:
      return {
        ...state,
        results: action,
        fetching: false,
      }
    case FETCH_TRENDING_FAILED:
      return {
        ...state,
        fetching: false,
      }
    default:
      return state
  }
}

export default trending;