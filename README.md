# Vayu Intel — Air Quality Intelligence Platform

A React + Vite frontend for **Vayu Intel**, India's Air Quality Intelligence & Early Warning System. Built on top of a Stitch-designed UI, converted to a fully navigable React application.

## Pages

| Route | Page |
|---|---|
| `/` | Main Dashboard — AQI overview, spatial hotspot map, trend chart |
| `/live` | Live Station Telemetry — real-time sensor readings across 38 stations |
| `/forecast` | 48-Hour AQI Predictive Forecast — WRF-Chem ensemble model output |
| `/sources` | Pollution Source Intelligence — vehicular, dust, industrial attribution |
| `/alerts` | Alerts & Health Advisories — GRAP-based action protocols |
| `/transparency` | Data Sources & Model Transparency — open science governance |

## Tech Stack

- **React 18** + **React Router v6**
- **Vite 5** build tooling
- **Tailwind CSS v3** with a full custom Vayu design system
- **Google Fonts** — Inter, Plus Jakarta Sans, JetBrains Mono, Material Symbols

## Design System

All colors, spacing, and typography tokens are ported directly from the original Stitch prototype and defined in `tailwind.config.js`. Key brand colors:

- `primary`: `#003527` — deep forest green
- `secondary`: `#006a61` — teal
- `error`: `#ba1a1a` — alert red

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Production build
npm run build

# Preview production build
npm run preview
```

## Data

All values shown are **illustrative demonstration data** (MVP synthetic baseline). No live API connections are active. Labels are clearly marked "Illustrative MVP Demo Data" throughout the UI.

## Notes

- The original Stitch HTML files are preserved in `../stitch_air_quality_intelligence_platform/` and were not modified.
- The logo (`public/vayu-logo.svg`) is a locally hosted SVG asset using the brand color palette.
