"use client"

import { useState } from 'react'
import { Clapperboard, Film, Plus, X, Sparkles, Wand2, Loader2, Check, Trash2 } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { TrendingSection } from '@/components/TrendingSection'
import { StoryEditor } from '@/components/StoryEditor'
import { MarathonEditor } from '@/components/MarathonEditor'
import { Button } from '@/components/ui/button'
import { TMDBMovie } from '@/types/tmdb'
import { getImageUrl, getTitle, discoverMovies, GENRE_MAP } from '@/lib/tmdb'

const SUGGESTION_PRESETS = [
  { id: 'action', name: 'Action Pack', genres: [28, 53], minRating: 7 },
  { id: 'comedy', name: 'Comedy Night', genres: [35], minRating: 6.5 },
  { id: 'scifi', name: 'Sci-Fi Marathon', genres: [878], minRating: 7 },
  { id: 'horror', name: 'Horror Fest', genres: [27], minRating: 6.5 },
  { id: 'drama', name: 'Award Winners', genres: [18], minRating: 8 },
  { id: 'animation', name: 'Animation', genres: [16], minRating: 7 },
]

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)
  const [marathonMode, setMarathonMode] = useState(false)
  const [marathonMovies, setMarathonMovies] = useState<TMDBMovie[]>([])
  const [showMarathonEditor, setShowMarathonEditor] = useState(false)
  const [showSuggestionPanel, setShowSuggestionPanel] = useState(false)
  const [isSuggestionClosing, setIsSuggestionClosing] = useState(false)
  const [selectedGenres, setSelectedGenres] = useState<number[]>([])
  const [minRating, setMinRating] = useState(7)
  const [movieCount, setMovieCount] = useState(6)
  const [isLoadingSuggestions, setIsLoadingSuggestions] = useState(false)

  const handleMovieSelect = (movie: TMDBMovie) => {
    if (marathonMode) {
      if (!marathonMovies.find((m) => m.id === movie.id) && marathonMovies.length < 6) {
        setMarathonMovies([...marathonMovies, movie])
      }
    } else {
      setSelectedMovie(movie)
    }
  }

  const handleRemoveFromMarathon = (id: number) => {
    setMarathonMovies(marathonMovies.filter((m) => m.id !== id))
  }

  const handleClearMarathon = () => {
    setMarathonMovies([])
  }

  const handleOpenMarathonEditor = () => {
    if (marathonMovies.length >= 2) {
      setShowMarathonEditor(true)
    }
  }

  const handleCloseMarathonEditor = () => {
    setShowMarathonEditor(false)
  }

  const handleOpenSuggestionPanel = () => {
    setShowSuggestionPanel(true)
  }

  const handleCloseSuggestionPanel = () => {
    setIsSuggestionClosing(true)
    setTimeout(() => {
      setShowSuggestionPanel(false)
      setIsSuggestionClosing(false)
    }, 400)
  }

  const handlePresetClick = (preset: typeof SUGGESTION_PRESETS[0]) => {
    setSelectedGenres(preset.genres)
    setMinRating(preset.minRating)
  }

  const toggleGenre = (genreId: number) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId) ? prev.filter((g) => g !== genreId) : [...prev, genreId]
    )
  }

  const handleGenerateSuggestions = async () => {
    setIsLoadingSuggestions(true)
    try {
      const movies = await discoverMovies({
        genres: selectedGenres.length > 0 ? selectedGenres : undefined,
        minRating,
        sortBy: 'popularity.desc',
      })

      // Shuffle and pick random movies
      const shuffled = movies.sort(() => Math.random() - 0.5)
      const selected = shuffled.slice(0, Math.min(movieCount, 6))

      setMarathonMovies(selected)
      handleCloseSuggestionPanel()
    } catch (error) {
      console.error('Failed to get suggestions:', error)
    } finally {
      setIsLoadingSuggestions(false)
    }
  }

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      {/* Hero Section */}
      <div className="relative flex-1 flex flex-col min-h-0">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] sm:w-[600px] h-[400px] sm:h-[600px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12 pb-4 sm:pb-8 flex-1 flex flex-col justify-center">
          {/* Logo & Title */}
          <div className="text-center mb-4 sm:mb-8">
            <div className="inline-flex items-center justify-center w-12 h-12 sm:w-16 sm:h-16 rounded-xl sm:rounded-2xl bg-gradient-to-br from-primary to-primary/50 mb-3 sm:mb-4 shadow-lg shadow-primary/25">
              <Clapperboard className="size-6 sm:size-8 text-primary-foreground" />
            </div>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-2 sm:mb-3 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text leading-tight">
              Story Generator
            </h1>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl mx-auto px-2 sm:px-0">
              Create stunning Instagram stories from your favorite movies and TV series
            </p>
            <a
              href="https://github.com/rezaaa/movie-story-generator"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 mt-3 px-3 py-1.5 rounded-full bg-card border border-border hover:bg-accent/50 active:bg-accent/70 transition-colors text-xs sm:text-sm"
            >
              <svg className="size-4" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/>
              </svg>
              <span className="font-medium">Star on GitHub</span>
              <img
                src="https://img.shields.io/github/stars/rezaaa/movie-story-generator?style=social&label="
                alt="GitHub stars"
                className="h-4"
              />
            </a>
          </div>

          {/* Mode Toggle */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1 p-1 rounded-lg bg-card border border-border">
              <Button
                variant={!marathonMode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMarathonMode(false)}
                className="gap-2"
              >
                <Film className="size-4" />
                Single Story
              </Button>
              <Button
                variant={marathonMode ? 'default' : 'ghost'}
                size="sm"
                onClick={() => setMarathonMode(true)}
                className="gap-2"
              >
                <Sparkles className="size-4" />
                Marathon
              </Button>
            </div>
          </div>

          {/* Search Bar with Suggest Button */}
          <div className="relative">
            <div className="flex items-center gap-2 max-w-2xl mx-auto">
              <div className="flex-1">
                <SearchBar onSelect={handleMovieSelect} />
              </div>
              {marathonMode && (
                <Button
                  onClick={handleOpenSuggestionPanel}
                  variant="outline"
                  className="h-12 sm:h-16 px-4 sm:px-6 rounded-xl sm:rounded-2xl border-2 border-primary/50 hover:border-primary hover:bg-primary/10 gap-2 shrink-0"
                >
                  <Wand2 className="size-5" />
                  <span className="hidden sm:inline">Suggest</span>
                </Button>
              )}
            </div>
            <div className="min-h-[20px] sm:min-h-[24px] mt-2">
              {marathonMode && (
                <p className="text-center text-xs sm:text-sm text-muted-foreground">
                  Search movies or use <span className="text-primary font-medium">Suggest</span> to auto-pick ({marathonMovies.length}/6)
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Trending Section */}
      <TrendingSection onSelect={handleMovieSelect} />

      {/* Footer */}
      <footer className="border-t border-border mt-4 sm:mt-8 py-3 sm:py-4 mt-auto">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-xs sm:text-sm text-muted-foreground">
            © {new Date().getFullYear()}{' - '}
            Created by{' '}
            <a
              href="https://x.com/rezamahmoudii"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground active:text-foreground transition-colors"
            >
              Reza Mahmoudi
            </a>
          </p>
        </div>
      </footer>

      {/* Floating Marathon Panel */}
      <div className={`fixed left-1/2 -translate-x-1/2 z-40 w-[95%] max-w-xl transition-all duration-400 [transition-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
        marathonMode && marathonMovies.length > 0 
          ? 'translate-y-0 opacity-100' 
          : 'md:translate-y-12 -translate-y-12 opacity-0 pointer-events-none'
      } top-4 md:top-auto md:bottom-4`}>
        <div className="bg-card border border-border rounded-2xl shadow-2xl overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-muted/30">
              <div className="flex items-center gap-2">
                <Sparkles className="size-4 text-primary" />
                <span className="font-semibold">Marathon</span>
                <span className="text-xs text-muted-foreground">({marathonMovies.length}/6)</span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearMarathon}
                  className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8 gap-1.5 px-3"
                >
                  <Trash2 className="size-3.5" />
                  Clear
                </Button>
                <Button
                  size="sm"
                  onClick={handleOpenMarathonEditor}
                  disabled={marathonMovies.length < 2}
                  className="h-8"
                >
                  Create Image
                </Button>
              </div>
            </div>

            {/* Movie Thumbnails - Bigger posters */}
            <div className="flex gap-3 p-4 overflow-x-auto">
              {marathonMovies.map((movie, index) => (
                <div key={movie.id} className="relative shrink-0 group">
                  <div
                    className="w-24 sm:w-28 rounded-xl overflow-hidden bg-muted border-2 border-transparent group-hover:border-primary transition-all duration-300"
                    style={{ aspectRatio: '2/3' }}
                  >
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, 'w185')}
                        alt={getTitle(movie)}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Film className="size-6 text-muted-foreground" />
                      </div>
                    )}
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-black/40 opacity-0 md:group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <button
                        onClick={() => handleRemoveFromMarathon(movie.id)}
                        className="w-10 h-10 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center shadow-lg transform translate-y-4 md:group-hover:translate-y-0 transition-all duration-300"
                      >
                        <Trash2 className="size-5" />
                      </button>
                    </div>
                    {/* Mobile Remove Button - Always visible on small screens */}
                    <button
                      onClick={() => handleRemoveFromMarathon(movie.id)}
                      className="md:hidden absolute top-1 right-1 w-8 h-8 rounded-full bg-destructive/90 text-destructive-foreground flex items-center justify-center shadow-md backdrop-blur-sm z-20"
                    >
                      <Trash2 className="size-4" />
                    </button>
                  </div>
                  {/* Order badge */}
                  <div className="absolute -top-2 -left-2 w-7 h-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-lg border-2 border-card z-10 transition-transform group-hover:scale-110">
                    {index + 1}
                  </div>
                </div>
              ))}

              {/* Add more placeholder */}
              {marathonMovies.length < 6 && (
                <div
                  className="w-24 sm:w-28 rounded-xl border-2 border-dashed border-border flex items-center justify-center shrink-0"
                  style={{ aspectRatio: '2/3' }}
                >
                  <Plus className="size-6 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Hint */}
            <div className="h-7 mb-1 flex items-center justify-center">
              {marathonMovies.length < 2 ? (
                <p className="text-xs text-muted-foreground text-center animate-in fade-in slide-in-from-bottom-1 duration-300">
                  Add at least 2 movies to create a marathon image
                </p>
              ) : null}
            </div>
          </div>
        </div>

      {/* Suggestion Panel Modal */}
      {showSuggestionPanel && (
        <div 
          className={`fixed inset-0 z-50 flex items-center md:items-center items-end justify-center p-0 md:p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-500 ${
            isSuggestionClosing ? 'animate-out fade-out duration-400' : ''
          }`}
          onClick={(e) => {
            if (e.target === e.currentTarget) handleCloseSuggestionPanel()
          }}
        >
          <div 
            className={`bg-card border-x border-t md:border border-border rounded-t-[32px] md:rounded-2xl shadow-2xl w-full max-w-lg max-h-[92vh] md:max-h-[85vh] overflow-hidden flex flex-col animate-in slide-in-from-bottom-full md:zoom-in-95 md:slide-in-from-bottom-4 duration-500 [animation-timing-function:cubic-bezier(0.16,1,0.3,1)] ${
              isSuggestionClosing ? 'animate-out md:zoom-out-95 slide-out-to-bottom-full md:slide-out-to-bottom-4 duration-400' : ''
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Grabber for Mobile */}
            <div className="md:hidden flex justify-center pt-3 pb-1">
              <div className="w-12 h-1.5 rounded-full bg-border" />
            </div>

            {/* Header */}
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <div className="flex items-center gap-2">
                <Wand2 className="size-5 text-primary" />
                <h2 className="text-lg font-bold">Smart Suggestions</h2>
              </div>
              <Button variant="ghost" size="icon" onClick={handleCloseSuggestionPanel}>
                <X className="size-5" />
              </Button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-5 space-y-6">
              {/* Quick Presets */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Quick Presets</h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {SUGGESTION_PRESETS.map((preset) => (
                    <button
                      key={preset.id}
                      onClick={() => handlePresetClick(preset)}
                      className={`p-3 rounded-lg border text-left transition-all hover:border-primary/50 ${
                        selectedGenres.length > 0 &&
                        preset.genres.every((g) => selectedGenres.includes(g))
                          ? 'border-primary bg-primary/10'
                          : 'border-border'
                      }`}
                    >
                      <span className="font-medium text-sm">{preset.name}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        Rating {preset.minRating}+
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* Genre Selection */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Genres</h3>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(GENRE_MAP).map(([id, name]) => {
                    const genreId = parseInt(id)
                    const isSelected = selectedGenres.includes(genreId)
                    return (
                      <button
                        key={id}
                        onClick={() => toggleGenre(genreId)}
                        className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                          isSelected
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted hover:bg-muted/80'
                        }`}
                      >
                        {isSelected && <Check className="size-3 inline mr-1" />}
                        {name}
                      </button>
                    )
                  })}
                </div>
              </div>

              {/* Min Rating */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Minimum Rating: <span className="text-primary">{minRating}</span>
                </h3>
                <input
                  type="range"
                  min="5"
                  max="9"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full accent-primary"
                />
                <div className="flex justify-between text-xs text-muted-foreground mt-1">
                  <span>5.0</span>
                  <span>9.0</span>
                </div>
              </div>

              {/* Movie Count */}
              <div>
                <h3 className="text-sm font-semibold mb-3">
                  Number of Movies: <span className="text-primary">{movieCount}</span>
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between px-1">
                    {[2, 3, 4, 5, 6].map((num) => (
                      <button
                        key={num}
                        onClick={() => setMovieCount(num)}
                        className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                          movieCount === num
                            ? 'bg-primary text-primary-foreground scale-110'
                            : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="6"
                    step="1"
                    value={movieCount}
                    onChange={(e) => setMovieCount(parseInt(e.target.value))}
                    className="w-full accent-primary"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="p-5 border-t border-border">
              <Button
                onClick={handleGenerateSuggestions}
                disabled={isLoadingSuggestions}
                className="w-full h-12"
                size="lg"
              >
                {isLoadingSuggestions ? (
                  <>
                    <Loader2 className="size-5 mr-2 animate-spin" />
                    Finding Movies...
                  </>
                ) : (
                  <>
                    <Wand2 className="size-5 mr-2" />
                    Generate {movieCount} Movies
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Story Editor Modal */}
      {selectedMovie && (
        <StoryEditor
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}

      {/* Marathon Editor Modal */}
      {showMarathonEditor && marathonMovies.length >= 2 && (
        <MarathonEditor
          movies={marathonMovies}
          onClose={handleCloseMarathonEditor}
          onRemoveMovie={handleRemoveFromMarathon}
        />
      )}
    </main>
  )
}
