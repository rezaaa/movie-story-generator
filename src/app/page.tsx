"use client"

import { useState } from 'react'
import { Clapperboard } from 'lucide-react'
import { SearchBar } from '@/components/SearchBar'
import { TrendingSection } from '@/components/TrendingSection'
import { StoryEditor } from '@/components/StoryEditor'
import { TMDBMovie } from '@/types/tmdb'

export default function Home() {
  const [selectedMovie, setSelectedMovie] = useState<TMDBMovie | null>(null)

  return (
    <main className="min-h-screen bg-background overflow-x-hidden flex flex-col">
      {/* Hero Section - fills remaining space if content is short */}
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

          {/* Search Bar */}
          <SearchBar onSelect={setSelectedMovie} />
        </div>
      </div>

      {/* Trending Section */}
      <TrendingSection onSelect={setSelectedMovie} />

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

      {/* Story Editor Modal */}
      {selectedMovie && (
        <StoryEditor
          movie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      )}
    </main>
  )
}
