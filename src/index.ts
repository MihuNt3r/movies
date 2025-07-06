import express, { Request, Response } from 'express';
import { sequelize } from "./database.ts";
import { Actor, Movie } from "./models.ts";

sequelize.sync()
    .then(() => console.log('db is ready'))
    .catch((err) => console.error('db error: ' + err));

const app = express();

app.use(express.json());

app.get('/movies', async (req: Request, res: Response) => {
    try {
        const movies = await Movie.findAll({
            include: [{
                model: Actor,
                through: { attributes: [] },
            }],
        });

        res.json(movies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch movies' });
    }
});

app.post('/movies', async (req: Request, res: Response) => {
    const { title, year, format, actors } = req.body;

    try {
        // Create the movie
        const movie = await Movie.create({ title, year, format });

        // Create actors and associate with movie
        const actorInstances: Actor[] = [];
        for (const actorName of actors) {
            const [actor] = await Actor.findOrCreate({
                where: { name: actorName },
            });
            actorInstances.push(actor);
        }

        // Associate actors with movie (creates entries in movie_actors)
        await movie.$set('actors', actorInstances);

        res.status(201).json({ message: 'Movie created successfully', movie });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create movie' });
    }
});

app.get('/movies/:id', async (req: Request, res: Response) => {
    try {
        const movieId = Number(req.params.id);

        if (isNaN(movieId)) {
            res.status(400).json({error: 'Invalid movie ID'});
            return;
        }

        const movie = await Movie.findByPk(movieId, {
            include: [{
                model: Actor,
                attributes: ['id', 'name'],
                through: {attributes: []}, // hides MovieActor
            }],
        });

        if (!movie) {
            res.status(404).json({error: 'Movie not found'});
            return;
        }

        res.json(movie);
    } catch (error) {
        console.error('Error fetching movie:', error);
        res.status(500).json({error: 'Failed to fetch movie'});
    }
});

app.delete('/movies/:id', async (req: Request, res: Response) => {
    const movieId = Number(req.params.id);

    if (isNaN(movieId)) {
        res.status(400).json({ error: 'Invalid movie ID' });
        return;
    }

    try {
        const movie = await Movie.findByPk(movieId);

        if (!movie) {
            res.status(404).json({ error: 'Movie not found' });
            return;
        }

        await movie.destroy();

        res.status(200).json({ message: `Movie with ID ${movieId} deleted successfully.` });
    } catch (error) {
        console.error('Error deleting movie:', error);
        res.status(500).json({ error: 'Failed to delete movie' });
    }
});

app.listen(3000, () => {
    console.log('Listening on port 3000');
})