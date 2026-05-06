# AeraLiving

AeraLiving is a Next.js website for curated stays, interior design services, booking inquiries, guest reviews, and the Blink concierge assistant.

## What This App Includes

- Marketing pages for AeraLiving stays and interiors.
- A locations directory with property detail pages for Retro Den, Doon's Den, and Terra House.
- A client-side booking widget that calculates stay totals and opens a WhatsApp inquiry.
- A server-side booking inquiry flow backed by Firebase Admin and Firestore.
- A floating 3D chat assistant that answers from site content and can collect booking intent.
- Customer review submission and display through Firebase.

## Tech Stack

- Next.js 16 App Router
- React 19
- TypeScript
- Tailwind CSS
- Firebase Admin and Firestore
- Groq/OpenAI-compatible chat completions
- Three.js, React Three Fiber, and Drei for the interactive robot
- Lucide React icons

## Project Structure

```text
app/                 Next.js routes, layouts, and API handlers
components/          Reusable UI sections and client components
components/ui/       Small shared UI primitives
lib/                 Site data, chatbot retrieval, telemetry, booking logic, Firebase helpers
public/              Images, icons, brand assets, property galleries
```

The main content source is `lib/siteContent.ts`. Update that file when changing FAQs, property listings, amenities, photos, pricing, maps, or property metadata.

## Getting Started

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Open `http://localhost:3000`.

## Useful Scripts

```bash
npm run dev      # Start local development with Next.js
npm run build    # Create a production build
npm run start    # Start the production server
npm run lint     # Run ESLint
```

## Environment Variables

The app can render static marketing pages without all integrations, but the API routes need these variables in deployed or full local environments.

```bash
FIREBASE_PROJECT_ID=
FIREBASE_CLIENT_EMAIL=
FIREBASE_PRIVATE_KEY=

GROQ_API_KEY=
# or
CHATBOT_LLM_API_KEY=

CHATBOT_LLM_API_URL=
CHATBOT_LLM_MODEL=

BOOKING_GSHEET_WEBHOOK_URL=
BOOKING_WEBHOOK_SECRET=
CHATBOT_GSHEET_WEBHOOK_URL=
NEXT_PUBLIC_CHAT_DEBUG=
```

## Notes

- Booking inquiries are validated in `lib/bookingIntent.ts` before being written to Firestore.
- The chatbot knowledge base is built from `lib/siteContent.ts` in `lib/chatbotKnowledge.ts`.
- The visible chat widget is `components/SplineBot.tsx`.
- Property pages are generated from `app/locations/[slug]/page.tsx`.
