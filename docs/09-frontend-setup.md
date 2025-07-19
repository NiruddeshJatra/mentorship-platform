# Step 7: Frontend Setup (Vite + React + TypeScript)

## Overview
The frontend is built with Vite, React, and TypeScript for fast development, type safety, and a modern developer experience.

## Folder Structure
```
frontend/
├── src/
│   ├── assets/         # Static assets (images, logos, etc.)
│   ├── components/     # Reusable UI components
│   ├── pages/          # Top-level route components/pages
│   ├── App.tsx         # Main app component
│   ├── main.tsx        # Entry point
│   └── vite-env.d.ts   # Vite type definitions
├── public/
│   └── vite.svg        # Public assets
├── index.html          # HTML entry point
├── package.json        # Project metadata and scripts
├── tsconfig.json       # TypeScript config (project references)
├── tsconfig.app.json   # TypeScript config (app)
├── tsconfig.node.json  # TypeScript config (node)
├── vite.config.ts      # Vite config
├── .gitignore          # Git ignore rules
├── README.md           # Frontend-specific readme
└── eslint.config.js    # ESLint config
```

## Running the Frontend Locally
```sh
cd frontend
npm install
npm run dev
```

## Conventions & Best Practices
- Place reusable UI in `src/components/`
- Place top-level route components in `src/pages/`
- Static assets (images, logos) go in `src/assets/` or `public/`
- Use TypeScript for all code
- Use functional components and hooks
- Keep code modular and organized

## Next Steps
- Implement the homepage/landing page as the first route in `src/pages/Home.tsx`
- Set up routing (e.g., with react-router-dom) if not already
- See the [main README](../README.md) for overall project context and roadmap 