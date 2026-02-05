"use client"

import { useState, useEffect, useRef } from 'react'
import { Search, Film, Tv, Loader2 } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { useDebounce } from '@/hooks/useDebounce'
import { searchMulti, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'
import { TMDBMovie } from '@/types/tmdb'

interface SearchBarProps {
  onSelect: (movie: TMDBMovie) => void
}

export function SearchBar({ onSelect }: SearchBarProps) {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<TMDBMovie[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const debouncedQuery = useDebounce(query, 300)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    async function search() {
      if (!debouncedQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const data = await searchMulti(debouncedQuery)
        setResults(data.slice(0, 8))
      } catch (error) {
        console.error('Search error:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }

    search()
  }, [debouncedQuery])

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSelect = (movie: TMDBMovie) => {
    onSelect(movie)
    setQuery('')
    setResults([])
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl mx-auto z-50">
      <div className="relative">
        <Search className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 size-5 sm:size-6 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Search movies or TV series..."
          value={query}
          onChange={(e) => {
            setQuery(e.target.value)
            setIsOpen(true)
          }}
          onFocus={() => setIsOpen(true)}
          className="h-12 sm:h-16 pl-12 sm:pl-14 pr-12 text-lg sm:text-xl font-semibold rounded-xl sm:rounded-2xl bg-card border-2 border-border/50 focus:border-primary/50 placeholder:font-normal placeholder:text-muted-foreground/60"
        />
        {isLoading && (
          <Loader2 className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 size-5 sm:size-6 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border border-border rounded-xl shadow-2xl z-[100]">
          <div className="max-h-[300px] sm:max-h-[400px] overflow-y-auto rounded-xl">
            {results.map((item) => (
              <button
                key={item.id}
                onClick={() => handleSelect(item)}
                className="w-full flex items-center gap-3 sm:gap-4 p-3 hover:bg-accent/50 transition-colors text-left"
              >
                <div className="relative w-10 h-14 sm:w-12 sm:h-16 rounded-lg overflow-hidden bg-muted shrink-0">
                  {item.poster_path ? (
                    <img
                      src={getImageUrl(item.poster_path, 'w92')}
                      alt={getTitle(item)}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.media_type === 'tv' ? (
                        <Tv className="size-4 sm:size-5 text-muted-foreground" />
                      ) : (
                        <Film className="size-4 sm:size-5 text-muted-foreground" />
                      )}
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold truncate text-sm sm:text-base">{getTitle(item)}</span>
                    <span className="shrink-0 px-2 py-0.5 text-xs font-medium rounded-full bg-primary/10 text-primary">
                      {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground">
                    <span>{getReleaseYear(item)}</span>
                    {item.vote_average > 0 && (
                      <>
                        <span>•</span>
                        <span className="text-yellow-500">★ {item.vote_average.toFixed(1)}</span>
                      </>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
