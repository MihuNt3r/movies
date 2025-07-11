import express, { Request, Response } from 'express';
import { getAllMovies, getMovieById, createMovie, updateMovie, deleteMovie } from "../services/movieService.js";
import { validateBody } from "../middleware/validators.js";
import { CreateUpdateMovieDto } from "../dtos/movieDtos.js";
import { CreateUpdateMovieSchema, MovieQuerySchema } from "../validators/movieValidators.js";
import { importMoviesFromTxt } from "../services/movieImportService.js";
import { authenticate } from "../middleware/authentication.js";
import multer from "multer";

const router = express.Router();
const upload = multer({ dest: "uploads/" });

router.get('/', async (req: Request, res: Response) => {
    const parsed = MovieQuerySchema.safeParse(req.query);

    if (!parsed.success) {
        res.status(400).json({ error: 'Invalid query', details: parsed.error.flatten() });
        return;
    }

    const movies = await getAllMovies(parsed.data);
    res.json(movies);
});

router.get('/:id', async (req: Request, res: Response) => {
    const movie = await getMovieById(Number(req.params.id));
    res.json(movie);
});

router.post('/', authenticate, validateBody(CreateUpdateMovieSchema), async (req: Request, res: Response) => {
    const movie = await createMovie(req.body as CreateUpdateMovieDto);
    res.status(201).json({ message: 'Movie created successfully', movie });
});

router.patch('/:id', authenticate, validateBody(CreateUpdateMovieSchema), async (req: Request, res: Response) => {
    const movie = await updateMovie(Number(req.params.id), req.body as CreateUpdateMovieDto);
    res.status(201).json({ message: 'Movie updated successfully', movie });
});

router.delete('/:id', authenticate, async (req: Request, res: Response) => {
    await deleteMovie(Number(req.params.id));
    res.status(204).json({ message: 'Movie deleted successfully' });
});

router.post('/import', upload.single('file'), async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            res.status(400).json({ error: 'No file uploaded' });
            return;
        }

        if (!req.file.originalname.endsWith('.txt')) {
            res.status(415).json({ error: 'Only .txt files are supported' });
            return
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

export default router;