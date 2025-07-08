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

1. Install dependencies:
`npm install`

2. Configure environment variables

Create a .env file in the root directory with the following content:
`JWT_SECRET=your_jwt_secret`
`APP_PORT=8050`

3. Run `npm run dev`

## Docker Image

## Techniques Used

This application leverages several modern backend and frontend development techniques:

- **RESTful API Design**: The backend follows REST principles, exposing clear endpoints for CRUD operations on movies and user authentication.

- **Express.js Middleware**: Custom middleware is used for authentication (`JWT`-based), error handling, and request validation, ensuring clean separation of concerns.

- **Validation with Zod**: All incoming data (body and query) is validated using [Zod](https://zod.dev/), providing strong runtime type safety and clear error messages.

- **Sequelize ORM**: Database interactions are managed with Sequelize and `sequelize-typescript`, enabling model definitions, associations, and migrations in a type-safe way.

- **JWT Authentication**: Secure user authentication is implemented using JSON Web Tokens, with middleware to protect sensitive endpoints.

- **File Upload and Parsing**: Bulk import of movies is handled via file upload (using `multer`), with robust parsing and validation of `.txt` files.

- **Modular Architecture**: The codebase is organized into services, routes, middleware, DTOs, and validators, promoting maintainability and scalability.

- **Frontend Integration**: A simple HTML/JavaScript frontend is provided for file import, demonstrating integration between client and server.

- **Error Handling**: Centralized error handling middleware ensures consistent API responses and easier debugging.

- **Environment Configuration**: Sensitive configuration (like JWT secrets and port) is managed via environment variables and `.env` files.

These techniques together provide a robust, secure, and maintainable foundation for the application.

## Instruction