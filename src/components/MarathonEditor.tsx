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
  Sparkles,
  ChevronDown,
  Settings2,
  Type,
  SlidersHorizontal,
  Trash2,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { MarathonMovie, TMDBMovie } from '@/types/tmdb'
import { getImageUrl, getTitle, getReleaseYear } from '@/lib/tmdb'
import { VerticalRectangle, HorizontalRectangle } from '@/components/icons/AspectRatioIcons'

interface MarathonEditorProps {
  movies: TMDBMovie[]
  onClose: () => void
  onRemoveMovie: (id: number) => void
}

type Size = 'horizontal' | 'vertical'
type MarathonLayoutType = 'grid' | 'ranked' | 'timeline' | 'collage' | 'minimal'
type ThemeType = 'light' | 'dark'
type FontType = 'default' | 'oswald' | 'cinzel' | 'bebas-neue' | 'righteous' | 'orbitron'

const sizeConfig: Record<Size, { width: number; height: number; label: string; icon: React.ComponentType<{ className?: string }> }> = {
  vertical: { width: 1080, height: 1920, label: 'Vertical', icon: VerticalRectangle },
  horizontal: { width: 1920, height: 1080, label: 'Horizontal', icon: HorizontalRectangle },
}

const layouts: Record<MarathonLayoutType, { name: string; description: string }> = {
  'collage': { name: 'Artistic', description: 'Overlapping posters' },
  'grid': { name: 'Grid', description: 'Even poster grid' },
  'ranked': { name: 'Ranked', description: 'Numbered list' },
  'timeline': { name: 'Timeline', description: 'Horizontal flow' },
  'minimal': { name: 'Minimal', description: 'Clean list' },
}

const fonts: Record<FontType, { name: string; family: string; preview: string }> = {
  'default': { name: 'Inter', family: 'var(--font-inter), system-ui, sans-serif', preview: 'ABC' },
  'oswald': { name: 'Oswald', family: 'var(--font-oswald), sans-serif', preview: 'MOVIE' },
  'cinzel': { name: 'Cinzel', family: 'var(--font-cinzel), serif', preview: 'THEATRE' },
  'bebas-neue': { name: 'Bebas Neue', family: 'var(--font-bebas-neue), sans-serif', preview: 'STORY' },
  'righteous': { name: 'Righteous', family: 'var(--font-righteous), sans-serif', preview: 'ART' },
  'orbitron': { name: 'Orbitron', family: 'var(--font-orbitron), monospace', preview: 'CYBER' },
}

interface Preset {
  name: string
  layout: MarathonLayoutType
  accentColor: string
}

const presets: Preset[] = [
  { name: 'Artistic', layout: 'collage', accentColor: '#ec4899' },
  { name: 'Cinema', layout: 'grid', accentColor: '#f59e0b' },
  { name: 'Top List', layout: 'ranked', accentColor: '#ef4444' },
  { name: 'Journey', layout: 'timeline', accentColor: '#8b5cf6' },
  { name: 'Clean', layout: 'minimal', accentColor: '#6b7280' },
]

export function MarathonEditor({ movies, onClose, onRemoveMovie }: MarathonEditorProps) {
  const [size, setSize] = useState<Size>('vertical')
  const [layout, setLayout] = useState<MarathonLayoutType>('collage')
  const [accentColor, setAccentColor] = useState('#ec4899')
  const [theme, setTheme] = useState<ThemeType>('dark')
  const [font, setFont] = useState<FontType>('default')
  const [showRatings, setShowRatings] = useState(true)
  const [isExporting, setIsExporting] = useState(false)
  const [isSharing, setIsSharing] = useState(false)
  const [canShare, setCanShare] = useState(false)
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showColorPicker, setShowColorPicker] = useState(false)
  const [previewSize, setPreviewSize] = useState({ width: 0, height: 0 })
  const [isVisible, setIsVisible] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [mobileControlsOpen, setMobileControlsOpen] = useState(false)
  const [marathonMovies, setMarathonMovies] = useState<MarathonMovie[]>(
    movies.map((m, i) => ({ ...m, order: i + 1 }))
  )
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null)
  const canvasRef = useRef<HTMLDivElement>(null)
  const colorPickerRef = useRef<HTMLDivElement>(null)
  const previewContainerRef = useRef<HTMLDivElement>(null)

  // Update marathon movies when props change
  useEffect(() => {
    setMarathonMovies(movies.map((m, i) => ({ ...m, order: i + 1 })))
  }, [movies])

  // Animate in on mount
  useEffect(() => {
    requestAnimationFrame(() => setIsVisible(true))
  }, [])

  // Detect mobile viewport
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
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
    overlayOpacity: theme === 'dark' ? 'ee' : '99',
  }

  const watermarkText = process.env.NEXT_PUBLIC_WATERMARK_TEXT || 'Movie Marathon'

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
      link.download = `movie-marathon-${size}.png`
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

      const response = await fetch(dataUrl)
      const blob = await response.blob()
      const file = new File([blob], `movie-marathon.png`, { type: 'image/png' })

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: 'Movie Marathon' })
      } else {
        handleExport()
      }
    } catch (error) {
      if ((error as Error).name !== 'AbortError') {
        console.error('Share failed:', error)
      }
    } finally {
      setIsSharing(false)
    }
  }

  const { width, height } = sizeConfig[size]
  const isVertical = size === 'vertical'

  // Calculate preview scale
  useEffect(() => {
    const updatePreviewSize = () => {
      if (previewContainerRef.current) {
        const container = previewContainerRef.current
        const padding = isMobile ? 24 : 48
        const containerWidth = container.clientWidth - padding
        const containerHeight = container.clientHeight - padding
        setPreviewSize({ width: containerWidth, height: containerHeight })
      }
    }

    updatePreviewSize()
    window.addEventListener('resize', updatePreviewSize)
    return () => window.removeEventListener('resize', updatePreviewSize)
  }, [isMobile])

  const baseScale = previewSize.width > 0 && previewSize.height > 0
    ? Math.min(previewSize.width / width, previewSize.height / height)
    : isMobile
      ? Math.min(350 / width, 500 / height)
      : Math.min(800 / width, 900 / height)

  const previewScale = size === 'horizontal'
    ? baseScale * (isMobile ? 0.65 : 0.75)
    : baseScale * (isMobile ? 0.9 : 1)

  // Drag and drop handlers
  const handleDragStart = (index: number) => {
    setDraggedIndex(index)
  }

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault()
    if (draggedIndex === null || draggedIndex === index) return

    const newMovies = [...marathonMovies]
    const draggedMovie = newMovies[draggedIndex]
    newMovies.splice(draggedIndex, 1)
    newMovies.splice(index, 0, draggedMovie)
    newMovies.forEach((m, i) => (m.order = i + 1))
    setMarathonMovies(newMovies)
    setDraggedIndex(index)
  }

  const handleDragEnd = () => {
    setDraggedIndex(null)
  }

  // Render marathon content based on layout
  const renderMarathonContent = () => {
    const count = marathonMovies.length

    // Grid Layout - Full bleed posters filling the entire frame
    if (layout === 'grid') {
      // Calculate optimal grid configuration
      const getGridConfig = () => {
        if (isVertical) {
          if (count <= 2) return { cols: 1, rows: 2 }
          if (count <= 4) return { cols: 2, rows: 2 }
          if (count <= 6) return { cols: 2, rows: 3 }
          if (count <= 9) return { cols: 3, rows: 3 }
          return { cols: 2, rows: 5 }
        } else {
          if (count <= 2) return { cols: 2, rows: 1 }
          if (count <= 4) return { cols: 4, rows: 1 }
          if (count <= 6) return { cols: 3, rows: 2 }
          if (count <= 8) return { cols: 4, rows: 2 }
          return { cols: 5, rows: 2 }
        }
      }
      const { cols } = getGridConfig()

      return (
        <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
          {/* Full bleed grid */}
          <div
            className="absolute inset-0 grid"
            style={{
              gridTemplateColumns: `repeat(${cols}, 1fr)`,
              gap: '4px',
            }}
          >
            {marathonMovies.map((movie, index) => (
              <div key={movie.id} className="relative overflow-hidden">
                {movie.poster_path && (
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={getTitle(movie)}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                )}
                {/* Number badge */}
                <div
                  className="absolute top-4 left-4 flex items-center justify-center font-black"
                  style={{
                    width: isVertical ? 64 : 56,
                    height: isVertical ? 64 : 56,
                    borderRadius: '50%',
                    backgroundColor: themeConfig.accent,
                    color: themeConfig.bg,
                    fontSize: isVertical ? 32 : 28,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.5)',
                  }}
                >
                  {index + 1}
                </div>
                {/* Bottom gradient with title */}
                <div
                  className="absolute bottom-0 left-0 right-0"
                  style={{
                    background: `linear-gradient(to top, ${themeConfig.bg} 0%, ${themeConfig.bg}dd 60%, transparent 100%)`,
                    padding: isVertical ? '80px 20px 20px' : '60px 16px 16px',
                  }}
                >
                  <p
                    className="font-bold leading-tight"
                    style={{
                      color: themeConfig.text,
                      fontSize: isVertical ? (count <= 4 ? 40 : 32) : (count <= 4 ? 48 : 36),
                      fontFamily: fonts[font].family,
                    }}
                  >
                    {getTitle(movie)}
                  </p>
                  {showRatings && (
                    <div className="flex items-center gap-2 mt-2">
                      <Star
                        style={{
                          width: isVertical ? 28 : 24,
                          height: isVertical ? 28 : 24,
                          color: themeConfig.accent,
                          fill: themeConfig.accent,
                        }}
                      />
                      <span style={{ color: themeConfig.text, fontSize: isVertical ? 26 : 22, fontWeight: 700 }}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
          {/* Watermark */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 py-3 rounded-xl shadow-2xl z-30"
            style={{ backgroundColor: themeConfig.accent }}
          >
            <p style={{ color: themeConfig.bg, fontSize: 20, fontWeight: 900, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{watermarkText}</p>
          </div>
        </div>
      )
    }

    // Ranked Layout - Large numbers with posters
    if (layout === 'ranked') {
      if (isVertical) {
        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
            {/* Background gradient */}
            <div
              className="absolute inset-0"
              style={{
                background: `linear-gradient(135deg, ${themeConfig.accent}15 0%, transparent 50%, ${themeConfig.accent}10 100%)`,
              }}
            />
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 pt-14 pb-12 text-center" style={{ zIndex: 10 }}>
              <p
                style={{
                  color: themeConfig.accent,
                  fontSize: 28,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5em',
                  fontWeight: 800,
                  opacity: 0.8,
                  marginBottom: 16
                }}
              >
                Marathon
              </p>
              <h1
                className="font-black"
                style={{
                  color: themeConfig.text,
                  fontSize: 110,
                  fontFamily: fonts[font].family,
                  letterSpacing: '-0.04em',
                  lineHeight: 0.9
                }}
              >
                TOP {count}
              </h1>
              <div className="w-24 h-2 mx-auto mt-8 rounded-full" style={{ backgroundColor: themeConfig.accent }} />
            </div>

            {/* Ranked items - fill remaining space */}
            <div className="absolute left-0 right-0 top-[320px] bottom-[80px] flex flex-col px-8 gap-4">
              {marathonMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex-1 flex items-center gap-5 rounded-2xl overflow-hidden"
                  style={{ backgroundColor: `${themeConfig.text}08` }}
                >
                  {/* Big number */}
                  <div
                    className="w-28 flex items-center justify-center font-black shrink-0"
                    style={{
                      color: index === 0 ? themeConfig.accent : `${themeConfig.text}40`,
                      fontSize: index === 0 ? 96 : 72,
                    }}
                  >
                    {index + 1}
                  </div>
                  {/* Poster */}
                  <div className="h-[88%] aspect-[2/3] rounded-xl overflow-hidden shrink-0">
                    {movie.poster_path && (
                      <img
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={getTitle(movie)}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 pr-6 py-4">
                    <p
                      className="font-bold leading-tight line-clamp-2"
                      style={{
                        color: themeConfig.text,
                        fontSize: count <= 5 ? 40 : 32,
                        fontFamily: fonts[font].family,
                      }}
                    >
                      {getTitle(movie)}
                    </p>
                    <p style={{ color: `${themeConfig.text}66`, fontSize: 24, marginTop: 4, fontWeight: 500 }}>
                      {getReleaseYear(movie)}
                    </p>
                    {showRatings && (
                      <div className="flex items-center gap-2.5 mt-4">
                        <Star style={{ width: 28, height: 28, color: themeConfig.accent, fill: themeConfig.accent }} />
                        <span style={{ color: themeConfig.text, fontSize: 28, fontWeight: 800 }}>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Watermark */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p style={{ color: themeConfig.text, fontSize: 24, opacity: 0.6 }}>{watermarkText}</p>
            </div>
          </div>
        )
      } else {
        // Horizontal ranked
        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
            {/* Background Texture */}
            <div
              className="absolute inset-0"
              style={{
                background: `radial-gradient(circle at 80% 20%, ${themeConfig.accent}15 0%, transparent 40%),
                            radial-gradient(circle at 20% 80%, ${themeConfig.accent}10 0%, transparent 40%)`,
              }}
            />

            {/* Background Typography */}
            <div 
              className="absolute top-0 right-0 p-12 -mt-10 -mr-10 font-black leading-none select-none pointer-events-none opacity-5"
              style={{ 
                color: themeConfig.text, 
                fontSize: 300,
                fontFamily: fonts[font].family 
              }}
            >
              TOP {count}
            </div>
            
            {/* Header */}
            <div className="absolute top-8 left-12 z-10">
              <h1
                className="font-black"
                style={{ 
                  color: themeConfig.text, 
                  fontSize: 56, 
                  fontFamily: fonts[font].family,
                  letterSpacing: '0.15em',
                  textShadow: '0 4px 12px rgba(0,0,0,0.5)'
                }}
              >
                RANKED
              </h1>
              <div className="w-24 h-2 mt-2" style={{ backgroundColor: themeConfig.accent }} />
            </div>

            {/* Content Container */}
            <div className="absolute left-0 right-0 top-[180px] bottom-[60px] px-12 flex gap-4 items-end">
              {marathonMovies.map((movie, index) => {
                 // Creating hierarchy with height modulation - top 3 get full height emphasis
                 const isTop3 = index < 3;
                 
                 return (
                  <div key={movie.id} className="flex-1 relative h-full flex flex-col justify-end group">
                    <div 
                        className="relative w-full rounded-2xl overflow-hidden transition-all duration-300"
                        style={{ 
                            height: isTop3 ? '100%' : '88%',
                            boxShadow: '0 10px 30px -10px rgba(0,0,0,0.5)',
                            backgroundColor: `${themeConfig.text}05`
                        }}
                    >
                         {/* Full Cover Image */}
                        {movie.poster_path && (
                            <img
                            src={getImageUrl(movie.poster_path, 'w500')}
                            alt={getTitle(movie)}
                            className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                            crossOrigin="anonymous"
                            />
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
                        
                        {/* Rank Number */}
                        <div 
                            className="absolute top-0 right-0 px-4 font-black leading-none" 
                            style={{ 
                                fontSize: isTop3 ? 160 : 100, 
                                color: 'white',
                                opacity: 0.3,
                                textShadow: '0 4px 12px rgba(0,0,0,0.8)'
                            }}
                        >
                            {index + 1}
                        </div>

                         {/* Info at bottom */}
                        <div className="absolute bottom-0 left-0 right-0 p-5">
                            <h3 
                                className="font-bold leading-tight mb-2 text-white line-clamp-2"
                                style={{ 
                                    fontSize: count <= 5 ? 42 : 32, 
                                    fontFamily: fonts[font].family 
                                }}
                            >
                                {getTitle(movie)}
                            </h3>
                            <div className="flex items-center gap-2 text-white/90">
                                <span className="text-xl font-medium">{getReleaseYear(movie)}</span>
                                {showRatings && (
                                    <>
                                       <span className="w-1.5 h-1.5 rounded-full bg-white/40" />
                                       <Star className="w-4 h-4 fill-current text-yellow-400" />
                                       <span className="text-xl font-bold">{movie.vote_average.toFixed(1)}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                  </div>
              )})}
            </div>

            {/* Watermark */}
            <div className="absolute bottom-5 right-8">
              <p style={{ color: themeConfig.text, fontSize: 20, opacity: 0.6 }}>{watermarkText}</p>
            </div>
          </div>
        )
      }
    }

    // Timeline Layout - Sequential flow
    if (layout === 'timeline') {
      if (isVertical) {
        const topSpace = 280
        const bottomSpace = 100
        const itemHeight = Math.floor((1920 - topSpace - bottomSpace) / count)
        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
            {/* Timeline line */}
            <div
              className="absolute left-[110px] top-[270px] bottom-0 w-1.5"
              style={{ backgroundColor: `${themeConfig.accent}50` }}
            />

            {/* Header */}
            <div className="absolute top-0 left-0 right-0 pt-24 px-20">
              <p
                style={{
                  color: themeConfig.accent,
                  fontSize: 28,
                  textTransform: 'uppercase',
                  letterSpacing: '0.5em',
                  fontWeight: 800,
                  opacity: 0.8,
                  marginBottom: 12
                }}
              >
                Marathon
              </p>
              <h1
                className="font-black"
                style={{ 
                    color: themeConfig.text, 
                    fontSize: 84, 
                    fontFamily: fonts[font].family,
                    letterSpacing: '-0.02em',
                    lineHeight: 1
                }}
              >
                THE ORDER
              </h1>
              <div className="w-32 h-2 mt-8 rounded-full" style={{ backgroundColor: themeConfig.accent }} />
            </div>

            {/* Timeline items */}
            {marathonMovies.map((movie, index) => (
              <div
                key={movie.id}
                className="absolute left-0 right-0 flex items-center"
                style={{
                  top: topSpace + index * itemHeight,
                  height: itemHeight,
                  paddingLeft: 50,
                  paddingRight: 50,
                }}
              >
                {/* Dot on timeline */}
                <div
                  className="absolute flex items-center justify-center font-bold"
                  style={{
                    left: 88,
                    width: 44,
                    height: 44,
                    borderRadius: '50%',
                    backgroundColor: themeConfig.accent,
                    color: themeConfig.bg,
                    fontSize: 24,
                    zIndex: 2,
                    boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                  }}
                >
                  {index + 1}
                </div>

                {/* Card */}
                <div
                  className="ml-[110px] flex-1 flex items-center gap-8 h-[92%] rounded-2xl overflow-hidden px-6"
                  style={{ backgroundColor: `${themeConfig.text}08` }}
                >
                  <div className="h-[85%] aspect-[2/3] rounded-xl overflow-hidden shrink-0 shadow-2xl">
                    {movie.poster_path && (
                      <img
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={getTitle(movie)}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    )}
                  </div>
                  <div className="flex-1">
                    <p
                      className="font-bold leading-tight line-clamp-2"
                      style={{
                        color: themeConfig.text,
                        fontSize: count <= 5 ? 48 : 38,
                        fontFamily: fonts[font].family,
                      }}
                    >
                      {getTitle(movie)}
                    </p>
                    <p style={{ color: `${themeConfig.text}77`, fontSize: 26, marginTop: 8 }}>
                      {getReleaseYear(movie)}
                    </p>
                    {showRatings && (
                      <div className="flex items-center gap-3 mt-4">
                        <Star style={{ width: 32, height: 32, color: themeConfig.accent, fill: themeConfig.accent }} />
                        <span style={{ color: themeConfig.text, fontSize: 32, fontWeight: 700 }}>
                          {movie.vote_average.toFixed(1)}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}

            {/* Watermark */}
            <div className="absolute bottom-8 left-0 right-0 text-center">
              <p style={{ color: themeConfig.text, fontSize: 24, opacity: 0.6 }}>{watermarkText}</p>
            </div>
          </div>
        )
      } else {
        // Horizontal timeline
        const leftPadding = 420 // Increased to give room for the title on the left
        const rightPadding = 80
        const topSpace = 60 
        const itemWidth = Math.floor((1920 - leftPadding - rightPadding) / count)
        const lineY = 540 // Vertically centered
        const dotSize = 56
        const dotRadius = dotSize / 2
        const connectorLength = 50 

        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
             {/* Main Title - Fixed to the left edge */}
             <div 
                className="absolute left-0 top-0 p-12 max-w-md z-10"
                style={{ 
                    left: 60,
                    top: 80
                }}
             >
                <div className="flex items-center gap-4 mb-2">
                     <div className="h-1 w-12" style={{ backgroundColor: themeConfig.accent }} />
                    <p
                        style={{
                        color: themeConfig.accent,
                        fontSize: 20,
                        textTransform: 'uppercase',
                        letterSpacing: '0.2em',
                        fontWeight: 700,
                        }}
                    >
                        Review Order
                    </p>
                </div>
              <h1
                className="font-black leading-tight"
                style={{ 
                    color: themeConfig.text, 
                    fontSize: 72, 
                    fontFamily: fonts[font].family,
                    textShadow: `0 4px 20px ${themeConfig.bg}`
                 }}
              >
                THE MARATHON
              </h1>
              <p style={{ color: themeConfig.text, fontSize: 24, marginTop: 12, opacity: 0.6 }}>
                 {count} Movies • {Math.round(marathonMovies.reduce((acc, m) => acc + (m.vote_average || 0), 0) / count * 10) / 10} Avg Rating
              </p>
              <div 
                className="mt-10 pt-8 border-t" 
                style={{ borderColor: `${themeConfig.text}15`, width: '300px' }}
              >
                <p style={{ color: themeConfig.text, fontSize: 32, fontWeight: 600, opacity: 0.5, letterSpacing: '0.1em' }}>{watermarkText}</p>
              </div>
            </div>

            {/* Timeline axis */}
            <div
              className="absolute h-1.5 z-0"
              style={{ top: lineY, left: 0, right: 0, backgroundColor: `${themeConfig.text}20` }}
            />
             <div
              className="absolute h-1.5 z-0"
              style={{ 
                  top: lineY, 
                  left: 0, right: 0,
                  backgroundColor: themeConfig.accent,
                  opacity: 0.6
              }}
            />

            {/* Items */}
            {marathonMovies.map((movie, index) => {
                 const isTop = index % 2 !== 0; // Start bottom (index 0 isTop=false)
                 
                 // Dynamic positioning
                 const cx = leftPadding + index * itemWidth + (itemWidth / 2); // Center X using itemWidth
                 // Actually previous logic used left: leftPadding + index * itemWidth. And centered content in the width.
                 // Let's stick to the previous left logic but center content properly.
                 const leftPos = leftPadding + index * itemWidth;
                 
              return (
                <div
                   key={movie.id}
                   className="absolute top-0 bottom-0 pointer-events-none"
                   style={{
                       left: leftPos,
                       width: itemWidth,
                   }}
                >
                     {/* Connector Line */}
                     {/* 
                        Top Item: Connects from (lineY - radius) up to (lineY - radius - length)
                        Bottom Item: Connects from (lineY + radius) down to (lineY + radius + length)
                     */}
                     <div 
                        className="absolute w-1 bg-current opacity-40"
                        style={{
                            backgroundColor: themeConfig.accent,
                            left: '50%',
                            transform: 'translateX(-50%)',
                            top: isTop ? (lineY - dotRadius - connectorLength) : (lineY + dotRadius),
                            height: connectorLength
                        }}
                     />
                     
                    {/* Dot Center */}
                     <div
                        className="absolute left-1/2 flex items-center justify-center font-black z-10"
                        style={{
                            top: lineY,
                            transform: 'translate(-50%, -50%)',
                            width: dotSize,
                            height: dotSize,
                            borderRadius: '50%',
                            backgroundColor: themeConfig.bg,
                            border: `5px solid ${themeConfig.accent}`,
                            color: themeConfig.text,
                            fontSize: 28,
                            boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
                        }}
                     >
                         {index + 1}
                     </div>
                     
                     {/* Content Card */}
                     <div 
                        className={`absolute left-1/2 flex flex-col items-center text-center p-4 bg-transparent ${isTop ? 'justify-end' : 'justify-start'}`}
                        style={{
                            // Top item bottom edge = lineY - radius - length
                            bottom: isTop ? (1080 - (lineY - dotRadius - connectorLength)) : 'auto', 
                            // Bottom item top edge = lineY + radius + length
                            top: isTop ? 'auto' : (lineY + dotRadius + connectorLength),
                            
                            transform: 'translateX(-50%)',
                            width: 440, // Fixed width
                            height: 440, // Fixed height to ensure alignment
                        }}
                     >
                        {isTop && ( /* Title first for top items */
                             <div className="mb-4 w-full">
                                <p
                                className="font-bold leading-tight px-1 truncate w-full"
                                style={{
                                    color: themeConfig.text,
                                    fontSize: 28,
                                    fontFamily: fonts[font].family,
                                }}
                                >
                                {getTitle(movie)}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-1 opacity-90" style={{ color: themeConfig.text }}>
                                    <span className="text-lg font-medium">{getReleaseYear(movie)}</span>
                                    {showRatings && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                            <Star className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                                            <span className="text-lg font-bold">{movie.vote_average.toFixed(1)}</span>
                                        </>
                                    )}
                                </div>
                             </div>
                        )}

                         {/* Poster */}
                        <div
                        className="w-full rounded-xl overflow-hidden shadow-2xl relative z-20 shrink-0"
                        style={{ aspectRatio: '2/3', maxWidth: 220, border: `4px solid ${themeConfig.bg}` }}
                        >
                        {movie.poster_path && (
                            <img
                            src={getImageUrl(movie.poster_path, 'w342')}
                            alt={getTitle(movie)}
                            className="w-full h-full object-cover"
                            crossOrigin="anonymous"
                            />
                        )}
                        </div>

                        {!isTop && ( /* Title last for bottom items */
                             <div className="mt-4 w-full">
                                <p
                                className="font-bold leading-tight px-1 truncate w-full"
                                style={{
                                    color: themeConfig.text,
                                    fontSize: 28,
                                    fontFamily: fonts[font].family,
                                }}
                                >
                                {getTitle(movie)}
                                </p>
                                <div className="flex items-center justify-center gap-2 mt-1 opacity-90" style={{ color: themeConfig.text }}>
                                    <span className="text-lg font-medium">{getReleaseYear(movie)}</span>
                                    {showRatings && (
                                        <>
                                            <span className="w-1 h-1 rounded-full bg-current opacity-50" />
                                            <Star className="w-3.5 h-3.5 text-emerald-500 fill-current" />
                                            <span className="text-lg font-bold">{movie.vote_average.toFixed(1)}</span>
                                        </>
                                    )}
                                </div>
                             </div>
                        )}
                     </div>
                </div>
              )
            })}
          </div>
        )
      }
    }

    // Collage Layout - Overlapping artistic posters (images stay in top 60% of frame)
    if (layout === 'collage') {
      // Generate positions - keep all posters in top portion
      const generatePositions = () => {
        if (isVertical) {
          // Special centered layouts for few movies
          if (count === 2) {
            return [
              { top: '15%', left: '10%', width: '52%', rotate: -8, z: 2 },
              { top: '22%', right: '10%', width: '48%', rotate: 10, z: 1 },
            ]
          }
          if (count === 3) {
            return [
              { top: '10%', left: '8%', width: '46%', rotate: -10, z: 1 },
              { top: '14%', right: '8%', width: '44%', rotate: 12, z: 2 },
              { top: '28%', left: '22%', width: '50%', rotate: -2, z: 3 },
            ]
          }

          const positions = []
          const basePositions = [
            { top: '2%', left: '3%', width: '48%', rotate: -6, z: 3 },
            { top: '5%', right: '3%', width: '44%', rotate: 7, z: 2 },
            { top: '22%', left: '8%', width: '46%', rotate: 4, z: 5 },
            { top: '26%', right: '5%', width: '42%', rotate: -5, z: 4 },
            { top: '42%', left: '5%', width: '44%', rotate: -3, z: 6 },
            { top: '44%', right: '8%', width: '40%', rotate: 6, z: 1 },
            { top: '10%', left: '25%', width: '38%', rotate: 2, z: 7 },
            { top: '32%', right: '15%', width: '36%', rotate: -4, z: 2 },
            { top: '18%', left: '15%', width: '34%', rotate: 5, z: 8 },
            { top: '38%', left: '20%', width: '32%', rotate: -2, z: 3 },
          ]
          for (let i = 0; i < Math.min(count, 6); i++) {
            positions.push(basePositions[i])
          }
          return positions
        } else {
          // Special centered layouts for few movies
          if (count === 2) {
            return [
              { top: '18%', left: '22%', width: '26%', rotate: -6, z: 1 },
              { top: '22%', right: '22%', width: '26%', rotate: 8, z: 2 },
            ]
          }
          if (count === 3) {
            return [
              { top: '15%', left: '12%', width: '22%', rotate: -8, z: 1 },
              { top: '12%', left: '38%', width: '24%', rotate: 5, z: 2 },
              { top: '18%', right: '12%', width: '22%', rotate: -4, z: 3 },
            ]
          }

          // Horizontal positions - spread across top 65% of screen
          const positions = []
          const basePositions = [
            { top: '5%', left: '2%', width: '22%', rotate: -6, z: 3 },
            { top: '8%', left: '18%', width: '20%', rotate: 5, z: 2 },
            { top: '2%', left: '35%', width: '24%', rotate: -3, z: 5 },
            { top: '6%', left: '55%', width: '21%', rotate: 4, z: 4 },
            { top: '4%', right: '2%', width: '23%', rotate: -5, z: 6 },
            { top: '35%', left: '5%', width: '20%', rotate: 7, z: 1 },
            { top: '28%', left: '25%', width: '18%', rotate: -8, z: 7 },
            { top: '32%', left: '45%', width: '22%', rotate: 6, z: 2 },
            { top: '25%', right: '22%', width: '19%', rotate: -4, z: 8 },
            { top: '38%', right: '8%', width: '21%', rotate: 3, z: 3 },
          ]
          for (let i = 0; i < Math.min(count, 6); i++) {
            positions.push(basePositions[i])
          }
          return positions
        }
      }

      const positions = generatePositions()

      return (
        <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
          {/* Gradient background */}
          <div
            className="absolute inset-0"
            style={{
              background: `radial-gradient(ellipse at center top, ${themeConfig.accent}25 0%, transparent 60%)`,
            }}
          />

          {/* Scattered Posters - contained in top portion */}
          {marathonMovies.slice(0, positions.length).map((movie, index) => {
            const pos = positions[index]
            const style: React.CSSProperties = {
              position: 'absolute',
              width: pos.width,
              aspectRatio: '2/3',
              transform: `rotate(${pos.rotate}deg)`,
              zIndex: pos.z,
              borderRadius: 16,
              overflow: 'hidden',
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6)`,
            }
            if ('top' in pos) style.top = pos.top
            if ('left' in pos) style.left = pos.left
            if ('right' in pos) style.right = pos.right

            return (
              <div key={movie.id} style={style}>
                {movie.poster_path && (
                  <img
                    src={getImageUrl(movie.poster_path, 'w500')}
                    alt={getTitle(movie)}
                    className="w-full h-full object-cover"
                    crossOrigin="anonymous"
                  />
                )}
              </div>
            )
          })}

          {/* Title Overlay - solid background at bottom */}
          <div
            className="absolute bottom-0 left-0 right-0"
            style={{
              background: `linear-gradient(to top, ${themeConfig.bg} 0%, ${themeConfig.bg} ${isVertical ? '70%' : '90%'}, ${themeConfig.bg}ee ${isVertical ? '85%' : '95%'}, transparent 100%)`,
              padding: isVertical ? '180px 48px 60px' : '140px 60px 40px',
              zIndex: 20,
              display: 'flex',
              flexDirection: isVertical ? 'column' : 'row',
              alignItems: isVertical ? 'flex-start' : 'flex-end',
              justifyContent: 'space-between',
              gap: 40
            }}
          >
            <div className={isVertical ? "w-full" : "w-1/3 shrink-0"}>
                <h1
                className="font-black leading-none"
                style={{
                    color: themeConfig.text,
                    fontSize: isVertical ? 96 : 84,
                    fontFamily: fonts[font].family,
                }}
                >
                MARATHON NIGHT
                </h1>
                <p style={{ color: themeConfig.accent, fontSize: isVertical ? 40 : 32, marginTop: 12, fontWeight: 600 }}>
                {count} films lined up
                </p>
                {isVertical && (
                    <div 
                        className="mt-12 grid gap-x-10 gap-y-6"
                        style={{ 
                            gridTemplateColumns: 'repeat(2, 1fr)',
                            width: '100%'
                        }}
                    >
                        {marathonMovies.slice(0, 6).map((movie, idx) => (
                            <div key={movie.id} className="flex items-center gap-4">
                                <div 
                                    className="size-12 rounded-lg flex items-center justify-center font-black shrink-0 shadow-lg"
                                    style={{ 
                                        backgroundColor: themeConfig.accent, 
                                        color: themeConfig.bg,
                                        fontSize: 24
                                    }}
                                >
                                    {idx + 1}
                                </div>
                                <div className="flex flex-col min-w-0">
                                    <span 
                                        className="font-bold truncate" 
                                        style={{ 
                                            color: themeConfig.text,
                                            fontSize: 28, 
                                            fontFamily: fonts[font].family,
                                            letterSpacing: '-0.02em'
                                        }}
                                    >
                                        {getTitle(movie)}
                                    </span>
                                    <div className="flex items-center gap-3">
                                        <span style={{ color: themeConfig.text, fontSize: 18, opacity: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                            {getReleaseYear(movie)}
                                        </span>
                                        {showRatings && (
                                            <div className="flex items-center gap-1">
                                                <Star className="size-4 fill-current" style={{ color: themeConfig.accent }} />
                                                <span style={{ color: themeConfig.text, fontSize: 18, fontWeight: 800 }}>
                                                    {movie.vote_average.toFixed(1)}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                <p style={{ color: themeConfig.text, fontSize: isVertical ? 24 : 20, marginTop: 32, opacity: 0.6 }}>
                {watermarkText}
                </p>
            </div>

            {!isVertical && (
                <div 
                    className="flex-1 grid gap-x-10 gap-y-4 content-end mb-2"
                    style={{ 
                        gridTemplateColumns: count > 5 ? 'repeat(2, 1fr)' : '1fr',
                        maxWidth: '60%'
                    }}
                >
                    {marathonMovies.slice(0, 6).map((movie, idx) => (
                        <div key={movie.id} className="flex items-center gap-4 group">
                             <div 
                                className="size-12 rounded-lg flex items-center justify-center font-black shrink-0 shadow-lg"
                                style={{ 
                                    backgroundColor: themeConfig.accent, 
                                    color: themeConfig.bg,
                                    fontSize: 24
                                }}
                             >
                                {idx + 1}
                             </div>
                             <div className="flex flex-col min-w-0">
                                <span 
                                    className="font-bold truncate text-white" 
                                    style={{ 
                                        fontSize: count > 6 ? 22 : 28, 
                                        fontFamily: fonts[font].family,
                                        letterSpacing: '-0.02em'
                                    }}
                                >
                                    {getTitle(movie)}
                                </span>
                                <div className="flex items-center gap-3">
                                    <span style={{ color: 'white', fontSize: 16, opacity: 0.5, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                                        {getReleaseYear(movie)}
                                    </span>
                                    {showRatings && (
                                        <div className="flex items-center gap-1">
                                            <Star className="size-4 fill-current text-white opacity-80" />
                                            <span style={{ color: 'white', fontSize: 18, fontWeight: 800 }}>
                                                {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                             </div>
                        </div>
                    ))}
                </div>
            )}
          </div>
        </div>
      )
    }

    // Minimal Layout - Clean list view filling the frame
    if (layout === 'minimal') {
      const itemHeight = isVertical
        ? Math.floor((1920 - 260) / count)
        : Math.floor((1080 - 180) / Math.ceil(count / 2))

      if (isVertical) {
        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
            {/* Header */}
            <div className="absolute top-0 left-0 right-0 p-12">
              <p
                style={{
                  color: themeConfig.accent,
                  fontSize: 26,
                  textTransform: 'uppercase',
                  letterSpacing: '0.3em',
                  fontWeight: 600,
                }}
              >
                Marathon
              </p>
              <h1
                className="font-black"
                style={{ color: themeConfig.text, fontSize: 84, fontFamily: fonts[font].family }}
              >
                {count} Movies
              </h1>
            </div>

            {/* Movie List */}
            <div className="absolute left-0 right-0 top-[220px] bottom-[80px] flex flex-col px-8">
              {marathonMovies.map((movie, index) => (
                <div
                  key={movie.id}
                  className="flex items-center gap-6 px-6 rounded-xl"
                  style={{
                    height: itemHeight,
                    backgroundColor: index % 2 === 0 ? `${themeConfig.text}06` : 'transparent',
                  }}
                >
                  {/* Number */}
                  <span
                    className="font-black w-20 text-center shrink-0"
                    style={{ color: `${themeConfig.text}35`, fontSize: 56 }}
                  >
                    {index + 1}
                  </span>
                  {/* Poster */}
                  <div
                    className="rounded-xl overflow-hidden shrink-0 bg-muted"
                    style={{ height: '82%', aspectRatio: '2/3' }}
                  >
                    {movie.poster_path ? (
                      <img
                        src={getImageUrl(movie.poster_path, 'w342')}
                        alt={getTitle(movie)}
                        className="w-full h-full object-cover"
                        crossOrigin="anonymous"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center" style={{ backgroundColor: `${themeConfig.text}10` }}>
                        <span style={{ color: `${themeConfig.text}40`, fontSize: 40 }}>?</span>
                      </div>
                    )}
                  </div>
                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <p
                      className="font-bold leading-tight"
                      style={{
                        color: themeConfig.text,
                        fontSize: count <= 5 ? 44 : 36,
                        fontFamily: fonts[font].family,
                      }}
                    >
                      {getTitle(movie)}
                    </p>
                    <p style={{ color: `${themeConfig.text}66`, fontSize: 28, marginTop: 6 }}>
                      {getReleaseYear(movie)}
                    </p>
                  </div>
                  {/* Rating */}
                  {showRatings && (
                    <div className="flex items-center gap-3 shrink-0">
                      <Star style={{ width: 36, height: 36, color: themeConfig.accent, fill: themeConfig.accent }} />
                      <span style={{ color: themeConfig.text, fontSize: 36, fontWeight: 700 }}>
                        {movie.vote_average.toFixed(1)}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Watermark */}
            <div className="absolute bottom-6 left-0 right-0 text-center">
              <p style={{ color: themeConfig.text, fontSize: 24, opacity: 0.5 }}>{watermarkText}</p>
            </div>
          </div>
        )
      } else {
        // Horizontal minimal - Adaptive Grid
        // Determine grid sizing based on count
        const cols = count <= 3 ? count : (count <= 6 ? 3 : (count <= 10 ? 5 : 6));
        const rows = Math.ceil(count / cols);
        
        return (
          <div className="relative w-full h-full overflow-hidden" style={{ backgroundColor: themeConfig.bg }}>
            {/* Header */}
            <div className="absolute top-8 left-12 right-12 flex justify-between items-start" style={{ zIndex: 20 }}>
                <div className="flex flex-col">
                    <p
                        style={{
                        color: themeConfig.text,
                        fontSize: 18,
                        textTransform: 'uppercase',
                        letterSpacing: '0.4em',
                        fontWeight: 800,
                        opacity: 0.5
                        }}
                    >
                        Marathon
                    </p>
                    <h1
                        className="font-black leading-none mt-2"
                        style={{ color: themeConfig.text, fontSize: 84, fontFamily: fonts[font].family, letterSpacing: '-0.02em' }}
                    >
                        {count} MOVIES
                    </h1>
                </div>
                <p style={{ 
                    color: themeConfig.text, 
                    fontSize: 22, 
                    opacity: 0.4, 
                    fontWeight: 500,
                    letterSpacing: '0.05em',
                    marginTop: 12
                }}>
                    {watermarkText}
                </p>
            </div>

            {/* Grid Container */}
            <div className="absolute left-0 right-0 top-[180px] bottom-[40px] px-12 pb-4">
                 <div 
                    className="grid w-full h-full gap-6"
                    style={{
                        gridTemplateColumns: `repeat(${cols}, 1fr)`,
                        gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))`,
                    }}
                >
                    {marathonMovies.map((movie, index) => (
                        <div
                            key={movie.id}
                            className="flex gap-5 p-4 rounded-xl items-stretch overflow-hidden"
                             style={{
                                backgroundColor: `${themeConfig.text}08`,
                                border: `1px solid ${themeConfig.text}10`,
                                boxShadow: '0 10px 30px -10px rgba(0,0,0,0.3)'
                            }}
                        >
                            {/* Poster */}
                             <div
                                className="h-full rounded-lg overflow-hidden shrink-0 bg-muted shadow-2xl aspect-[2/3] relative"
                                style={{ 
                                    backgroundColor: `${themeConfig.text}10` 
                                }}
                                >
                                {movie.poster_path ? (
                                    <img
                                    src={getImageUrl(movie.poster_path, 'w500')}
                                    alt={getTitle(movie)}
                                    className="w-full h-full object-cover"
                                    crossOrigin="anonymous"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center opacity-20">
                                        <Monitor size={32} />
                                    </div>
                                )}
                            </div>
                            
                            {/* Details */}
                            <div className="flex-1 flex flex-col min-w-0">
                                <div className="flex flex-col grow">
                                    <span
                                        className="font-black leading-none mb-2 mt-1"
                                        style={{ color: themeConfig.accent, fontSize: 32, opacity: 0.9 }}
                                    >
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    
                                    <p
                                        className="font-bold leading-tight line-clamp-2"
                                        style={{
                                        color: themeConfig.text,
                                        fontSize: count <= 4 ? 44 : (count <= 6 ? 36 : 28),
                                        fontFamily: fonts[font].family,
                                        }}
                                    >
                                        {getTitle(movie)}
                                    </p>
                                </div>
                                
                                <div className="mt-auto flex items-center justify-between pt-4 border-t" style={{ borderColor: `${themeConfig.text}10` }}>
                                    <span style={{ 
                                        color: themeConfig.text, 
                                        fontSize: 20, 
                                        fontWeight: 600,
                                        opacity: 0.5
                                    }}>
                                        {getReleaseYear(movie)}
                                    </span>
                                    
                                     {showRatings && (
                                        <div className="flex items-center gap-2">
                                            <Star className="size-5 fill-current" style={{ color: themeConfig.accent }} />
                                            <span style={{ color: themeConfig.text, fontSize: 24, fontWeight: 800 }}>
                                                {movie.vote_average.toFixed(1)}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                 </div>
            </div>
          </div>
        )
      }
    }

    return null
  }

  // Controls panel
  const renderControls = () => (
    <>
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
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {presets.map((preset) => (
            <Button
              key={preset.name}
              variant={layout === preset.layout && accentColor === preset.accentColor ? 'default' : 'outline'}
              size="sm"
              onClick={() => {
                setLayout(preset.layout)
                setAccentColor(preset.accentColor)
              }}
              className="justify-start text-xs gap-2 w-full truncate"
            >
              <span className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: preset.accentColor }} />
              <span className="truncate">{preset.name}</span>
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
            <div className="w-8 h-8 rounded-lg shadow-inner border border-white/20" style={{ backgroundColor: accentColor }} />
            <div className="flex-1 text-left">
              <span className="text-sm font-medium">{accentColor.toUpperCase()}</span>
              <p className="text-xs text-muted-foreground">Click to change</p>
            </div>
            <ChevronDown className={`size-4 text-muted-foreground transition-transform ${showColorPicker ? 'rotate-180' : ''}`} />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 right-0 mt-2 z-50">
              <div className="fixed inset-0" onClick={() => setShowColorPicker(false)} />
              <div className="relative rounded-lg border border-border shadow-xl overflow-hidden bg-[#0a0a0a]">
                <ChromePicker
                  color={accentColor}
                  onChange={(color: ColorResult) => setAccentColor(color.hex)}
                  disableAlpha
                />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Movie List */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-semibold flex items-center gap-2">
            <Star className="size-4" />
            Movies ({marathonMovies.length})
          </h3>
          <Button variant="ghost" size="sm" onClick={() => setShowRatings(!showRatings)} className="text-xs">
            {showRatings ? 'Hide Ratings' : 'Show Ratings'}
          </Button>
        </div>
        <div className="space-y-2 max-h-48 overflow-y-auto">
          {marathonMovies.map((movie, index) => (
            <div
              key={movie.id}
              draggable
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => handleDragOver(e, index)}
              onDragEnd={handleDragEnd}
              className={`flex items-center gap-2 p-2 rounded-lg border border-border bg-card cursor-move ${
                draggedIndex === index ? 'opacity-50' : ''
              }`}
            >
              <GripVertical className="size-4 text-muted-foreground shrink-0" />
              <span className="text-xs text-muted-foreground w-4">{index + 1}</span>
              <div className="w-8 h-12 rounded overflow-hidden shrink-0 bg-muted">
                {movie.poster_path && (
                  <img src={getImageUrl(movie.poster_path, 'w92')} alt="" className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{getTitle(movie)}</p>
                <p className="text-xs text-muted-foreground">{getReleaseYear(movie)}</p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="size-8 shrink-0 text-destructive hover:text-destructive"
                onClick={() => onRemoveMovie(movie.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      {/* Advanced Options */}
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
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(Object.keys(layouts) as MarathonLayoutType[]).map((l) => (
                  <Button
                    key={l}
                    variant={layout === l ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setLayout(l)}
                    className="justify-start text-xs flex-col items-start h-auto py-2 w-full overflow-hidden"
                  >
                    <span className="font-bold truncate w-full text-left">{layouts[l].name}</span>
                    <span className="text-[10px] opacity-60 truncate w-full text-left">{layouts[l].description}</span>
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
              <div className="grid grid-cols-2 gap-2">
                {(Object.keys(fonts) as FontType[]).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFont(f)}
                    className={`w-full p-2.5 rounded-lg border text-left transition-all relative overflow-hidden group ${
                      font === f 
                        ? 'border-primary bg-primary/10 ring-1 ring-primary' 
                        : 'border-white/10 hover:border-white/20 bg-white/5'
                    }`}
                  >
                    <div className="relative z-10">
                      <span className={`text-[9px] uppercase tracking-wider font-bold block mb-1 ${
                        font === f ? 'text-primary' : 'text-muted-foreground'
                      }`}>
                        {fonts[f].name}
                      </span>
                      <div 
                        className="text-base font-bold leading-none"
                        style={{ fontFamily: fonts[f].family }}
                      >
                        {fonts[f].preview}
                      </div>
                    </div>
                    {font === f && (
                      <div className="absolute right-2 top-2">
                        <div className="size-1.5 rounded-full bg-primary animate-pulse" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  )

  // Export buttons
  const renderExportButtons = () => (
    <div className="space-y-2">
      {canShare && (
        <Button onClick={handleShare} disabled={isSharing || isExporting} className="w-full" size="lg">
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
  )

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col md:flex-row transition-all duration-300 ease-out ${
        isVisible && !isClosing ? 'bg-black/90 backdrop-blur-sm' : 'bg-black/0 backdrop-blur-none'
      }`}
    >
      {/* Desktop Sidebar Controls */}
      <div
        className={`hidden md:flex w-80 bg-card border-r border-border flex-col overflow-hidden transition-transform duration-300 ease-out ${
          isVisible && !isClosing ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-bold">Marathon Studio</h2>
          <Button variant="ghost" size="icon" onClick={handleClose}>
            <X className="size-5" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-6">
          {renderControls()}
        </div>

        <div className="p-4 border-t border-border">
          {renderExportButtons()}
        </div>
      </div>

      {/* Mobile Header */}
      <div className="flex md:hidden items-center justify-between p-3 bg-card border-b border-border">
        <h2 className="text-base font-bold">Marathon Studio</h2>
        <Button variant="ghost" size="icon" onClick={handleClose} className="size-9">
          <X className="size-5" />
        </Button>
      </div>

      {/* Preview Area */}
      <div
        ref={previewContainerRef}
        className="flex-1 flex items-center justify-center p-2 sm:p-3 md:p-6 overflow-hidden min-h-0 cursor-pointer"
        onClick={(e) => {
          if (e.target === e.currentTarget && !isMobile) handleClose()
        }}
      >
        <div
          className={`relative shadow-2xl rounded-lg overflow-hidden select-none transition-opacity duration-300 ease-out max-w-full max-h-full cursor-default ${
            isVisible && !isClosing ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            width: Math.min(width * previewScale, previewSize.width || window.innerWidth - 24),
            height: Math.min(height * previewScale, previewSize.height || window.innerHeight * 0.6),
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
            {renderMarathonContent()}
          </div>
        </div>
      </div>

      {/* Mobile Bottom Bar */}
      <div className="md:hidden bg-card border-t border-border">
        <div className="flex items-center gap-2 p-3">
          <div className="flex-1 flex gap-2">
            {canShare && (
              <Button onClick={handleShare} disabled={isSharing || isExporting} className="flex-1" size="default">
                <Share2 className="size-4 mr-1.5" />
                {isSharing ? 'Sharing...' : 'Share'}
              </Button>
            )}
            <Button
              onClick={handleExport}
              disabled={isExporting || isSharing}
              variant={canShare ? 'outline' : 'default'}
              className="flex-1"
              size="default"
            >
              <Download className="size-4 mr-1.5" />
              {isExporting ? 'Exporting...' : 'Download'}
            </Button>
          </div>
          <Button variant="outline" size="icon" onClick={() => setMobileControlsOpen(!mobileControlsOpen)} className="shrink-0">
            <SlidersHorizontal className={`size-4 transition-transform ${mobileControlsOpen ? 'rotate-180' : ''}`} />
          </Button>
        </div>

        <div
          className={`bg-card border-t border-border overflow-hidden transition-all duration-300 ease-out ${
            mobileControlsOpen ? 'max-h-[50vh]' : 'max-h-0'
          }`}
        >
          <div className="overflow-y-auto max-h-[50vh] p-4 space-y-6">
            {renderControls()}
          </div>
        </div>
      </div>
    </div>
  )
}
