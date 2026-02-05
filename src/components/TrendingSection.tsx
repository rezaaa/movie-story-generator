"use client"

import { useEffect, useState } from 'react'
import { ChevronLeft, ChevronRight, TrendingUp, Film, Tv } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi
} from '@/components/ui/carousel'
import { getTrending, getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'
import { TMDBMovie } from '@/types/tmdb'

interface TrendingSectionProps {
  onSelect: (movie: TMDBMovie) => void
}

export function TrendingSection({ onSelect }: TrendingSectionProps) {
  const [trending, setTrending] = useState<TMDBMovie[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [api, setApi] = useState<CarouselApi>()

  useEffect(() => {
    async function fetchTrending() {
      try {
        const data = await getTrending()
        setTrending(data)
      } catch (error) {
        console.error('Failed to fetch trending:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchTrending()
  }, [])

  if (isLoading) {
    return (
      <div className="mt-4 sm:mt-6 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <TrendingUp className="size-4 sm:size-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold">Trending This Week</h2>
        </div>
        <div className="flex gap-2.5 sm:gap-3 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[130px] sm:w-[160px] h-[195px] sm:h-[240px] rounded-lg bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-4 sm:mt-6">
      <div className="flex items-center justify-between mb-3 sm:mb-4 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 sm:size-5 text-primary" />
          <h2 className="text-base sm:text-lg font-bold">Trending This Week</h2>
        </div>
        <div className="flex gap-1.5">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            className="rounded-full size-8 sm:size-9"
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            className="rounded-full size-8 sm:size-9"
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full select-none"
      >
        <CarouselContent className="-ml-2.5 sm:-ml-3">
          {/* Spacer for start padding */}
          <CarouselItem className="pl-0 basis-auto">
            <div className="w-4 sm:w-6 lg:w-8" aria-hidden="true" />
          </CarouselItem>
          {trending.map((item) => (
            <CarouselItem key={item.id} className="pl-2.5 sm:pl-3 basis-auto">
              <button
                onClick={() => onSelect(item)}
                className="group w-[130px] sm:w-[160px] active:scale-[0.98] transition-transform"
              >
                <div className="relative aspect-[2/3] rounded-lg overflow-hidden bg-muted mb-1.5 sm:mb-2">
                  {item.poster_path ? (
                    <img
                      src={getImageUrl(item.poster_path, 'w342')}
                      alt={getTitle(item)}
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      {item.media_type === 'tv' ? (
                        <Tv className="size-8 sm:size-10 text-muted-foreground" />
                      ) : (
                        <Film className="size-8 sm:size-10 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-1.5 right-1.5">
                    <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded bg-black/60 text-white backdrop-blur-sm">
                      {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  {item.vote_average > 0 && (
                    <div className="absolute top-1.5 left-1.5">
                      <span className="px-1.5 py-0.5 text-[10px] sm:text-xs font-semibold rounded bg-yellow-500/90 text-black">
                        ★ {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-xs sm:text-sm truncate text-left">
                  {getTitle(item)}
                </h3>
                <p className="text-[10px] sm:text-xs text-muted-foreground text-left">{getReleaseYear(item)}</p>
              </button>
            </CarouselItem>
          ))}
          {/* Spacer for end padding */}
          <CarouselItem className="pl-2.5 sm:pl-3 basis-auto">
            <div className="w-1 sm:w-2 lg:w-4 shrink-0" aria-hidden="true" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
