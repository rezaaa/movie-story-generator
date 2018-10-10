import { call, put, throttle, takeLatest } from 'redux-saga/effects';
import axios from 'axios';
import {moviesApiBase, apiKey} from '../common/urls';

function fetchTrendingRequest() {
  return axios
    .get(`${moviesApiBase}/3/trending/movie/day?api_key=${apiKey}`)
    .then(response => response)
    .catch(error => ({ error }));
}

function* fetchTrending() {
   try {
      const trends = yield call(fetchTrendingRequest);
      yield put({type: "FETCH_TRENDING_SUCCESS", trends: trends.data.results});
    } catch (e) {
      yield put({type: "FETCH_TRENDING_FAILED", message: e.message});
    }
  }

 export default function* fetchTrendingSaga() {
  yield takeLatest("FETCH_TRENDING_REQUESTED", fetchTrending);
}