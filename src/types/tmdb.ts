export interface TMDBMovie {
  id: number
  title: string
  name?: string
  original_title?: string
  original_name?: string
  overview: string
  poster_path: string | null
  backdrop_path: string | null
  release_date?: string
  first_air_date?: string
  vote_average: number
  vote_count: number
  popularity: number
  genre_ids: number[]
  media_type?: 'movie' | 'tv'
}

export interface TMDBSearchResult {
  page: number
  results: TMDBMovie[]
  total_pages: number
  total_results: number
}

export interface TMDBConfiguration {
  images: {
    base_url: string
    secure_base_url: string
    backdrop_sizes: string[]
    logo_sizes: string[]
    poster_sizes: string[]
    profile_sizes: string[]
    still_sizes: string[]
  }
}

export interface Genre {
  id: number
  name: string
}

export interface MovieDetails extends TMDBMovie {
  genres: Genre[]
  runtime?: number
  episode_run_time?: number[]
  tagline?: string
  status: string
  production_companies: {
    id: number
    name: string
    logo_path: string | null
  }[]
}
