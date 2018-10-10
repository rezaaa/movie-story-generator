import {
  FETCH_MOVIE_GENRES_REQUESTED,
  FETCH_MOVIE_GENRES_SUCCESS,
  FETCH_MOVIE_GENRES_FAILED,
  FETCH_TV_GENRES_REQUESTED,
  FETCH_TV_GENRES_SUCCESS,
  FETCH_TV_GENRES_FAILED
} from './names';

export function fetchMovieGenresRequest() {
  return {
    type: FETCH_MOVIE_GENRES_REQUESTED,
  }
}

export function fetchMovieGenresSuccess(payload) {
  return {
    type: FETCH_MOVIE_GENRES_SUCCESS,
    payload,
  }
}

export function fetchMovieGenresFailed(payload) {
  return {
    type: FETCH_MOVIE_GENRES_FAILED,
    payload,
  }
}

export function fetchTvGenresRequest() {
  return {
    type: FETCH_TV_GENRES_REQUESTED,
  }
}

export function fetchTvGenresSuccess(payload) {
  return {
    type: FETCH_TV_GENRES_SUCCESS,
    payload,
  }
}

export function fetchTvGenresFailed(payload) {
  return {
    type: FETCH_TV_GENRES_FAILED,
    payload,
  }
}