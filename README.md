# MindMate - AI-Powered Study Companion

An intelligent, full-stack study companion that empowers students to learn more efficiently through personalized insights, AI-generated summaries, and progress tracking.

## Features

- **User Authentication**: Secure signup, login, and logout with JWT
- **Notes Management**: Create, read, update, and delete notes with search, filter, sort, and pagination
- **AI-Generated Summaries**: Get concise summaries of your notes using Gemini AI
- **Flashcards**: Create and manage flashcards with AI generation support
- **Flashcard Review**: Interactive flashcard review system with difficulty tracking
- **Progress Analytics**: Visual dashboard with study statistics and recommendations
- **Smart Recommendations**: AI-powered study suggestions based on your activity

## Tech Stack

- **Frontend**: Next.js 16, React 19, TailwindCSS
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT (jsonwebtoken)
- **AI Integration**: Google Gemini API
- **UI Components**: shadcn/ui

## Getting Started

### Prerequisites

- Node.js 18+ 
- PostgreSQL database
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rancap
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory:
```
DATABASE_URL="postgresql://user:password@localhost:5432/mindmate?schema=public"
JWT_SECRET="your-secret-key-change-in-production"
GEMINI_API_KEY="your-gemini-api-key-here"
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Register a new user
- `POST /api/auth/login` - Authenticate user

### Notes
- `GET /api/notes` - Get all notes (with search, filter, sort, pagination)
- `POST /api/notes` - Create a new note
- `PUT /api/notes/:id` - Update a note
- `DELETE /api/notes/:id` - Delete a note

### Flashcards
- `GET /api/flashcards` - Get all flashcards (with filter, sort, pagination)
- `POST /api/flashcards` - Create a flashcard
- `DELETE /api/flashcards?id=:id` - Delete a flashcard
- `PUT /api/flashcards/:id/review` - Update flashcard review

### AI
- `POST /api/ai/summary` - Generate AI summary
- `POST /api/ai/flashcards` - Generate flashcards from content

### Analytics
- `GET /api/analytics?days=30` - Get study analytics

### Sessions
- `POST /api/sessions` - Create a study session

## Project Structure

```
rancap/
├── app/
│   ├── api/           # API routes
│   ├── dashboard/     # Dashboard page
│   ├── notes/         # Notes page
│   ├── flashcards/    # Flashcards page
│   ├── login/         # Login page
│   ├── signup/        # Signup page
│   └── layout.js      # Root layout
├── components/
│   ├── ui/            # shadcn/ui components
│   ├── Navbar.js      # Navigation bar
│   └── ProtectedRoute.js
├── contexts/
│   └── AuthContext.js # Authentication context
├── lib/
│   ├── api.js         # API utility functions
│   ├── auth.js        # Authentication utilities
│   ├── gemini.js      # Gemini AI integration
│   └── prisma.js      # Prisma client
└── prisma/
    └── schema.prisma  # Database schema
```

## Database Schema

- **User**: User accounts with authentication
- **Note**: Study notes with title, content, topic, and tags
- **Flashcard**: Flashcards with front, back, topic, and review tracking
- **StudySession**: Study session tracking with duration and topics

## Development

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## Deployment

### Frontend (Vercel)
1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Backend (Render)
1. Create a new Web Service in Render
2. Connect your GitHub repository
3. Set build command: `npm install && npx prisma generate && npm run build`
4. Set start command: `npm start`
5. Add environment variables
6. Deploy

### Database (Supabase/Neon)
1. Create a PostgreSQL database
2. Update DATABASE_URL in environment variables
3. Run migrations: `npx prisma db push`

## License

MIT
