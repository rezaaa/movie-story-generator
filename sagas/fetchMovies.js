import { call, put, throttle, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {moviesApiBase, apiKey} from '../common/urls';

function fetchMoviesRequest(title) {
  if(title.length > 0) {
    return axios
      .get(`${moviesApiBase}/3/search/multi?api_key=${apiKey}&language=en-US&page=1&include_adult=false&query=${title}`)
      .then(response => response)
      .catch(error => ({ error }));
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(() => resolve(true), ms))
} 

function* fetchMovies(action) {
  yield delay(200)
   try {
      const movies = yield call(fetchMoviesRequest, action.movieTitle);
      yield put({type: "FETCH_MOVIES_SUCCESS", movies});
    } catch (e) {
      yield put({type: "FETCH_MOVIES_FAILED", message: e.message});
    }
  }

 export default function* fetchMoviesSaga() {
  yield takeLatest("FETCH_MOVIES_REQUESTED", fetchMovies);
}