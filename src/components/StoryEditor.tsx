"use client"

import { useState, useRef, useEffect } from 'react'
import { toPng } from 'html-to-image'
import { ChromePicker, ColorResult } from 'react-color'
import {
  X,
  Download,
  Share2,
  Star,
  Palette,
  Layout,
  Monitor,
  RotateCcw,
  Sparkles,
  ChevronDown,
  Settings2,
  Type,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Slider } from '@/components/ui/slider'
import { TMDBMovie, MovieDetails } from '@/types/tmdb'
import { getImageUrl, getTitle, getReleaseYear, getMovieDetails } from '@/lib/tmdb'
import { VerticalRectangle, HorizontalRectangle } from '@/components/icons/AspectRatioIcons'

interface StoryEditorProps {
  movie: TMDBMovie
  onClose: () => void
}

type Size = 'horizontal' | 'vertical'
type LayoutType = 'classic' | 'modern' | 'cinematic' | 'minimal' | 'glassmorphic' | 'split'
type ThemeType = 'light' | 'dark'
type FontType = 'default' | 'oswald' | 'cinzel' | 'bebas-neue' | 'righteous' | 'orbitron' | 'caveat'

const sizeConfig: Record<Size, { width: number; height: number; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  vertical: { width: 1080, height: 1920, label: 'Vertical', icon: VerticalRectangle },
  horizontal: { width: 1920, height: 1080, label: 'Horizontal', icon: HorizontalRectangle },
}

const layouts: Record<LayoutType, string> = {
  'classic': 'Classic',
  'modern': 'Modern',
  'cinematic': 'Cinematic',
  'minimal': 'Minimal',
  'glassmorphic': 'Glassmorphic',
  'split': 'Split',
}

const fonts: Record<FontType, { name: string; family: string; preview: string }> = {
  'default': {
    name: 'Inter',
    family: 'var(--font-inter), system-ui, sans-serif',
    preview: 'The Matrix'
  },
  'oswald': {
    name: 'Oswald',
    family: 'var(--font-oswald), sans-serif',
    preview: 'INCEPTION'
  },
  'cinzel': {
    name: 'Cinzel',
    family: 'var(--font-cinzel), serif',
    preview: 'Gladiator'
  },
  'bebas-neue': {
    name: 'Bebas Neue',
    family: 'var(--font-bebas-neue), sans-serif',
    preview: 'DUNE'
  },
  'righteous': {
    name: 'Righteous',
    family: 'var(--font-righteous), sans-serif',
    preview: 'MARVEL'
  },
  'orbitron': {
    name: 'Orbitron',
    family: 'var(--font-orbitron), monospace',
    preview: 'TRON'
  },
  'caveat': {
    name: 'Caveat',
    family: 'var(--font-caveat), cursive',
    preview: 'Indie Film'
  },
}

interface Preset {
  name: string
  layout: LayoutType
  accentColor: string
  font: FontType
}

const presets: Preset[] = [
  { name: 'Premiere', layout: 'cinematic', accentColor: '#f59e0b', font: 'default' },
  { name: 'Nostalgia', layout: 'classic', accentColor: '#ec4899', font: 'default' },
  { name: 'Neon', layout: 'modern', accentColor: '#a855f7', font: 'default' },
  { name: 'Noir', layout: 'minimal', accentColor: '#737373', font: 'default' },
  { name: 'Frost', layout: 'glassmorphic', accentColor: '#60a5fa', font: 'default' },
  { name: 'Duality', layout: 'split', accentColor: '#22c55e', font: 'default' },
]

export function StoryEditor({ movie, onClose }: StoryEditorProps) {
  const [size, setSize] = useState<Size>('vertical')
  const [layout, setLayout] = useState<LayoutType>('cinematic')
  const [accentColor, setAccentColor] = useState('#f59e0b')
  const [theme, setTheme] = useState<ThemeType>('dark')
  const [customRating, setCustomRating] = useState<number>(movie.vote_average)
  const [font, setFont] = useState<FontType>('default')
  const [showRating, setShowRating] = useState(true)
  const [details, setDetails] = useState<MovieDetails | null>(null)
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const canvasRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // Handle close with animation
  const handleClose = () => {
    setIsClosing(true)
    setTimeout(onClose, 300)
  }

  // Theme config
  const themeConfig = {
    bg: theme === 'dark' ? '#0a0a0a' : '#ffffff',
    text: theme === 'dark' ? '#ffffff' : '#000000',
    accent: accentColor,
    overlayOpacity: theme === 'dark' ? 'ee' : '99', // Less opacity for light theme
  }

  const watermarkText = process.env.NEXT_PUBLIC_WATERMARK_TEXT || '{watermarkText}'

  useEffect(() => {
    async function fetchDetails() {
      try {
        const data = await getMovieDetails(movie.id, movie.media_type || 'movie')
        setDetails(data)
      } catch (error) {
        console.error('Failed to fetch details:', error)
      }
    }
    fetchDetails()
  }, [movie])

  // Check if Web Share API is available
  useEffect(() => {
    setCanShare(typeof navigator !== 'undefined' && !!navigator.share && !!navigator.canShare)
  }, [])

  const handleExport = async () => {
    if (!canvasRef.current) return

    setIsExporting(true)
    try {
      const { width, height } = sizeConfig[size]
      const dataUrl = await toPng(canvasRef.current, {
        width,
        height,
        pixelRatio: 1,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
        },
      })

      const link = document.createElement('a')
      link.download = `${getTitle(movie).replace(/\s+/g, '-').toLowerCase()}-${size}-story.png`
      link.href = dataUrl
      link.click()
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setIsExporting(false)
    }
  }

  const handleShare = async () => {
    if (!canvasRef.current) return

    setIsSharing(true)
    try {
      const { width, height } = sizeConfig[size]
      const dataUrl = await toPng(canvasRef.current, {
        width,
        height,
        pixelRatio: 1,
        style: {
          transform: 'scale(1)',
          transformOrigin: 'top left',
          width: `${width}px`,
          height: `${height}px`,
        },
      })

      // Convert data URL to blob
      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `${getTitle(movie).replace(/\s+/g, '-').toLowerCase()}-story.png`, {
        type: 'image/png',
      })

      // Check if sharing files is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          files: [file],
          title: `${getTitle(movie)} - Story`,
        })
      } else {
        // Fallback to download if file sharing not supported
        handleExport()
      }
    } catch (error) {
      // User cancelled or share failed
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    } finally {
      setIsSharing(false)
    }
  }

  const title = getTitle(movie)
  const year = getReleaseYear(movie)
  const genres = details?.genres?.slice(0, 3).map((g) => g.name).join(' • ') || ''

  const { width, height } = sizeConfig[size]

  // Calculate preview scale based on container size
  useEffect(() => {
    const updatePreviewSize = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current
        const containerWidth = container.clientWidth - 48 // padding
        const containerHeight = container.clientHeight - 48 // padding
        setPreviewSize({ width: containerWidth, height: containerHeight })
      }
    }

    updatePreviewSize()
    window.addEventListener('resize', updatePreviewSize)
    return () => window.removeEventListener('resize', updatePreviewSize)
  }, [])

  const baseScale = previewSize.width > 0 && previewSize.height > 0
    ? Math.min(previewSize.width / width, previewSize.height / height)
    : Math.min(800 / width, 900 / height)

  // Make horizontal preview smaller
  const previewScale = size === 'horizontal' ? baseScale * 0.75 : baseScale

  const isVertical = size === 'vertical'

  const renderStoryContent = () => {
    // Font sizes - much bigger for X (Twitter) mode
    const fontSize = {
      title: isVertical ? 88 : 96,
      meta: isVertical ? 36 : 42,
      rating: isVertical ? 48 : 56,
      ratingIcon: isVertical ? 52 : 60,
    }

    // Classic Layout - Full background with info overlay at bottom
    if (layout === 'classic') {
      const bgImage = isVertical ? movie.poster_path : (movie.backdrop_path || movie.poster_path)
      return (
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ backgroundColor: themeConfig.bg }}
        >
          {bgImage && (
            <img
              src={getImageUrl(bgImage, 'original')}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${themeConfig.bg} 0%, ${themeConfig.bg}${themeConfig.overlayOpacity} 20%, transparent 55%)`
            }}
          />

          <div className={`absolute bottom-0 left-0 right-0 ${isVertical ? 'p-[8%] pb-[12%]' : 'p-[5%] pb-[8%]'}`}>
            <h1
              className="font-bold leading-[1.05] mb-[2%]"
              style={{ 
                color: themeConfig.text, 
                fontSize: `${fontSize.title}px`,
                fontFamily: fonts[font].family
              }}
            >
              {title}
            </h1>
            <div className="flex items-center flex-wrap" style={{ gap: `${fontSize.meta * 0.6}px` }}>
              <span
                className="opacity-70 font-medium"
                style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
              >
                {year}
              </span>
              {genres && (
                <>
                  <span style={{ color: themeConfig.text, opacity: 0.4 }}>•</span>
                  <span
                    className="opacity-70"
                    style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
                  >
                    {genres}
                  </span>
                </>
              )}
              {showRating && (
                <>
                  <span style={{ color: themeConfig.text, opacity: 0.4 }}>•</span>
                  <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.3}px` }}>
                    <Star
                      style={{
                        width: fontSize.ratingIcon,
                        height: fontSize.ratingIcon,
                        color: themeConfig.accent,
                        fill: themeConfig.accent
                      }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: themeConfig.text, fontSize: `${fontSize.rating}px` }}
                    >
                      {customRating.toFixed(1).replace(/\.0$/, '')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-18 p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }

    // Modern Layout - Full backdrop with overlay
    if (layout === 'modern') {
      const bgImage = isVertical ? movie.poster_path : (movie.backdrop_path || movie.poster_path)
      return (
        <div className="relative w-full h-full overflow-hidden">
          {bgImage && (
            <img
              src={getImageUrl(bgImage, 'original')}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${themeConfig.bg} 0%, ${themeConfig.bg}dd 25%, ${themeConfig.bg}44 60%, transparent 100%)`
            }}
          />

          <div className={`absolute inset-0 flex flex-col justify-end ${isVertical ? 'p-[10%] pb-[15%]' : 'p-[5%] pb-[8%]'}`}>
            <h1
              className="font-extrabold leading-[1.05] mb-[2%]"
              style={{ 
                color: themeConfig.text, 
                fontSize: `${fontSize.title}px`,
                fontFamily: fonts[font].family
              }}
            >
              {title}
            </h1>
            <div className="flex items-center flex-wrap" style={{ gap: `${fontSize.meta * 0.6}px` }}>
              <span
                className="opacity-70 font-medium"
                style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
              >
                {year}
              </span>
              {genres && (
                <>
                  <span style={{ color: themeConfig.text, opacity: 0.4 }}>•</span>
                  <span
                    className="opacity-70"
                    style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
                  >
                    {genres}
                  </span>
                </>
              )}
              {showRating && (
                <>
                  <span style={{ color: themeConfig.text, opacity: 0.4 }}>•</span>
                  <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.3}px` }}>
                    <Star
                      style={{
                        width: fontSize.ratingIcon,
                        height: fontSize.ratingIcon,
                        color: themeConfig.accent,
                        fill: themeConfig.accent
                      }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: themeConfig.text, fontSize: `${fontSize.rating}px` }}
                    >
                      {customRating.toFixed(1).replace(/\.0$/, '')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-24 p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }

    // Cinematic Layout
    if (layout === 'cinematic') {
      if (size === 'horizontal') {
        return (
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: themeConfig.bg }}
          >
            {(movie.backdrop_path || movie.poster_path) && (
              <img
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40"
                crossOrigin="anonymous"
              />
            )}

            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(to right, ${themeConfig.bg}${themeConfig.overlayOpacity} 0%, ${themeConfig.bg}aa 50%, ${themeConfig.bg}66 100%)`
              }}
            />

            <div className="absolute inset-0 flex items-center px-[5%] py-[4%]">
              <div className="relative h-[85%] aspect-[2/3] rounded-xl overflow-hidden shadow-2xl shrink-0">
                {movie.poster_path && (
                  <img
                    src={getImageUrl(movie.poster_path, 'original')}
                    alt={title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                )}
              </div>

              <div className="flex-1 flex flex-col justify-center px-[5%]">
                <h1
                  className="font-bold leading-[1.05] mb-[4%]"
                  style={{ 
                    color: themeConfig.text, 
                    fontSize: `${fontSize.title}px`,
                    fontFamily: fonts[font].family
                  }}
                >
                  {title}
                </h1>
                <p
                  className="opacity-60 mb-[5%] font-medium"
                  style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
                >
                  {year} {genres && `• ${genres}`}
                </p>
                {showRating && (
                  <div className="flex items-center" style={{ gap: `${fontSize.ratingIcon * 0.35}px` }}>
                    <Star
                      style={{
                        width: fontSize.ratingIcon,
                        height: fontSize.ratingIcon,
                        color: themeConfig.accent,
                        fill: themeConfig.accent
                      }}
                    />
                    <span
                      className="font-bold"
                      style={{ color: themeConfig.text, fontSize: `${fontSize.rating}px` }}
                    >
                      {customRating.toFixed(1).replace(/\.0$/, '')}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="absolute bottom-4 left-22 p-4" style={{ opacity: 0.55 }}>
              <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
                {watermarkText}
              </p>
            </div>
          </div>
        )
      }

      // Vertical - Centered poster cinematic
      return (
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ backgroundColor: themeConfig.bg }}
        >
          {movie.backdrop_path && (
            <img
              src={getImageUrl(movie.backdrop_path, 'w780')}
              alt=""
              className="absolute inset-0 w-full h-full object-cover opacity-20 blur-2xl scale-110"
              crossOrigin="anonymous"
            />
          )}

          <div className="absolute inset-0 flex flex-col items-center justify-center px-[5%] py-[6%]">
            <div
              className="relative rounded-2xl overflow-hidden shadow-2xl mb-[4%]"
              style={{
                width: '85%',
                height: '65%',
                boxShadow: `0 25px 50px -12px ${themeConfig.bg}`
              }}
            >
              {movie.poster_path && (
                <img
                  src={getImageUrl(movie.poster_path, 'original')}
                  alt={title}
                  className="w-full h-full object-cover"
                  crossOrigin="anonymous"
                />
              )}
            </div>

            <h1
              className="font-bold leading-[1.05] text-center mb-[2%]"
              style={{ 
                color: themeConfig.text, 
                fontSize: `${fontSize.title * 0.85}px`,
                fontFamily: fonts[font].family
              }}
            >
              {title}
            </h1>
            <p
              className="opacity-60 text-center mb-[3%] font-medium"
              style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}
            >
              {year} {genres && `• ${genres}`}
            </p>
            {showRating && (
              <div className="flex items-center" style={{ gap: `${fontSize.ratingIcon * 0.3}px` }}>
                <Star
                  style={{
                    width: fontSize.ratingIcon,
                    height: fontSize.ratingIcon,
                    color: themeConfig.accent,
                    fill: themeConfig.accent
                  }}
                />
                <span
                  className="font-bold"
                  style={{ color: themeConfig.text, fontSize: `${fontSize.rating}px` }}
                >
                  {customRating.toFixed(1).replace(/\.0$/, '')}
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-6 left-0 right-0 p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }

    // Minimal Layout
    if (layout === 'minimal') {
      const bgImage = isVertical ? movie.poster_path : (movie.backdrop_path || movie.poster_path)
      return (
        <div
          className="relative w-full h-full overflow-hidden flex flex-col justify-end"
          style={{ backgroundColor: themeConfig.bg }}
        >
          {bgImage && (
            <img
              src={getImageUrl(bgImage, 'original')}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}

          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, ${themeConfig.bg} 0%, ${themeConfig.bg}ee 15%, ${themeConfig.bg}aa 35%, ${themeConfig.bg}55 50%, ${themeConfig.bg}00 60%)`
            }}
          />

          <div className={`relative ${isVertical ? 'p-[10%] pb-[20%]' : 'p-[5%] pb-[10%]'}`}>
            <h1
              className={`font-black leading-[1] ${isVertical ? 'mb-[6%]' : 'mb-[2%]'} tracking-tight`}
              style={{ 
                color: themeConfig.text, 
                fontSize: `${fontSize.title * 1.1}px`,
                fontFamily: fonts[font].family
              }}
            >
              {title}
            </h1>
            <div className="flex items-center flex-wrap" style={{ gap: `${fontSize.meta * 0.6}px` }}>
              <span
                className="opacity-50 font-semibold"
                style={{ color: themeConfig.text, fontSize: `${fontSize.meta * 1.1}px` }}
              >
                {year}
              </span>
              {showRating && (
                <>
                  <span style={{ color: themeConfig.text, opacity: 0.3 }}>—</span>
                  <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.4}px` }}>
                    <Star
                      style={{
                        width: fontSize.ratingIcon,
                        height: fontSize.ratingIcon,
                        color: themeConfig.accent,
                        fill: themeConfig.accent
                      }}
                    />
                    <span
                      className="font-bold opacity-90"
                      style={{ color: themeConfig.text, fontSize: `${fontSize.rating}px` }}
                    >
                      {customRating.toFixed(1).replace(/\.0$/, '')}
                    </span>
                  </div>
                </>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-22 p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }

    // Glassmorphic Layout
    if (layout === 'glassmorphic') {
      if (!isVertical) {
        // Horizontal glassmorphic - poster inside glass card
        return (
          <div
            className="relative w-full h-full overflow-hidden"
            style={{ backgroundColor: themeConfig.bg }}
          >
            {(movie.backdrop_path || movie.poster_path) && (
              <img
                src={getImageUrl(movie.backdrop_path || movie.poster_path, 'original')}
                alt=""
                className="absolute inset-0 w-full h-full object-cover opacity-40 blur-md scale-105"
                crossOrigin="anonymous"
              />
            )}

            <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeConfig.bg}77 0%, ${themeConfig.bg}99 100%)` }} />

            <div className="absolute inset-0 flex items-center justify-center px-[4%] py-[4%]">
              {/* Glass Card */}
              <div
                className="h-[88%] w-[92%] rounded-3xl border backdrop-blur-xl flex items-center px-[4%] py-[3%]"
                style={{
                  backgroundColor: `rgba(255, 255, 255, 0.06)`,
                  borderColor: `rgba(255, 255, 255, 0.15)`,
                  boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.3)`,
                }}
              >
                {/* Poster inside box */}
                <div
                  className="relative h-full aspect-[2/3] rounded-2xl overflow-hidden shrink-0"
                  style={{
                    boxShadow: `0 20px 40px -12px rgba(0, 0, 0, 0.5)`,
                  }}
                >
                  {movie.poster_path && (
                    <img
                      src={getImageUrl(movie.poster_path, 'original')}
                      alt={title}
                      className="w-full h-full object-cover"
                      crossOrigin="anonymous"
                    />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 flex flex-col justify-center pl-[5%]">
                  <h1
                    className="font-bold leading-[1.05] mb-[3%]"
                    style={{
                      color: themeConfig.text,
                      fontSize: `${fontSize.title}px`,
                      fontFamily: fonts[font].family,
                    }}
                  >
                    {title}
                  </h1>

                  <p
                    className="opacity-70 mb-[4%] font-medium"
                    style={{
                      color: themeConfig.text,
                      fontSize: `${fontSize.meta}px`,
                    }}
                  >
                    {year} {genres && `• ${genres}`}
                  </p>

                  {showRating && (
                    <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.4}px` }}>
                      <Star
                        style={{
                          width: fontSize.ratingIcon,
                          height: fontSize.ratingIcon,
                          color: themeConfig.accent,
                          fill: themeConfig.accent,
                        }}
                      />
                      <span
                        className="font-bold"
                        style={{
                          color: themeConfig.text,
                          fontSize: `${fontSize.rating}px`,
                        }}
                      >
                        {customRating.toFixed(1).replace(/\.0$/, '')}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 p-4" style={{ opacity: 0.55 }}>
              <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
                {watermarkText}
              </p>
            </div>
          </div>
        )
      }

      // Vertical glassmorphic
      const bgImage = movie.poster_path
      return (
        <div
          className="relative w-full h-full overflow-hidden"
          style={{ backgroundColor: themeConfig.bg }}
        >
          {bgImage && (
            <img
              src={getImageUrl(bgImage, 'original')}
              alt={title}
              className="absolute inset-0 w-full h-full object-cover"
              crossOrigin="anonymous"
            />
          )}

          <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${themeConfig.bg}66 0%, ${themeConfig.bg}99 100%)` }} />

          <div className="absolute inset-0 flex items-center justify-center p-[8%]">
            <div
              className="w-full rounded-3xl border backdrop-blur-xl p-[6%]"
              style={{
                backgroundColor: `rgba(255, 255, 255, 0.08)`,
                borderColor: `${themeConfig.accent}40`,
                boxShadow: `0 8px 32px 0 rgba(31, 38, 135, 0.37), inset 0 0 32px 0 ${themeConfig.accent}20`,
              }}
            >
              {movie.poster_path && (
                <div className="mb-[4%] rounded-2xl overflow-hidden" style={{ height: '45%' }}>
                  <img
                    src={getImageUrl(movie.poster_path, 'original')}
                    alt={title}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                </div>
              )}

              <h1
                className="font-bold leading-[1.05] mb-[2%]"
                style={{
                  color: themeConfig.text,
                  fontSize: `${fontSize.title * 0.8}px`,
                  fontFamily: fonts[font].family,
                }}
              >
                {title}
              </h1>

              <p
                className="opacity-75 mb-[3%] font-medium"
                style={{
                  color: themeConfig.text,
                  fontSize: `${fontSize.meta * 0.8}px`,
                }}
              >
                {year} {genres && `• ${genres}`}
              </p>

              {showRating && (
                <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.3}px` }}>
                  <Star
                    style={{
                      width: fontSize.ratingIcon * 0.9,
                      height: fontSize.ratingIcon * 0.9,
                      color: themeConfig.accent,
                      fill: themeConfig.accent,
                    }}
                  />
                  <span
                    className="font-bold"
                    style={{
                      color: themeConfig.text,
                      fontSize: `${fontSize.rating * 0.9}px`,
                    }}
                  >
                    {customRating.toFixed(1).replace(/\.0$/, '')}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="absolute bottom-4 left-0 right-0 p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px`, textAlign: 'center' }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }



    // Split Layout (poster left, info right)
    if (layout === 'split') {
      return (
        <div
          className="relative w-full h-full overflow-hidden flex"
          style={{ backgroundColor: themeConfig.bg }}
        >
          {/* Left - Image */}
          <div className="w-[45%] h-full overflow-hidden relative">
            {movie.poster_path && (
              <img
                src={getImageUrl(movie.poster_path, 'original')}
                alt={title}
                className="w-full h-full object-cover"
                crossOrigin="anonymous"
              />
            )}
            <div className="absolute inset-0" style={{ background: `linear-gradient(to right, ${themeConfig.bg}00 0%, ${themeConfig.bg} 100%)` }} />
          </div>

          {/* Right - Info */}
          <div className="w-[55%] flex flex-col justify-center p-[6%]">
            <span
              className="font-bold mb-[2%] opacity-60"
              style={{
                color: themeConfig.accent,
                fontSize: `${fontSize.meta * 0.8}px`,
                textTransform: 'uppercase',
                letterSpacing: '0.15em',
              }}
            >
              {year}
            </span>

            <h1
              className="font-black leading-[1.1] mb-[4%]"
              style={{
                color: themeConfig.text,
                fontSize: `${fontSize.title * 0.95}px`,
                fontFamily: fonts[font].family,
              }}
            >
              {title}
            </h1>

            {genres && (
              <p
                className="opacity-70 mb-[4%] font-medium leading-relaxed"
                style={{
                  color: themeConfig.text,
                  fontSize: `${fontSize.meta * 0.85}px`,
                }}
              >
                {genres}
              </p>
            )}

            {showRating && (
              <div className="flex items-center" style={{ gap: `${fontSize.meta * 0.4}px` }}>
                <Star
                  style={{
                    width: fontSize.ratingIcon * 0.95,
                    height: fontSize.ratingIcon * 0.95,
                    color: themeConfig.accent,
                    fill: themeConfig.accent,
                  }}
                />
                <span
                  className="font-black"
                  style={{
                    color: themeConfig.text,
                    fontSize: `${fontSize.rating * 0.95}px`,
                  }}
                >
                  {customRating.toFixed(1).replace(/\.0$/, '')}
                </span>
              </div>
            )}
          </div>

          <div className="absolute bottom-4 left-[50%] p-4" style={{ opacity: 0.55 }}>
            <p style={{ color: themeConfig.text, fontSize: `${fontSize.meta}px` }}>
              {watermarkText}
            </p>
          </div>
        </div>
      )
    }
  }

  return (
    <div
      className={`fixed inset-0 z-50 flex transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
    >
      {/* Sidebar Controls */}
      <div
        className={`w-80 bg-card border-r border-border flex flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isVisible && !isClosing ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Story Studio</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Theme */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Palette className="size-4" />
              Theme
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(['light', 'dark'] as ThemeType[]).map((t) => (
                <Button
                  key={t}
                  variant={theme === t ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setTheme(t)}
                  className="justify-start capitalize"
                >
                  {t}
                </Button>
              ))}
            </div>
          </div>

          {/* Size */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Monitor className="size-4" />
              Size
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {(Object.keys(sizeConfig) as Size[]).map((p) => {
                const config = sizeConfig[p]
                const IconComponent = config.icon
                return (
                  <Button
                    key={p}
                    variant={size === p ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSize(p)}
                    className="justify-start gap-2"
                  >
                    <IconComponent className="size-4" />
                    {config.label}
                  </Button>
                )
              })}
            </div>
          </div>

          {/* Presets */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Sparkles className="size-4" />
              Presets
            </h3>
            <div className="grid grid-cols-2 gap-2">
              {presets.map((preset) => (
                <Button
                  key={preset.name}
                  variant={layout === preset.layout && accentColor === preset.accentColor && font === preset.font ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => {
                    setLayout(preset.layout)
                    setAccentColor(preset.accentColor)
                  }}
                  className="justify-start text-xs gap-2"
                >
                  <span
                    className="w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: preset.accentColor }}
                  />
                  {preset.name}
                </Button>
              ))}
            </div>
          </div>

          {/* Accent Color */}
          <div>
            <h3 className="text-sm font-semibold mb-3 flex items-center gap-2">
              <Palette className="size-4" />
              Accent Color
            </h3>
            <div className="relative" ref={colorPickerRef}>
              <button
                onClick={() => setShowColorPicker(!showColorPicker)}
                className="w-full flex items-center gap-3 p-3 rounded-lg border border-border bg-background hover:bg-accent/50 transition-colors"
              >
                <div
                  className="w-8 h-8 rounded-lg shadow-inner border border-white/20"
                  style={{ backgroundColor: accentColor }}
                />
                <div className="flex-1 text-left">
                  <span className="text-sm font-medium">{accentColor.toUpperCase()}</span>
                  <p className="text-xs text-muted-foreground">Click to change</p>
                </div>
                <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
              </button>

              {showColorPicker && (
                <div className="absolute top-full left-0 right-0 mt-2 z-50">
                  <div
                    className="fixed inset-0"
                    onClick={() => setShowColorPicker(false)}
                  />
                  <div className="relative rounded-lg border border-border shadow-xl overflow-hidden bg-[#0a0a0a]">
                    <style jsx global>{`
                      .chrome-picker {
                        background: #0a0a0a !important;
                        box-shadow: none !important;
                        border-radius: 8px !important;
                        color: #e5e5e5 !important;
                      }
                      .chrome-picker input,
                      .chrome-picker .hex input,
                      .chrome-picker .fields input {
                        background: #1a1a1a !important;
                        color: #e5e5e5 !important;
                        border: 1px solid #2a2a2a !important;
                        box-shadow: none !important;
                      }
                      .chrome-picker .saturation,
                      .chrome-picker .hue {
                        border-radius: 4px !important;
                      }
                      .chrome-picker .hue {
                        height: 12px !important;
                      }
                      .chrome-picker .swatch {
                        border: 1px solid #2a2a2a !important;
                      }
                    `}</style>
                    <ChromePicker
                      color={accentColor}
                      onChange={(color: ColorResult) => setAccentColor(color.hex)}
                      disableAlpha
                      styles={{
                        default: {
                          picker: {
                            width: '100%',
                            boxShadow: 'none',
                            background: '#0a0a0a',
                            borderRadius: '8px',
                          } as React.CSSProperties,
                          saturation: {
                            borderRadius: '4px 4px 0 0',
                          } as React.CSSProperties,
                          body: {
                            background: '#0a0a0a',
                            padding: '12px',
                          } as React.CSSProperties,
                          controls: {
                            display: 'flex',
                          } as React.CSSProperties,
                          color: {
                            width: '32px',
                            height: '32px',
                            borderRadius: '50%',
                          } as React.CSSProperties,
                          hue: {
                            borderRadius: '4px',
                          } as React.CSSProperties,
                        },
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Rating */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold flex items-center gap-2">
                <Star className="size-4" />
                Rating
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRating(!showRating)}
                className="text-xs"
              >
                {showRating ? 'Hide' : 'Show'}
              </Button>
            </div>
            {showRating && (
              <div className="space-y-3">
                <Slider
                  value={[customRating]}
                  onValueChange={([value]) => setCustomRating(value)}
                  min={0}
                  max={10}
                  step={0.1}
                />
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Your rating</span>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-yellow-500">{customRating.toFixed(1).replace(/\.0$/, '')}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setCustomRating(movie.vote_average)}
                      className="h-6 px-2"
                    >
                      <RotateCcw className="size-3" />
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Advanced Options - Collapsible */}
          <div>
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full flex items-center justify-between text-sm font-semibold py-2 text-muted-foreground hover:text-foreground transition-colors"
            >
              <span className="flex items-center gap-2">
                <Settings2 className="size-4" />
                Advanced Options
              </span>
              <ChevronDown className={`size-4 transition-transform ${showAdvanced ? 'rotate-180' : ''}`} />
            </button>

            {showAdvanced && (
              <div className="mt-3 space-y-4">
                {/* Layout */}
                <div>
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                    <Layout className="size-3" />
                    Layout
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
                    {(Object.keys(layouts) as LayoutType[]).map((l) => (
                      <Button
                        key={l}
                        variant={layout === l ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setLayout(l)}
                        className="justify-start text-xs"
                      >
                        {layouts[l]}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Font */}
                <div>
                  <h4 className="text-xs font-medium mb-2 flex items-center gap-2 text-muted-foreground">
                    <Type className="size-3" />
                    Typography
                  </h4>
                  <div className="space-y-2">
                    {(Object.keys(fonts) as FontType[]).map((f) => (
                      <button
                        key={f}
                        onClick={() => setFont(f)}
                        className={`w-full p-3 rounded-lg border text-left transition-all hover:bg-accent/50 ${
                          font === f 
                            ? 'border-primary bg-primary/10' 
                            : 'border-border bg-background'
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium">{fonts[f].name}</span>
                          {font === f && (
                            <div className="w-2 h-2 rounded-full bg-primary" />
                          )}
                        </div>
                        <div 
                          className="text-lg font-bold text-muted-foreground leading-none"
                          style={{ fontFamily: fonts[f].family }}
                        >
                          {fonts[f].preview}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Export Buttons */}
        <div className="p-4 border-t border-border space-y-2">
          {canShare && (
            <Button
              onClick={handleShare}
              disabled={isSharing || isExporting}
              className="w-full"
              size="lg"
            >
              <Share2 className="size-5 mr-2" />
              {isSharing ? 'Sharing...' : 'Share'}
            </Button>
          )}
          <Button
            onClick={handleExport}
            disabled={isExporting || isSharing}
            variant={canShare ? 'outline' : 'default'}
            className="w-full"
            size="lg"
          >
            <Download className="size-5 mr-2" />
            {isExporting ? 'Exporting...' : 'Download'}
          </Button>
          <p className="text-xs text-muted-foreground text-center mt-2">
            {sizeConfig[size].width} x {sizeConfig[size].height}px
          </p>
        </div>
      </div>

      {/* Preview Area */}
      <div ref={previewContainerRef} className="flex-1 flex items-center justify-center p-6 overflow-auto">
        <div
          className={`relative shadow-2xl rounded-lg overflow-hidden select-none transition-all duration-300 ease-out ${
            isVisible && !isClosing ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
          }`}
          style={{
            width: width * previewScale,
            height: height * previewScale,
          }}
          onContextMenu={(e) => e.preventDefault()}
        >
          <div
            ref={canvasRef}
            className="pointer-events-none"
            style={{
              width: `${width}px`,
              height: `${height}px`,
              transform: `scale(${previewScale})`,
              transformOrigin: 'top left',
            }}
          >
            {renderStoryContent()}
          </div>
        </div>
      </div>
    </div>
  )
}
