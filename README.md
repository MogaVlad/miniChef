# miniChef

A web application that generates recipes based on user-provided ingredients and a selected food category. Powered by Google Gemini AI, the app validates ingredient-category compatibility and returns detailed, step-by-step recipes with realistic preparation times.

## About

This project was originally built in **August 2023** during a web development internship at **Cylex**. In **May 2025**, it was upgraded to bring it up to current standards, including migrating to the Gemini AI API, improving prompt engineering for better recipe validation, and refining the UI/UX. In **May 2026**, it was further expanded with new pages and a recipe saving system.

## Features

- **AI Recipe Generation** — Enter ingredients and a category to get complete, step-by-step recipes
- **Save Recipes** — Save your favorite generated recipes to a personal collection (persisted in localStorage)
- **Browse Categories** — Breakfast, Soups, Salads, Dinner, Desserts, Quick Meals, Lunchbox, and Vegetarian
- **Community Hub** — Discover, review, and share recipes with other users
- **Responsive Pages** — About Us, Help & Support (FAQ + contact form), and Terms & Privacy

## Tech Stack

- **Framework:** Next.js 13 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **AI:** Google Gemma (via Google Generative AI SDK)

## Project Structure

```
src/
├── app/
│   ├── api/generate-recipes/   # AI recipe generation endpoint
│   ├── about/                  # About Us page
│   ├── community/              # Enter the Community page
│   ├── help/                   # Help & Support (FAQ + Contact)
│   ├── results/                # Generated recipes display
│   ├── saved/                  # Saved recipes collection
│   ├── terms/                  # Terms & Privacy page
│   ├── layout.tsx              # Root layout (NavBar + Footer)
│   └── page.tsx                # Home page
├── assets/
│   ├── category_images/        # Category thumbnails and recipe images
│   ├── community/              # Community section illustrations
│   ├── social/                 # Social media icons
│   └── categoryImages.ts       # Category image map for dynamic lookups
├── components/                 # Reusable UI components
└── context/                    # React contexts (Ingredients, SavedRecipes)
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create a `.env` file in the root directory and add your Gemini API key:
   ```
   GEMINI_KEY=your_api_key_here
   ```
4. Run the development server:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

### Third-Party Licenses

- [Next.js](https://github.com/vercel/next.js/blob/canary/license.md) - MIT License
- [React](https://github.com/facebook/react/blob/main/LICENSE) - MIT License
- [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss/blob/master/LICENSE) - MIT License
- [Google Generative AI SDK](https://github.com/google-gemini/generative-ai-js/blob/main/LICENSE) - Apache License 2.0
- Social media icons by [Flaticon](https://www.flaticon.com/)
