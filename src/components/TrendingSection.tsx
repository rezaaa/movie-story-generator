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
      <div className="mt-12 px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-6">
          <TrendingUp className="size-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </div>
        <div className="flex gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="shrink-0 w-[180px] h-[270px] rounded-xl bg-muted animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="mt-12">
      <div className="flex items-center justify-between mb-6 px-4 sm:px-6 lg:px-8 container mx-auto">
        <div className="flex items-center gap-3">
          <TrendingUp className="size-6 text-primary" />
          <h2 className="text-2xl font-bold">Trending This Week</h2>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollPrev()}
            className="rounded-full"
          >
            <ChevronLeft className="size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => api?.scrollNext()}
            className="rounded-full"
          >
            <ChevronRight className="size-5" />
          </Button>
        </div>
      </div>

      <Carousel
        setApi={setApi}
        opts={{
          align: 'start',
          dragFree: true,
        }}
        className="w-full"
      >
        <CarouselContent className="-ml-4">
          {/* Spacer for start padding */}
          <CarouselItem className="pl-0 basis-auto">
            <div className="w-4 sm:w-6 lg:w-8" aria-hidden="true" />
          </CarouselItem>
          {trending.map((item) => (
            <CarouselItem key={item.id} className="pl-4 basis-auto">
              <button
                onClick={() => onSelect(item)}
                className="group w-[180px]"
              >
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-muted mb-3">
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
                        <Tv className="size-12 text-muted-foreground" />
                      ) : (
                        <Film className="size-12 text-muted-foreground" />
                      )}
                    </div>
                  )}
                  <div className="absolute top-2 right-2">
                    <span className="px-2 py-1 text-xs font-semibold rounded-md bg-black/60 text-white backdrop-blur-sm">
                      {item.media_type === 'tv' ? 'TV' : 'Movie'}
                    </span>
                  </div>
                  {item.vote_average > 0 && (
                    <div className="absolute top-2 left-2">
                      <span className="px-2 py-1 text-xs font-semibold rounded-md bg-yellow-500/90 text-black">
                        ★ {item.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
                <h3 className="font-semibold text-sm truncate text-left">
                  {getTitle(item)}
                </h3>
                <p className="text-xs text-muted-foreground text-left">{getReleaseYear(item)}</p>
              </button>
            </CarouselItem>
          ))}
          {/* Spacer for end padding */}
          <CarouselItem className="pl-4 basis-auto">
            <div className="w-0 sm:w-2 lg:w-4 shrink-0" aria-hidden="true" />
          </CarouselItem>
        </CarouselContent>
      </Carousel>
    </div>
  )
}
