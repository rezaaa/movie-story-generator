import {FETCH_TRENDING_REQUESTED, FETCH_TRENDING_SUCCESS, FETCH_TRENDING_FAILED} from './names';

export function fetchTrendingRequest() {
  return {
    type: FETCH_TRENDING_REQUESTED,
  }
}

export function fetchTrendingSuccess(payload) {
  return {
    type: FETCH_TRENDING_SUCCESS,
    payload,
  }
}

export function fetchTrendingFailed(payload) {
  return {
    type: FETCH_TRENDING_FAILED,
    payload,
  }
}