# Movie Story Generator

Create stunning Instagram stories and social media posts from your favorite movies and TV series. Because your taste in movies deserves to look as good as it sounds.

## Features

- **Search Everything** - Find any movie or TV series from TMDB's massive database
- **6 Unique Layouts** - Premiere, Nostalgia, Neon, Noir, Frost, and Duality
- **Multiple Sizes** - Vertical (1080x1920) for Stories, Horizontal (1920x1080) for posts
- **Dark & Light Themes** - For the vampires and the early birds
- **Custom Colors** - Pick any accent color you want
- **Typography Options** - 7 fonts to match your vibe
- **Custom Ratings** - Rate movies your way (we won't judge)
- **Watermark Support** - Brand your creations
- **Export & Share** - Download as PNG or share directly

## Quick Start

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

## Environment Variables

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_TMDB_API_KEY` | Your TMDB API key (required) |
| `NEXT_PUBLIC_TMDB_API_URL` | TMDB API base URL |
| `NEXT_PUBLIC_WATERMARK_TEXT` | Custom watermark text |

## Tech Stack

- **Next.js 15** - React framework
- **Tailwind CSS** - Styling
- **shadcn/ui** - UI components
- **TMDB API** - Movie & TV data
- **html-to-image** - Export magic

## Contributing

Found a bug? Have a cool idea? Want to add a "Nicolas Cage Appreciation Mode"?

1. Fork it
2. Create your feature branch (`git checkout -b feature/cage-mode`)
3. Commit your changes (`git commit -m 'Add Nicolas Cage easter egg'`)
4. Push to the branch (`git push origin feature/cage-mode`)
5. Open a Pull Request

All contributions are welcome - from fixing typos to adding new layouts. Just keep it fun!

## License

MIT - Do whatever you want with it.

---

Made with popcorn by [Reza Mahmoudi](https://x.com/rezamahmoudii)
