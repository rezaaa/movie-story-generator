import {FETCH_MOVIES_REQUESTED, FETCH_MOVIES_SUCCESS, FETCH_MOVIES_FAILED, CLEAR_RESULTS} from './names';

export function fetchMoviesRequest(title) {
  return {
    type: FETCH_MOVIES_REQUESTED,
    movieTitle: title,
  }
}

export function fetchMoviesSuccess(payload) {
  return {
    type: FETCH_MOVIES_SUCCESS,
    payload,
  }
}

export function fetchMoviesFailed(payload) {
  return {
    type: FETCH_MOVIES_FAILED,
    payload,
  }
}

export function clearResults() {
  return {
    type: CLEAR_RESULTS,
  }
}