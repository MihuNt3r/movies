# Movies REST API

A Node.js REST API for managing a movie collection, supporting CRUD operations and bulk import from `.txt` files.

## Features

- **CRUD for Movies**: Create, read, update, and delete movies.
- **Actors**: Each movie can have multiple actors.
- **User Authentication**: Register and log in with JWT-based authentication.
- **Bulk Import**: Import movies from a specially formatted `.txt` file.
- **Search & Filtering**: Query movies by title, actor, or general search.
- **Frontend**: Simple HTML/JS frontend for file import.

## Endpoints

### Movies

- `GET /movies` — List movies (supports filtering, sorting, pagination)
- `GET /movies/:id` — Get a single movie by ID
- `POST /movies` — Create a new movie (authenticated)
- `PATCH /movies/:id` — Update a movie (authenticated)
- `DELETE /movies/:id` — Delete a movie (authenticated)
- `POST /movies/import` — Import movies from a `.txt` file (multipart/form-data)

### Users & Sessions

- `POST /users` — Register a new user
- `POST /sessions` — Log in and receive a JWT token

## Setup

1. Install dependencies
npm install

2. Configure environment variables

Create a .env file in the root directory with the following content:
JWT_SECRET=your_jwt_secret
APP_PORT=8050

3. Run npm run dev