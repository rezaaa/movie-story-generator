# 🎬 Movie Story Generator

[![GitHub stars](https://img.shields.io/github/stars/rezaaa/movie-story-generator?style=social)](https://github.com/rezaaa/movie-story-generator)

Create stunning Instagram stories and social media posts from your favorite movies and TV series. Turn your movie taste into beautiful, shareable designs in seconds.

## ✨ Features

- **🔍 Search Everything** - Find any movie or TV series from TMDB's massive database.
- **🖼️ Two Unique Modes:**
  - **Single Story:** Focus on one masterpiece with deep customization.
  - **Marathon Mode:** Create lists, rankings, or bundles of up to 6 movies.
- **🎨 11+ Unique Layouts:**
  - **Single:** Classic, Modern, Cinematic, Minimal, Glassmorphic, Split.
  - **Marathon:** Artistic (Collage), Grid, Ranked, Timeline, Minimal.
- **📱 Built for Social** - Export in Vertical (1080x1920) for Stories or Horizontal (1920x1080) for posts.
- **🪄 Smart Suggestions** - Use the "Magic Wand" to generate themed marathons based on genres and ratings.
- **🌈 Deep Customization:**
  - Dark & Light themes.
  - Custom accent colors & backgrounds.
  - 8+ Premium typography options (Oswald, Cinzel, Bebas Neue, etc.).
  - Custom ratings & watermark support.
- **💾 High-Quality Export** - Download your creations as high-resolution PNGs.

## 🚀 Quick Start

1. Clone the repo
```bash
git clone git@github.com:rezaaa/movie-story-generator.git
cd movie-story-generator
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.local.example .env.local
```

4. Get your TMDB API key from [themoviedb.org](https://www.themoviedb.org/settings/api) and add it to `.env.local`

5. Run the dev server
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) and start creating!

## ⚙️ Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key (Required) |
| `NEXT_PUBLIC_TMDB_API_URL` | `https://api.themoviedb.org/3` |
| `NEXT_PUBLIC_TMDB_IMAGE_URL` | `https://image.tmdb.org/t/p` |
| `NEXT_PUBLIC_WATERMARK_TEXT` | Custom watermark text (Optional) |

## 🛠️ Tech Stack

- **[Next.js 16](https://nextjs.org/)** - React Framework
- **[React 19](https://react.dev/)** - UI Library
- **Tailwind CSS 4** - Styling
- **shadcn/ui** - Component Library
- **TMDB API** - Movie & TV Data
- **html-to-image** - Client-side export magic

## 🤝 Contributing

Found a bug? Have a cool idea? Want to add a new font or layout?

1. Fork it
2. Create your feature branch (`git checkout -b feature/cool-new-thing`)
3. Commit your changes (`git commit -m 'Add awesome feature'`)
4. Push to the branch (`git push origin feature/cool-new-thing`)
5. Open a Pull Request

## 📄 License

MIT - Do whatever you want with it.

---

Made by [Reza Mahmoudi](https://x.com/rezamahmoudii)
