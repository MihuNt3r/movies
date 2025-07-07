import express, { Request, Response } from 'express';
import { sequelize } from "./database.ts";
import { errorHandler } from "./middleware/errorHandler.ts";
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "./services/movieService.ts";
import { validateBody } from "./middleware/validators.ts";
import { CreateUpdateMovieDto } from "./dtos/movieDtos.ts";
import {CreateUpdateMovieSchema, MovieQuerySchema} from "./validators/movieValidators.ts";
// import { upload } from "./middleware/upload.ts";
import { importMoviesFromTxt } from "./services/movieImportService.ts";
import multer from "multer";

const upload = multer({ dest: "uploads/" });

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

app.use(errorHandler);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})