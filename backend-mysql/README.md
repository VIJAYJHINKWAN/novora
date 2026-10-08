# Novora Backend (PHP + MySQL)

## Setup

1. Install dependencies:
   ```
   composer install
   ```
2. Create the database:
   ```
   mysql -u root -p < schema.sql
   ```
3. Copy `.env.example` to `.env` and fill in your DB credentials and a random `JWT_SECRET`.
4. Run the dev server:
   ```
   php -S localhost:8000 -t public
   ```

## What's built so far

- `POST /api/register` - create an account (name, email, password)
- `POST /api/login` - returns a JWT on success
- `GET /api/books` - list all books (requires `Authorization: Bearer <token>`)
- `POST /api/books` - add a book
- `POST /api/books/{id}/like` - toggle like on a book

## How to add the remaining resources (Events, Messages, Stories, Profile)

Every resource follows the exact same pattern as `BookController.php`:

1. Add a `Controller` class in `src/Controllers/` with static methods for
   `list`, `create`, etc. Each method takes the authenticated `$userId` as
   its first argument (from `AuthMiddleware::requireAuth()`), runs a
   parameterized PDO query, and echoes JSON.
2. Register the routes in `public/index.php`, following the same
   `if ($uri === '...' && $method === '...')` shape.

The table/column names for each are already defined in `schema.sql`:
- `events` + `event_rsvps` -> EventController
- `chat_messages` -> MessageController
- `reading_stories` + `story_likes` -> StoryController
- `users` (profile fields) + `user_badges` -> ProfileController

Ask Claude to generate any of these next in the same style.
