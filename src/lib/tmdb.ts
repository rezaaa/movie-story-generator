import { TMDBMovie, TMDBSearchResult, MovieDetails } from '@/types/tmdb'

const TMDB_API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY
const TMDB_BASE_URL = process.env.NEXT_PUBLIC_TMDB_API_URL
export const TMDB_IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_URL

export async function searchMulti(query: string): Promise<TMDBMovie[]> {
  if (!query.trim()) return []

  const res = await fetch(
    `${TMDB_BASE_URL}/search/multi?api_key=${TMDB_API_KEY}&query=${encodeURIComponent(query)}&include_adult=false`
  )

  if (!res.ok) throw new Error('Failed to search')

  const data: TMDBSearchResult = await res.json()
  return data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  )
}

export async function getTrending(): Promise<TMDBMovie[]> {
  const res = await fetch(
    `${TMDB_BASE_URL}/trending/all/week?api_key=${TMDB_API_KEY}`
  )

  if (!res.ok) throw new Error('Failed to fetch trending')

  const data: TMDBSearchResult = await res.json()
  return data.results.filter(
    (item) => item.media_type === 'movie' || item.media_type === 'tv'
  )
}

export async function getMovieDetails(id: number, type: 'movie' | 'tv'): Promise<MovieDetails> {
  const res = await fetch(
    `${TMDB_BASE_URL}/${type}/${id}?api_key=${TMDB_API_KEY}`
  )

  if (!res.ok) throw new Error('Failed to fetch details')

  return res.json()
}

export function getImageUrl(path: string | null, size: string = 'w500'): string {
  if (!path) return '/placeholder.svg'
  return `${TMDB_IMAGE_BASE}/${size}${path}`
}

export function getTitle(item: TMDBMovie): string {
  return item.title || item.name || item.original_title || item.original_name || 'Unknown'
}

export function getReleaseYear(item: TMDBMovie): string {
  const date = item.release_date || item.first_air_date
  return date ? new Date(date).getFullYear().toString() : ''
}

export interface DiscoverOptions {
  genres?: number[]
  minRating?: number
  sortBy?: 'popularity.desc' | 'vote_average.desc' | 'release_date.desc'
  page?: number
}

export async function discoverMovies(options: DiscoverOptions = {}): Promise<TMDBMovie[]> {
  const params = new URLSearchParams({
    api_key: TMDB_API_KEY || '',
    include_adult: 'false',
    'vote_count.gte': '100',
    sort_by: options.sortBy || 'popularity.desc',
    page: (options.page || 1).toString(),
  })

  if (options.genres && options.genres.length > 0) {
    params.append('with_genres', options.genres.join(','))
  }

  if (options.minRating) {
    params.append('vote_average.gte', options.minRating.toString())
  }

  const res = await fetch(`${TMDB_BASE_URL}/discover/movie?${params}`)

  if (!res.ok) throw new Error('Failed to discover movies')

  const data: TMDBSearchResult = await res.json()
  return data.results.map((movie) => ({ ...movie, media_type: 'movie' as const }))
}

export const GENRE_MAP: Record<number, string> = {
  28: 'Action',
  12: 'Adventure',
  16: 'Animation',
  35: 'Comedy',
  80: 'Crime',
  99: 'Documentary',
  18: 'Drama',
  10751: 'Family',
  14: 'Fantasy',
  36: 'History',
  27: 'Horror',
  10402: 'Music',
  9648: 'Mystery',
  10749: 'Romance',
  878: 'Sci-Fi',
  10770: 'TV Movie',
  53: 'Thriller',
  10752: 'War',
  37: 'Western',
}
