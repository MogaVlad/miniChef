# miniChef

A web application that generates recipes based on user-provided ingredients and a selected food category. Powered by Google Gemini AI, the app validates ingredient-category compatibility and returns detailed, step-by-step recipes with realistic preparation times.

## About

This project was originally built in **August 2023** during a web development internship at **Cylex**. In **May 2026**, it was upgraded to current standards — migrating to the Gemini AI API, improving prompt engineering for better recipe validation, refining the UI/UX, adding authentication (with a localStorage fallback for offline use), a Supabase backend, a community recipe-sharing system with content moderation, and account-based recipe saving.

## Features

- **AI Recipe Generation** — Enter ingredients and a category to get complete, step-by-step recipes
- **Authentication** — Sign up and log in with email/password (Supabase Auth), with a localStorage fallback when no `.env` is configured
- **User Profiles** — View and edit profile details, change password with validation rules
- **Save Recipes** — Save your favorite generated or community recipes to a personal collection (Supabase-backed, with a localStorage fallback)
- **Community** — Share recipes with the community, browse by category, like, save, and report other users' recipes
- **Content Moderation** — Blacklisted-term validation prevents inappropriate recipes from being posted
- **Photo Attachment** — Authors of custom (non-AI) recipes can attach a photo URL
- **AI Author Attribution** — AI-generated recipes shared to the community are credited as "miniChef AI - shared by [user]"
- **Popular Recipes** — Home page carousel dynamically shows the top 4 most-liked community recipes
- **Duplicate Prevention** — Identical recipes cannot be posted to the community twice
- **Browse Categories** — Breakfast, Soups, Salads, Dinner, Desserts, Quick Meals, Lunchbox, and Vegetarian
- **Billing Section** — Profile page includes plan info and upgrade placeholder
- **Responsive Pages** — About Us, Help & Support (FAQ + contact form), and Terms & Privacy

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemini (via Google Generative AI SDK)
- **Backend:** Supabase (PostgreSQL database + Auth)

## Project Structure

```
src/
├── app/
│   ├── api/generate-recipes/   # AI recipe generation endpoint
│   ├── about/                  # About Us page
│   ├── community/              # Community recipe feed with sharing, likes, and category filtering
│   ├── help/                   # Help & Support (FAQ + Contact)
│   ├── login/                  # Log in page
│   ├── signup/                 # Sign up page with password validation
│   ├── profile/                # User profile (edit name, change password, billing, sign out)
│   ├── results/                # Generated recipes display
│   ├── saved/                  # Saved recipes collection (account-based)
│   ├── terms/                  # Terms & Privacy page
│   ├── layout.tsx              # Root layout (providers, NavBar, Footer)
│   └── page.tsx                # Home page
├── assets/
│   ├── category_images/        # Category thumbnails and recipe images
│   ├── community/              # Community section illustrations
│   ├── social/                 # Social media icons
│   └── categoryImages.ts       # Category image map for dynamic lookups
├── components/                 # Reusable UI components
├── context/                    # React contexts (Auth, SavedRecipes, Community, Ingredients)
└── lib/
    ├── moderation.ts           # Blacklist-based content validation
    └── supabase.ts             # Supabase client initialization
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Open [http://localhost:3000](http://localhost:3000) in your browser.

> **Note:** The app works locally without a `.env` file — authentication falls back to localStorage, and the community uses seed data. AI recipe generation and Supabase persistence require the environment variables below.

### Optional: Full Backend Setup

1. **Set up Supabase:**
   - Create a free project at [supabase.com](https://supabase.com)
   - Go to **SQL Editor** and run the contents of `supabase-schema.sql`
   - Go to **Settings → API** and copy the **Project URL** and **anon/public key**
2. Create a `.env` file in the root directory:
   ```
   GEMINI_KEY=your_gemini_api_key
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

## Database Schema

The Supabase database consists of four tables (defined in `supabase-schema.sql`):

- **profiles** — User first/last name, auto-created on sign-up via a database trigger
- **saved_recipes** — Per-user saved recipes with a unique constraint on (user, name, category)
- **community_recipes** — Shared recipes visible to all users
- **community_likes** — Like tracking with a composite primary key (recipe, user)

All tables use Row Level Security (RLS) to ensure users can only modify their own data.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- [Next.js](https://github.com/vercel/next.js/blob/canary/license.md) - MIT License
- [React](https://github.com/facebook/react/blob/main/LICENSE) - MIT License
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) - MIT License
- [Google Generative AI SDK](https://github.com/google-gemini/generative-ai-js/blob/main/LICENSE) - Apache License 2.0
- [Supabase JS](https://github.com/supabase/supabase-js/blob/master/LICENSE) - MIT License
- Social media icons by [Flaticon](https://www.flaticon.com/)
