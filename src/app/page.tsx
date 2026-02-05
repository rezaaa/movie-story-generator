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
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-primary/10 rounded-full blur-3xl -translate-y-1/2" />

        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 pt-12 sm:pt-20 pb-12 sm:pb-16">
          {/* Logo & Title */}
          <div className="text-center mb-8 sm:mb-12">
            <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-primary to-primary/50 mb-4 sm:mb-6 shadow-lg shadow-primary/25">
              <Clapperboard className="size-8 sm:size-10 text-primary-foreground" />
            </div>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-3 sm:mb-4 bg-gradient-to-r from-foreground via-foreground to-foreground/70 bg-clip-text leading-tight">
              Story Generator
            </h1>
            <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto px-4 sm:px-0">
              Create stunning Instagram stories and social media posts from your favorite movies and TV series
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar onSelect={setSelectedMovie} />
        </div>
      </div>

      {/* Trending Section */}
      <TrendingSection onSelect={setSelectedMovie} />

      {/* Footer */}
      <footer className="border-t border-border mt-16 py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()}{' - '}
            Created by{' '}
            <a
              href="https://x.com/rezamahmoudii"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
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
