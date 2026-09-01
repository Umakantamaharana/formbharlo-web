# FormBharlo Web Portal (Frontend)

> Production-grade Next.js web application for **FormBharlo** (*Har Sarkari Bharti, Ek Jagah*), optimized for Google AdSense monetization, Google Jobs rich snippets, sub-second page loads, and high-conversion recruitment notice presentation.

---

## 🛠️ Technology Stack

- **Framework**: [Next.js 16.3.3](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) with `@tailwindcss/typography`
- **Icons**: [Lucide React](https://lucide.dev/)
- **Markdown Rendering**: [react-markdown](https://github.com/remarkjs/react-markdown)
- **Deployment**: Vercel / Netlify / Self-hosted Node.js

---

## 📂 Directory Layout

```
career/
├── src/
│   ├── app/
│   │   ├── layout.tsx                # Root layout, AdSense loader, Schema injection, Theme detector
│   │   ├── page.tsx                  # SSR Homepage (Breaking ticker, 4-Box Matrix, Category Feed)
│   │   ├── globals.css               # Tailwind CSS v4 tokens, Light/Dark theme styles
│   │   ├── sitemap.ts                # Dynamic /sitemap.xml for 1,400+ job routes
│   │   ├── robots.ts                 # Dynamic /robots.txt with crawler directives
│   │   ├── job/[id]/page.tsx         # Job details page with At-a-Glance table & Google Jobs JSON-LD
│   │   ├── admin/                    # Admin portal with search, filter, and live status toggles
│   │   ├── (static)/                 # Compliance pages: /about, /contact, /privacy, /terms
│   │   ├── ads.txt/route.ts          # IAB-standard /ads.txt digital sellers route
│   │   ├── feed.xml/route.ts         # RSS 2.0 dynamic feed route
│   │   └── api/                      # Backend API routes for jobs & admin authentication
│   │
│   ├── components/
│   │   ├── Header.tsx                # Sticky navbar, category shortcuts, WhatsApp/Telegram badges
│   │   ├── ThemeToggle.tsx           # Accessible Light/Dark mode switcher (useSyncExternalStore)
│   │   ├── BreakingTicker.tsx        # High-visibility ticker for urgent exam & result announcements
│   │   ├── SarkariMatrix.tsx         # 4-Box grid: Top Forms, Admit Cards, Results, Answer Keys
│   │   ├── JobCard.tsx               # High-contrast recruitment card with direct action buttons
│   │   ├── JobFilterFeed.tsx         # Interactive search, category pill filters, and interleaved ads
│   │   ├── MarkdownContent.tsx       # Custom markdown parser with verified badges & tables
│   │   ├── AdBanner.tsx              # Zero Cumulative Layout Shift (CLS) responsive ad containers
│   │   ├── AdSenseScript.tsx         # Dynamic Google AdSense script injector
│   │   └── CommunityBanner.tsx       # Telegram & WhatsApp channel acquisition cards
│   │
│   ├── services/
│   │   ├── serverJobService.ts       # Multi-tier data ingestion, in-memory caching & link normalizer
│   │   └── jobService.ts             # Client-side API fetcher
│   │
│   └── types.ts                      # Strict TypeScript definitions for Job, Status, and Content
│
├── public/                           # Static assets, fallback database (latest_jobs.json)
├── tailwind.config.ts                # Tailwind typography plugin configuration
├── package.json
└── .env.example                      # Environment variable template
```

---

## ⚙️ Environment Variables

Create a `.env.local` file in the root of the `career` directory:

```env
# Base Production URL (used for Canonical URLs, OpenGraph, Sitemaps)
NEXT_PUBLIC_SITE_URL=https://career135.com

# Google AdSense Publisher ID (e.g. ca-pub-XXXXXXXXXXXXXXXX)
NEXT_PUBLIC_ADSENSE_CLIENT_ID=ca-pub-XXXXXXXXXXXXXXXX

# Admin Portal Authentication
ADMIN_PASSWORD=your_secure_admin_password
ADMIN_SECRET_KEY=your_jwt_or_session_secret_key

# Optional: GitHub PAT for direct commits from the Admin portal
GITHUB_PAT=ghp_your_github_personal_access_token
```

---

## 🚦 Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts local Next.js development server at `http://localhost:3000` |
| `npm run build` | Compiles application with Turbopack and pre-renders static SSG routes |
| `npm start` | Starts the production Next.js server |
| `npm run lint` | Runs ESLint and TypeScript strict type-checking |

---

## 🎯 Key Architectural Highlights

### 1. Zero Cumulative Layout Shift (CLS) Ad Architecture
- `AdBanner.tsx` pre-reserves precise CSS aspect ratios for Leaderboards (728x90 desktop / 320x50 mobile), In-Feed Native banners, and Sticky Skyscraper units (300x600).
- Content never jumps when AdSense ads finish loading, maintaining a **100/100 Core Web Vitals** performance score.

### 2. Multi-Tier Data Ingestion & Caching
- `serverJobService.ts` automatically checks the backend monorepo (`../job-scrapper-backend/latest_jobs.json`) first, then falls back to local `public/latest_jobs.json` or the remote GitHub API.
- Implements an **in-memory RAM cache (`TTL = 10 mins`)** to ensure builds and server requests don't repeatedly redownload or reparse JSON data.

### 3. Dual Light / Dark Theme Engine
- Defaults to a crisp, high-contrast **Light Theme** tailored for daytime reading.
- Includes a dedicated `ThemeToggle` component powered by `useSyncExternalStore` and inline `<head>` execution to prevent any flash of unstyled theme (FOUC).

### 4. Search Engine Optimization (SEO)
- Every `/job/[id]` route injects standard **Schema.org `JobPosting`** and **`BreadcrumbList`** structured data for Google Jobs rich cards.
- Root layout injects **`WebSite` (with SitelinksSearchBox)** and **`Organization`** schemas.
- Dynamically generated `/sitemap.xml` and `/feed.xml` update automatically as new jobs are published.
