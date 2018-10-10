import { call, put, throttle, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {moviesApiBase, apiKey} from '../common/urls';

function fetchMovieGenresRequest() {
  return axios
    .get(`${moviesApiBase}/3/genre/movie/list?api_key=${apiKey}`)
    .then(response => response)
    .catch(error => ({ error }));
}

function* fetchMovieGenres() {
   try {
      const genres = yield call(fetchMovieGenresRequest);
      yield put({type: "FETCH_MOVIE_GENRES_SUCCESS", genres: genres.data.genres});
    } catch (e) {
      yield put({type: "FETCH_MOVIE_GENRES_FAILED", message: e.message});
    }
  }

 export default function* fetchMovieGenresSaga() {
  yield takeLatest("FETCH_MOVIE_GENRES_REQUESTED", fetchMovieGenres);
}