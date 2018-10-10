import fetchMoviesSaga from './fetchMovies';
import fetchMovieGenresSaga from './fetchMovieGenres';
import fetchTvGenresSaga from './fetchTvGenres';
import fetchTrendingSaga from './fetchTrending';

export default function* rootSaga() {
  yield [
    fetchMovieGenresSaga(),
    fetchTvGenresSaga(),
    fetchMoviesSaga(),
    fetchTrendingSaga(),
  ]
}