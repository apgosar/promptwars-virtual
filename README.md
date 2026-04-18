# 🏟️ EventXP: Premium Stadium Experience Portal

**EventXP** is a state-of-the-art digital experience portal designed for large-scale sporting venues. Built for the Promptwars Hackathon, it prioritizes accessibility, real-time intelligence, and robust engineering to enhance the fan journey from entry to exit.

## 🚀 Key Features

- **📍 Dynamic Venue Mapping**: Interactive 2D mapping using Google Maps Platform with high-contrast support and venue-specific overlays (Gates, F&B, Medical).
- **🤖 Gemini-Powered Assistant**: A contextual AI concierge that handles natural language queries about the venue, wait times, and services.
- **🎫 Personalized Wayfinding**: Ticket-driven routing that identifies the fastest entry gate based on the user's assigned section.
- **♿ Accessibility First**: Dedicated High Contrast Mode and "Flat Path" logic for users with mobility or visual impairments.
- **🌐 Offline-Ready (PWA)**: Full service-worker integration ensuring crucial maps and info are accessible even in high-crowd, low-connectivity zones.

## 🏆 Hackathon Criteria Alignment

### 🎨 Aesthetics & Design
- **Modern UI**: Implemented a "Glassmorphism" design system with deep-blue dark mode, vibrant accents, and smooth micro-animations.
- **Interactive Experience**: Leverages real-time data simulations to provide immediate value to fans.

### ♿ Accessibility (Inclusive Design)
- **High Contrast**: A specialized mode that simplifies the UI and boosts contrast for better readability.
- **Semantic HTML**: Built using standard ARIA patterns and accessible navigation structures.

### 🛡️ Security & Reliability
- **Responsible AI**: System prompts for Gemini are constrained to venue-specific context to ensure safe and relevant responses.
- **Secret Management**: Environment variables are handled via `.env` to prevent leaking API keys.

### 🧪 Quality & Testing
- **TypeScript**: Full type safety across the application to minimize runtime errors.
- **Automated Testing**: Integrated **Vitest** for validating core logic (e.g., Accessibility Manager, Routing).
- **Maintainability**: Component-based architecture with clean separation of concerns (Data, Logic, UI).

### ⚡ Efficiency
- **Resource Management**: Optimized build with Vite, lazy loading of Map components, and runtime caching of static assets.

## 🛠️ Technology Stack

- **Framework**: React 18 + TypeScript + Vite
- **Mapping**: Google Maps JavaScript API
- **AI**: Google Gemini AI (Vertex AI/Generative AI SDK)
- **Styling**: Vanilla Modern CSS (Variables, Flexbox, Grid)
- **Tooling**: Vitest, Lucide React, Vite PWA Plugin

## 🏁 Getting Started

1. **Clone the repository**:
   ```bash
   git clone [repo-url]
   ```
2. **Install dependencies**:
   ```bash
   npm install --legacy-peer-deps
   ```
3. **Configure API Keys**:
   Create a `.env` file based on `.env.example` and add your `VITE_GOOGLE_MAPS_API_KEY` and `VITE_GEMINI_API_KEY`.
4. **Run the application**:
   ```bash
   npm run dev
   ```

---
*Created with ❤️ for Promptwars Hackathon.*
