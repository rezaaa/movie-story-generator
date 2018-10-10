import { call, put, throttle, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {moviesApiBase, apiKey} from '../common/urls';

function fetchTvGenresRequest() {
  return axios
    .get(`${moviesApiBase}/3/genre/tv/list?api_key=${apiKey}`)
    .then(response => response)
    .catch(error => ({ error }));
}

function* fetchTvGenres() {
   try {
      const genres = yield call(fetchTvGenresRequest);
      yield put({type: "FETCH_TV_GENRES_SUCCESS", genres: genres.data.genres});
    } catch (e) {
      yield put({type: "FETCH_TV_GENRES_FAILED", message: e.message});
    }
  }

 export default function* fetchTvGenresSaga() {
  yield takeLatest("FETCH_TV_GENRES_REQUESTED", fetchTvGenres);
}