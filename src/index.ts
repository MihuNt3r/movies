import express, { Request, Response } from 'express';
import { sequelize } from "./database.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "./services/movieService.ts";
import { createUser } from "./services/userService.ts";
import { validateBody } from "./middleware/validators.ts";
import { CreateUpdateMovieDto } from "./dtos/movieDtos.ts";
import { CreateUpdateMovieSchema, MovieQuerySchema} from "./validators/movieValidators.ts";
import { importMoviesFromTxt } from "./services/movieImportService.ts";
import multer from "multer";
import dotenv from "dotenv";
import { CreateUserSchema } from "./validators/userValidators.ts";
import { CreateSessionSchema } from "./validators/sessionValidators.ts";
import { CreateUserDto } from "./dtos/userDtos.ts";
import { createSession } from "./services/sessionService.ts";
import { SessionCreateDto } from "./dtos/sessionDtos.ts";

const upload = multer({ dest: "uploads/" });

dotenv.config();

sequelize.sync()
    .then(() => console.log('db is ready'))
    .catch((err) => console.error('db error: ' + err));

const app = express();

app.use(express.json());

app.get('/movies', async (req: Request, res: Response) => {
    const parsed = MovieQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
        return;
    }

    const movies = await getAllMovies(parsed.data);
    res.json(movies);
});

app.get('/movies/:id', async (req: Request, res: Response) => {
    const movie = await getMovieById(Number(req.params.id));
    res.json(movie);
});

app.post('/movies', validateBody(CreateUpdateMovieSchema), async (req: Request, res: Response) => {
    const movie = await createMovie(req.body as CreateUpdateMovieDto);
    res.status(201).json({ message: 'Movie created successfully', movie });
});

app.patch('/movies/:id', validateBody(CreateUpdateMovieSchema), async (req: Request, res: Response) => {
    const movie = await updateMovie(Number(req.params.id), req.body as CreateUpdateMovieDto);
    res.status(201).json({ message: 'Movie updated successfully', movie });
});

app.delete('/movies/:id', async (req: Request, res: Response) => {
    await deleteMovie(Number(req.params.id));
    res.status(204).json({ message: 'Movie deleted successfully' });
});

app.post('/movies/import', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        const result = await importMoviesFromTxt(req.file.path);
        res.json({ message: 'Import completed', ...result });
    } catch (err) {
        console.error('Import failed:', err);
        res.status(500).json({
            error: 'Import failed',
            details: err instanceof Error ? err.message : String(err),
        });
    }
});

// ----------------------------------------------------------------------- User

app.post('/users', async (req: Request, res: Response) => {
    const parsed = CreateUserSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
    }

    const { token } = await createUser(parsed.data as CreateUserDto);
    res.json({ token });
})

// ---------------------------------------------------------------------------- Sessions
app.post('/sessions', async (req: Request, res: Response) => {
    const parsed = CreateSessionSchema.safeParse(req.body);

    if (!parsed.success) {
        res.status(400).json({ error: 'Validation failed', details: parsed.error.flatten() });
        return;
    }

    const { token } = await createSession(req.body as SessionCreateDto);
    res.json({ token });
})


app.use(errorHandler);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})