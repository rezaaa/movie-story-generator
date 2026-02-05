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
