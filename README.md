|English|[中文版](README.zh-CN.md)|
|-------|---------------------|

# PolicyGame

A modern game project based on Next.js, focusing on policy simulation and decision analysis.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ (recommended)
- pnpm (preferred) or npm/yarn

### Installation
```bash
pnpm install
```

### Development
```bash
pnpm dev
```

### Production Build
```bash
pnpm build
```

The static site is generated in `out/`; `next start` does not serve static exports.

### GitHub Pages deployment

1. In the repository's **Settings → Pages → Build and deployment**, set **Source** to **GitHub Actions**. Deploying from the source branch runs Jekyll and publishes this README instead of the game.
2. Push to `main`, or run **Deploy Next.js site to Pages** from the Actions tab. The workflow builds and uploads `out/`.
3. Wait for both the build and deploy jobs to succeed, then open `https://ugnjhjf.github.io/PolicyGame/`.

The workflow uses the Pages base path for scripts, navigation, and public assets. Local production builds default to `/PolicyGame`; set `NEXT_PUBLIC_BASE_PATH` before building to target a different path (or an empty string for root hosting). Routes export as directories so direct visits to `/story/`, `/chapter/`, and `/game/` work on static hosting. The exported `.nojekyll` file preserves `_next` assets when using branch publishing.



The app will run at http://localhost:3000

## 🛠️ Tech Stack

- **Next.js 15** - React full-stack framework
- **React 19** - User interface library
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework
- **shadcn/ui** - High-quality UI component library
- **Radix UI** - Accessible component primitives

## 📁 Project Structure

```
PolicyGame/
├── app/                    # Next.js app directory
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page
├── components/            # Components directory
│   └── ui/               # UI component library
├── config/               # Configuration files
├── hooks/                # React Hooks
├── lib/                  # Utility libraries
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎯 Development Guidelines

- Use TypeScript for type-safe development
- Follow Tailwind CSS styling conventions
- Leverage shadcn/ui component library for UI building
- Keep code clean and maintainable

## 📄 License

This project currently has no license file. Please add one as needed.

---

*Project is under development. Contributions and suggestions are welcome!*
