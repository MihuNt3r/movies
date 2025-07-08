import { Actor, Movie } from "../models.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import { CreateUpdateMovieDto } from "../dtos/movieDtos.js";
import { MovieQuery } from "../validators/movieValidators.js";
import { Op } from "sequelize";

const getAllMovies = async (query: MovieQuery) => {
    const {
        actor,
        title,
        search,
        sort,
        order,
        limit,
        offset,
    } = query;

    // Build where clause for Movie
    const movieWhere: any = {};
    const actorWhere: any = {};

    if (title) {
        movieWhere.title = { [Op.like]: `%${title}%` };
    }

    if (search) {
        movieWhere.title = { [Op.like]: `%${search}%` };
        actorWhere.name = { [Op.like]: `%${search}%` };
    }

    if (actor) {
        actorWhere.name = { [Op.like]: `%${actor}%` };
    }

    const movies = await Movie.findAll({
        where: movieWhere,
        include: [
            {
                model: Actor,
                as: 'actors',
                where: Object.keys(actorWhere).length ? actorWhere : undefined,
                through: { attributes: [] }, // exclude junction table
                required: !!actor || !!search, // inner join only when filtering
            },
        ],
        order: [[sort, order]],
        limit,
        offset,
    });

    return movies;
}

const getMovieById = async (id: number) => {
    const movie = await Movie.findByPk(id, {
        include: [{
            model: Actor,
            through: { attributes: [] },
        }],
    });

    if (!movie) {
        throw new NotFoundError('Movie');
    }

    return movie;
}

const createMovie = async (movieDto: CreateUpdateMovieDto) => {
    const { title, year, format, actors } = movieDto;

    const movie = await Movie.create({ title, year, format });

    const actorInstances: Actor[] = [];
    for (const actorName of actors) {
        const [actor] = await Actor.findOrCreate({
            where: { name: actorName },
        });
        actorInstances.push(actor);
    }

    // Associate actors with movie (creates entries in movie_actors)
    await movie.$set('actors', actorInstances);

    await movie.reload({
        include: [{
            model: Actor,
            through: { attributes: [] },
        }]
    });

    return movie;
}

const updateMovie = async (id: number, movieDto: CreateUpdateMovieDto) => {
    const movie = await Movie.findByPk(id);

    if (!movie) {
        throw new NotFoundError('Movie');
    }

    const { title, year, format, actors } = movieDto;

    await movie.update({ title, year, format });

    const actorInstances: Actor[] = [];

    for (const actorName of actors) {
        const [actor] = await Actor.findOrCreate({
            where: { name: actorName },
        });
        actorInstances.push(actor);
    }

    await movie.$set('actors', actorInstances);

    await movie.reload({
        include: [{
            model: Actor,
            through: { attributes: [] },
        }]
    });

    return movie;
}

const deleteMovie = async (id: number) => {
    const movie = await Movie.findByPk(id);

    if (!movie) {
        throw new NotFoundError('Movie');
    }

    await movie.destroy();
}

export {
    getAllMovies,
    getMovieById,
    createMovie,
    updateMovie,
    deleteMovie,
}