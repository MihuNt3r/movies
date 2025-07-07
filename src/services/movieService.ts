import {Actor, Movie} from "../models.ts";
import {NotFoundError} from "../errors/NotFoundError.ts";

const getAllMovies = async () => {
    const movies = await Movie.findAll({
        include: [{
            model: Actor,
            through: { attributes: [] },
        }],
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

// const updateMovie = async (id: number, )

export {
    getAllMovies,
    getMovieById,
}